from django.shortcuts import render, get_object_or_404
from user_register.models import User, Session
from django.views import View
from user_register.response import response
from cryptography.fernet import Fernet

import json

class UserViews(View):
    def post(self, request, *args, **kwargs):
        request_body = get_request_body(request)
        username = request_body['username']
        mobile_number = int(request_body['mobile_number'])
        if username and mobile_number:
            user = {
                'username' : username,
                'mobile_number' : mobile_number
            }
            try :
                user_obj = User(**user)
                user_obj.save()
                return response(request.method, 'success', 'user added successfully', user)
            except Exception as e:
                return response(request.method, 'internal_server_error', 'Error occured while saving the user info', user)
        return response(request.method, 'bad_request', 'Not enough data to save the user', user)
    
    def get(self, request, id):
        if id :
            try : 
                user = User.objects.filter(username = id).first()
                return user
            except Exception as e:
                return None
        else :
            username = request.GET.get('username')
            try :
                if username:
                    user_list = list(User.objects.filter().exclude(username=username).values())
                else :
                    user_list = list(User.objects.filter().values())
                return response(request.method, 'success', 'user_list', user_list)
            except Exception as e :
                return response(request.method, 'internal_server_error', str(e))
            
def get_request_body(request):
    return json.loads(request.body.decode('utf-8'))


def session(request, user1, user2):
    if request.method == 'POST':
        sender = user1
        receiver = user2
        user_1_username = None
        if user1 > user2 :
            user_1_username = receiver
            user_2_username = sender
        else :
            user_1_username = sender
            user_2_username = receiver
        # print(user_1_username)
        # print(user_2_username)
        session_obj = Session.objects.filter(user_1__username=user_1_username, user_2__username=user_2_username).first()
        if not session_obj:
            user1_obj = get_object_or_404(User, username=user_1_username)
            user2_obj = get_object_or_404(User, username=user_2_username)
            session_key = str(Fernet.generate_key())
            session_obj = Session.objects.create(user_1=user1_obj, user_2=user2_obj, session_key = session_key)
        session_data = {
            'sender': sender,
            'receiver': receiver,
            'public_key' : session_obj.user_1.public_key if sender == user_2_username else session_obj.user_2.public_key,
            'session_key': str(session_obj.session_key)
        }
        return response(request.method, 'success', 'session_data', session_data)
    else: 
        from django.db.models import Q
        session_obj_list = list(Session.objects.filter(Q(user_1__username = user1) | Q(user_2__username = user1)))
        session_list = []

        for session in session_obj_list:

            if user1 == session.user_1.username:
                receiver = session.user_2.username
                mobile_number = session.user_2.mobile_number
            else:
                receiver = session.user_1.username
                mobile_number = session.user_1.mobile_number

            session = {
                'username': receiver,
                'mobile_number' : mobile_number,
            }
            session_list.append(session)

    return response(request.method, 'success', 'user_list', session_list)
    
def print_info(args):
    print('<----------------------------------------------------------------------->')
    print('/n')
    print('/n')
    print('/n')
    print('/n')
    print(args)
    print('/n')
    print('/n')
    print('/n')
    print('/n')
    print('/n')
    print('<----------------------------------------------------------------------->')