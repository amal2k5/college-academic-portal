from rest_framework import serializers

from .models import Complaint, ComplaintStatusHistory


class AttachmentUrlMixin(serializers.Serializer):
    attachment = serializers.SerializerMethodField()

    def get_attachment(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = (
            "id",
            "tracking_code",
            "text",
            "attachment",
            "category",
            "scope",
            "department",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "tracking_code",
            "status",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        scope = attrs.get("scope")
        department = attrs.get("department")

        if scope == Complaint.Scope.DEPARTMENT:
            if department is None:
                raise serializers.ValidationError(
                    {
                        "department": "Department is required for department complaints."
                    }
                )

            if getattr(department, "college", None) is None:
                raise serializers.ValidationError(
                    {
                        "department": "Selected department is not linked to any college."
                    }
                )

        elif scope == Complaint.Scope.COLLEGE:
            attrs["department"] = None

        return attrs


class ComplaintTrackingSerializer(AttachmentUrlMixin, serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = (
            "tracking_code",
            "text",
            "attachment",
            "category",
            "scope",
            "status",
            "resolution_note",
            "created_at",
            "updated_at",
        )


class ComplaintStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintStatusHistory
        fields = (
            "id",
            "old_status",
            "new_status",
            "note",
            "changed_by",
            "changed_at",
        )

    def get_changed_by(self, obj):
        if obj.changed_by:
            return obj.changed_by.get_full_name() or obj.changed_by.email
        return None


class ComplaintListSerializer(AttachmentUrlMixin, serializers.ModelSerializer):
    college = serializers.StringRelatedField()
    department = serializers.StringRelatedField()

    class Meta:
        model = Complaint
        fields = (
            "id",
            "tracking_code",
            "text",
            "attachment",
            "category",
            "scope",
            "college",
            "department",
            "status",
            "resolution_note",
            "created_at",
            "updated_at",
        )


class ComplaintDetailSerializer(AttachmentUrlMixin, serializers.ModelSerializer):
    college = serializers.StringRelatedField()
    department = serializers.StringRelatedField()

    history = ComplaintStatusHistorySerializer(
        source="status_history",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Complaint
        fields = (
            "id",
            "tracking_code",
            "text",
            "attachment",
            "category",
            "scope",
            "college",
            "department",
            "status",
            "resolution_note",
            "created_at",
            "updated_at",
            "history",
        )


class ComplaintStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Complaint.Status.choices,
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    resolution_note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    def validate(self, attrs):
        complaint = self.context["complaint"]

        current = complaint.status
        new = attrs["status"]

        allowed = {
            Complaint.Status.SUBMITTED: [
                Complaint.Status.SEEN,
            ],
            Complaint.Status.SEEN: [
                Complaint.Status.RESOLVED,
            ],
            Complaint.Status.RESOLVED: [],
        }

        if new not in allowed[current]:
            raise serializers.ValidationError(
                {
                    "status": f"Cannot change complaint status from '{current}' to '{new}'."
                }
            )

        if (
            new == Complaint.Status.RESOLVED
            and not attrs.get("resolution_note", "").strip()
        ):
            raise serializers.ValidationError(
                {
                    "resolution_note": "Resolution note is required when resolving a complaint."
                }
            )

        return attrs


class ComplaintDashboardSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    submitted = serializers.IntegerField()
    seen = serializers.IntegerField()
    resolved = serializers.IntegerField()

    categories = serializers.DictField(
        child=serializers.IntegerField(),
        default=dict,
    )

    departments = serializers.DictField(
        child=serializers.IntegerField(),
        default=dict,
    )