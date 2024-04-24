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
    

    @classmethod
    def get_message_threads(cls, user1, user2):
        """
        Retrieve message threads between two users.
        """
        # Query messages where either user1 is the sender and user2 is the recipient, or vice versa
        messages = cls.objects.filter(
            models.Q(sender=user1, recipient=user2) |
            models.Q(sender=user2, recipient=user1)
        ).order_by('sent_time')
        return messages