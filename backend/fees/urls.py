from django.urls import path, include

from .views import (
    FeeListAPIView,
    FeeDetailAPIView,
    CreateOrderAPIView,
    VerifyPaymentAPIView,
    FeeManageDetailAPIView,
    PaymentHistoryAPIView,

    HODFeeViewSet,

    FeeManageListCreateAPIView,
    PendingFeesAPIView,
    FeeSummaryAPIView,
    

)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'hod', HODFeeViewSet, basename='hod-fee')

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

    path("", include(router.urls)),

    path(
    "manage/",
    FeeManageListCreateAPIView.as_view(),
    name="manage-fees",
),

path(
    "manage/<int:pk>/",
    FeeManageDetailAPIView.as_view(),
    name="manage-fee-detail",
),path(
    "pending/",
    PendingFeesAPIView.as_view(),
    name="pending-fees",
),
path(
    "summary/",
    FeeSummaryAPIView.as_view(),
    name="fee-summary",
),

]