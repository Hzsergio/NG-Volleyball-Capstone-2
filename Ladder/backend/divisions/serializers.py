from django.db.models import F
from rest_framework import serializers
from .models import User, Team, Division, TeamInDivision
from match.models import MatchTable

class TeamInDivisionSerializer(serializers.ModelSerializer):
    division_name = serializers.CharField(source='division.name', read_only=True)
    team_name = serializers.CharField(source='team.name')
    class Meta:
        model = TeamInDivision
        fields = ('division','team','position', 'division_name', 'team_name')

class DivisionSerializer(serializers.ModelSerializer):
    admin_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Division
        fields = ('name','admin','publicProfile', 'admin_email','status')

    def get_admin_email(self, obj):
        return obj.admin.email

class MatchTableSerializer(serializers.ModelSerializer):
    division_name = serializers.CharField(source='division.name', read_only=True)
    team_name = serializers.CharField(source='team.name')
    wins = serializers.SerializerMethodField()
    losses = serializers.SerializerMethodField()
    ratio = serializers.SerializerMethodField()

    class Meta:
        model = TeamInDivision
        fields = ('division','team','position', 'division_name', 'team_name', 'wins', 'losses', 'ratio')

    def get_wins(self, obj):
        team = obj.team
        team1Wins = MatchTable.objects.filter(team1Name=team, team1Wins__gt=F('team2Wins')).count()
        team2Wins = MatchTable.objects.filter(team2Name=team, team2Wins__gt=F('team1Wins')).count()
        totalWins = team1Wins + team2Wins
        return totalWins
    
    def get_losses(self, obj):
        wins=self.get_wins(obj)
        totalGames = self.get_total_games(obj)
        return wins - totalGames
    
    def get_total_games(self, obj):
        team = obj.team
        totalGameTeam1 = MatchTable.objects.filter(team1Name =team).count()
        totalGameTeam2 = MatchTable.objects.filter(team2Name =team).count()
        totalGames = totalGameTeam1 + totalGameTeam2
        return totalGames
    
    def get_ratio(self, obj):
        wins=self.get_wins(obj)
        totalGames=self.get_total_games(obj)
        if totalGames == 0:
            return 0
        
        return wins / totalGames
