from asgiref.sync import async_to_sync
from celery import shared_task

from channels.layers import get_channel_layer
from django.db.models import Count, Q

from students.models import Student
from notifications.models import Notification

from .models import Attendance, Subject, Exam


@shared_task
def check_low_attendance():
    """
    Runs daily and creates notifications
    for students whose attendance is below 75%.
    """

    notifications_created = 0

    students = Student.objects.select_related(
        "department"
    )

    for student in students:

        subjects = Subject.objects.filter(
            department=student.department
        )

        for subject in subjects:

            stats = Attendance.objects.filter(
                student=student,
                subject=subject,
            ).aggregate(
                total_days=Count("id"),
                present_days=Count(
                    "id",
                    filter=Q(
                        status=Attendance.Status.PRESENT
                    ),
                ),
            )

            total_days = stats["total_days"]
            present_days = stats["present_days"]

            if total_days == 0:
                continue

            percentage = round(
                (present_days / total_days) * 100,
                2,
            )

            if percentage < 75:

                Notification.objects.create(
                    student=student,
                    message=(
                        f"Low Attendance Alert!\n"
                        f"{subject.name}: {percentage}% attendance.\n"
                        f"Minimum required attendance is 75%."
                    ),
                )

                notifications_created += 1

    return (
        f"{notifications_created} notification(s) created."
    )


@shared_task
def notify_exam_scheduled(exam_id):
    """
    Notify students when a new exam is scheduled.
    """

    exam = Exam.objects.select_related(
        "subject",
        "department",
    ).get(id=exam_id)

    students = Student.objects.filter(
        department=exam.department,
        semester=exam.semester,
    )

    channel_layer = get_channel_layer()

    for student in students:

        message = (
            f"Your {exam.get_exam_type_display()} for "
            f"{exam.subject.name} is scheduled on "
            f"{exam.exam_date} at {exam.start_time}."
        )

        Notification.objects.create(
            student=student,
            message=message,
        )

        async_to_sync(channel_layer.group_send)(
            f"student_{student.user.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )


@shared_task
def notify_exam_rescheduled(exam_id):
    """
    Notify students when an exam is rescheduled.
    """

    exam = Exam.objects.select_related(
        "subject",
        "department",
    ).get(id=exam_id)

    students = Student.objects.filter(
        department=exam.department,
        semester=exam.semester,
    )

    channel_layer = get_channel_layer()

    for student in students:

        message = (
            f"Your {exam.get_exam_type_display()} for "
            f"{exam.subject.name} has been moved from "
            f"{exam.original_date} to "
            f"{exam.exam_date} at "
            f"{exam.start_time}."
        )

        Notification.objects.create(
            student=student,
            message=message,
        )

        async_to_sync(channel_layer.group_send)(
            f"student_{student.user.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )


@shared_task
def notify_exam_cancelled(exam_id):
    """
    Notify students when an exam is cancelled.
    """

    exam = Exam.objects.select_related(
        "subject",
        "department",
    ).get(id=exam_id)

    students = Student.objects.filter(
        department=exam.department,
        semester=exam.semester,
    )

    channel_layer = get_channel_layer()

    for student in students:

        message = (
            f"Your {exam.get_exam_type_display()} for "
            f"{exam.subject.name} on "
            f"{exam.exam_date} has been cancelled."
        )

        Notification.objects.create(
            student=student,
            message=message,
        )

        async_to_sync(channel_layer.group_send)(
            f"student_{student.user.id}",
            {
                "type": "send_notification",
                "message": message,
            },
        )