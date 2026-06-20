from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DepartmentViewSet,
    CollegeDepartmentListView,
)

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
]

urlpatterns += router.urls