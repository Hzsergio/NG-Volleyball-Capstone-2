from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, Messages
'''
router = DefaultRouter()
router.register('messages', MessageViewSet, basename='Messages')
'''
router = DefaultRouter()
router.register('messages', Messages, basename='Messages')

urlpatterns = router.urls
