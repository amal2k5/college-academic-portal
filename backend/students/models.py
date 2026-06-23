from django.db import models

from accounts.models import User
from departments.models import Department


class Student(models.Model):

    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="students"
    )

    roll_number = models.CharField(
        max_length=50,
        unique=True
    )

    admission_number = models.CharField(
        max_length=50,
        unique=True
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        null=True,
        blank=True
    )

    parent_name = models.CharField(
        max_length=100,
        blank=True
    )

    parent_phone = models.CharField(
        max_length=15,
        blank=True
    )

    semester = models.PositiveIntegerField()

    academic_year = models.CharField(
        max_length=20
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.user.first_name} "
            f"{self.user.last_name}"
        )