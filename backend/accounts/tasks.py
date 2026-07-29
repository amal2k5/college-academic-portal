from celery import shared_task
import logging

logger = logging.getLogger(__name__)

from django.conf import settings

print("=" * 60)
print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
print("EMAIL_HOST_PASSWORD:", repr(settings.EMAIL_HOST_PASSWORD))
print("=" * 60)
@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_setup_email_task(self, user_id, token_id):
    from django.contrib.auth import get_user_model
    from .models import AccountSetupToken
    from .services import send_setup_email

    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
        token = AccountSetupToken.objects.get(id=token_id)
        send_setup_email(user, token)
    except Exception as exc:
        logger.error(f"send_setup_email_task failed for user {user_id}: {exc}")
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_reset_otp_email_task(self, user_id, otp_record_id):
    from django.contrib.auth import get_user_model
    from .models import PasswordResetOTP
    from .services import send_reset_otp_email

    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
        otp_record = PasswordResetOTP.objects.get(id=otp_record_id)
        send_reset_otp_email(user, otp_record)
    except Exception as exc:
        logger.error(f"send_reset_otp_email_task failed for user {user_id}: {exc}")
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_rejection_email_task(self, email, college_name, reason=""):
    from .services import send_rejection_email

    try:
        send_rejection_email(email=email, college_name=college_name, reason=reason)
    except Exception as exc:
        logger.error(f"send_rejection_email_task failed for {email}: {exc}")
        raise self.retry(exc=exc)
    