"""
ASGI config for basic_chat_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chat import routing


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basic_chat_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            URLRouter(
                routing.websocket_urlpatterns
            )
        ),
})
