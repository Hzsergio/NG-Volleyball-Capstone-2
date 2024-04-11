from django.shortcuts import render
from .models import MatchTable,CourtSchedule
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import *
from django.db.models import Q
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
    
    def delete(self, request, pk):
        try:
            challenge = MatchTable.objects.get(pk=pk)
            challenge.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MatchTable.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
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
        serializer = self.serializer_class(match_result, many=True)
        return Response(serializer.data)
    
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

            match.save() # Save the changes
            return JsonResponse({'message': 'Match results updated successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        #need to change teamscore 1,2, status:void,finished in json
        # {
        #     "team1Wins": 3,
        #     "team2Wins": 1,
        #     "status": "f"
        # }
    
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