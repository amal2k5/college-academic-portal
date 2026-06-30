from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()

router.register(
    r"",
    DepartmentViewSet,
    basename="department"
)

urlpatterns = [
    path(
        "my-departments/",
        CollegeDepartmentListView.as_view(),
        name="college_departments",
    ),
path(
    "<int:pk>/details/",
    DepartmentDetailView.as_view(),
    name="department-detail",
),
    path(
    "<int:pk>/status/",
    DepartmentStatusUpdateView.as_view(),
    name="department-status",
),
]

urlpatterns += router.urls