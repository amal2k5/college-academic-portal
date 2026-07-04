from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from notices.models import Notice
from notifications.models import Notification
from students.models import Student


@receiver(post_save, sender=Notice)
def create_notice_notifications(sender, instance, created, **kwargs):
    print("\n========== NOTICE SIGNAL CALLED ==========")

    if not created:
        print("Notice updated. Skipping notification.")
        return

    print(f"Notice Title: {instance.title}")
    print(f"Notice Scope: {instance.scope}")

    if instance.scope == Notice.Scope.COLLEGE:
        students = Student.objects.filter(
            department__college=instance.college
        ).select_related("user")

    elif instance.scope == Notice.Scope.DEPARTMENT:
        students = Student.objects.filter(
            department=instance.department
        ).select_related("user")

    else:
        print("Invalid notice scope.")
        return

    print(f"Students Found: {students.count()}")

    notifications = [
        Notification(
            student=student,
            notice=instance,
            message=f"New notice: {instance.title}",
        )
        for student in students
    ]

    Notification.objects.bulk_create(notifications)

    print(f"Notifications Created: {len(notifications)}")

    channel_layer = get_channel_layer()

    if channel_layer is None:
        print("Channel layer not found!")
        return

    for notification in notifications:
        print(f"Sending notification to: {notification.student.user.email}")

        async_to_sync(channel_layer.group_send)(
            f"student_{notification.student.user.id}",
            {
                "type": "send_notification",
                "message": notification.message,
            },
        )

    print("========== SIGNAL COMPLETED ==========\n")