from rest_framework import serializers
from .models import User, Team, Division,TeamInDivision

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
    
        
