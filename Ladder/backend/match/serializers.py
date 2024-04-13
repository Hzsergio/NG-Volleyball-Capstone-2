from rest_framework import serializers
from .models import *

class MatchTableSerializer(serializers.ModelSerializer):
    team1_name = serializers.SerializerMethodField()
    team2_name = serializers.SerializerMethodField()

    def get_team1_name(self, obj):
        return obj.team1Name.name

    def get_team2_name(self, obj):
        return obj.team2Name.name

    class Meta:
        model = MatchTable
        fields = ('id','team1Name','team2Name', 'division', 'ref','countDown','team1Wins','team2Wins','status','team1_name', 'team2_name')

class CourtScheduleSerializer(serializers.ModelSerializer):
    startTime = serializers.DateTimeField(format='%I:%M %m-%d-%Y')  # Format the startTime field

    class Meta:
        model = CourtSchedule
        fields = ('id','match','location','startTime','matchDetail')
