from django.contrib import admin

from .models import Complaint, ComplaintStatusHistory


class ComplaintStatusHistoryInline(admin.TabularInline):
    model = ComplaintStatusHistory
    extra = 0
    can_delete = False
    show_change_link = True

    readonly_fields = (
        "old_status",
        "new_status",
        "changed_by",
        "note",
        "changed_at",
    )

    ordering = ("-changed_at",)


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):

    list_display = (
        "tracking_code",
        "category",
        "scope",
        "college",
        "department",
        "status",
        "created_at",
    )

    list_display_links = (
        "tracking_code",
    )

    list_filter = (
        "status",
        "category",
        "scope",
        "college",
        "department",
        "created_at",
    )

    search_fields = (
        "tracking_code",
        "text",
        "resolution_note",
    )

    readonly_fields = (
        "tracking_code",
        "attachment",
        "created_at",
        "updated_at",
    )

    list_select_related = (
        "college",
        "department",
    )

    ordering = (
        "-created_at",
    )

    date_hierarchy = "created_at"

    list_per_page = 25

    inlines = (
        ComplaintStatusHistoryInline,
    )

    fieldsets = (
        (
            "Complaint Information",
            {
                "fields": (
                    "tracking_code",
                    "text",
                    "attachment",
                    "category",
                    "scope",
                    "college",
                    "department",
                )
            },
        ),
        (
            "Status Information",
            {
                "fields": (
                    "status",
                    "resolution_note",
                )
            },
        ),
        (
            "Audit Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )


@admin.register(ComplaintStatusHistory)
class ComplaintStatusHistoryAdmin(admin.ModelAdmin):

    list_display = (
        "complaint",
        "old_status",
        "new_status",
        "changed_by",
        "changed_at",
    )

    list_display_links = (
        "complaint",
    )

    list_filter = (
        "old_status",
        "new_status",
        "changed_at",
    )

    search_fields = (
        "complaint__tracking_code",
        "changed_by__email",
        "changed_by__first_name",
        "changed_by__last_name",
        "note",
    )

    readonly_fields = (
        "complaint",
        "old_status",
        "new_status",
        "changed_by",
        "note",
        "changed_at",
    )

    list_select_related = (
        "complaint",
        "changed_by",
    )

    ordering = (
        "-changed_at",
    )

    date_hierarchy = "changed_at"

    list_per_page = 25