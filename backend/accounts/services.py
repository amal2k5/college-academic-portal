from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from colleges.models import College
from departments.models import Department

from .models import (
    CollegeAdminProfile,
    HODProfile,
    AccountSetupToken,
)

User = get_user_model()


def create_college_admin(
    first_name,
    last_name,
    email,
    college_id
):

    college = College.objects.get(
        id=college_id
    )

    user = User.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.COLLEGE_ADMIN,
        is_active=False,
    )

    CollegeAdminProfile.objects.create(
        user=user,
        college=college,
        phone=""
    )

    return user


def generate_setup_token(user):

    AccountSetupToken.objects.filter(
        user=user
    ).delete()

    token = AccountSetupToken.objects.create(
        user=user,
        expires_at=timezone.now() + timedelta(hours=24)
    )

    return token

def send_setup_email(user, token):

    print("EMAIL FUNCTION CALLED")

    setup_link = (
        f"{settings.FRONTEND_URL}/setup-password/{token.token}"
    )

    context = {
        "first_name": user.first_name,
        "setup_link": setup_link,
    }

    html_message = render_to_string(
        "emails/approval_email.html",
        context
    )

    text_message = (
        f"Hello {user.first_name},\n\n"
        f"Your college registration has been approved.\n\n"
        f"Set your password here:\n"
        f"{setup_link}\n\n"
        f"This link expires in 24 hours."
    )

    email = EmailMultiAlternatives(
        subject="Your College Registration Has Been Approved",
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    email.attach_alternative(
        html_message,
        "text/html"
    )

    email.send()

    print("APPROVAL EMAIL SENT SUCCESSFULLY")
    
def send_rejection_email(
    email,
    college_name,
    reason=""
):

    context = {
        "college_name": college_name,
        "reason": reason,
    }

    html_message = render_to_string(
        "emails/rejection_email.html",
        context
    )

    text_message = (
        f"Dear {college_name},\n\n"
        f"Your registration request has been rejected.\n\n"
    )

    if reason:
        text_message += f"Reason:\n{reason}\n\n"

    text_message += (
        "You may correct the issue(s) and submit a new registration request.\n\n"
        "Thank you,\n"
        "College Academic Portal Team"
    )

    email_message = EmailMultiAlternatives(
        subject="Update on Your College Registration Request",
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )

    email_message.attach_alternative(
        html_message,
        "text/html"
    )

    email_message.send()

    print("REJECTION EMAIL SENT SUCCESSFULLY")
    

def setup_password(
    token_value,
    password
):

    try:

        token = AccountSetupToken.objects.get(
            token=token_value
        )

    except AccountSetupToken.DoesNotExist:

        raise ValueError(
            "Invalid setup token."
        )

    if token.is_used:

        raise ValueError(
            "Setup token already used."
        )

    if timezone.now() > token.expires_at:

        raise ValueError(
            "Setup token has expired."
        )

    user = token.user

    user.set_password(
        password
    )

    user.is_active = True

    user.save()

    token.is_used = True

    token.save()

    return user


def create_hod(
    first_name,
    last_name,
    email,
    phone,
    department_id
):

    department = Department.objects.get(
        id=department_id
    )

    if HODProfile.objects.filter(
        department=department
    ).exists():

        raise ValueError(
            "Department already has a HOD."
        )

    user = User.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.HOD,
        is_active=False,
    )

    HODProfile.objects.create(
        user=user,
        department=department,
        phone=phone,
    )

    return user