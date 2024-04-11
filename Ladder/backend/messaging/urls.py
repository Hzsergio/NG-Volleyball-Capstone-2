from django.urls import path
from . import views
from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'messaging'

urlpatterns = [
    path('inbox', views.inbox_view, name='inbox'),
    path('compose/', views.compose_message_view, name='compose'),
    path('message/<int:message_id>/', views.message_detail_view, name='message_detail'),
]

router = DefaultRouter()
router.register('inbox', views.inbox_view, basename='inbox')
urlpatterns = router.urls