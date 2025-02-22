from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view

from django.db.models import F,Q, Count, Max
from .models import Division,TeamInDivision, Team, User
from match.models import MatchTable
from .serializers import DivisionSerializer,TeamInDivisionSerializer, MatchTableSerializer
from rest_framework.decorators import action
from collections import defaultdict
from team.serializers import TeamSerializer


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
    
    def update(self, request, pk=None):
        try:
            division = self.queryset.get(pk=pk)
        except Division.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(division, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['POST'], url_path='delete_division/(?P<division_name>[^/.]+)')
    def delete_division(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        if division404.status != Division.Status.FINISHED:
            return Response({'error': f'Division {division_name} is not finished.'}, status=status.HTTP_400_BAD_REQUEST)

        #deletes the division
        division404.delete()
        return Response({'message': f'Division {division_name} left successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['POST'], url_path='change_admin/(?P<division_name>[^/.]+)/(?P<new_admin_id>\d+)')
    def change_admin(self, request, division_name=None, new_admin_id=None):
        division = get_object_or_404(Division, name=division_name)
        new_admin = get_object_or_404(User, pk=new_admin_id)

        # Update the division admin
        division.admin = new_admin
        division.save()

        return Response({'message': f'Admin of division {division_name} changed successfully to user {new_admin_id}.'}, status=status.HTTP_200_OK)
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
            totalGameTeam1 = MatchTable.objects.filter(team1Name =team,winner__in=[0, 1],status='f').count()
            totalGameTeam2 = MatchTable.objects.filter(team2Name =team,winner__in=[0, 1],status='f').count()
            totalGames = totalGameTeam1 + totalGameTeam2

            #--------------Getting total wins------------------------------------
            # Count wins by checking name and if team has higher score than other team on same row
            team1Wins = MatchTable.objects.filter(team1Name=team, winner = 0).count()
            team2Wins = MatchTable.objects.filter(team2Name=team, winner = 1).count()
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
        

    @action(detail=False, methods=['GET'], url_path='user_divisions/(?P<user_id>\d+)')
    def user_divisions(self, request, user_id=None):
        try:
            # Get all team-in-division instances where the team is associated with the user
            user_team_divisions = TeamInDivision.objects.filter(team__users=user_id)
            # Extract divisions from the team-in-division instances
            user_divisions = [team_in_division.division for team_in_division in user_team_divisions]
            serializer = DivisionSerializer(user_divisions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Division.DoesNotExist:
            return Response({"error": "Divisions not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'], url_path='current-team/(?P<division_name>[^/.]+)/(?P<user_id>\d+)')
    def current_team(self, request, division_name, user_id):
        try:
            # Get the division with the specified name
            division = get_object_or_404(Division, name=division_name)
            
            # Retrieve the team for which the user is the captain in the division
            team = TeamInDivision.objects.filter(division=division, team__captain_id=user_id).first()
            
            if team:
                # Serialize the team object
                serializer = TeamSerializer(team.team)
                return Response(serializer.data)
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
        team_in_division = self.queryset.filter(division=division).order_by("position")
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
    
    @action(detail=False, methods=['POST'], url_path='fix-ladder/(?P<division_name>[^/.]+)')
    def fix_ladder(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)

        teams = TeamInDivision.objects.filter(division=division404).order_by('position')  
        max_position = teams.aggregate(Max('position'))['position__max']
        
        # Iterate through each position
        for position in range(0, max_position):
            try:
                team = teams.get(position=position)
            except TeamInDivision.DoesNotExist:
                # If the position is empty, increment the positions of subsequent teams
                TeamInDivision.objects.filter(division=division404, position__gt=position).update(position=F('position') - 1)
        return Response({'message': 'Ladder positions fixed successfully.'})
        

    @action(detail=False, methods=['GET'], url_path='total-ranks/(?P<division_name>[^/.]+)')
    def total_rank(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)

        total_rank_count = TeamInDivision.objects.filter(division=division404).values('position').annotate(rank_count=Count('position')).count()

        return Response({total_rank_count})
    
    # need to check match status of other team -need to test
    @action(detail=False, methods=['GET'], url_path='challengeable-teams/(?P<division_name>[^/.]+)/(?P<team_name>[^/.]+)')
    def challengeable_teams(self, request, division_name=None,team_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        team404 = get_object_or_404(Team, name=team_name)
        team_in_division = get_object_or_404(TeamInDivision, division=division404, team=team404)
        current_position = team_in_division.position

        #this returns avaialbe challengable teams
        challengeables = TeamInDivision.objects.filter(division=division404,position=current_position - 1)

        #removes all the challengeable teams that are in a match
        challengeables = challengeables.exclude(
            Q(team__team1_matches__status=MatchTable.Status.INPROGRESS) |
            Q(team__team2_matches__status=MatchTable.Status.INPROGRESS) |
            Q(team__team1_matches__status=MatchTable.Status.SCHEDULED) |
            Q(team__team2_matches__status=MatchTable.Status.SCHEDULED)
        )
        serializer = TeamInDivisionSerializer(challengeables, many=True)

        return Response(serializer.data)
    
        #this version returns the whole row
        #challengeables = TeamInDivision.objects.filter(division=division404,position=current_position -1)
        #serializer = self.serializer_class(challengeables, many=True)
        #serializer = self.serializer_class(challengeables, many=True)
        #return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='available-teams/(?P<division_name>[^/.]+)/(?P<team_name>[^/.]+)')
    def available_teams(self, request, division_name=None,team_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        team404 = get_object_or_404(Team, name=team_name)
        team_in_division = get_object_or_404(TeamInDivision, division=division404, team=team404)
        current_position = team_in_division.position

        #this returns avaialbe challengable teams
        challengeables = TeamInDivision.objects.filter(division=division404,position=current_position - 1)

        serializer = TeamInDivisionSerializer(challengeables, many=True)

        return Response(serializer.data)
    
    #not in schedule or inprogress
    @action(detail=False, methods=['POST'], url_path='leave_division/(?P<division_name>[^/.]+)/(?P<team_name>[^/.]+)')
    def leave_division(self, request, division_name=None,team_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        team404 = get_object_or_404(Team, name=team_name)
        team_in_division = get_object_or_404(TeamInDivision, division=division404, team=team404)
        
        # Check if the team has any matches with status 'inProgress' or 'scheduled'
        has_matches = MatchTable.objects.filter(
            division=division404,
            team1Name=team404,
            status__in=[MatchTable.Status.INPROGRESS, MatchTable.Status.SCHEDULED]
        ).exists()

        if has_matches:
            return Response({'message': 'Cannot leave division. Team has matches in progress or scheduled.'}, status=status.HTTP_400_BAD_REQUEST)

        #delete that row when meet condition
        team_in_division.delete()
        return Response({'message': f'Team {team_name} left division {division_name} successfully.'}, status=status.HTTP_200_OK)
    
    
    def order_teams_by_win_rate(self, team_list):
        # Calculate win rate for each team
        team_win_rates = {}
        for team_in_division in team_list:
            team = team_in_division.team
            total_games_team1 = MatchTable.objects.filter(team1Name =team,winner__in=[0, 1],status='f').count()
            total_games_team2 = MatchTable.objects.filter(teamwName =team,winner__in=[0, 1],status='f').count()
            total_games = total_games_team1 + total_games_team2

            team1_wins = MatchTable.objects.filter(team1Name=team, winner = 0).count()
            team2_wins = MatchTable.objects.filter(team2Name=team, winner = 1).count()
            total_wins = team1_wins + team2_wins

            if total_games > 0:
                win_rate = total_wins / total_games
            else:
                win_rate = 0

            team_win_rates[team] = win_rate

        # Sort teams based on win rate
        sorted_teams = sorted(team_list, key=lambda team: team_win_rates[team.team])

        # Assign positions
        for i, team in enumerate(sorted_teams):
            team.position = i + 1  # Positions start from 1


    @action(detail=False, methods=['POST'], url_path='single-assign-positions/(?P<division_name>[^/.]+)')
    def single_assign_positions(self, request, division_name=None):
        division404 = get_object_or_404(Division, name=division_name)
        team_list = TeamInDivision.objects.filter(division=division404)  # Get queryset without converting to list

        # Call order_teams_by_win_rate method with the queryset
        self.order_teams_by_win_rate(team_list)

        # Save each team object to the database
        for team in team_list:
            team.save()

        return Response({'message': 'Positions assigned successfully.'})

    def order_teams_by_group_settings(self, team_list, group_settings):
        # Convert group_settings to a list of tuples sorted by key (level)
        sorted_settings = sorted(group_settings.items(), key=lambda x: int(x[0]) if x[0].isdigit() else float('inf'))
        # Assign positions based on group settings
        number_of_teams = len(team_list)
        total_teams_assigned = 0
        current_position = 1

        for level, teams in sorted_settings:
            if level.isdigit():
                teams = int(teams)
                teams_assigned = 0  # Counter to track how many teams have been assigned positions for the current level
                for _ in range(teams):
                    # Assign the current_position to the next team
                    team_list[total_teams_assigned].position = current_position

                    teams_assigned += 1
                    total_teams_assigned += 1
                    if total_teams_assigned == number_of_teams:
                        break
                    if teams_assigned == teams:
                        # Increment current_position only when all teams for the current level have been assigned positions
                        current_position += 1

        # Handle the 'default' key if present
        default_teams = group_settings.get('default')
        if default_teams:
            default_teams = int(default_teams)
            teams_assigned = 0
            for _ in range(default_teams):
                # Assign the current_position to the next team
                team_list[total_teams_assigned].position = current_position
                teams_assigned += 1
                total_teams_assigned += 1
                if total_teams_assigned == number_of_teams:
                        break
                if teams_assigned == teams:
                    current_position += 1




    @action(detail=False, methods=['POST'], url_path='group-assign-positions/(?P<division_name>[^/.]+)')
    def group_assign_positions(self, request, division_name=None):
        division = get_object_or_404(Division, name=division_name)
        team_list = list(TeamInDivision.objects.filter(division=division))

        # Access group settings from the division instance
        group_settings = division.group_settings

        # Call order_teams_by_group_settings method with the queryset and group settings
        self.order_teams_by_group_settings(team_list, group_settings)

        # Save each team object to the database
        for team in team_list:
            team.save()

        return Response({'message': 'Positions assigned successfully.'})
