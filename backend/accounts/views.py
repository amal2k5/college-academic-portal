from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import AuthUserSerializer

from colleges.models import College
from college_requests.models import CollegeRegistration
from students.models import Student
from notices.models import Notice
from assignments.models import Assignment
from .models import HODProfile

import logging

logger = logging.getLogger(__name__)
from .models import User, CollegeAdminProfile
from .serializers import (
    LoginSerializer,
    CollegeAdminCreateSerializer,
    SetupPasswordSerializer,
    HODCreateSerializer,
    HODListSerializer,
    HODDetailSerializer,
    HODStatusSerializer,
    CollegeAdminListSerializer,
    CollegeAdminStatusSerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
)
from .services import (
    create_college_admin,
    generate_setup_token,
    setup_password,
    create_hod,
    generate_reset_otp,
    verify_reset_otp,
    reset_password,
)
from .tasks import send_setup_email_task, send_reset_otp_email_task
from .permissions import IsPlatformAdmin, IsCollegeAdmin
from departments.models import Department
from rest_framework.permissions import AllowAny

class PlatformDashboardStatsView(APIView):
    """
    Platform Admin Dashboard Statistics
    """

    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        data = {
            "total_colleges": College.objects.count(),

            "active_colleges": College.objects.filter(
                is_active=True
            ).count(),

            "inactive_colleges": College.objects.filter(
                is_active=False
            ).count(),

            "pending_requests": CollegeRegistration.objects.filter(
                status=CollegeRegistration.Status.PENDING
            ).count(),

            "approved_requests": CollegeRegistration.objects.filter(
                status=CollegeRegistration.Status.APPROVED
            ).count(),

            "rejected_requests": CollegeRegistration.objects.filter(
                status=CollegeRegistration.Status.REJECTED
            ).count(),
        }

        return Response(data, status=status.HTTP_200_OK)

class PublicStatsView(APIView):
    """
    Public Statistics for Landing Page
    """

    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "colleges": College.objects.count(),
            "students": Student.objects.count(),
            "departments": Department.objects.count()
        }

        return Response(data, status=status.HTTP_200_OK)
    
class LoginView(APIView):
    """Handles user login and JWT token generation."""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)

        if not user:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"message": "Your account has been deactivated. Please contact support."},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response({
    "access": str(refresh.access_token),
    "refresh": str(refresh),
    "user": AuthUserSerializer(user).data,
}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Handles user logout by blacklisting the refresh token."""

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"message": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"message": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )


class CollegeAdminCreateView(APIView):
    """Creates a new College Admin and sends setup email."""
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def post(self, request):
        serializer = CollegeAdminCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = create_college_admin(
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            email=serializer.validated_data["email"],
            college_id=serializer.validated_data["college_id"],
        )

        token = generate_setup_token(user)
        send_setup_email_task.delay(user.id, token.id)

        return Response({
            "message": "College Admin created successfully. Setup email sent.",
            "email": user.email,
            "role": user.role,
            "setup_token": str(token.token), # Consider removing token from response in prod for security
        }, status=status.HTTP_201_CREATED)


class SetupPasswordView(APIView):
    """Allows users to set their password using a setup token."""
    authentication_classes = []  # No auth needed for initial setup
    permission_classes = []

    def post(self, request):
        serializer = SetupPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            setup_password(
                serializer.validated_data["token"],
                serializer.validated_data["password"]
            )
        except ValueError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Password set successfully. You can now log in."},
            status=status.HTTP_200_OK
        )

class HODCreateView(APIView):
    """Allows College Admins to create HODs for their own college."""
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get_admin_college(self, user):
        """Helper to get the college associated with the admin."""
        try:
            return CollegeAdminProfile.objects.get(user=user).college
        except CollegeAdminProfile.DoesNotExist:
            return None

    def post(self, request):
        serializer = HODCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        admin_college = self.get_admin_college(request.user)
        if not admin_college:
            return Response(
                {"message": "Admin profile not found."},
                status=status.HTTP_403_FORBIDDEN
            )

        department_id = serializer.validated_data["department_id"]

        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response(
                {"message": "Department not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if department.college != admin_college:
            return Response(
                {"message": "You can only create HODs for your own college."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user = create_hod(
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                email=serializer.validated_data["email"],
                phone=serializer.validated_data.get("phone"),
                department_id=department_id,
            )
        except ValueError as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"HOD created successfully: {user.email}")

        token = generate_setup_token(user)
        logger.info(f"Setup token created: {token.id}")

        try:
            result = send_setup_email_task.delay(user.id, token.id)
            logger.info(f"Celery task queued successfully. Task ID: {result.id}")
        except Exception as e:
            logger.exception("Failed to queue setup email task")
            return Response(
                {
                    "message": "HOD created, but failed to queue setup email.",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "message": "HOD created successfully. Setup email sent.",
                "email": user.email,
                "role": user.role,
                "task_id": result.id,
            },
            status=status.HTTP_201_CREATED,
        )


class HODListView(APIView):
    """Lists all HODs belonging to the College Admin's college."""
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get(self, request):
        try:
            college = CollegeAdminProfile.objects.get(user=request.user).college
        except CollegeAdminProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

        hods = User.objects.filter(
            role=User.Role.HOD,
            hodprofile__department__college=college
        ).select_related('hodprofile__department')

        serializer = HODListSerializer(hods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HODDetailView(APIView):
    """Retrieves details of a specific HOD."""
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get(self, request, pk):
        try:
            college = CollegeAdminProfile.objects.get(user=request.user).college
        except CollegeAdminProfile.DoesNotExist:
            return Response(
                {"message": "Admin profile not found."},
                status=status.HTTP_403_FORBIDDEN
            )

        hod = get_object_or_404(
            User,
            pk=pk,
            role=User.Role.HOD,
            hodprofile__department__college=college,
        )

        serializer = HODDetailSerializer(hod)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HODStatusUpdateView(APIView):
    """Activates or deactivates an HOD."""
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def patch(self, request, pk):
        serializer = HODStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            college = CollegeAdminProfile.objects.get(user=request.user).college
        except CollegeAdminProfile.DoesNotExist:
            return Response(
                {"message": "Admin profile not found."},
                status=status.HTTP_403_FORBIDDEN
            )

        hod = get_object_or_404(
            User,
            pk=pk,
            role=User.Role.HOD,
            hodprofile__department__college=college,
        )

        hod.is_active = serializer.validated_data["is_active"]
        hod.save(update_fields=["is_active"])

        message = "HOD activated successfully." if hod.is_active else "HOD deactivated successfully."
        
        return Response({
            "message": message,
            "is_active": hod.is_active,
        }, status=status.HTTP_200_OK)


class CollegeAdminListView(APIView):
    """Lists all College Admins (Platform Admin view)."""
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        college_admins = User.objects.filter(
            role=User.Role.COLLEGE_ADMIN
        ).select_related("collegeadminprofile__college").order_by("first_name")

        serializer = CollegeAdminListSerializer(college_admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CollegeAdminStatusUpdateView(APIView):
    """Activates or deactivates a College Admin."""
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def patch(self, request, pk):
        serializer = CollegeAdminStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_object_or_404(
            User,
            pk=pk,
            role=User.Role.COLLEGE_ADMIN,
        )

        user.is_active = serializer.validated_data["is_active"]
        user.save(update_fields=["is_active"])

        message = "College Admin activated successfully." if user.is_active else "College Admin deactivated successfully."

        return Response({
            "message": message,
            "is_active": user.is_active,
        }, status=status.HTTP_200_OK)
    
class ForgotPasswordView(APIView):
    """
    Sends a password reset OTP to the user's email.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)

            if (
                user.is_active
                and user.role != User.Role.PLATFORM_ADMIN
            ):
                otp = generate_reset_otp(user)

                if otp:
                    send_reset_otp_email_task.delay(user.id, otp.id)

        except User.DoesNotExist:
            pass

        return Response(
            {
                "message": (
                    "If an account with this email exists, "
                    "an OTP has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )
class VerifyOTPView(APIView):
    """
    Verifies the password reset OTP.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            otp_record = verify_reset_otp(
                serializer.validated_data["email"],
                serializer.validated_data["otp"],
            )

        except ValueError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "OTP verified successfully.",
                "reset_token": str(otp_record.reset_token),
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """
    Resets the user's password after OTP verification.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            reset_password(
                serializer.validated_data["reset_token"],
                serializer.validated_data["password"],
            )

        except ValueError as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Password reset successfully. You can now log in."
            },
            status=status.HTTP_200_OK,
        )