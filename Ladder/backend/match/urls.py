from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('MatchTable', MatchTableView, basename='MatchTable')
router.register('CourtSchedule', CourtScheduleView, basename='CourtSchedule')

urlpatterns = router.urls



