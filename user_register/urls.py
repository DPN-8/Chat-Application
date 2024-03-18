from django.urls import re_path
from user_register.views import UserViews, session

urlpatterns = [
    re_path(r'session/username/(?P<user1>\w+)-(?P<user2>\w+)/$', session),
    re_path(r'user/(?P<id>.*)$', UserViews.as_view())
]
