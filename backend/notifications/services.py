from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification
from .tasks import send_fcm_notification
import logging

logger = logging.getLogger(__name__)


def notify_students(
    students,
    message,
    title="Notification",
    notice=None,
    assignment=None,
    data=None,
):
    """
    Create notification records, send WebSocket updates,
    and queue Firebase push notifications.
    """

    if not students:
        return []

    notifications = []
    student_ids = []

    channel_layer = get_channel_layer()

    for student in students:
        notification = Notification.objects.create(
            student=student,
            message=message,
            notice=notice,
            assignment=assignment,
        )

        notifications.append(notification)
        student_ids.append(student.id)

        try:
            async_to_sync(channel_layer.group_send)(
                f"student_{student.user.id}",
                {
                    "type": "send_notification",
                    "message": message,
                },
            )
        except Exception:
            logger.exception("Exception in notify_students group_send")

    try:
        send_fcm_notification.delay(
            student_ids=student_ids,
            title=title,
            body=message,
            data=data or {},
        )
    except Exception:
        logger.exception("Exception in notify_students send_fcm_notification")

    return notifications


def notify_platform_admins(message, data=None):
    """
    Send WebSocket updates to all platform admins.
    This does NOT create database notifications or send FCM.
    """
    channel_layer = get_channel_layer()
    
    try:
        async_to_sync(channel_layer.group_send)(
            "platform_admin",
            {
                "type": "send_notification",
                "message": message,
            },
        )
    except Exception:
        logger.exception("Exception in notify_platform_admins")


def notify_hods(hod_users, message, data=None):
    """
    Send WebSocket updates to specific HODs.
    """
    if not hod_users:
        return

    channel_layer = get_channel_layer()

    for user in hod_users:
        try:
            async_to_sync(channel_layer.group_send)(
                f"hod_{user.id}",
                {
                    "type": "send_notification",
                    "message": message,
                },
            )
        except Exception:
            logger.exception("Exception in notify_hods group_send")


def notify_college_admins(admin_users, message, data=None):
    """
    Send WebSocket updates to specific College Admins.
    """
    if not admin_users:
        return

    channel_layer = get_channel_layer()

    for user in admin_users:
        try:
            async_to_sync(channel_layer.group_send)(
                f"college_admin_{user.id}",
                {
                    "type": "send_notification",
                    "message": message,
                },
            )
        except Exception:
            logger.exception("Exception in notify_college_admins group_send")