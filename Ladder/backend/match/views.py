from django.shortcuts import get_object_or_404
from .models import MatchTable,CourtSchedule
from divisions.models import TeamInDivision, Division
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from collections import defaultdict

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
    @action(detail=False, methods=['GET'], url_path=r'match-results/(?P<team_name>[^/.]+)/(?P<division_name>[^/.]+)?')
    def match_results(self, request, team_name=None,division_name=None,):
        team = get_object_or_404(Team, name=team_name)

        # Filter MatchTable if team1 or team2
        match_results = MatchTable.objects.filter(team1Name=team) | \
                        MatchTable.objects.filter(team2Name=team)
        if division_name:
            division = get_object_or_404(Division, name=division_name)
            match_result = MatchTable.objects.filter(division=division)

        # Serialize match results excluding 'id' and 'countdown'
        serializer = self.serializer_class(match_results, many=True, exclude=['id', 'countDown'])
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
