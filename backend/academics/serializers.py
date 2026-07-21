from rest_framework import serializers

from students.models import Student
from .models import Exam


from .models import (
    Subject,
    Marks,
    Attendance,
    Exam,
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
        read_only_fields = ("department",)


class MarksSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True,
    )

    roll_number = serializers.CharField(
        source="student.roll_number",
        read_only=True,
    )

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )


    subject_code = serializers.CharField(
        source="subject.subject_code",
        read_only=True,
    )

    exam_type = serializers.CharField(
        source="exam.exam_type",
        read_only=True,
    )

    maximum_marks = serializers.DecimalField(
        source="exam.maximum_marks",
        max_digits=5,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Marks
        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "subject_name",
            "subject_code",
            "exam",
            "exam_type",
            "marks",
            "maximum_marks",
            "percentage",
            "grade",
            "status",
            "created_at",
            "updated_at",
            "roll_number"
        ]


class AttendanceSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True,
    )

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "subject_name",
            "date",
            "status",
            "created_at",
            "updated_at",
        ]



class ExamSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )
    subject_code = serializers.CharField(
        source="subject.subject_code",
        read_only=True,
    )
    subject_semester = serializers.IntegerField(
        source="subject.semester",
        read_only=True,
    )
    created_by = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Exam
        fields = [
            "id",
            "subject",
            "subject_name",
            "subject_code",
            "subject_semester",
            "department",
            "exam_type",
            "maximum_marks",
            "exam_date",
            "start_time",
            "end_time",
            "venue",
            "created_by",
            "status",
            "original_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "department", 
            "created_by",
            "created_at", 
            "updated_at"
        ]


        
class BulkMarkSerializer(serializers.Serializer):

    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all()
    )

    marks = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=0,
    )


class BulkMarksEntrySerializer(serializers.Serializer):

    exam = serializers.PrimaryKeyRelatedField(
        queryset=Exam.objects.all()
    )

    marks = BulkMarkSerializer(
        many=True
    )


class PublishMarksSerializer(serializers.Serializer):

    exam = serializers.PrimaryKeyRelatedField(
        queryset=Exam.objects.all()
    )


class StudentMarksSerializer(serializers.ModelSerializer):

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )

    subject_code = serializers.CharField(
        source="subject.subject_code",
        read_only=True,
    )

    semester = serializers.IntegerField(
        source="subject.semester",
        read_only=True,
    )

    exam_type = serializers.CharField(
        source="exam.exam_type",
        read_only=True,
    )

    maximum_marks = serializers.DecimalField(
        source="exam.maximum_marks",
        max_digits=5,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Marks
        fields = [
            "id",
            "subject_name",
            "subject_code",
            "semester",
            "exam_type",
            "marks",
            "maximum_marks",
            "percentage",
            "grade",
            "status",
        ]
        
class BulkAttendanceItemSerializer(serializers.Serializer):

    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all()
    )

    status = serializers.ChoiceField(
        choices=Attendance.Status.choices
    )


class BulkAttendanceSerializer(serializers.Serializer):

    subject = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all()
    )

    date = serializers.DateField()

    attendance = BulkAttendanceItemSerializer(
        many=True
    )
    
# from rest_framework import serializers



class ExamSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )
    subject_code = serializers.CharField(
        source="subject.subject_code",
        read_only=True,
    )

    class Meta:
        model = Exam
        fields = "__all__"
        read_only_fields = (
            "department",
            "semester",
            "created_by",
            "status",
            "original_date",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError(
                    {
                        "end_time": (
                            "End time must be later than start time."
                        )
                    }
                )

        return attrs