from django.contrib.auth import get_user_model

from accounts.services import (
    generate_setup_token,
    send_setup_email,
)

from .models import Student

User = get_user_model()


def create_student(
    *,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    gender,
    parent_name,
    parent_phone,
    roll_number,
    admission_number,
    semester,
    academic_year,
    department,
):

    user = User.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.STUDENT,
        is_active=False,
    )

    student = Student.objects.create(
        user=user,
        department=department,
        phone=phone,
        date_of_birth=date_of_birth,
        gender=gender,
        parent_name=parent_name,
        parent_phone=parent_phone,
        roll_number=roll_number,
        admission_number=admission_number,
        semester=semester,
        academic_year=academic_year,
    )

    token = generate_setup_token(
        user
    )

    send_setup_email(
        user,
        token
    )

    return student