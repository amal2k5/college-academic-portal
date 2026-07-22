from decimal import Decimal
import uuid

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from razorpay.errors import SignatureVerificationError

from fees.models import Fee, Payment
from .razorpay_client import client


class PaymentService:

    CURRENCY = "INR"

    @staticmethod
    def calculate_amount(fee):
        amount = fee.amount
        late_fee = False

        if (
            fee.late_fee_enabled
            and timezone.now().date() > fee.due_date
        ):
            amount += fee.late_fee_amount
            late_fee = True

        return amount, late_fee

    @staticmethod
    @transaction.atomic
    def create_order(student, fee_id):

        fee = (
            Fee.objects
            .select_for_update()
            .get(id=fee_id, is_active=True)
        )

        # Security check
        if (
            fee.department_id != student.department_id
            or fee.semester != student.semester
        ):
            raise ValidationError(
                "This fee is not applicable to you."
            )

        # Already paid?
        if Payment.objects.filter(
            student=student,
            fee=fee,
            status=Payment.Status.PAID,
        ).exists():
            raise ValidationError(
                "Fee has already been paid."
            )

        # Reuse pending payment
        existing = (
            Payment.objects.filter(
                student=student,
                fee=fee,
                status__in=[
                    Payment.Status.CREATED,
                    Payment.Status.PENDING,
                ],
            )
            .order_by("-created_at")
            .first()
        )

        if existing:
            return {
                "payment": existing,
                "order": {
                    "id": existing.razorpay_order_id,
                    "amount": int(existing.amount * 100),
                    "currency": PaymentService.CURRENCY,
                },
                "amount": existing.amount,
                "reused": True,
            }

        amount, late_fee = PaymentService.calculate_amount(fee)

        order = client.order.create(
            {
                "amount": int(amount * 100),
                "currency": PaymentService.CURRENCY,
                "receipt": f"fee_{uuid.uuid4().hex[:12]}",
                "payment_capture": 1,
            }
        )

        payment = Payment.objects.create(
            student=student,
            fee=fee,
            razorpay_order_id=order["id"],
            amount=amount,
            late_fee_applied=late_fee,
            status=Payment.Status.CREATED,
        )

        return {
            "payment": payment,
            "order": {
                "id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
            },
            "amount": amount,
            "reused": False,
        }

    @staticmethod
    @transaction.atomic
    def verify_payment(
        *,
        user,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    ):
        try:
            payment = (
                Payment.objects
                .select_related("student")
                .select_for_update()
                .get(
                    razorpay_order_id=razorpay_order_id,
                    student__user=user,
                )
            )
        except Payment.DoesNotExist:
            raise ValidationError(
                {"detail": "Payment not found."}
            )

        if payment.status == Payment.Status.PAID:
            return payment

        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )
        except SignatureVerificationError:
            raise ValidationError(
                {"detail": "Invalid payment signature."}
            )

        payment.status = Payment.Status.PAID
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.paid_at = timezone.now()

        payment.save(
            update_fields=[
                "status",
                "razorpay_payment_id",
                "razorpay_signature",
                "paid_at",
                "updated_at",
            ]
        )

        return payment