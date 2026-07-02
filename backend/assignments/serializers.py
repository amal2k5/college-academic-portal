from rest_framework import serializers

from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):

    attachment_url = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Assignment

        fields = [
            "id",
            "title",
            "subject",
            "description",
            "attachment",
            "attachment_url",
            "target_year",
            "department",
            "deadline",
            "max_marks",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "department",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def get_attachment_url(self, obj):

        if obj.attachment:
            return obj.attachment.url

        return None

    def get_created_by_name(self, obj):

        return (
            f"{obj.created_by.first_name} "
            f"{obj.created_by.last_name}"
        ).strip()