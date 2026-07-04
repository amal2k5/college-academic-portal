from django.shortcuts import render

# Create your views here.
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