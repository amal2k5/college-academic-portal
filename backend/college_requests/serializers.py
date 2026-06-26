from rest_framework import serializers
from .models import CollegeRegistration
from colleges.models import College


class CollegeRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeRegistration
        fields = [
            "id",
            "college_name",
            "contact_person",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "notes",
            "status",
            "rejection_reason",
            "approved_by",
            "rejected_by",
            "approved_at",
            "rejected_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "status",
            "rejection_reason",
            "approved_by",
            "rejected_by",
            "approved_at",
            "rejected_at",
            "created_at",
            "updated_at",
        ]

    def validate_college_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "College name must be at least 3 characters long."
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits."
            )

        if len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError(
                "Phone number must be between 10 and 15 digits."
            )

        return value

    def validate_email(self, value):
        value = value.lower().strip()

        # Duplicate pending request
        if CollegeRegistration.objects.filter(
            email=value,
            status=CollegeRegistration.Status.PENDING
        ).exists():
            raise serializers.ValidationError(
                "A pending registration request already exists for this email."
            )

        # Existing approved college
        email_domain = value.split("@")[-1]

        if College.objects.filter(email_domain=email_domain).exists():
            raise serializers.ValidationError(
                "A college with this email domain already exists."
            )

        return value

    def validate(self, attrs):
        required_fields = [
            "college_name",
            "contact_person",
            "email",
            "phone",
            "address",
            "city",
            "state",
        ]

        errors = {}

        for field in required_fields:
            value = attrs.get(field)

            if value is None or str(value).strip() == "":
                errors[field] = "This field is required."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs    