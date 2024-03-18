from django.shortcuts import render
from user_register.views import get_request_body, UserViews
from user_register.response import response
from user_register.models import User
def login(request):
    request_body = get_request_body(request)

    username = request_body['username']

    if username :
        print(username)
        user = list(User.objects.filter(username = username).values())
        if user :
            return response(request.method, 'success', 'user data', user)
        else :
            return response(request.method, 'user_not_found', 'username ' + username + ' not found', user)
