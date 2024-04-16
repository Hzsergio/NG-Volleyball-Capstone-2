from rest_framework import serializers
from .models import *

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'sent_time', 'read', 'sender_username', 'receiver_username']


'''

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'sent_time', 'read','sender_username','receiver_username']
    
    def get_sender_username(self, obj):
            return obj.sender.username
    
    def get_receiver_username(self, obj):
            return obj.receiver.username

    '''