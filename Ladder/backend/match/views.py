from django.shortcuts import get_object_or_404
from .models import MatchTable,CourtSchedule
from divisions.models import TeamInDivision, Division
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from collections import defaultdict
import json
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
    
    #to get the match result with optional division
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
    
    #used for submiting result, void,finished. 
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
