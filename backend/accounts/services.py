from datetime import timedelta
import random

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

from colleges.models import College
from departments.models import Department
import uuid
from .models import (
    CollegeAdminProfile,
    HODProfile,
    AccountSetupToken,
    PasswordResetOTP,
)

User = get_user_model()


# ======================================================
# Forgot Password Services
# ======================================================

def generate_reset_otp(user):

    if user.role == User.Role.PLATFORM_ADMIN:
        return None

    PasswordResetOTP.objects.filter(
        user=user,
        is_used=False,
    ).delete()

    otp = str(random.randint(100000, 999999))

    otp_record = PasswordResetOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=timezone.now() + timedelta(minutes=15),
    )

    return otp_record


def send_reset_otp_email(user, otp_record):

    text_message = (
        f"Hello {user.first_name},\n\n"
        f"Your password reset OTP is:\n\n"
        f"{otp_record.otp}\n\n"
        f"This OTP will expire in 15 minutes.\n\n"
        f"If you did not request this, please ignore this email."
    )

    email = EmailMultiAlternatives(
        subject="Password Reset OTP",
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    email.send()


def verify_reset_otp(email, otp):

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        raise ValueError("Invalid OTP.")

    try:
        otp_record = PasswordResetOTP.objects.filter(
            user=user,
            is_used=False,
        ).latest("created_at")

    except PasswordResetOTP.DoesNotExist:
        raise ValueError("Invalid OTP.")

    if otp_record.is_used:
        raise ValueError("OTP has already been used.")

    if timezone.now() > otp_record.expires_at:
        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])
        raise ValueError("OTP has expired.")

    if otp_record.otp != otp:

        otp_record.attempts += 1

        if otp_record.attempts >= 5:
            otp_record.is_used = True

        otp_record.save()

        raise ValueError("Invalid OTP.")

    otp_record.attempts = 0

    otp_record.reset_token = uuid.uuid4()

    otp_record.reset_token_expires_at = (
        timezone.now() + timedelta(minutes=15)
    )

    otp_record.save(
        update_fields=[
            "attempts",
            "reset_token",
            "reset_token_expires_at",
        ]
    )

    return otp_record

def reset_password(
    reset_token,
    password,
):

    try:
        otp_record = PasswordResetOTP.objects.get(
            reset_token=reset_token,
            is_used=False,
        )

    except PasswordResetOTP.DoesNotExist:
        raise ValueError("Invalid reset token.")

    if (
        otp_record.reset_token_expires_at
        and timezone.now() > otp_record.reset_token_expires_at
    ):
        raise ValueError("Reset token has expired.")

    user = otp_record.user

    user.set_password(password)
    user.save()

    otp_record.is_used = True
    otp_record.reset_token = None
    otp_record.reset_token_expires_at = None

    otp_record.save(
        update_fields=[
            "is_used",
            "reset_token",
            "reset_token_expires_at",
        ]
    )

    return user


# ======================================================
# College Admin Services
# ======================================================

def create_college_admin(
    first_name,
    last_name,
    email,
    college_id,
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
        phone="",
    )

    return user


def generate_setup_token(user):

    AccountSetupToken.objects.filter(
        user=user
    ).delete()

    token = AccountSetupToken.objects.create(
        user=user,
        expires_at=timezone.now() + timedelta(hours=24),
    )

    return token

# ======================================================
# Account Setup Services
# ======================================================

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
        context,
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
        "text/html",
    )

    result = email.send(fail_silently=False)
    print(f"EMAIL SEND RESULT: {result}")

    print("APPROVAL EMAIL SENT SUCCESSFULLY")


def send_rejection_email(
    email,
    college_name,
    reason="",
):

    context = {
        "college_name": college_name,
        "reason": reason,
    }

    html_message = render_to_string(
        "emails/rejection_email.html",
        context,
    )

    text_message = (
        f"Dear {college_name},\n\n"
        f"Your registration request has been rejected.\n\n"
    )

    if reason:
        text_message += (
            f"Reason:\n{reason}\n\n"
        )

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
        "text/html",
    )

    email_message.send()

    print("REJECTION EMAIL SENT SUCCESSFULLY")


def setup_password(
    token_value,
    password,
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

    user.set_password(password)
    user.is_active = True
    user.save(
        update_fields=[
            "password",
            "is_active",
        ]
    )

    token.is_used = True
    token.save(
        update_fields=[
            "is_used",
        ]
    )

    return user


# ======================================================
# HOD Services
# ======================================================

def create_hod(
    first_name,
    last_name,
    email,
    phone,
    department_id,
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