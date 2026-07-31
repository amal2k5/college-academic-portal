from django.urls import path

from .views import (
    CollegeRegistrationCreateView,
    CollegeRegistrationListView,
    CollegeRegistrationDetailView,
    ApproveCollegeRegistrationView,
    RejectCollegeRegistrationView,
)

urlpatterns = [
    path(
        "",
        CollegeRegistrationCreateView.as_view(),
        name="college-registration-create",
    ),

    path(
        "list/",
        CollegeRegistrationListView.as_view(),
        name="college-registration-list",
    ),

    path(
        "<int:pk>/",
        CollegeRegistrationDetailView.as_view(),
        name="college-registration-detail",
    ),

    path(
        "<int:pk>/approve/",
        ApproveCollegeRegistrationView.as_view(),
        name="college-registration-approve",
    ),

    path(
        "<int:pk>/reject/",
        RejectCollegeRegistrationView.as_view(),
        name="college-registration-reject",
    ),
]