from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('',include('team.urls')),
    path('',include('users.urls')),
    path('',include('divisions.urls')),
    path('',include('match.urls') ),
    path('',include('messaging.urls'))
]


