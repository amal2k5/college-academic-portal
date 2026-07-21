from rest_framework import serializers
from .models import Notification, DeviceToken
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "message",
            "is_read",
            "created_at",
        ]


class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = [
            "token",
            "device_name",
        ]
        extra_kwargs = {
            "token": {
                "validators": [],
            }
        }