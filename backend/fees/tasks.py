from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

from fees.models import Fee, Payment
from students.models import Student


@shared_task
def send_fee_reminder_emails():
    """
    Send reminder emails to students who have not paid
    active fees assigned to their department and semester.
    """

    reminders_sent = 0

    active_fees = Fee.objects.filter(is_active=True)

    for fee in active_fees:

        students = Student.objects.filter(
            department=fee.department,
            semester=fee.semester,
        ).select_related("user")

        for student in students:

            already_paid = Payment.objects.filter(
                student=student,
                fee=fee,
                status=Payment.Status.PAID,
            ).exists()

            if already_paid:
                continue

            subject = f"Fee Payment Reminder - {fee.title}"

            message = f"""
Dear {student.user.first_name},

This is a reminder that the following fee is still pending.

Fee Title : {fee.title}
Fee Type  : {fee.fee_type}
Amount    : ₹{fee.amount}
Due Date  : {fee.due_date}

Please complete the payment before the due date.

Thank you,
College Administration
"""

            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[student.user.email],
                    fail_silently=False,
                )

                reminders_sent += 1

            except Exception as e:
                print(
                    f"Failed to send email to "
                    f"{student.user.email}: {e}"
                )

    return f"{reminders_sent} reminder emails sent successfully."