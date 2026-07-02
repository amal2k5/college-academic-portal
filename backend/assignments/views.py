from django.shortcuts import get_object_or_404

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from accounts.models import User
from students.models import Student

from .models import Assignment
from .serializers import AssignmentSerializer
from .filters import AssignmentFilter

class AssignmentListCreateView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):

        user = request.user

        if user.role == User.Role.HOD:

            department = user.hodprofile.department

            assignments = (
                Assignment.objects.filter(
                    department=department
                )
                .select_related(
                    "department",
                    "created_by"
                )
                .order_by(
                    "deadline"
                )
            )

        elif user.role == User.Role.STUDENT:

            student = get_object_or_404(
                Student,
                user=user
            )

            assignments = (
                Assignment.objects.filter(
                    department=student.department,
                    target_year=student.year
                )
                .select_related(
                    "department",
                    "created_by"
                )
                .order_by(
                    "deadline"
                )
            )

        else:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        assignment_filter = AssignmentFilter(
            request.GET,
            queryset=assignments
        )

        serializer = AssignmentSerializer(
            assignment_filter.qs,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        user = request.user

        if user.role != User.Role.HOD:

            return Response(
                {
                    "detail": "Only HOD can create assignments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AssignmentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        department = user.hodprofile.department

        serializer.save(
            department=department,
            created_by=user,
        )

        return Response(
            AssignmentSerializer(
                serializer.instance
            ).data,
            status=status.HTTP_201_CREATED
        )
class AssignmentDetailView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, request, pk):

        user = request.user

        if user.role == User.Role.HOD:

            department = user.hodprofile.department

            return get_object_or_404(
                Assignment.objects.select_related(
                    "department",
                    "created_by"
                ),
                pk=pk,
                department=department
            )

        elif user.role == User.Role.STUDENT:

            student = get_object_or_404(
                Student,
                user=user
            )

            return get_object_or_404(
                Assignment.objects.select_related(
                    "department",
                    "created_by"
                ),
                pk=pk,
                department=student.department,
                target_year=student.year
            )

        return None

    def get(self, request, pk):

        assignment = self.get_object(
            request,
            pk
        )

        if assignment is None:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AssignmentSerializer(
            assignment
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        assignment = self.get_object(
            request,
            pk
        )

        if assignment is None:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        user = request.user

        if user.role != User.Role.HOD:

            return Response(
                {
                    "detail": "Only HOD can update assignments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if assignment.created_by != user:

            return Response(
                {
                    "detail": "You can update only your own assignments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AssignmentSerializer(
            assignment,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            department=assignment.department,
            created_by=assignment.created_by,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):

        assignment = self.get_object(
            request,
            pk
        )

        if assignment is None:

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        user = request.user

        if user.role != User.Role.HOD:

            return Response(
                {
                    "detail": "Only HOD can delete assignments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if assignment.created_by != user:

            return Response(
                {
                    "detail": "You can delete only your own assignments."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        assignment.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )