from celery import shared_task

from .firebase import send_to_devices
from .models import DeviceToken



@shared_task
def send_fcm_notification(
    student_ids,
    title,
    body,
    data=None,
):
    """
    Send an FCM notification to one or more students.
    """

    tokens = list(
        DeviceToken.objects.filter(
            student_id__in=student_ids,
            is_active=True,
        ).values_list(
            "token",
            flat=True,
        )
    )

    if not tokens:
        return {
            "success": False,
            "message": "No active device tokens found.",
        }

    return send_to_devices(
        tokens=tokens,
        title=title,
        body=body,
        data=data,
    )