from django.shortcuts import get_object_or_404
from .services import get_exam_marks
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
    BulkAttendanceSerializer,
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
    cancel_exam,
    get_student_exams,
    bulk_mark_attendance,
    get_student_attendance,
    get_class_attendance,

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
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsHOD, IsStudent

from .models import Exam
from .serializers import ExamSerializer
from .services import (
    create_exam,
    update_exam,
    cancel_exam,
    get_student_exams,
)

class ExamListCreateView(APIView):
    """
    List exams.

    - HOD: View exams for their own department.
    - Student: View exams for their own department and semester.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role == request.user.Role.HOD:

            department = request.user.hodprofile.department

            exams = (
                Exam.objects.filter(
                    department=department
                )
                .select_related(
                    "subject",
                    "department",
                    "created_by",
                )
                .order_by(
                    "exam_date",
                    "start_time",
                )
            )

        elif request.user.role == request.user.Role.STUDENT:

            student = request.user.student_profile

            exams = get_student_exams(student)

        else:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

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

        if request.user.role != request.user.Role.HOD:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

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
    Retrieve, update and cancel an exam.

    Only exams belonging to the logged-in HOD's
    department are accessible.
    """

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def get_object(self, request, pk):

        return get_object_or_404(
            Exam.objects.select_related(
                "subject",
                "department",
                "created_by",
            ),
            pk=pk,
            department=request.user.hodprofile.department,
        )

    def get(self, request, pk):

        exam = self.get_object(
            request,
            pk,
        )

        serializer = ExamSerializer(exam)

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
        )

        serializer.is_valid(
            raise_exception=True,
        )

        exam = update_exam(
            exam=exam,
            validated_data=serializer.validated_data,
        )

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

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

        cancel_exam(exam)

        return Response(
            {
                "message": "Exam cancelled successfully."
            },
            status=status.HTTP_200_OK,
        )
        

        
        
class BulkAttendanceView(APIView):
    """
    HOD can mark attendance for an entire class in a single request.
    """

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def post(self, request):

        serializer = BulkAttendanceSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        attendance = bulk_mark_attendance(
            validated_data=serializer.validated_data,
            user=request.user,
        )

        return Response(
            {
                "message": "Attendance marked successfully.",
                "results": AttendanceSerializer(
                    attendance,
                    many=True,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class StudentAttendanceView(APIView):
    """
    Student can view attendance percentage
    for all subjects.
    """

    permission_classes = [
        IsAuthenticated,
        IsStudent,
    ]

    def get(self, request):

        attendance = get_student_attendance(
            request.user,
        )

        return Response(
            attendance,
            status=status.HTTP_200_OK,
        )


class ClassAttendanceView(APIView):
    """
    HOD can view attendance of a class
    for a particular subject and date.
    """

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def get(self, request):

        subject = request.query_params.get("subject")
        attendance_date = request.query_params.get("date")

        if not subject or not attendance_date:

            return Response(
                {
                    "detail": (
                        "subject and date query parameters are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance = get_class_attendance(
            subject_id=subject,
            attendance_date=attendance_date,
            user=request.user,
        )

        serializer = AttendanceSerializer(
            attendance,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
        