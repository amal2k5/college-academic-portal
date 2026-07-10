from rest_framework import serializers

from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):

    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Assignment

        fields = [
            "id",
            "title",
            "subject",
            "description",
            "attachment_url",
            "attachment_public_id",
            "attachment_resource_type",
            "attachment_original_name",
            "attachment_format",
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
            "attachment_url",
            "attachment_public_id",
            "attachment_resource_type",
            "attachment_original_name",
            "attachment_format",
            "created_at",
            "updated_at",
        ]

    def get_created_by_name(self, obj):
        return (
            f"{obj.created_by.first_name} "
            f"{obj.created_by.last_name}"
        ).strip()