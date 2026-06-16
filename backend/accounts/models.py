from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager

import uuid

class User(AbstractUser):

    username = None

    class Role(models.TextChoices):
        PLATFORM_ADMIN = "PLATFORM_ADMIN", "Platform Admin"
        COLLEGE_ADMIN = "COLLEGE_ADMIN", "College Admin"
        HOD = "HOD", "HOD"
        STUDENT = "STUDENT", "Student"

    email = models.EmailField(
        unique=True
    )

    first_name = models.CharField(
        max_length=100,
        blank=True
    )

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.STUDENT
    )

    is_active = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class CollegeAdminProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    phone = models.CharField(
        max_length=15
    )

    joined_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.email


class HODProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    phone = models.CharField(
        max_length=15
    )

    joined_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.email


class AccountSetupToken(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )

    used = models.BooleanField(
        default=False
    )

    expires_at = models.DateTimeField()

    def __str__(self):
        return str(self.token)