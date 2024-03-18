from django.urls import re_path
from authentication.views import login

urlpatterns = [
    re_path('login', login)
]