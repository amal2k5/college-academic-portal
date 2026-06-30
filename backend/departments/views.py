from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsCollegeAdmin
from .models import Department
from accounts.models import CollegeAdminProfile
from .serializers import *
from rest_framework.decorators import action
from rest_framework import status
from django.shortcuts import get_object_or_404


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsCollegeAdmin
from accounts.models import CollegeAdminProfile

from .models import Department
from .serializers import DepartmentSerializer


class DepartmentViewSet(
    viewsets.ModelViewSet
):
    
    queryset = Department.objects.all()


    serializer_class = (
        DepartmentSerializer
    )

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def get_queryset(
        self
    ):

        college = (
            CollegeAdminProfile.objects
            .select_related("college")
            .get(
                user=self.request.user
            )
            .college
        )

        return (
            Department.objects
            .filter(
                college=college
            )
            .order_by("name")
        )

    def perform_create(
        self,
        serializer
    ):

        college = (
            CollegeAdminProfile.objects
            .select_related("college")
            .get(
                user=self.request.user
            )
            .college
        )

        serializer.save(
            college=college
        )
    

    
class CollegeDepartmentListView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def get(
        self,
        request
    ):

        college = (
            CollegeAdminProfile.objects
            .select_related("college")
            .get(
                user=request.user
            )
            .college
        )

        departments = (
            Department.objects
            .filter(
                college=college,
            )
            .order_by("name")
        )

        serializer = (
            DepartmentListSerializer(
                departments,
                many=True
            )
        )

        return Response(
            serializer.data
        )    
        
        
class DepartmentDetailView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def get(self, request, pk):

        college = (
            CollegeAdminProfile.objects
            .select_related("college")
            .get(user=request.user)
            .college
        )

        department = get_object_or_404(
            Department,
            pk=pk,
            college=college
        )

        serializer = DepartmentDetailSerializer(
            department
        )

        return Response(serializer.data)        
    
    
class DepartmentStatusUpdateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def patch(self, request, pk):

        college = (
            CollegeAdminProfile.objects
            .select_related("college")
            .get(user=request.user)
            .college
        )

        department = get_object_or_404(
            Department,
            pk=pk,
            college=college,
        )

        is_active = request.data.get("is_active")

        if is_active is None:
            return Response(
                {
                    "message": "is_active field is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        department.is_active = is_active
        department.save(update_fields=["is_active"])

        return Response(
            {
                "message": (
                    "Department activated successfully."
                    if department.is_active
                    else "Department deactivated successfully."
                ),
                "is_active": department.is_active,
            },
            status=status.HTTP_200_OK,
        )    