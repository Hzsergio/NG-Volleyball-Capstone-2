from django.db import models
from django.utils import timezone
from django.conf import settings
from users.models import User


class Message(models.Model):
    
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User,related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    sent_time = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)
    #captain = models.ForeignKey(User,related_name='team_captain',on_delete=models.CASCADE)


    def __str__(self):
        return f"From {self.sender} to {self.recipient} - {self.sent_time}"
