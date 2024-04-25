from rest_framework import viewsets, permissions, status
from .models import *
from divisions.models import TeamInDivision
from .serializers import *
from rest_framework.response import Response
from rest_framework.decorators import action


# Create your views here.


class TeamViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def list(self, request):
        queryset = Team.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = CreateTeamSerializer(data=request.data)
        if serializer.is_valid():
            # serializer.save()
            team_instance = serializer.save()  # Save the team instance
            team_instance.users.add(team_instance.captain)  # Add the captain to the users list
            print("Serialized Data:", serializer.data)

            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project)
        return Response(serializer.data)


    def update(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        project.delete()
        return Response(status=204)

    @action(detail=False, methods=['GET'], url_path='user_teams/(?P<user_id>\d+)')
    def user_teams(self, request, user_id=None):
        try:
            user_teams = Team.objects.filter(users=user_id)
            serializer = TeamSerializer(user_teams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['POST'], url_path='join_team/(?P<team_id>\d+)/(?P<user_id>\d+)')
    def join_team(self, request, team_id=None, user_id=None):
        try:
            team = Team.objects.get(pk=team_id)
            user = User.objects.get(pk=user_id)
            team.users.add(user)
            return Response({'message': f'User {user_id} joined team {team_id} successfully.'})
        except Team.DoesNotExist:
            return Response({'error': f'Team {team_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': f'User {user_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['POST'], url_path='reassign_captain/(?P<team_id>\d+)/(?P<user_id>\d+)')
    def reassign_captain(self, request, team_id=None, user_id=None):
        try:
            team = Team.objects.get(pk=team_id)
            new_captain = User.objects.get(pk=user_id)

            if new_captain not in team.users.all():  # Check if user is a member of the team
                return Response({'error': f'User with ID {user_id} is not a member of team {team_id}.'}, status=status.HTTP_400_BAD_REQUEST)
            team.captain = new_captain#reassign and save to db
            team.save()
            return Response({'message': f'Captain of team {team_id} reassigned successfully to user {new_captain}.'}, status=status.HTTP_200_OK)
        except Team.DoesNotExist:
            return Response({'error': f'Team {team_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': f'User {user_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #i think this also works for kicking players
    @action(detail=False, methods=['DELETE'], url_path='leave_team/(?P<team_id>\d+)/(?P<user_id>\d+)')
    def leave_team(self, request, team_id=None, user_id=None):
        try:
            team = Team.objects.get(pk=team_id)
            user = User.objects.get(pk=user_id)
            
            if team.captain == user:#not allowed if captain
                return Response({'message': 'you can not leave you are the captain '},status=status.HTTP_403_FORBIDDEN)
            
            if user in team.users.all():  # Check if the user is in the team's users
                team.users.remove(user)  # Remove the user from the team
                return Response({'message': f'User {user_id} left team {team_id} successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': f'User {user_id} is not a member of team {team_id}.'}, status=status.HTTP_400_BAD_REQUEST)#removes the user from the team
        except Team.DoesNotExist:
            return Response({'error': f'Team {team_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': f'User {user_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['DELETE'], url_path='delete_team/(?P<team_id>\d+)')
    def delete_team(self, request, team_id=None):
        try:
            team = Team.objects.get(pk=team_id)
            
            # Check if the team is assigned to any division
            if TeamInDivision.objects.filter(team=team).exists():
                return Response({'error': 'Team is assigned to one or more divisions and cannot be deleted.'}, status=status.HTTP_400_BAD_REQUEST)
            
            team.delete()
            return Response({'message': f'Team {team_id} deleted successfully.'}, status=status.HTTP_200_OK)
        
        except Team.DoesNotExist:
            return Response({'error': f'Team {team_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
