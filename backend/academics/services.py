from decimal import Decimal

from django.db import transaction
from django.db.models import Count, Q
from django.core.cache import cache
from rest_framework.exceptions import ValidationError

from students.models import Student
from .models import (
    Subject,
    Marks,
    Exam,
)

from django.core.cache import cache

from .models import Attendance
def get_class_attendance(subject_id, attendance_date, user):

    department = user.hodprofile.department

    subject = Subject.objects.get(
        pk=subject_id,
        department=department,
    )

    attendance = (
        Attendance.objects.filter(
            subject=subject,
            date=attendance_date,
        )
        .select_related(
            "student__user",
            "subject",
        )
        .order_by(
            "student__roll_number",
        )
    )

    return attendance

def get_student_attendance(user):

    student = user.student_profile

    attendance_summary = []

    subjects = Subject.objects.filter(
        department=student.department
    ).order_by(
        "semester",
        "subject_code",
    )

    for subject in subjects:

        cache_key = (
            f"attendance_percentage:"
            f"{student.id}:{subject.id}"
        )

        cached_data = cache.get(cache_key)

        if cached_data:
            print("✅ CACHE HIT:", cache_key)
            attendance_summary.append(cached_data)
            continue
        print("❌ CACHE MISS:", cache_key)

        stats = Attendance.objects.filter(
            student=student,
            subject=subject,
        ).aggregate(
            total_days=Count("id"),
            present_days=Count(
                "id",
                filter=Q(
                    status=Attendance.Status.PRESENT
                ),
            ),
        )

        total_days = stats["total_days"]
        present_days = stats["present_days"]

        percentage = (
            round((present_days / total_days) * 100, 2)
            if total_days
            else 0
        )

        data = {
            "subject_id": subject.id,
            "subject_name": subject.name,
            "subject_code": subject.subject_code,
            "present_days": present_days,
            "total_days": total_days,
            "attendance_percentage": percentage,
        }

        cache.set(
            cache_key,
            data,
            timeout=60 * 60,
        )

        attendance_summary.append(data)

    return attendance_summary

@transaction.atomic
def bulk_mark_attendance(validated_data, user):

    department = user.hodprofile.department

    subject = validated_data["subject"]
    attendance_data = validated_data["attendance"]
    attendance_date = validated_data["date"]

    if subject.department != department:
        raise ValidationError(
            {
                "subject": [
                    "You cannot mark attendance for another department."
                ]
            }
        )

    attendance_objects = []

    for item in attendance_data:

        student = Student.objects.select_related(
            "department"
        ).get(
            pk=item["student"].id
        )

        if student.department != department:
            raise ValidationError(
                {
                    "student": [
                        f"{student.roll_number} does not belong to your department."
                    ]
                }
            )

        attendance, created = Attendance.objects.update_or_create(
            student=student,
            subject=subject,
            date=attendance_date,
            defaults={
                "status": item["status"],
            },
        )

        cache.delete(
            f"attendance_percentage:{student.id}:{subject.id}"
        )

        attendance_objects.append(attendance)

    return attendance_objects

@transaction.atomic
def create_subject(validated_data, user):
    department = user.hodprofile.department

    if Subject.objects.filter(
        department=department,
        subject_code=validated_data["subject_code"],
    ).exists():
        raise ValidationError(
            {
                "subject_code": [
                    "A subject with this code already exists."
                ]
            }
        )

    if Subject.objects.filter(
        department=department,
        name__iexact=validated_data["name"],
    ).exists():
        raise ValidationError(
            {
                "name": [
                    "A subject with this name already exists."
                ]
            }
        )

    return Subject.objects.create(
        department=department,
        **validated_data,
    )


@transaction.atomic
def update_subject(subject, validated_data):

    if (
        "subject_code" in validated_data
        and Subject.objects.filter(
            department=subject.department,
            subject_code=validated_data["subject_code"],
        )
        .exclude(pk=subject.pk)
        .exists()
    ):
        raise ValidationError(
            {
                "subject_code": [
                    "A subject with this code already exists."
                ]
            }
        )

    if (
        "name" in validated_data
        and Subject.objects.filter(
            department=subject.department,
            name__iexact=validated_data["name"],
        )
        .exclude(pk=subject.pk)
        .exists()
    ):
        raise ValidationError(
            {
                "name": [
                    "A subject with this name already exists."
                ]
            }
        )

    for key, value in validated_data.items():
        setattr(subject, key, value)

    subject.save(update_fields=validated_data.keys())

    return subject


@transaction.atomic
def delete_subject(subject):
    subject.delete()


def calculate_percentage(marks, maximum_marks):
    """
    Calculate percentage from obtained marks.
    """

    if maximum_marks == 0:
        return Decimal("0.00")

    return round((marks / maximum_marks) * 100, 2)


def calculate_grade(percentage):
    """
    Calculate grade from percentage.
    """

    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"

    return "F"


@transaction.atomic
def bulk_save_marks(validated_data, user):

    exam = validated_data["exam"]
    marks_data = validated_data["marks"]

    department = user.hodprofile.department

    if exam.department != department:
        raise ValidationError(
            {
                "exam": [
                    "You cannot add marks for another department."
                ]
            }
        )

    created_marks = []

    for item in marks_data:

        student = Student.objects.select_related(
            "department"
        ).get(
            pk=item["student"].id
        )

        if student.department != department:
            raise ValidationError(
                {
                    "student": [
                        f"{student.roll_number} does not belong to your department."
                    ]
                }
            )

        percentage = calculate_percentage(
            item["marks"],
            exam.maximum_marks,
        )

        grade = calculate_grade(percentage)

        mark, created = Marks.objects.update_or_create(
            student=student,
            subject=exam.subject,
            exam=exam,
            defaults={
                "marks": item["marks"],
                "percentage": percentage,
                "grade": grade,
                "status": Marks.Status.DRAFT,
            },
        )

        created_marks.append(mark)

    return created_marks


@transaction.atomic
def publish_marks(validated_data, user):

    exam = validated_data["exam"]

    department = user.hodprofile.department

    if exam.department != department:
        raise ValidationError(
            {
                "exam": [
                    "You cannot publish marks for another department."
                ]
            }
        )

    Marks.objects.filter(
        exam=exam
    ).update(
        status=Marks.Status.PUBLISHED
    )

    return exam


def get_student_marks(user):

    student = user.student_profile

    return (
        Marks.objects.filter(
            student=student,
            status=Marks.Status.PUBLISHED,
        )
        .select_related(
            "subject",
            "exam",
        )
        .order_by("-created_at")
    )
    
@transaction.atomic
def create_exam(validated_data, user):
    """
    Create a new exam for the logged-in HOD's department.
    """

    department = user.hodprofile.department
    subject = validated_data["subject"]

    if subject.department != department:
        raise ValidationError(
            {
                "subject": [
                    "You can only create exams for your department."
                ]
            }
        )

    if Exam.objects.filter(
        subject=subject,
        exam_type=validated_data["exam_type"],
    ).exists():
        raise ValidationError(
            {
                "exam_type": [
                    "This exam already exists for the selected subject."
                ]
            }
        )

    return Exam.objects.create(
        department=department,
        **validated_data,
    )


@transaction.atomic
def update_exam(exam, validated_data, user):
    """
    Update an existing exam.
    """

    department = user.hodprofile.department

    if (
        "subject" in validated_data
        and validated_data["subject"].department != department
    ):
        raise ValidationError(
            {
                "subject": [
                    "Invalid subject."
                ]
            }
        )

    subject = validated_data.get("subject", exam.subject)
    exam_type = validated_data.get("exam_type", exam.exam_type)

    if (
        Exam.objects.filter(
            subject=subject,
            exam_type=exam_type,
        )
        .exclude(pk=exam.pk)
        .exists()
    ):
        raise ValidationError(
            {
                "exam_type": [
                    "This exam already exists."
                ]
            }
        )

    for key, value in validated_data.items():
        setattr(exam, key, value)

    exam.save()

    return exam


@transaction.atomic
def delete_exam(exam):
    exam.delete()