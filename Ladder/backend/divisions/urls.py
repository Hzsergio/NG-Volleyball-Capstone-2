from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('division', DivisionView, basename='division')
router.register('teamindivision', TeamInDivisionView, basename='teamindivision')

urlpatterns = router.urls



