from django.db import models

from departments.models import Department
from students.models import Student


class Subject(models.Model):

    class Semester(models.IntegerChoices):
        FIRST = 1, "Semester 1"
        SECOND = 2, "Semester 2"
        THIRD = 3, "Semester 3"
        FOURTH = 4, "Semester 4"
        FIFTH = 5, "Semester 5"
        SIXTH = 6, "Semester 6"
        SEVENTH = 7, "Semester 7"
        EIGHTH = 8, "Semester 8"

    class SubjectType(models.TextChoices):
        THEORY = "THEORY", "Theory"
        PRACTICAL = "PRACTICAL", "Practical"
        LAB = "LAB", "Lab"

    name = models.CharField(max_length=200)

    subject_code = models.CharField(
        max_length=20,
        unique=True
    )

    semester = models.PositiveSmallIntegerField(
        choices=Semester.choices
    )

    subject_type = models.CharField(
        max_length=20,
        choices=SubjectType.choices,
        default=SubjectType.THEORY
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="subjects"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["semester", "subject_code"]

    def __str__(self):
        return f"{self.subject_code} - {self.name}"

class Marks(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="marks"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="marks"
    )

    exam = models.ForeignKey(
        "Exam",
        on_delete=models.CASCADE,
        related_name="marks"
    )

   

    marks = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    grade = models.CharField(
        max_length=2,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    constraints = [
        models.UniqueConstraint(
            fields=[
                "student",
                "subject",
                "exam",
            ],
            name="unique_marks_per_exam",
        )
    ]

    def __str__(self):
        return (
            f"{self.student.roll_number} - "
            f"{self.subject.subject_code} - "
            f"{self.exam.exam_type}"
        )
class Attendance(models.Model):

    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="attendance"
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=Status.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "student",
                    "subject",
                    "date",
                ],
                name="unique_attendance_per_day",
            )
        ]

    def __str__(self):
        return (
            f"{self.student.roll_number} - "
            f"{self.subject.subject_code} - "
            f"{self.date}"
        )


class Exam(models.Model):

    class ExamType(models.TextChoices):
        INTERNAL1 = "INTERNAL1", "Internal 1"
        INTERNAL2 = "INTERNAL2", "Internal 2"
        MODEL = "MODEL", "Model Exam"
        SEMESTER = "SEMESTER", "Semester Exam"

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="exams"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="exams"
    )

    exam_type = models.CharField(
        max_length=20,
        choices=ExamType.choices
    )

    maximum_marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100
    )

    date = models.DateField()

    time = models.TimeField()

    duration = models.PositiveIntegerField(
        help_text="Duration in minutes"
    )

    venue = models.CharField(
        max_length=200
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return (
            f"{self.subject.subject_code} - "
            f"{self.exam_type}"
        )