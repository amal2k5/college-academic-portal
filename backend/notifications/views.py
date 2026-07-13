from django.shortcuts import render
from .models import DeviceToken
from .serializers import DeviceTokenSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import User
from .models import Notification
from .serializers import NotificationSerializer





class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.STUDENT:
            return Response(
                {"detail": "Only students can access notifications."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notifications = Notification.objects.filter(
            student__user=request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(serializer.data)


class UnreadNotificationCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.STUDENT:
            return Response(
                {"detail": "Only students can access notifications."},
                status=status.HTTP_403_FORBIDDEN,
            )

        count = Notification.objects.filter(
            student__user=request.user,
            is_read=False,
        ).count()

        return Response(
            {
                "unread_count": count,
            }
        )


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != User.Role.STUDENT:
            return Response(
                {"detail": "Only students can access notifications."},
                status=status.HTTP_403_FORBIDDEN,
            )

        Notification.objects.filter(
            student__user=request.user,
            is_read=False,
        ).update(
            is_read=True,
        )

        return Response(
            {
                "message": "All notifications marked as read."
            }
        )


from students.models import Student

class DeviceTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response(
                {"detail": "Only students can register device tokens."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = DeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]

        device_name = serializer.validated_data.get(
            "device_name",
            "",
        )

        DeviceToken.objects.filter(
            student=student,
            is_active=True,
            ).exclude(
                    token=token,
                                ).update(
                                        is_active=False,
            )

        DeviceToken.objects.update_or_create(
            token=token,
            defaults={
                "student": student,
                "device_name": device_name,
                "is_active": True,
            },
        )

        return Response(
            {"message": "Device token saved successfully."},
            status=status.HTTP_200_OK,
        )