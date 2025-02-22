from django.shortcuts import render
from .models import MatchTable,CourtSchedule
from divisions.models import TeamInDivision, Division
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from collections import defaultdict
import json
from django.http import JsonResponse
from .models import *
from django.db.models import Q, F, Case, When, IntegerField
from django.http import JsonResponse


# Create your views here.
class MatchTableView(viewsets.ViewSet):
    queryset = MatchTable.objects.all()
    serializer_class = MatchTableSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        queryset = MatchTable.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    def retrieve(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path=r'user_challenges/(?P<user_id>\d+)')
    def user_challenges(self, request, user_id=None):
        # Get teams associated with the user
        user_teams = Team.objects.filter(users=user_id)
        
        # Get matches where the user's teams are either team1 or team2
        user_matches = MatchTable.objects.filter(
            Q(team1Name__in=user_teams) | Q(team2Name__in=user_teams)
        )
        
        # Serialize the matches
        serializer = self.serializer_class(user_matches, many=True)
        
        # Return serialized matches as response
        return Response(serializer.data)
    

    def put(self, request, pk):
        try:
            match_instance = MatchTable.objects.get(pk=pk)
        except MatchTable.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Update the match status
        match_instance.status = 'i'  # 'i' represents "in progress"
        match_instance.save()
        
        serializer = MatchTableSerializer(match_instance)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path=r'match-results/(?P<team_name>[^/.]+)(?:/(?P<division_name>[^/.]+))?')
    def match_results(self, request, team_name=None,division_name=None):
        team = get_object_or_404(Team, name=team_name)

        # Filter MatchTable if team1 or team2
        match_result = MatchTable.objects.filter(team1Name=team) | \
                        MatchTable.objects.filter(team2Name=team)
        if division_name:
            division = get_object_or_404(Division, name=division_name)
            match_result = MatchTable.objects.filter(division=division)

        # Serialize match results excluding 'id' and 'countdown'
        serializer = self.serializer_class(match_result, many=True)#, exclude=['id', 'countDown'])
        return Response(serializer.data)
    
    #make the team_name also optional to seach through division for everyones info
    @action(detail=False, methods=['GET'], url_path=r'table_view/(?P<team_name>[^/.]+)(?:/(?P<division_name>[^/.]+))?')
    def table_view(self, request, team_name=None, division_name = None):
        team = get_object_or_404(Team, name=team_name)
        
        if division_name:
            division404 = get_object_or_404(Division, name=division_name)
            matches = MatchTable.objects.filter(division = division404)
            total_wins = MatchTable.objects.filter(division = division404)
        #get total matches
        matches = MatchTable.objects.filter(Q(team1Name=team) | Q(team2Name=team), status=MatchTable.Status.FINISHED)
        total_games = matches.count()

        #to get wins and loses
        total_wins = matches.filter(team1Name =team,winner = 0,status='f').count() + \
                     matches.filter(team2Name=team, winner = 1,status = 'f').count()
        total_losses = total_games - total_wins

        # Calculate win rate
        if total_games > 0:
            win_rate = total_wins / total_games
        else: 
            win_rate=0

        # Construct the response data
        response_data = {
            'team_name': team_name,
            'total_wins': total_wins,
            'total_losses': total_losses,
            'win_rate': win_rate
        }

        return Response(response_data)
    
    #need to fix this
    @action(detail=False, methods=['POST'], url_path=r'submit-results/(?P<match_id>[^/.]+)')
    def submit_results(self, request, match_id=None):
        try:
            match = get_object_or_404(MatchTable, id=match_id)
            data = request.data
            
            # Get the values from the request data
            team1Wins = data.get('team1Wins')
            team2Wins = data.get('team2Wins')
            status = data.get('status')

            # Update the MatchTable object if the values are provided
            if team1Wins is not None:
                match.team1Wins = team1Wins
            if team2Wins is not None:
                match.team2Wins = team2Wins
            if status:
                match.status = status

            if match.team1Wins == match.team2Wins:
                 return JsonResponse({'message': 'No ties allowed.'}, status=400)
            match.save() # Save the changes

            #changing their position if challenger won
            if match.status == MatchTable.Status.FINISHED and match.team1Wins > match.team2Wins:
                team1_in_division = get_object_or_404(TeamInDivision, division=match.division, team=match.team1Name)
                team2_in_division = get_object_or_404(TeamInDivision, division=match.division, team=match.team2Name)

                #swapping the positions
                team1_position = team1_in_division.position
                team2_position = team2_in_division.position
                team1_in_division.position = team2_position
                team2_in_division.position = team1_position
                #saving the data
                team1_in_division.save()
                team2_in_division.save()
                
            return JsonResponse({'message': 'Match results updated successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        #need to change teamscore 1,2, status:void,finished in json
        # {
        #     "team1Wins": 3,
        #     "team2Wins": 1,
        #     "status": "f"
        # }

    @action(detail=False, methods=['GET'], url_path=r'user_challenges/(?P<user_id>\d+)')
    def user_challenges(self, request, user_id=None):
        # Get teams associated with the user
        user_teams = Team.objects.filter(users=user_id)
        
        # Get matches where the user's teams are either team1 or team2
        user_matches = MatchTable.objects.filter(
            Q(team1Name__in=user_teams) | Q(team2Name__in=user_teams)
        )

        # Define a custom ordering based on status
        status_ordering = Case(
            When(status='s', then=0),
            When(status='i', then=1),
            When(status='r', then=2),
            When(status='f', then=3),
            default=4,
            output_field=IntegerField(),
        )

        # Sort the matches based on status ordering
        user_matches = user_matches.annotate(
            status_order=status_ordering
        ).order_by('status_order')

        # Serialize the matches
        serializer = self.serializer_class(user_matches, many=True)
        
        # Return serialized matches as response
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path=r'division-matches/(?P<divisionName>[^/.]+)')
    def division_matches(self, request, divisionName=None):
        # Get teams associated with the division
        division_matches = MatchTable.objects.filter(division=divisionName)
        

        # Serialize the matches
        serializer = self.serializer_class(division_matches, many=True)
        

        # Return serialized matches as response
        return Response(serializer.data)
    
    def put(self, request, pk):
        try:
            match_instance = MatchTable.objects.get(pk=pk)
        except MatchTable.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Update the match status
        match_instance.status = 'i'  # Assuming 'i' represents "in progress"
        match_instance.save()
        
        serializer = MatchTableSerializer(match_instance)
        return Response(serializer.data)


class CourtScheduleView(viewsets.ViewSet):
    queryset = CourtSchedule.objects.all()
    serializer_class = CourtScheduleSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        queryset = CourtSchedule.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    def retrieve(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        try:
            instance = CourtSchedule.objects.get(pk=pk)
        except CourtSchedule.DoesNotExist:
            return Response({"error": "CourtSchedule not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourtScheduleSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], url_path=r'match-court/(?P<match_id>\d+)')
    def get_court_schedule(self, request, match_id=None):
        try:
            # Retrieve the CourtSchedule object associated with the match ID
            court_schedule = CourtSchedule.objects.get(match_id=match_id)
            # Serialize the CourtSchedule object
            serializer = CourtScheduleSerializer(court_schedule)
            # Return the serialized data as JSON response
            return Response(serializer.data)
        except CourtSchedule.DoesNotExist:
            # Handle the case where no CourtSchedule is found for the given match ID
            return Response({'error': 'Court schedule not found'}, status=404)
        
    #@action(detail=False, methods=['GET'], url_path=r'')