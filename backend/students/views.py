from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Student
from .serializers import (
    StudentSerializer,
    StudentCreateSerializer,
)
from .services import create_student
from .permissions import (
    IsHOD,
    IsStudent,
)


class StudentCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def post(self, request):

        serializer = StudentCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        student = create_student(
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            email=serializer.validated_data["email"],
            phone=serializer.validated_data["phone"],
            date_of_birth=serializer.validated_data["date_of_birth"],
            gender=serializer.validated_data["gender"],
            parent_name=serializer.validated_data["parent_name"],
            parent_phone=serializer.validated_data["parent_phone"],
            roll_number=serializer.validated_data["roll_number"],
            admission_number=serializer.validated_data["admission_number"],
            semester=serializer.validated_data["semester"],
            academic_year=serializer.validated_data["academic_year"],
            department=request.user.hodprofile.department,
            year=serializer.validated_data["year"],
        )

        return Response(
            {
                "message": "Student created successfully",
                "student_id": student.id,
                "email": student.user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class StudentListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def get(self, request):

        students = Student.objects.filter(
            department=request.user.hodprofile.department
        ).select_related(
            "user",
            "department",
            "department__college"
        )

        search = request.GET.get("search")

        if search:

            students = students.filter(
                Q(user__first_name__icontains=search)
                |
                Q(user__last_name__icontains=search)
                |
                Q(user__email__icontains=search)
                |
                Q(roll_number__icontains=search)
                |
                Q(admission_number__icontains=search)
            )

        semester = request.GET.get("semester")

        if semester:

            students = students.filter(
                semester=semester
            )

        gender = request.GET.get("gender")

        if gender:

            students = students.filter(
                gender=gender
            )
        
        for s in students:
            print(
        "LIST:",
        s.id,
        s.phone,
        s.gender
    )    

        serializer = StudentSerializer(
            students,
            many=True
        )

        return Response(
            {
                "count": students.count(),
                "results": serializer.data,
            }
        )


class StudentDetailView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def get(self, request, pk):

        try:

            student = Student.objects.select_related(
                "user",
                "department",
                "department__college"
            ).get(
                id=pk,
                department=request.user.hodprofile.department
            )

        except Student.DoesNotExist:

            return Response(
                {
                    "message": "Student not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = StudentSerializer(
            student
        )

        return Response(
            serializer.data
        )


class StudentUpdateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]


    def put(
        self,
        request,
        pk
    ):
        print("REQUEST DATA:", request.data)

    def put(self, request, pk):


        try:

            student = Student.objects.get(
                id=pk,
                department=request.user.hodprofile.department
            )

        except Student.DoesNotExist:

            return Response(
                {
                    "message": "Student not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        student.phone = request.data.get(
            "phone",
            student.phone
        )

        student.parent_phone = request.data.get(
            "parent_phone",
            student.parent_phone
        )

        student.parent_name = request.data.get(
            "parent_name",
            student.parent_name
        )

        student.semester = request.data.get(
            "semester",
            student.semester
        )

        student.academic_year = request.data.get(
            "academic_year",
            student.academic_year
        )
        print("BEFORE SAVE:", student.phone)
        student.save()
        student.refresh_from_db()
        print("DB VALUE:", student.phone)
 

        return Response(
            {
                "message": "Student updated successfully"
            }
        )


class StudentDeleteView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def delete(self, request, pk):

        try:

            student = Student.objects.get(
                id=pk,
                department=request.user.hodprofile.department
            )

        except Student.DoesNotExist:

            return Response(
                {
                    "message": "Student not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        student.delete()

        return Response(
            {
                "message": "Student deleted successfully"
            },
            status=status.HTTP_200_OK
        )


class StudentProfileView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsStudent,
    ]

    def get(self, request):
        student = (
            Student.objects.select_related(
                "user",
                "department",
                "department__college",
            )
            .filter(user=request.user)
            .first()
        )

        if not student:
            return Response(
                {
                    "message": "No student profile is linked to this account. Please contact your administrator."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HODDashboardStatsView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsHOD,
    ]

    def get(self, request):

        department = request.user.hodprofile.department

        total_students = Student.objects.filter(
            department=department
        ).count()

        return Response(
    {
        "total_students": total_students,
        "department_name": department.name,
        "college_name": department.college.name,
        "hod_name": f"{request.user.first_name} {request.user.last_name}".strip(),
    }
        )