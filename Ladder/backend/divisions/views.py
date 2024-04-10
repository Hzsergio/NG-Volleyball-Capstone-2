from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view

from django.db.models import F,Q
from .models import Division,TeamInDivision, Team, User
from match.models import MatchTable
from .serializers import DivisionSerializer,TeamInDivisionSerializer, MatchTableSerializer
from rest_framework.decorators import action
from collections import defaultdict


class DivisionView(viewsets.ViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        queryset = Division.objects.all()
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

class Tree:
    def __init__(self):
        self.positionNum = 0
        self.available = 0
        self.leafAmount = 1

    def CalculateWinRate(self,TeamList):#total wins/total games
        team_win_rates = defaultdict(float)

        for teamInDivision in TeamList:
            team = teamInDivision.team #foreign key to team table
            #----------getting the total games---------------------------------
            totalGameTeam1 = MatchTable.objects.filter(team1Name =team).count()
            totalGameTeam2 = MatchTable.objects.filter(team2Name =team).count()
            totalGames = totalGameTeam1 + totalGameTeam2

            #--------------Getting total wins------------------------------------
            # Count wins by checking name and if team has higher score than other team on same row
            team1Wins = MatchTable.objects.filter(team1Name=team, team1Wins__gt=F('team2Wins')).count()
            team2Wins = MatchTable.objects.filter(team2Name=team, team2Wins__gt=F('team1Wins')).count()
            totalWins = team1Wins + team2Wins

            #---------------calculating the win rate------------------------------
            winRate = 0 #survay would go here
            if totalGames >0:
                winRate = totalWins /totalGames
            team_win_rates[team] = winRate
            #sorts them
        sortedTeams = sorted(TeamList, key=lambda team: team_win_rates[team.team])
        return sortedTeams

    #should work as passbyReference
    def assignPosition(self, team_list):
        # Reorganize the team list based on win rates
        #team_list.sort(key=lambda team: self.get_win_rate(team.team))

        #assigning their positions
        for Team in team_list:
            if (self.available < self.leafAmount):
                Team.position = self.positionNum
                self.available += 1

            if (self.available == self.leafAmount):
                self.positionNum += 1
                self.available = 0
                self.leafAmount *= 2
     
class TeamInDivisionView(viewsets.ViewSet):
    queryset = TeamInDivision.objects.all()
    serializer_class = TeamInDivisionSerializer
    permission_classes = [permissions.AllowAny]


    def list(self, request):
        queryset = TeamInDivision.objects.all()
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
    
    @action(detail=False, methods=['POST'], url_path=r'join_division/(?P<division_name>[^/.]+)/(?P<team_id>\d+)')
    def join_division(self, request, team_id, division_name):
        try:
            team = get_object_or_404(Team, id=team_id)
            division = get_object_or_404(Division, name=division_name)
            
            # Check if the team is already in the division
            if TeamInDivision.objects.filter(team=team, division=division).exists():
                return Response({'message': 'Team is already in the division'}, status=400)

            # Create a new TeamInDivision object to represent the relationship
            TeamInDivision.objects.create(team=team, division=division)
            
            return Response({'message': f'Team {team_id} joined division {division_name} successfully.'})
        except Team.DoesNotExist:
            return Response({'error': f'Team {team_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Division.DoesNotExist:
            return Response({'error': f'Division {division_name} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #Checks if the user is a captain of one of the teams in the division
    @action(detail=False, methods=['GET'], url_path=r'check-user-captain/(?P<division_name>[^/.]+)/(?P<user_id>\d+)')
    def check_user_captain(self, request, division_name, user_id):
        try:
            # Get all teams in the division
            teams_in_division = TeamInDivision.objects.filter(division__name=division_name)

            # Check if the user is a captain of any team in the division
            is_captain = any(team.team.captain_id == int(user_id) for team in teams_in_division)

            return Response({'isCaptain': is_captain})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #Checks to see if the current user is the admin of the division    
    @action(detail=False, methods=['GET'], url_path='check-admin/(?P<division_name>[^/.]+)/(?P<user_id>\d+)')
    def check_admin(self, request, division_name, user_id):
        try:
            # Get the division with the specified name
            division = Division.objects.get(name=division_name)
            print(division.admin, user_id)
            # Check if the user is the admin of the division
            is_admin = division.admin.id == int(user_id)

            return Response({'is_admin': is_admin})
        except Division.DoesNotExist:
            return Response({'error': 'Division does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['GET'], url_path='current-team/(?P<division_name>[^/.]+)/(?P<user_id>\d+)')
    def current_team(self, request, division_name, user_id):
        try:
            # Get the division with the specified name
            division = get_object_or_404(Division, name=division_name)
            
            # Retrieve the team for which the user is the captain in the division
            team = TeamInDivision.objects.filter(division=division, team__captain_id=user_id).first()
            
            if team:
                return Response({'team_id': team.team_id})
            else:
                return Response({'error': 'User is not captain of any team in this division'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    def get_queryset(self):
        division_name = self.kwargs['division_name']
        # Retrieve the division object by name
        division = get_object_or_404(Division, name=division_name)
        # Get all team-in-division objects for the division
        queryset = TeamInDivision.objects.filter(division=division)
        return queryset

    @action(detail=False, methods=['GET'], url_path=r'(?P<division_name>[^/.]+)')
    def list_by_division(self, request, division_name=None):
        division = get_object_or_404(Division, name=division_name)
        team_in_division = self.queryset.filter(division=division)
        serializer = MatchTableSerializer(team_in_division, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'], url_path='assign-positions/(?P<division_name>[^/.]+)')
    def assign_positions(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        TeamList = list(TeamInDivision.objects.filter(division=division404))#querrySet into list
        tree = Tree()

        tree.assignPosition(tree.CalculateWinRate(TeamList))
        for team in TeamList: #saves each teamObject to the database
            team.save()

        return Response({'message': 'Positions assigned successfully.'})
    
    #could do a boolen to condense these two together
    @action(detail=False, methods=['POST'], url_path='remake-tree/(?P<division_name>[^/.]+)')
    def remake_tree(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        TeamList = list(TeamInDivision.objects.filter(division=division404))#querrySet into list
        tree = Tree()
        #basically the same as assign_position but without recalibration winrate
        tree.assignPosition(TeamList)
        for team in TeamList: #saves each teamObject to the database
            team.save()

        return Response({'message': 'Positions assigned successfully.'})
    
    # need to check match status of other team -need to test
    @action(detail=False, methods=['GET'], url_path='challengeable-teams/(?P<division_name>[^/.]+)/(?P<team_name>[^/.]+)')
    def challengeable_teams(self, request, division_name=None,team_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        team404 = get_object_or_404(Team, name=team_name)
        team_in_division = get_object_or_404(TeamInDivision, division=division404, team=team404)
        current_position = team_in_division.position

        #this returns avaialbe challengable teams
        challengeables = TeamInDivision.objects.filter(division=division404,position=current_position - 1).values_list('team__name', flat=True)

        #removes all the challengeable teams that are in a match
        challengeables = challengeables.exclude(
            Q(team__team1_matches__status=MatchTable.Status.INPROGRESS) |
            Q(team__team2_matches__status=MatchTable.Status.INPROGRESS) |
            Q(team__team1_matches__status=MatchTable.Status.SCHEDULED) |
            Q(team__team2_matches__status=MatchTable.Status.SCHEDULED)
        ).values_list('team__name', flat=True)

        return Response(challengeables)
    
        #this version returns the whole row
        #challengeables = TeamInDivision.objects.filter(division=division404,position=current_position -1)
        #serializer = self.serializer_class(challengeables, many=True)
        #serializer = self.serializer_class(challengeables, many=True)
        #return Response(serializer.data)
    