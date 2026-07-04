from rest_framework import serializers  # type: ignore

from django.contrib.auth import get_user_model

from colleges.models import College

User = get_user_model()


class LoginSerializer(
    serializers.Serializer
):
    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


class CollegeAdminCreateSerializer(
    serializers.Serializer
):
    first_name = serializers.CharField(
        max_length=100
    )

    last_name = serializers.CharField(
        max_length=100
    )

    email = serializers.EmailField()

    college_id = serializers.IntegerField()

    def validate_email(
        self,
        value
    ):
        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate_college_id(
        self,
        value
    ):
        if not College.objects.filter(
            id=value,
            is_active=True
        ).exists():

            raise serializers.ValidationError(
                "Invalid college."
            )

        return value


class SetupPasswordSerializer(
    serializers.Serializer
):
    token = serializers.UUIDField()

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
    
class HODCreateSerializer(
    serializers.Serializer
):

    first_name = serializers.CharField(
        max_length=100
    )

    last_name = serializers.CharField(
        max_length=100
    )

    email = serializers.EmailField()

    phone = serializers.CharField(
        max_length=15
    )

    department_id = serializers.IntegerField()

    def validate_email(
        self,
        value
    ):

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate_department_id(
        self,
        value
    ):

        from departments.models import Department

        if not Department.objects.filter(
            id=value,
            is_active=True
        ).exists():

            raise serializers.ValidationError(
                "Invalid department."
            )

        return value
    
    
class HODListSerializer(serializers.ModelSerializer):

    department = serializers.CharField(
        source="hodprofile.department.name"
    )

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "department",
            "is_active"
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
        
class CollegeAdminListSerializer(
    serializers.ModelSerializer
):

    college = serializers.CharField(
        source="collegeadminprofile.college.name"
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
            "created_at"
        ]        
        

class CollegeAdminStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()        
    
    
class HODStatusSerializer(serializers.Serializer):

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