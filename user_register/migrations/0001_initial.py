# Generated by Django 5.0.3 on 2024-03-13 13:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('username', models.CharField(primary_key=True, serialize=False, unique=True)),
                ('public_key', models.TextField()),
                ('private_key', models.TextField()),
                ('mobile_number', models.BigIntegerField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.TextField()),
                ('user_1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_1', to='user_register.user')),
                ('user_2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_2', to='user_register.user')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('encrypted_content', models.TextField()),
                ('status', models.CharField(default=0, verbose_name={'READ': 1, 'UNREAD': 0})),
                ('time_stamp', models.DateTimeField(auto_now_add=True)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_register.session')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_register.user')),
            ],
        ),
    ]
