from django.urls import path

from rest_framework_simplejwt.views import (  # type: ignore
    TokenRefreshView,
)

from .views import *


urlpatterns = [
    path(
        "platform/dashboard/stats/",
        PlatformDashboardStatsView.as_view(),
        name="platform-dashboard-stats",
    ),

    path(
        "public/stats/",
        PublicStatsView.as_view(),
        name="public-stats",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "college-admin/create/",
        CollegeAdminCreateView.as_view(),
        name="create_college_admin",
    ),

    path(
        "setup-password/",
        SetupPasswordView.as_view(),
        name="setup_password",
    ),

    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),

    path(
        "verify-otp/",
        VerifyOTPView.as_view(),
        name="verify-otp",
    ),

    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),

    path(
        "hod/create/",
        HODCreateView.as_view(),
        name="create_hod",
    ),

    path(
        "hods/",
        HODListView.as_view(),
        name="hod-list",
    ),

    path(
        "hods/<int:pk>/",
        HODDetailView.as_view(),
        name="hod-detail",
    ),

    path(
        "hods/<int:pk>/status/",
        HODStatusUpdateView.as_view(),
        name="hod-status",
    ),

    path(
        "college-admins/",
        CollegeAdminListView.as_view(),
        name="college-admin-list",
    ),

    path(
        "college-admins/<int:pk>/status/",
        CollegeAdminStatusUpdateView.as_view(),
        name="college-admin-status",
    ),
]