from django.contrib import admin

from .models import Fee, Payment


@admin.register(Fee)
class FeeAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "fee_type",
        "department",
        "semester",
        "amount",
        "due_date",
        "is_active",
    )

    list_filter = (
        "department",
        "semester",
        "is_active",
    )

    search_fields = (
        "title",
        "fee_type",
    )

    ordering = ("-created_at",)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "fee",
        "amount",
        "status",
        "razorpay_order_id",
        "paid_at",
        "created_at",
    )

    list_filter = (
        "status",
        "late_fee_applied",
        "created_at",
    )

    search_fields = (
        "student__roll_number",
        "student__user__email",
        "fee__title",
        "razorpay_order_id",
        "receipt_number",
    )

    readonly_fields = (
        "receipt_number",
        "razorpay_order_id",
        "razorpay_payment_id",
        "razorpay_signature",
        "created_at",
        "updated_at",
        "paid_at",
    )

    ordering = ("-created_at",)