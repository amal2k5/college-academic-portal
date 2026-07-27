from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_approval_email_task(self, registration_id, user_id, token_id):
    from django.contrib.auth import get_user_model
    from accounts.models import AccountSetupToken
    from accounts.services import send_setup_email

    User = get_user_model()

    logger.info(
        f"Starting approval email task | registration={registration_id}, user={user_id}, token={token_id}"
    )

    try:
        user = User.objects.get(id=user_id)
        logger.info(f"User found: {user.email}")

        token = AccountSetupToken.objects.get(id=token_id)
        logger.info("Setup token found")

        send_setup_email(user, token)

        logger.info(f"Approval email sent successfully to {user.email}")

    except Exception as exc:
        logger.exception("Approval email task failed")
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_rejection_email_task(self, email, college_name, reason=""):
    from accounts.services import send_rejection_email

    try:
        send_rejection_email(email, college_name, reason)
    except Exception as exc:
        logger.error(f"send_rejection_email_task failed for {email}: {exc}")
        raise self.retry(exc=exc)