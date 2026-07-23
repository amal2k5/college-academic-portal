from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .throttles import ComplaintSubmissionThrottle
from .filters import ComplaintFilter
from .models import Complaint
from django.core.cache import cache
from .permissions import (
    CanCreateComplaint,
    CanViewCollegeComplaint,
    CanViewDepartmentComplaint,
    CanUpdateComplaintStatus,
)
from .serializers import (
    ComplaintCreateSerializer,
    ComplaintDashboardSerializer,
    ComplaintDetailSerializer,
    ComplaintListSerializer,
    ComplaintStatusUpdateSerializer,
    ComplaintTrackingSerializer,
)
from .services import (
    create_complaint,
    get_college_complaints,
    get_complaint_by_tracking_code,
    get_dashboard_statistics,
    get_department_complaints,
    update_complaint_status,
)


class ComplaintPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ComplaintCreateView(APIView):
    """
    Create a new anonymous complaint.
    Only students can submit complaints.
    """

    permission_classes = [CanCreateComplaint]
    throttle_classes = [ComplaintSubmissionThrottle]

    def post(self, request):
        serializer = ComplaintCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        student = request.user.student_profile

        if validated_data["scope"] == Complaint.Scope.COLLEGE:
            validated_data["college"] = (
                student.department.college
            )

        elif validated_data["scope"] == Complaint.Scope.DEPARTMENT:
            validated_data["department"] = (
                student.department
            )
            validated_data["college"] = (
                student.department.college
            )

        complaint = create_complaint(validated_data)

        return Response(
            {
                "message": "Complaint submitted successfully.",
                "tracking_code": complaint.tracking_code,
                "data": ComplaintDetailSerializer(
                    complaint
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

class ComplaintTrackView(APIView):
    """
    Track complaint by tracking code.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tracking_code = request.query_params.get(
            "tracking_code"
        )

        if not tracking_code:
            return Response(
                {
                    "detail": (
                        "tracking_code query parameter "
                        "is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        complaint = get_complaint_by_tracking_code(
            tracking_code
        )

        if complaint is None:
            return Response(
                {
                    "detail": "Complaint not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ComplaintTrackingSerializer(
            complaint
        )

        return Response(serializer.data)


class DepartmentComplaintListView(
    generics.ListAPIView
):
    """
    List department complaints for HOD.
    """

    serializer_class = ComplaintListSerializer

    permission_classes = [
        CanViewDepartmentComplaint,
    ]

    pagination_class = ComplaintPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_class = ComplaintFilter

    ordering_fields = [
        "created_at",
        "updated_at",
        "status",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        department = (
            self.request.user
            .hodprofile
            .department
        )

        return get_department_complaints(
            department
        )
        
class CollegeComplaintListView(generics.ListAPIView):
    """
    List all college-level complaints
    for the College Admin.
    """

    serializer_class = ComplaintListSerializer

    permission_classes = [
        CanViewCollegeComplaint,
    ]

    pagination_class = ComplaintPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_class = ComplaintFilter

    ordering_fields = [
        "created_at",
        "updated_at",
        "status",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        college = (
            self.request.user
            .collegeadminprofile
            .college
        )

        return get_college_complaints(
            college
        )


class ComplaintStatusUpdateView(APIView):
    """
    Update complaint status.
    """

    permission_classes = [
        CanUpdateComplaintStatus,
    ]

    def patch(self, request, pk):
        try:
            complaint = (
                Complaint.objects
                .select_related(
                    "college",
                    "department",
                )
                .get(pk=pk)
            )

        except Complaint.DoesNotExist:
            return Response(
                {
                    "detail": "Complaint not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            complaint,
        )

        serializer = ComplaintStatusUpdateSerializer(
            data=request.data,
            context={
                "complaint": complaint,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        complaint = update_complaint_status(
            complaint=complaint,
            status=serializer.validated_data[
                "status"
            ],
            changed_by=request.user,
            note=serializer.validated_data.get(
                "note",
                "",
            ),
            resolution_note=serializer.validated_data.get(
                "resolution_note",
                "",
            ),
        )

        return Response(
            ComplaintDetailSerializer(
                complaint
            ).data
        )


class ComplaintDashboardView(APIView):
    """
    Complaint dashboard statistics.
    Supports both HOD and College Admin.
    Cached for 5 minutes using Redis.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    CACHE_TIMEOUT = 60 * 5  # 5 minutes

    def get(self, request):

        if hasattr(request.user, "collegeadminprofile"):

            college = request.user.collegeadminprofile.college

            cache_key = (
                f"complaint_dashboard_college_{college.id}"
            )

            queryset = get_college_complaints(college)

        elif hasattr(request.user, "hodprofile"):

            department = request.user.hodprofile.department

            cache_key = (
                f"complaint_dashboard_department_{department.id}"
            )

            queryset = get_department_complaints(department)

        else:
            raise PermissionDenied(
                "You do not have permission to view this dashboard."
            )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(
                cached_data,
                status=status.HTTP_200_OK,
            )

        stats = get_dashboard_statistics(queryset)

        serializer = ComplaintDashboardSerializer(
            instance=stats
        )

        cache.set(
            cache_key,
            serializer.data,
            timeout=self.CACHE_TIMEOUT,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )