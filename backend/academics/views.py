from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import (
    IsHOD,
    IsStudent,
)

from .models import (
    Subject,
    Marks,
    Attendance,
    Exam,
)

from .serializers import (
    SubjectSerializer,
    MarksSerializer,
    AttendanceSerializer,
    ExamSerializer,
    BulkMarksEntrySerializer,
    PublishMarksSerializer,
    StudentMarksSerializer,
)

from .services import (
    create_subject,
    update_subject,
    delete_subject,
    bulk_save_marks,
    publish_marks,
    get_student_marks,
    create_exam,
    update_exam,
    delete_exam,
    get_exam_marks
)

class SubjectListCreateView(APIView):
    """
    List all subjects of the logged-in HOD's department.
    Create a new subject for the logged-in HOD's department.
    """

    permission_classes = [IsAuthenticated, IsHOD]

    def get(self, request):

        department = request.user.hodprofile.department

        subjects = (
            Subject.objects.filter(
                department=department
            )
            .select_related("department")
            .order_by("semester", "subject_code")
        )

        serializer = SubjectSerializer(
            subjects,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = SubjectSerializer(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        subject = create_subject(
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            SubjectSerializer(subject).data,
            status=status.HTTP_201_CREATED,
        )


class SubjectDetailView(APIView):
    """
    Retrieve, update and delete a subject.
    Only subjects belonging to the logged-in HOD's department
    are accessible.
    """

    permission_classes = [IsAuthenticated, IsHOD]

    def get_object(self, request, pk):

        return get_object_or_404(
            Subject.objects.select_related("department"),
            pk=pk,
            department=request.user.hodprofile.department,
        )

    def get(self, request, pk):

        subject = self.get_object(request, pk)

        serializer = SubjectSerializer(subject)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        subject = self.get_object(request, pk)

        serializer = SubjectSerializer(
            subject,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        subject = update_subject(
            subject=subject,
            validated_data=serializer.validated_data,
        )

        return Response(
            SubjectSerializer(subject).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        subject = self.get_object(request, pk)

        delete_subject(subject)

        return Response(
            {
                "message": "Subject deleted successfully."
            },
            status=status.HTTP_200_OK,
        )


class BulkMarksEntryView(APIView):
    """
    HOD can enter marks for an entire class in a single request.

    Marks are saved as DRAFT.
    """

    permission_classes = [IsAuthenticated, IsHOD]

    def get(self, request):
        exam_id = request.query_params.get("exam")

        if not exam_id:
            return Response(
                {"detail": "exam query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        marks = get_exam_marks(
            exam_id=exam_id,
            user=request.user,
        )

        serializer = MarksSerializer(
            marks,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = BulkMarksEntrySerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        marks = bulk_save_marks(
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            {
                "message": "Marks saved as draft successfully.",
                "results": MarksSerializer(
                    marks,
                    many=True,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PublishMarksView(APIView):
    """
    Publish all draft marks for an exam.
    """

    permission_classes = [IsAuthenticated, IsHOD]

    def post(self, request):

        serializer = PublishMarksSerializer(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        publish_marks(
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            {
                "message": "Marks published successfully."
            },
            status=status.HTTP_200_OK,
        )


class StudentMarksView(APIView):
    """
    Student can view only his/her published marks.
    """

    permission_classes = [
        IsAuthenticated,
        IsStudent,
    ]

    def get(self, request):

        marks = get_student_marks(request.user)

        serializer = StudentMarksSerializer(
            marks,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
class ExamListCreateView(APIView):
    """
    List all exams of the logged-in HOD's department.
    For students, list exams relevant to their department and semester.
    Create a new exam for the logged-in HOD's department.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "HOD":
            department = request.user.hodprofile.department
            exams = (
                Exam.objects.filter(
                    department=department
                )
                .select_related(
                    "subject",
                    "department",
                )
                .order_by(
                    "date",
                    "time",
                )
            )
        elif request.user.role == "STUDENT":
            student = request.user.student_profile
            exams = (
                Exam.objects.filter(
                    department=student.department,
                    subject__semester=student.semester
                )
                .select_related(
                    "subject",
                    "department",
                )
                .order_by(
                    "date",
                    "time",
                )
            )
        else:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ExamSerializer(
            exams,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        if request.user.role != "HOD":
            return Response({"detail": "Only HOD can create exams."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ExamSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        exam = create_exam(
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_201_CREATED,
        )


class ExamDetailView(APIView):
    """
    Retrieve, update and delete an exam.
    Only exams belonging to the logged-in HOD's department
    are accessible.
    """

    permission_classes = [IsAuthenticated, IsHOD]

    def get_object(self, request, pk):

        return get_object_or_404(
            Exam.objects.select_related(
                "subject",
                "department",
            ),
            pk=pk,
            department=request.user.hodprofile.department,
        )

    def get(self, request, pk):

        exam = self.get_object(
            request,
            pk,
        )

        serializer = ExamSerializer(
            exam,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        exam = self.get_object(
            request,
            pk,
        )

        serializer = ExamSerializer(
            exam,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        exam = update_exam(
            exam=exam,
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        exam = self.get_object(
            request,
            pk,
        )

        delete_exam(exam)

        return Response(
            {
                "message": "Exam deleted successfully."
            },
            status=status.HTTP_200_OK,
        )