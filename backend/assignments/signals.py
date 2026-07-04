from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from assignments.models import Assignment
from notifications.models import Notification
from students.models import Student


@receiver(post_save, sender=Assignment)
def create_assignment_notifications(sender, instance, created, **kwargs):
    print("\n========== ASSIGNMENT SIGNAL CALLED ==========")

    if not created:
        print("Assignment updated. Skipping notification.")
        return

    print(f"Assignment Title: {instance.title}")
    print(f"Department: {instance.department.name}")
    print(f"Target Year: {instance.target_year}")

    students = Student.objects.filter(
        department=instance.department,
        year=instance.target_year,
    ).select_related("user")

    print(f"Students Found: {students.count()}")

    notifications = [
        Notification(
            student=student,
            assignment=instance,
            message=f"New assignment: {instance.title}",
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

    print("========== ASSIGNMENT SIGNAL COMPLETED ==========\n")