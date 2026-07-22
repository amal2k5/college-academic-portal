from django.urls import path

from .views import (
    FeeListAPIView,
    FeeDetailAPIView,
    CreateOrderAPIView,
    VerifyPaymentAPIView,
    PaymentHistoryAPIView,
)

urlpatterns = [
    path(
        "",
        FeeListAPIView.as_view(),
        name="fee-list",
    ),
    path(
        "<int:pk>/",
        FeeDetailAPIView.as_view(),
        name="fee-detail",
    ),
    path(
        "payments/create-order/",
        CreateOrderAPIView.as_view(),
        name="create-order",
    ),
    path(
        "payments/verify/",
        VerifyPaymentAPIView.as_view(),
        name="verify-payment",
    ),
    path(
        "payments/history/",
        PaymentHistoryAPIView.as_view(),
        name="payment-history",
    ),
]