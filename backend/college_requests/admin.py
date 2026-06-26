from django.contrib import admin
from .models import CollegeRegistration


@admin.register(CollegeRegistration)
class CollegeRegistrationAdmin(admin.ModelAdmin):

    list_display = (
        "college_name",
        "contact_person",
        "email",
        "phone",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "state",
    )

    search_fields = (
        "college_name",
        "email",
        "contact_person",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "approved_at",
        "rejected_at",
    )