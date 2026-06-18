from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone

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

    print("EMAIL FUNCTION CALLED")

    setup_link = (
        f"http://localhost:5173/setup-password/{token.token}"
    )

    print(setup_link)

    result=send_mail(
        subject="Setup Your College Portal Account",

        message=(
            f"Hello {user.first_name},\n\n"
            f"Your account has been created.\n\n"
            f"Click the link below to set your password:\n\n"
            f"{setup_link}"
        ),

        from_email=None,

        recipient_list=[
            user.email
        ],

        fail_silently=False,
    )
    print("SEND RESULT =", result)

    print("EMAIL SENT SUCCESSFULLY")
    

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