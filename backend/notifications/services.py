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
    notifications = []
    student_ids = []
    channel_layer = get_channel_layer()

    for student in students:
        # Create database notification entry for each student
        notification = Notification.objects.create(
            student=student,
            message=message,
            notice=notice,
            assignment=assignment,
        )
        notifications.append(notification)
        student_ids.append(student.id)

        # Send real-time WebSocket update to the individual student group
        async_to_sync(channel_layer.group_send)(
            f"student_{student.user.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )

    # Dispatch FCM push notification task asynchronously via Celery
    send_fcm_notification.delay(
        student_ids=student_ids,
        title=title,
        body=message,
        data=data or {},
    )

    return notifications