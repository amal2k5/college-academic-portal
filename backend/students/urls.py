from django.urls import path

from .views import (
    StudentCreateView,
    StudentListView,
    StudentDetailView,
    StudentUpdateView,
    StudentDeleteView,
)

urlpatterns = [

    path(
        "",
        StudentListView.as_view(),
        name="student-list"
    ),

    path(
        "create/",
        StudentCreateView.as_view(),
        name="student-create"
    ),

    path(
        "<int:pk>/",
        StudentDetailView.as_view(),
        name="student-detail"
    ),

    path(
        "<int:pk>/update/",
        StudentUpdateView.as_view(),
        name="student-update"
    ),

    path(
        "<int:pk>/delete/",
        StudentDeleteView.as_view(),
        name="student-delete"
    ),
]