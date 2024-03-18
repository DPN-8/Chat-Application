from django.db import models

class User(models.Model):
    username = models.CharField(primary_key = True, unique = True)
    public_key = models.TextField()
    private_key = models.TextField()
    mobile_number = models.BigIntegerField(unique = True)

class Session(models.Model):
    user_1 = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_1')
    user_2 = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'user_2')
    session_key = models.TextField()

class Message(models.Model):
    statusenum = {
        'READ' : 1,
        'UNREAD' : 0
    }
    session = models.ForeignKey(Session, on_delete = models.CASCADE)
    sender = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'sender')
    receiver = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'receiver')
    encrypted_content = models.TextField()
    status = models.CharField(statusenum, default = statusenum['UNREAD'])
    time_stamp = models.DateTimeField(auto_now_add = True)