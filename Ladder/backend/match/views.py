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