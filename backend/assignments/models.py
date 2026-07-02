from django.db import models
from cloudinary.models import CloudinaryField

from accounts.models import User
from departments.models import Department
from students.models import Student


class Assignment(models.Model):

    title = models.CharField(
        max_length=255
    )

    subject = models.CharField(
        max_length=150
    )

    description = models.TextField()

    attachment = CloudinaryField(
        "assignment_attachment",
        blank=True,
        null=True
    )

    target_year = models.PositiveSmallIntegerField(
        choices=Student.YearChoices.choices
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    deadline = models.DateTimeField()

    max_marks = models.PositiveIntegerField()

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_assignments"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["deadline"]

    def __str__(self):
        return self.title