from django.db import models
from team.models import Team
from users.models import User
from divisions.models import Division

class MatchTable(models.Model):
    id = models.AutoField(primary_key=True)
    team1Name = models.ForeignKey(Team,related_name='team1_matches',on_delete=models.CASCADE)
    team2Name = models.ForeignKey(Team,related_name='team2_matches',on_delete=models.CASCADE)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, null=True)
    ref = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    countDown = models.DateField(null=True)

    scores = models.JSONField(default=dict,blank=True, null=True)
    winner = models.IntegerField(blank=True,null=True)#0: if challenger win    1: if recipient win  2: if tie

    class Status(models.TextChoices):
       INPROGRESS = 'i', 'inProgress' 
       SCHEDULED = 's', 'scheduled'
       VOID = 'v', 'void'
       FINISHED = 'f', 'finished'
    status = models.CharField(max_length=1,choices=Status.choices,null=True)

    def __str__(self):
        return f"{self.team1Name} vs {self.team2Name} in {self.division}"

#https://stackoverflow.com/questions/28712848/composite-primary-key-in-django
#make sure match always has a value
class CourtSchedule(models.Model):
    id = models.AutoField(primary_key=True)
    match = models.ForeignKey(MatchTable, on_delete=models.CASCADE, related_name='court_schedules', default=None)
    location = models.CharField(max_length=128)
    startTime = models.DateTimeField()
    matchDetail = models.CharField(max_length=255,blank=True) 
