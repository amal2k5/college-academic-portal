from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    department_name = serializers.CharField(
        source="department.name",
        read_only=True
    )
    
    hod_name = serializers.SerializerMethodField()

    college_name = serializers.CharField(
    source="department.college.name",
    read_only=True
)
    
    def get_hod_name(self, obj):
        try:
            hod = obj.department.hodprofile
            return f"{hod.user.first_name} {hod.user.last_name}".strip()
        except Exception:
            return None

    class Meta:
        model = Student
        fields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "date_of_birth",
    "gender",
    "parent_name",
    "parent_phone",
    "roll_number",
    "admission_number",
    "semester",
    "academic_year",
    "department_name",
    "hod_name",
    "college_name",
    "created_at",
    "updated_at",
]

        read_only_fields = (
            "created_at",
            "updated_at",
        )


class StudentCreateSerializer(serializers.Serializer):

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

    date_of_birth = serializers.DateField()

    gender = serializers.ChoiceField(
        choices=Student.Gender.choices
    )

    parent_name = serializers.CharField(
        max_length=100
    )

    parent_phone = serializers.CharField(
        max_length=15
    )

    roll_number = serializers.CharField(
        max_length=50
    )

    admission_number = serializers.CharField(
        max_length=50
    )

    semester = serializers.IntegerField()

    academic_year = serializers.CharField(
        max_length=20
            
    )
    
    year = serializers.ChoiceField(
    choices=Student.YearChoices.choices
)