from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from assignments.models import Assignment
from notifications.models import Notification
from students.models import Student


@receiver(post_save, sender=Assignment)
def create_assignment_notifications(sender, instance, created, **kwargs):
    if not created:
        return

    students = Student.objects.filter(
        department=instance.department,
        year=instance.target_year,
    ).select_related("user")

    notifications = [
        Notification(
            student=student,
            assignment=instance,
            message=f"New assignment: {instance.title}",
        )
        for student in students
    ]

    Notification.objects.bulk_create(notifications)

    channel_layer = get_channel_layer()

    if channel_layer:
        for notification in notifications:
            async_to_sync(channel_layer.group_send)(
                f"student_{notification.student.user.id}",
                {
                    "type": "send_notification",
                    "message": notification.message,
                },
            )