from rest_framework import serializers
from .models import Department
from accounts.models import HODProfile
from rest_framework import serializers
from .models import Department
from rest_framework import serializers
from .models import Department
from accounts.models import HODProfile
from students.models import Student

class DepartmentSerializer(
    serializers.ModelSerializer
):

    college_name = serializers.CharField(
        source="college.name",
        read_only=True
    )

    class Meta:
        model = Department

        fields = [
            "id",
            "name",
            "college",
            "college_name",
            "is_active",
        ]

        read_only_fields = [
            "college",
        ]

class DepartmentListSerializer(
    serializers.ModelSerializer
):

    college_name = serializers.CharField(
        source="college.name",
        read_only=True
    )

    class Meta:
        model = Department

        fields = [
            "id",
            "name",
            "college_name",
            "is_active",
        ]
        
        


from rest_framework import serializers

from .models import Department
from accounts.models import HODProfile
from students.models import Student


class DepartmentDetailSerializer(serializers.ModelSerializer):

    college_name = serializers.CharField(
        source="college.name",
        read_only=True
    )

    hod_name = serializers.SerializerMethodField()

    hod_email = serializers.SerializerMethodField()

    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Department

        fields = [
            "id",
            "name",
            "college_name",
            "is_active",
            "hod_name",
            "hod_email",
            "student_count",
            "created_at",
            "updated_at",
        ]

    def get_hod_name(self, obj):
        try:
            hod_profile = HODProfile.objects.select_related(
                "user"
            ).get(
                department=obj
            )

            return (
                f"{hod_profile.user.first_name} "
                f"{hod_profile.user.last_name}"
            )

        except HODProfile.DoesNotExist:
            return None

    def get_hod_email(self, obj):
        try:
            hod_profile = HODProfile.objects.select_related(
                "user"
            ).get(
                department=obj
            )

            return hod_profile.user.email

        except HODProfile.DoesNotExist:
            return None

    def get_student_count(self, obj):
        return obj.students.count()