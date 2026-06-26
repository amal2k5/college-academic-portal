from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    
    path("api/colleges/", include("colleges.urls")),
    path("api/departments/", include("departments.urls")),
    path("api/students/", include("students.urls")),
    path(
        "api/college-requests/",
        include("college_requests.urls"),
    ),
]