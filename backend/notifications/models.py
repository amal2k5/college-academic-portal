from django.db import models

from students.models import Student
from notices.models import Notice
from assignments.models import Assignment


class Notification(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    message = models.TextField()

    notice = models.ForeignKey(
        Notice,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.user.email} - {self.message[:30]}"