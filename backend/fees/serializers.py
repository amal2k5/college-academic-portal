from rest_framework import serializers

from .models import Fee, Payment


class FeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )
    is_paid = serializers.BooleanField(read_only=True, default=False)
    paid_at = serializers.DateTimeField(read_only=True, default=None)

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
            "is_paid",
            "paid_at",
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
    
    fee_late_fee_amount = serializers.DecimalField(
        source="fee.late_fee_amount",
        read_only=True,
        max_digits=10,
        decimal_places=2
    )

    student_name = serializers.SerializerMethodField()
    student_roll_number = serializers.CharField(
        source="student.roll_number",
        read_only=True
    )
    student_department = serializers.CharField(
        source="student.department.name",
        read_only=True
    )
    student_semester = serializers.IntegerField(
        source="student.semester",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = (
            "id",
            "fee",
            "fee_title",
            "fee_type",
            "fee_late_fee_amount",
            "student",
            "student_name",
            "student_roll_number",
            "student_department",
            "student_semester",
            "razorpay_order_id",
            "razorpay_payment_id",
            "amount",
            "late_fee_applied",
            "status",
            "paid_at",
            "remarks",
            "created_at",
            "receipt_number",
        )

    def get_student_name(self, obj):
        return (
            f"{obj.student.user.first_name} "
            f"{obj.student.user.last_name}"
        ).strip()


class FeeListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    
    class Meta:
        model = Fee
        fields = (
            "id", "title", "fee_type", "amount", "department", 
            "department_name", "semester", "due_date", "is_active", 
            "created_at"
        )


class FeeDetailSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    
    class Meta:
        model = Fee
        fields = (
            "id", "title", "fee_type", "description", "amount", 
            "department", "department_name", "semester", "due_date", 
            "late_fee_enabled", "late_fee_amount", "eligibility", 
            "is_active", "created_at", "updated_at"
        )


class FeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = (
            "title", "fee_type", "description", "amount", 
            "semester", "due_date", "late_fee_enabled", 
            "late_fee_amount", "eligibility"
        )
        
    def validate(self, data):
        amount = data.get("amount")
        if amount is not None and amount <= 0:
            raise serializers.ValidationError({"amount": "Fee amount must be greater than 0."})
            
        semester = data.get("semester")
        if semester is not None and semester <= 0:
            raise serializers.ValidationError({"semester": "Semester must be greater than 0."})
            
        late_fee_enabled = data.get("late_fee_enabled", False)
        late_fee_amount = data.get("late_fee_amount")
        
        if late_fee_enabled and (late_fee_amount is None or late_fee_amount <= 0):
            raise serializers.ValidationError({
                "late_fee_amount": "Late fee amount must be greater than 0 when late fee is enabled."
            })
            
        return data


class FeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = (
            "title", "fee_type", "description", "amount", 
            "semester", "due_date", "late_fee_enabled", 
            "late_fee_amount", "eligibility", "is_active"
        )
        
    def validate(self, data):
        # Handle partial updates correctly by merging with existing instance data
        amount = data.get("amount", self.instance.amount if self.instance else None)
        if amount is not None and amount <= 0:
            raise serializers.ValidationError({"amount": "Fee amount must be greater than 0."})
            
        semester = data.get("semester", self.instance.semester if self.instance else None)
        if semester is not None and semester <= 0:
            raise serializers.ValidationError({"semester": "Semester must be greater than 0."})
            
        late_fee_enabled = data.get("late_fee_enabled", self.instance.late_fee_enabled if self.instance else False)
        late_fee_amount = data.get("late_fee_amount", self.instance.late_fee_amount if self.instance else None)
        
        if late_fee_enabled and (late_fee_amount is None or late_fee_amount <= 0):
            raise serializers.ValidationError({
                "late_fee_amount": "Late fee amount must be greater than 0 when late fee is enabled."
            })
            
        return data


class FeeStatsSerializer(serializers.Serializer):
    total_fees = serializers.IntegerField()
    active_fees = serializers.IntegerField()
    inactive_fees = serializers.IntegerField()
    total_paid_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_unpaid_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    paid_students = serializers.IntegerField()
    pending_students = serializers.IntegerField()
    late_payments = serializers.IntegerField()
    payment_percentage = serializers.FloatField()
