from django.db import models
from cloudinary.models import CloudinaryField

from accounts.models import User
from colleges.models import College
from departments.models import Department


class Notice(models.Model):

    class Category(models.TextChoices):
        GENERAL = "GENERAL", "General"
        EXAM = "EXAM", "Exam"
        EVENT = "EVENT", "Event"
        HOLIDAY = "HOLIDAY", "Holiday"
        FEE = "FEE", "Fee"

    class Scope(models.TextChoices):
        COLLEGE = "COLLEGE", "College"
        DEPARTMENT = "DEPARTMENT", "Department"

    title = models.CharField(
        max_length=255
    )

    body = models.TextField()

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.GENERAL
    )

    scope = models.CharField(
        max_length=20,
        choices=Scope.choices
    )

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="notices"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="notices",
        null=True,
        blank=True
    )

    image = CloudinaryField(
        "notice_image",
        blank=True,
        null=True
    )

    is_pinned = models.BooleanField(
        default=False
    )

    posted_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posted_notices"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self):
        return self.title