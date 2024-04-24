from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from .models import Message
from .serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    #def get_queryset(self):
        # Filter messages where the recipient is the current authenticated user
      #  return Message.objects.filter(recipient=self.request.user)   
    

class Messages(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        queryset = Message.objects.all()
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
    


@api_view(['GET'])
def inbox_view(request):
    """
    Retrieve a list of received messages for the authenticated user.
    """
    messages = Message.objects.filter(recipient=request.user)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def compose_message_view(request):
    """
    Compose and send a new message.
    """
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(sender=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def message_detail_view(request, message_id):
    """
    Retrieve a specific message by its ID.
    """
    message = get_object_or_404(Message, pk=message_id)
    if request.user == message.sender or request.user == message.recipient:
        serializer = MessageSerializer(message)
        return Response(serializer.data)
    return Response({"message": "You do not have permission to view this message."}, status=403)
