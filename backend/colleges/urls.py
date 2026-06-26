from django.urls import path

from .views import (
    CollegeListCreateView,
    CollegeDetailView,
)

urlpatterns = [
    path(
        "",
        CollegeListCreateView.as_view(),
        name="college-list-create",
    ),

    path(
        "<int:pk>/",
        CollegeDetailView.as_view(),
        name="college-detail",
    ),
]