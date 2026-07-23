import random
import string

from cloudinary.models import CloudinaryField
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q

from colleges.models import College
from departments.models import Department


class Complaint(models.Model):

    class Category(models.TextChoices):
        ACADEMIC = "ACADEMIC", "Academic"
        FACULTY = "FACULTY", "Faculty"
        FACILITIES = "FACILITIES", "Facilities"
        DISCIPLINE = "DISCIPLINE", "Discipline"
        EXAMINATION = "EXAMINATION", "Examination"
        OTHER = "OTHER", "Other"

    class Scope(models.TextChoices):
        COLLEGE = "COLLEGE", "College"
        DEPARTMENT = "DEPARTMENT", "Department"

    class Status(models.TextChoices):
        SUBMITTED = "SUBMITTED", "Submitted"
        SEEN = "SEEN", "Seen"
        RESOLVED = "RESOLVED", "Resolved"

    tracking_code = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        db_index=True,
    )

    text = models.TextField()

    attachment = CloudinaryField(
        "Complaint Attachment",
        blank=True,
        null=True,
    )

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        db_index=True,
    )

    scope = models.CharField(
        max_length=20,
        choices=Scope.choices,
        db_index=True,
    )

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="complaints",
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="complaints",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED,
        db_index=True,
    )

    resolution_note = models.TextField(
        blank=True,
        default="",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

        verbose_name = "Complaint"
        verbose_name_plural = "Complaints"

        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["scope"]),
            models.Index(fields=["college"]),
            models.Index(fields=["department"]),
            models.Index(fields=["created_at"]),
        ]

        constraints = [
            models.CheckConstraint(
                condition=(
                    (
                        Q(scope="COLLEGE")
                        & Q(department__isnull=True)
                    )
                    |
                    (
                        Q(scope="DEPARTMENT")
                        & Q(department__isnull=False)
                    )
                ),
                name="valid_complaint_scope_department",
            ),
        ]

    def __str__(self):
        return self.tracking_code

    @staticmethod
    def generate_tracking_code():
        """
        Generate a unique complaint tracking code.
        Example: CMP-A7X9Q2
        """
        while True:
            code = "CMP-" + "".join(
                random.choices(
                    string.ascii_uppercase + string.digits,
                    k=6,
                )
            )
            if not Complaint.objects.filter(tracking_code=code).exists():
                return code

    def clean(self):
        """
        Model-level validation.
        """

        # Auto assign college for department complaints
        if (
            self.scope == self.Scope.DEPARTMENT
            and self.department is not None
        ):
            self.college = self.department.college

        if (
            self.scope == self.Scope.DEPARTMENT
            and self.department is None
        ):
            raise ValidationError(
                {"department": "Department is required for department complaints."}
            )

        if (
            self.scope == self.Scope.COLLEGE
            and self.department is not None
        ):
            raise ValidationError(
                {"department": "Department must be empty for college complaints."}
            )

        if (
            self.scope == self.Scope.COLLEGE
            and self.college_id is None
        ):
            raise ValidationError(
                {"college": "College is required for college complaints."}
            )

        if (
            self.status == self.Status.RESOLVED
            and not self.resolution_note.strip()
        ):
            raise ValidationError(
                {"resolution_note": "Resolution note is required when resolving a complaint."}
            )

    def save(self, *args, **kwargs):
        """
        Generate tracking code and automatically assign
        the college before saving.
        """

        # Generate tracking code
        if not self.tracking_code:
            self.tracking_code = self.generate_tracking_code()

        # Auto assign college for department complaints
        if (
            self.scope == self.Scope.DEPARTMENT
            and self.department is not None
            and self.college_id is None
        ):
            if self.department.college is None:
                raise ValidationError(
                    {
                        "department": (
                            "Selected department is not linked "
                            "to any college."
                        )
                    }
                )
            self.college = self.department.college

        self.full_clean()
        super().save(*args, **kwargs)


class ComplaintStatusHistory(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="status_history",
    )

    old_status = models.CharField(
        max_length=20,
    )

    new_status = models.CharField(
        max_length=20,
    )

    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="complaint_status_changes",
    )

    note = models.TextField(
        blank=True,
        default="",
    )

    changed_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ["-changed_at"]

        verbose_name = "Complaint Status History"
        verbose_name_plural = "Complaint Status Histories"

        indexes = [
            models.Index(fields=["complaint"]),
            models.Index(fields=["changed_at"]),
        ]

    def __str__(self):
        return f"{self.complaint.tracking_code}: {self.old_status} → {self.new_status}"
