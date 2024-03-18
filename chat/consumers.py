from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from user_register.models import Session, User, Message
from django.shortcuts import get_object_or_404
from urllib.parse import unquote


import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user1 = self.scope['url_route']['kwargs']['user1']
        self.user2 = self.scope['url_route']['kwargs']['user2']
        self.session = self.scope['query_string']
        decoded_session_key = unquote(self.session)
        start_index = decoded_session_key.find("'") + -1
        end_index = decoded_session_key.rfind("'") + 1
        session_key_string = decoded_session_key[start_index:end_index]
        messages = list(Message.objects.filter(session__session_key=session_key_string))
        serialized_messages = []
        for message in messages:
            serialized_message = {
                'sender': message.sender.username,
                'receiver': message.receiver.username,
                'message': message.encrypted_content,
                'timestamp': message.time_stamp.isoformat(),
                'status': message.status
            }
            serialized_messages.append(serialized_message)

        message_data = json.dumps(serialized_messages)
        if self.user1 and self.user2 : 
            self.room_name = f'{self.user1}-{self.user2}'
            self.room_group_name = self.room_name
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )
            self.accept()
            self.send(text_data=message_data)


    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

# {'sender': 'Deepan', 'receiver': 'Stave', 'text': 'Ji', 'timestamp': '2024-03-14T12:53:10.156Z'}
    def receive(self, text_data):
        json_text = json.loads(text_data)
        message = json_text['message']
        sender = json_text['sender']
        receiver = json_text['receiver']
        timestamp = json_text['timestamp']
        session_key = json_text['session_key']

        session = Session.objects.get(session_key = session_key)
        session_sender = get_object_or_404(User, username = sender)
        session_receiver = get_object_or_404(User, username = receiver)
        message_obj = Message(session = session, sender = session_sender, receiver = session_receiver, encrypted_content = message, time_stamp = timestamp)
        message_obj.save()
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "message": message,
                "sender" : sender,
                "receiver" : receiver,
                "timestamp" : timestamp,
                "session_key" : session_key
            }
        )
    
    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        timestamp = event['timestamp']
        self.send(text_data=json.dumps({"message": message, "sender" : sender, "receiver": receiver, "timestamp" : timestamp}))