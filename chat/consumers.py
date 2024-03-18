from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user1 = self.scope['url_route']['kwargs']['user1']
        self.user2 = self.scope['url_route']['kwargs']['user2']
        print(self.scope)
        if self.user1 and self.user2 : 
            self.room_name = f'{self.user1}-{self.user2}'
            self.room_group_name = self.room_name
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )
            self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
# {'sender': 'Deepan', 'receiver': 'Stave', 'text': 'Ji', 'timestamp': '2024-03-14T12:53:10.156Z'}
    def receive(self, text_data):
        json_text = json.loads(text_data)
        print(json_text)
        message = json_text['message']
        sender = json_text['sender']
        receiver = json_text['receiver']
        timestamp = json_text['timestamp']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "message": message,
                "sender" : sender,
                "receiver" : receiver,
                "timestamp" : timestamp
            }
        )
    
    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        timestamp = event['timestamp']
        self.send(text_data=json.dumps({"message": message, "sender" : sender, "receiver": receiver, "timestamp" : timestamp}))