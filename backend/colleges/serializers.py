from rest_framework import serializers
from .models import College
import re


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = "__all__"
        extra_kwargs = {
            'name': {'required': True},
            'email_domain': {'required': True},
            'location': {'required': True},
        }


    def validate_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "College name must be at least 3 characters long."
            )
        return value


    def validate_email_domain(self, value):
        value = value.strip().lower()
        
        pattern = r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        
        if not re.match(pattern, value):
            raise serializers.ValidationError(
            "Please enter a valid email domain."
        )
        return value


    def validate_location(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Location must be at least 3 characters long."
            )
        return value