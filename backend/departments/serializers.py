from rest_framework import serializers

from .models import Department


from rest_framework import serializers
from .models import Department


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
        ]