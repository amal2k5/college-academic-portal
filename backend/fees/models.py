from decimal import Decimal

from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone  # ← BUG FIX #1: Added missing import

from departments.models import Department
from students.models import Student


class Fee(models.Model):
    title = models.CharField(
        max_length=255,
        help_text="Display name of the fee (e.g. S5 Tuition Fee)"
    )

    fee_type = models.CharField(
        max_length=100,
        help_text="Custom fee type (e.g. Tuition, Exam, Bus, Hostel)"
    )

    description = models.TextField(
        blank=True,
        help_text="Information about this fee and who should pay it."
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="fees"
    )

    semester = models.PositiveSmallIntegerField()

    due_date = models.DateField()

    late_fee_enabled = models.BooleanField(
        default=False
    )

    late_fee_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    eligibility = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: All Students, Grant Students, Management Quota, Self Financing Students."
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["department"]),
            models.Index(fields=["semester"]),
            models.Index(fields=["due_date"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """Validate that late fee amount is positive when enabled"""
        if self.late_fee_enabled and self.late_fee_amount <= 0:
            raise ValidationError({
                'late_fee_amount': 'Late fee amount must be greater than 0 when late fee is enabled.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()  # ← BUG FIX #4: Ensure clean() runs on save
        super().save(*args, **kwargs)


class Payment(models.Model):

    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        CANCELLED = "CANCELLED", "Cancelled"
        REFUNDED = "REFUNDED", "Refunded"

    fee = models.ForeignKey(
        Fee,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    razorpay_order_id = models.CharField(
        max_length=120,
        unique=True,
        db_index=True,
    )

    razorpay_payment_id = models.CharField(
        max_length=120,
        blank=True,
        null=True,
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    late_fee_applied = models.BooleanField(
        default=False
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED,
        db_index=True,
    )

    receipt_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
        help_text="Auto-generated receipt number after successful payment"
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
        help_text="Any additional notes about this payment"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["student"]),
            models.Index(fields=["status"]),
            models.Index(fields=["razorpay_order_id"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["paid_at"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "fee", "status"],
                condition=models.Q(status="PAID"),
                name="unique_paid_fee_per_student",
            )
        ]

    def __str__(self):
        return f"{self.student.roll_number} - {self.fee.title} ({self.status})"

    def clean(self):
        """Validate that amount is positive"""
        if self.amount <= 0:
            raise ValidationError({
                'amount': 'Payment amount must be greater than 0.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()  # ← BUG FIX #4: Ensure clean() runs on save

        if self.status == self.Status.PAID and not self.receipt_number:
            # Must save first to get an ID if it's a new record
            if self._state.adding:
                super().save(*args, **kwargs)  # First save to get ID
            
            year = self.paid_at.year if self.paid_at else timezone.now().year
            prefix = "CAP"
            self.receipt_number = f"{prefix}-{year}-{str(self.id).zfill(6)}"
            
            if "update_fields" in kwargs and "receipt_number" not in kwargs["update_fields"]:
                kwargs["update_fields"] = list(kwargs["update_fields"]) + ["receipt_number"]
            
        super().save(*args, **kwargs)

    def generate_receipt_number(self):
        """Alternative: Call this explicitly after payment verification instead of auto-save"""
        if self.status != self.Status.PAID:
            raise ValidationError("Can only generate receipt for paid payments.")
        
        if not self.receipt_number:
            year = self.paid_at.year if self.paid_at else timezone.now().year
            prefix = "CAP"
            self.receipt_number = f"{prefix}-{year}-{str(self.id).zfill(6)}"
            self.save(update_fields=["receipt_number"])
        return self.receipt_number