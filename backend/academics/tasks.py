from celery import shared_task

from django.db.models import Count, Q

from students.models import Student
from notifications.models import Notification

from .models import Attendance, Subject


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