from django.urls import path

from .views import (
    CollegeComplaintListView,
    ComplaintCreateView,
    ComplaintDashboardView,
    ComplaintStatusUpdateView,
    ComplaintTrackView,
    DepartmentComplaintListView,
)

app_name = "complaints"

urlpatterns = [
    # =====================================
    # Public Endpoints
    # =====================================

    # Create Anonymous Complaint
    path(
        "",
        ComplaintCreateView.as_view(),
        name="complaint-create",
    ),

    # Track Complaint
    path(
        "track/",
        ComplaintTrackView.as_view(),
        name="complaint-track",
    ),

    # =====================================
    # HOD Endpoints
    # =====================================

    path(
        "department/",
        DepartmentComplaintListView.as_view(),
        name="department-complaints",
    ),

    # =====================================
    # College Admin Endpoints
    # =====================================

    path(
        "college/",
        CollegeComplaintListView.as_view(),
        name="college-complaints",
    ),

    # =====================================
    # Shared HOD / College Admin Endpoints
    # =====================================

    # Complaint Dashboard
    path(
        "dashboard/",
        ComplaintDashboardView.as_view(),
        name="complaint-dashboard",
    ),

    # Update Complaint Status
    path(
        "<int:pk>/status/",
        ComplaintStatusUpdateView.as_view(),
        name="complaint-status-update",
    ),
]