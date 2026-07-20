from decimal import Decimal

from django.core.cache import cache
from django.db import transaction
from django.db.models import Count, Q

from rest_framework.exceptions import ValidationError
from notifications.services import notify_students
from students.models import Student

from .models import (
    Attendance,
    Exam,
    Marks,
    Subject,
)

from .tasks import (
    notify_exam_cancelled,
    notify_exam_rescheduled,
    notify_exam_scheduled,
)


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

    # Update marks status
    published_marks = Marks.objects.filter(exam=exam)
    published_marks.update(status=Marks.Status.PUBLISHED)

    # Collect students
    students = [
        mark.student
        for mark in published_marks.select_related("student")
    ]

    # Notify students
    try:
        notify_students(
            students=students,
            title="Marks Published",
            message=f"Your {exam.exam_type} marks for {exam.subject.name} have been published.",
            data={
                "type": "marks",
                "exam_id": str(exam.id),
                "subject_id": str(exam.subject.id),
            },
        )
    except Exception as e:
        # TODO: Replace with proper logging
        print(f"Marks notification error: {e}")

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


def get_exam_marks(*, exam_id, user):
    department = user.hodprofile.department
    return (
        Marks.objects.filter(
            exam_id=exam_id,
            exam__department=department,
        )
        .select_related(
            "student__user",
            "subject",
        )
        .order_by("student__roll_number")
    )


# =====================================================================
# CLEANED EXAM SERVICES (PART 1 & PART 2 COMPLETED)
# =====================================================================

@transaction.atomic
def create_exam(*, validated_data, user):

    subject = validated_data["subject"]

    department = subject.department
    semester = subject.semester

    conflict = Exam.objects.filter(
        department=department,
        semester=semester,
        exam_date=validated_data["exam_date"],
        status__in=[
            Exam.Status.SCHEDULED,
            Exam.Status.RESCHEDULED,
        ],
    ).filter(
        start_time__lt=validated_data["end_time"],
        end_time__gt=validated_data["start_time"],
    )

    if conflict.exists():
        raise ValidationError(
            {
                "exam_date": [
                    "Another exam is already scheduled during this time."
                ]
            }
        )

    exam = Exam.objects.create(
        **validated_data,
        department=department,
        semester=semester,
        created_by=user,
    )

    # Uncomment after testing
    # notify_exam_scheduled.delay(exam.id)

    return exam


@transaction.atomic
def update_exam(*, exam, validated_data):

    old_date = exam.exam_date
    old_start = exam.start_time
    old_end = exam.end_time
    old_venue = exam.venue

    new_date = validated_data.get(
        "exam_date",
        exam.exam_date,
    )

    new_start = validated_data.get(
        "start_time",
        exam.start_time,
    )

    new_end = validated_data.get(
        "end_time",
        exam.end_time,
    )

    new_venue = validated_data.get(
        "venue",
        exam.venue,
    )

    conflict = (
        Exam.objects.filter(
            department=exam.department,
            semester=exam.semester,
            exam_date=new_date,
            status__in=[
                Exam.Status.SCHEDULED,
                Exam.Status.RESCHEDULED,
            ],
        )
        .exclude(id=exam.id)
        .filter(
            start_time__lt=new_end,
            end_time__gt=new_start,
        )
    )

    if conflict.exists():
        raise ValidationError(
            {
                "exam_date": [
                    "Another exam is already scheduled during this time."
                ]
            }
        )

    rescheduled = any(
        [
            old_date != new_date,
            old_start != new_start,
            old_end != new_end,
            old_venue != new_venue,
        ]
    )

    if rescheduled:
        exam.original_date = old_date
        exam.status = Exam.Status.RESCHEDULED

    for key, value in validated_data.items():
        setattr(exam, key, value)

    exam.save()

    if rescheduled:
        # Uncomment after testing
        # notify_exam_rescheduled.delay(exam.id)
         notify_exam_rescheduled.delay(exam.id)
    return exam


@transaction.atomic
def cancel_exam(exam):

    exam.status = Exam.Status.CANCELLED

    exam.save(update_fields=["status"])

    # Uncomment after testing
    notify_exam_cancelled.delay(exam.id)

    return exam


def get_student_exams(student):

    return (
        Exam.objects.filter(
            department=student.department,
            semester=student.semester,
        )
        .select_related(
            "subject",
            "department",
        )
        .order_by(
            "exam_date",
            "start_time",
        )
    )