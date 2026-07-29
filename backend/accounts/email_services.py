import logging

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)


def send_email(to, subject, html_content, text_content=None):
    """
    Centralized email sender using SendGrid Web API.
    Returns True on success, raises on failure (so Celery can retry).
    """

    try:
        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=[to] if isinstance(to, str) else to,
            subject=subject,
            html_content=html_content,
            plain_text_content=text_content or "",
        )

        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)

        logger.info(
            f"Email sent via SendGrid to {to}. "
            f"Status Code: {response.status_code}"
        )

        return True

    except Exception as exc:
        logger.exception(f"SendGrid email failed for {to}: {exc}")
        raise