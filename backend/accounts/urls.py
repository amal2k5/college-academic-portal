from django.urls import path

from rest_framework_simplejwt.views import (  # type: ignore
    TokenRefreshView,
)

from .views import (
    LoginView,
    LogoutView,
    CollegeAdminCreateView,
    SetupPasswordView,
    HODCreateView,
)

urlpatterns = [

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout"
    ),

    path(
        "college-admin/create/",
        CollegeAdminCreateView.as_view(),
        name="create_college_admin"
    ),

    path(
        "setup-password/",
        SetupPasswordView.as_view(),
        name="setup_password"
    ),

    path(
        "hod/create/",
        HODCreateView.as_view(),
        name="create_hod"
    ),
]