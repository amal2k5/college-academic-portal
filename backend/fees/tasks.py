from celery import shared_task

from accounts.email_services import send_email

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

            if not student.user.email:
                continue

            subject = f"Fee Payment Reminder - {fee.title}"

            text_message = f"""
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

            html_message = f"""
            <p>Dear <strong>{student.user.first_name}</strong>,</p>

            <p>This is a reminder that the following fee is still pending.</p>

            <table style="border-collapse: collapse;">
                <tr>
                    <td><strong>Fee Title</strong></td>
                    <td>{fee.title}</td>
                </tr>
                <tr>
                    <td><strong>Fee Type</strong></td>
                    <td>{fee.fee_type}</td>
                </tr>
                <tr>
                    <td><strong>Amount</strong></td>
                    <td>₹{fee.amount}</td>
                </tr>
                <tr>
                    <td><strong>Due Date</strong></td>
                    <td>{fee.due_date}</td>
                </tr>
            </table>

            <p>Please complete the payment before the due date.</p>

            <p>
                Thank you,<br>
                <strong>College Administration</strong>
            </p>
            """

            try:
                send_email(
                    to=student.user.email,
                    subject=subject,
                    html_content=html_message,
                    text_content=text_message,
                )
                reminders_sent += 1

            except Exception as exc:
                print(
                    f"Failed to send email to "
                    f"{student.user.email}: {exc}"
                )

    return f"{reminders_sent} reminder emails sent successfully."   