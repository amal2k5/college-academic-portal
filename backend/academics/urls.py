from django.urls import path

from .views import (
    SubjectListCreateView,
    SubjectDetailView,
    BulkMarksEntryView,
    PublishMarksView,
    StudentMarksView,
    ExamListCreateView,
    ExamDetailView,
    BulkAttendanceView,
    StudentAttendanceView,
    ClassAttendanceView,
)

urlpatterns = [
    path(
        "subjects/",
        SubjectListCreateView.as_view(),
        name="subject-list-create",
    ),

    path(
        "subjects/<int:pk>/",
        SubjectDetailView.as_view(),
        name="subject-detail",
    ),

    path(
        "marks/bulk/",
        BulkMarksEntryView.as_view(),
        name="bulk-marks-entry",
    ),

    path(
        "marks/publish/",
        PublishMarksView.as_view(),
        name="publish-marks",
    ),

    path(
        "student/marks/",
        StudentMarksView.as_view(),
        name="student-marks",
    ),

    path(
        "exams/",
        ExamListCreateView.as_view(),
        name="exam-list-create",
    ),

    path(
        "exams/<int:pk>/",
        ExamDetailView.as_view(),
        name="exam-detail",
    ),

    path(
        "attendance/bulk/",
        BulkAttendanceView.as_view(),
        name="bulk-attendance",
    ),

    path(
        "student/attendance/",
        StudentAttendanceView.as_view(),
        name="student-attendance",
    ),

    path(
        "attendance/class/",
        ClassAttendanceView.as_view(),
        name="class-attendance",
    ),
    
]