from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_approval_email_task(self, registration_id, user_id, token_id):
    from django.contrib.auth import get_user_model
    from accounts.models import AccountSetupToken
    from accounts.services import send_setup_email

    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
        token = AccountSetupToken.objects.get(id=token_id)
        send_setup_email(user, token)
    except Exception as exc:
        logger.error(f"send_approval_email_task failed for registration {registration_id}: {exc}")
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_rejection_email_task(self, email, college_name, reason=""):
    from accounts.services import send_rejection_email

    try:
        send_rejection_email(email, college_name, reason)
    except Exception as exc:
        logger.error(f"send_rejection_email_task failed for {email}: {exc}")
        raise self.retry(exc=exc)