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
    admin_username = serializers.SerializerMethodField()
    formatted_start_date = serializers.SerializerMethodField()
    formatted_end_date = serializers.SerializerMethodField()


        
    class Meta:
        model = Division
        fields = ('name', 'admin', 'publicProfile', 'admin_username', 'status', 'description', 'category', 'defaultLocation', 'group_settings', 'challengeDistance','tournament_type', 'start_date', 'end_date', 'formatted_start_date', 'formatted_end_date')

    def get_admin_username(self, obj):
        return obj.admin.username
    
    def get_formatted_start_date(self, obj):
        return obj.start_date.strftime("%b %d %Y") if obj.start_date else None
    
    def get_formatted_end_date(self, obj):
        return obj.end_date.strftime("%b %d %Y") if obj.end_date else None

class MatchTableSerializer(serializers.ModelSerializer):
    division_name = serializers.CharField(source='division.name', read_only=True)
    team_name = serializers.CharField(source='team.name')
    wins = serializers.SerializerMethodField()
    losses = serializers.SerializerMethodField()
    ratio = serializers.SerializerMethodField()
    team_captain = serializers.CharField(source='team.captain')  


    class Meta:
        model = TeamInDivision
        fields = ('division','team','position', 'division_name', 'team_name', 'wins', 'losses', 'ratio', 'team_captain')

    def get_wins(self, obj):
        team = obj.team
        team1Wins = MatchTable.objects.filter(team1Name=team, team1Wins__gt=F('team2Wins')).count()
        team2Wins = MatchTable.objects.filter(team2Name=team, team2Wins__gt=F('team1Wins')).count()
        totalWins = team1Wins + team2Wins
        return totalWins
    
    def get_losses(self, obj):
        wins=self.get_wins(obj)
        totalGames = self.get_total_games(obj)
        return totalGames - wins
    
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
