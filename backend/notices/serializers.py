from rest_framework import serializers

from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()
    posted_by_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Notice

        fields = [
            "id",
            "title",
            "body",
            "category",
            "scope",
            "college",
            "department",
            "department_name",
            "image",
            "image_url",
            "is_pinned",
            "posted_by",
            "posted_by_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "college",
            "department",
            "posted_by",
            "is_pinned",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):

        if obj.image:
            return obj.image.url

        return None

    def get_posted_by_name(self, obj):

        return (
            f"{obj.posted_by.first_name} "
            f"{obj.posted_by.last_name}"
        ).strip()

    def get_department_name(self, obj):

        if obj.department:
            return obj.department.name

        return None