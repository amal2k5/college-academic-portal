from rest_framework import serializers

from .models import Fee, Payment


class FeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )

    class Meta:
        model = Fee
        fields = (
            "id",
            "title",
            "fee_type",
            "description",
            "amount",
            "department",
            "department_name",
            "semester",
            "due_date",
            "late_fee_enabled",
            "late_fee_amount",
            "eligibility",
            "is_active",
            "created_at",
        )


class CreateOrderSerializer(serializers.Serializer):
    fee_id = serializers.IntegerField(min_value=1)


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=120)
    razorpay_payment_id = serializers.CharField(max_length=120)
    razorpay_signature = serializers.CharField(max_length=255)


class PaymentSerializer(serializers.ModelSerializer):
    fee_title = serializers.CharField(
        source="fee.title",
        read_only=True
    )

    fee_type = serializers.CharField(
        source="fee.fee_type",
        read_only=True
    )

    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = (
            "id",
            "fee",
            "fee_title",
            "fee_type",
            "student",
            "student_name",
            "razorpay_order_id",
            "razorpay_payment_id",
            "amount",
            "late_fee_applied",
            "status",
            "paid_at",
            "remarks",
            "created_at",
        )

    def get_student_name(self, obj):
        return (
            f"{obj.student.user.first_name} "
            f"{obj.student.user.last_name}"
        ).strip()