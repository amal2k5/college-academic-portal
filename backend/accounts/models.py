from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager


class User(AbstractUser):

    username = None

    ROLE_CHOICES = (
        ("SUPER_ADMIN", "SUPER_ADMIN"),
        ("HOD", "HOD"),
        ("STUDENT", "STUDENT"),
    )

    email = models.EmailField(
        unique=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email