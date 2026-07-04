from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import User, CollegeAdminProfile, HODProfile
from colleges.models import College
from departments.models import Department

import re

User = get_user_model()

# ---------- Reusable Validators ----------
def validate_unique_email(value):
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("Email already exists.")
    return value

def validate_active_college_id(value):
    if not College.objects.filter(id=value, is_active=True).exists():
        raise serializers.ValidationError("Invalid college.")
    return value

def validate_active_department_id(value):
    if not Department.objects.filter(id=value, is_active=True).exists():
        raise serializers.ValidationError("Invalid department.")
    return value

def validate_phone(value):
    if not re.fullmatch(r"^[0-9]{10,15}$", value):
        raise serializers.ValidationError("Phone number must contain 10-15 digits only.")
    return value


# ---------- Serializers ----------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class CollegeAdminCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(validators=[validate_unique_email])
    college_id = serializers.IntegerField(validators=[validate_active_college_id])


class SetupPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs


class HODCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(validators=[validate_unique_email])
    phone = serializers.CharField(max_length=15, validators=[validate_phone])
    department_id = serializers.IntegerField(validators=[validate_active_department_id])


class HODListSerializer(serializers.ModelSerializer):
    department = serializers.CharField(
        source="hodprofile.department.name",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "department",
            "is_active",
        ]


class HODDetailSerializer(serializers.ModelSerializer):
    department = serializers.CharField(
        source="hodprofile.department.name",
        read_only=True
    )
    phone = serializers.CharField(
        source="hodprofile.phone",
        read_only=True
    )
    joined_at = serializers.DateTimeField(
        source="hodprofile.joined_at",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "department",
            "role",
            "is_active",
            "joined_at",
        ]


class CollegeAdminListSerializer(serializers.ModelSerializer):
    college = serializers.CharField(
        source="collegeadminprofile.college.name",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "college",
            "is_active",
            "created_at",
        ]


class CollegeAdminStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()



class HODStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class AuthUserSerializer(serializers.ModelSerializer):
    college = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "college",
            "department",
        ]

    def get_college(self, obj):
        if obj.role == User.Role.COLLEGE_ADMIN:
            try:
                return obj.collegeadminprofile.college.id
            except CollegeAdminProfile.DoesNotExist:
                return None

        if obj.role == User.Role.HOD:
            try:
                return obj.hodprofile.department.college.id
            except HODProfile.DoesNotExist:
                return None

        return None

    def get_department(self, obj):
        if obj.role == User.Role.HOD:
            try:
                return obj.hodprofile.department.id
            except HODProfile.DoesNotExist:
                return None

        return None

    is_active = serializers.BooleanField()    

# ==========================================
# Forgot Password Serializers
# ==========================================

class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Do not reveal whether the email exists.
        Validation only checks format.
        """
        return value


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        min_length=6,
        max_length=6
    )


class ResetPasswordSerializer(serializers.Serializer):

    reset_token = serializers.UUIDField()

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate(
        self,
        attrs
    ):

        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):

            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        return attrs

