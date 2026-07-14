from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification
from .tasks import send_fcm_notification


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
            # TODO: Replace with proper logging
            pass

    try:
        send_fcm_notification.delay(
            student_ids=student_ids,
            title=title,
            body=message,
            data=data or {},
        )
    except Exception:
        # TODO: Replace with proper logging
        pass

    return notifications