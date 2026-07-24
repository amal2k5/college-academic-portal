from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from fees.models import Fee, Payment
from students.models import Student

@shared_task
def send_fee_reminders_task(fee_id):
    """
    Celery task to send reminder emails to students who haven't paid a specific fee.
    """
    try:
        fee = Fee.objects.get(id=fee_id, is_active=True)
    except Fee.DoesNotExist:
        return f"Fee {fee_id} does not exist or is inactive."

    # Find students in the fee's department and semester
    eligible_students = Student.objects.filter(
        department=fee.department, 
        semester=fee.semester
    ).select_related('user')

    # Find students who have successfully paid
    paid_student_ids = Payment.objects.filter(
        fee=fee, 
        status=Payment.Status.PAID
    ).values_list('student_id', flat=True)

    # Exclude paid students to get pending students
    pending_students = eligible_students.exclude(id__in=paid_student_ids)

    if not pending_students.exists():
        return f"No pending students found for fee {fee_id}."

    emails = []
    for student in pending_students:
        if student.user.email:
            emails.append(student.user.email)

    if not emails:
        return f"No email addresses found for pending students for fee {fee_id}."

    # Send bulk email
    subject = f"Payment Reminder: {fee.title}"
    message = (
        f"Dear Student,\n\n"
        f"This is a reminder that the payment for '{fee.title}' (Amount: ₹{fee.amount}) "
        f"is pending. The due date is {fee.due_date.strftime('%d %B %Y')}.\n\n"
        f"Please log in to the College Academic Portal and complete your payment.\n\n"
        f"Thank you,\n"
        f"{fee.department.name} Department"
    )

    # In a production environment with many users, you might want to send these in batches
    # or individually to personalize them, but for this task, sending BCC or loop is fine.
    # Using send_mail in a loop for individual delivery:
    success_count = 0
    for email in emails:
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@collegeportal.com',
                recipient_list=[email],
                fail_silently=True,
            )
            success_count += 1
        except Exception as e:
            # Log the error in a real app
            pass

    return f"Successfully sent reminders to {success_count}/{len(emails)} students for fee {fee_id}."


class ReminderService:
    @staticmethod
    def trigger_reminders(fee_id, department):
        """
        Validates ownership and dispatches the Celery task.
        """
        try:
            fee = Fee.objects.get(id=fee_id, department=department)
        except Fee.DoesNotExist:
            raise Fee.DoesNotExist("Fee not found or you don't have permission to send reminders for it.")
            
        if not fee.is_active:
            raise ValueError("Cannot send reminders for inactive fees.")

        # Dispatch task to Celery
        send_fee_reminders_task.delay(fee_id)
        
        return True
