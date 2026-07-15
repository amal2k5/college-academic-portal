from django.contrib import admin

from .models import (
    Subject,
    Marks,
    Attendance,
    Exam,
)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = (
        "subject_code",
        "name",
        "semester",
        "subject_type",
        "department",
    )

    search_fields = (
        "name",
        "subject_code",
    )

    list_filter = (
        "semester",
        "subject_type",
        "department",
    )

    list_select_related = (
        "department",
    )


@admin.register(Marks)
class MarksAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "subject",
        "get_exam_type",
        "marks",
        "percentage",
        "grade",
        "status",
    )

    search_fields = (
        "student__roll_number",
        "student__user__first_name",
        "student__user__last_name",
        "subject__name",
        "subject__subject_code",
    )

    list_filter = (
        "status",
        "exam__exam_type",
        "subject",
    )

    list_select_related = (
        "student",
        "subject",
        "exam",
    )

    @admin.display(description="Exam Type")
    def get_exam_type(self, obj):
        return obj.exam.get_exam_type_display()


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "subject",
        "date",
        "status",
    )

    search_fields = (
        "student__roll_number",
        "student__user__first_name",
        "student__user__last_name",
        "subject__name",
    )

    list_filter = (
        "status",
        "date",
        "subject",
    )

    list_select_related = (
        "student",
        "subject",
    )


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subject",
        "department",
        "semester",
        "get_exam_type",
        "exam_date",
        "start_time",
        "end_time",
        "venue",
        "get_status",
        "created_by",
    )

    list_filter = (
        "department",
        "semester",
        "exam_type",
        "status",
        "exam_date",
    )

    search_fields = (
        "subject__name",
        "subject__subject_code",
        "venue",
    )

    ordering = (
        "exam_date",
        "start_time",
    )

    list_select_related = (
        "subject",
        "department",
        "created_by",
    )

    @admin.display(description="Exam Type")
    def get_exam_type(self, obj):
        return obj.get_exam_type_display()

    @admin.display(description="Status")
    def get_status(self, obj):
        return obj.get_status_display()