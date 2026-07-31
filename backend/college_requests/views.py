from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import CollegeRegistration
from .serializers import CollegeRegistrationSerializer
from .services import (
    approve_registration,
    reject_registration,
)
from accounts.permissions import IsPlatformAdmin
from notifications.services import notify_platform_admins


class CollegeRegistrationCreateView(APIView):
    """
    Public API
    Submit a college registration request.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = CollegeRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            notify_platform_admins(message="A new college registration request has been submitted.")

            return Response(
                {
                    "message": "College registration request submitted successfully."
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Validation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class CollegeRegistrationListView(APIView):
    """
    Platform Admin API
    List all registration requests.
    """

    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        queryset = CollegeRegistration.objects.all().order_by("-created_at")

        status_filter = request.query_params.get("status")

        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())

        paginator = PageNumberPagination()
        paginator.page_size = 10

        result_page = paginator.paginate_queryset(
            queryset,
            request
        )

        serializer = CollegeRegistrationSerializer(
            result_page,
            many=True
        )

        return paginator.get_paginated_response(serializer.data)


class CollegeRegistrationDetailView(APIView):
    """
    Platform Admin API
    Retrieve a single registration request.
    """

    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request, pk):
        registration = get_object_or_404(
            CollegeRegistration,
            pk=pk
        )

        serializer = CollegeRegistrationSerializer(registration)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ApproveCollegeRegistrationView(APIView):
    """
    Platform Admin API
    Approve a college registration request.
    """

    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def patch(self, request, pk):
        registration = get_object_or_404(
            CollegeRegistration,
            pk=pk
        )

        try:
            approve_registration(
                registration=registration,
                approved_by=request.user
            )

            return Response(
                {
                    "message": "College registration approved successfully.",
                    "status": registration.status,
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "message": "An error occurred while approving the registration.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RejectCollegeRegistrationView(APIView):
    """
    Platform Admin API
    Reject a college registration request.
    """

    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def patch(self, request, pk):
        registration = get_object_or_404(
            CollegeRegistration,
            pk=pk
        )

        reason = request.data.get("reason", "")

        try:
            reject_registration(
                registration=registration,
                rejected_by=request.user,
                reason=reason,
            )

            return Response(
                {
                    "message": "College registration rejected successfully.",
                    "status": registration.status,
                    "reason": registration.rejection_reason,
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "message": "An error occurred while rejecting the registration.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

