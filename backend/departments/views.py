from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsCollegeAdmin
from .models import Department
from accounts.models import CollegeAdminProfile
from .serializers import *


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
                is_active=True
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