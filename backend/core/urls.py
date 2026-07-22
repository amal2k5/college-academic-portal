from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    # Colleges
    path(
        "api/colleges/",
        include("colleges.urls"),
    ),

    # Departments
    path(
        "api/departments/",
        include("departments.urls"),
    ),

    # Students
    path(
        "api/students/",
        include("students.urls"),
    ),

    # College Requests
    path(
        "api/college-requests/",
        include("college_requests.urls"),
    ),

    # Notices
    path(
        "api/notices/",
        include("notices.urls"),
    ),

    # Assignments
    path(
        "api/assignments/",
        include("assignments.urls"),
    ),

    # Notifications
    path(
        "api/notifications/",
        include("notifications.urls"),
    ),
    path(
    "api/",
    include("academics.urls"),
    
),

 path("api/fees/", include("fees.urls")),
]