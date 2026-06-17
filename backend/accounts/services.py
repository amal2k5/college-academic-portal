from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone

from colleges.models import College

from .models import (
    CollegeAdminProfile,
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

    user = User.objects.create(
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


def generate_setup_token(
    user
):

    token = AccountSetupToken.objects.create(
        user=user,
        expires_at=timezone.now()
        + timedelta(hours=24)
    )

    return token


def send_setup_email(
    user,
    token
):

    setup_link = (
        f"http://localhost:5173/setup-password/{token.token}"
    )

    send_mail(
        subject="Setup Your College Portal Account",

        message=(
            f"Hello {user.first_name},\n\n"
            f"Your College Admin account has been created.\n\n"
            f"Click the link below to set your password:\n\n"
            f"{setup_link}\n\n"
            f"This link expires in 24 hours."
        ),

        from_email=None,

        recipient_list=[
            user.email
        ],

        fail_silently=False,
    )