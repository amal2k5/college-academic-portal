from django.urls import path

from .views import *



urlpatterns = [
    path(
    "",
    CollegeListView.as_view(),
    name="college-list",
    ),

    path(
        "<int:pk>/",
        CollegeDetailView.as_view(),
        name="college-detail",
    ),
]