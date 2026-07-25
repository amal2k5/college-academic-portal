from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import (
    LostFoundPost,
    Comment,
)


@admin.register(LostFoundPost)
class LostFoundPostAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "student",
        "category",
        "status",
        "location",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "student__user__first_name",
        "student__user__last_name",
        "student__user__email",
        "location",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "post",
        "student",
        "created_at",
    )

    search_fields = (
        "post__title",
        "student__user__first_name",
        "student__user__last_name",
        "student__user__email",
        "comment",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
    )