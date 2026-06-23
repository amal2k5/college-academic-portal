from django.contrib.auth import authenticate
from .serializers import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    CollegeAdminCreateSerializer,
    SetupPasswordSerializer,
)

from .services import (
    create_college_admin,
    generate_setup_token,
    send_setup_email,
    setup_password,
)
from rest_framework.permissions import IsAuthenticated

from .permissions import (
    IsCollegeAdmin,
)

from .serializers import (
    LoginSerializer,
    CollegeAdminCreateSerializer,
    SetupPasswordSerializer,
    HODCreateSerializer,
)

from .services import (
    create_college_admin,
    generate_setup_token,
    send_setup_email,
    setup_password,
    create_hod,
)

from .models import (
    CollegeAdminProfile,
)

from departments.models import Department


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data[
            "email"
        ]

        password = serializer.validated_data[
            "password"
        ]

        user = authenticate(
            request,
            email=email,
            password=password
        )

        if not user:

            return Response(
                {
                    "message": "Invalid credentials"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(
            user
        )

        return Response(
            {
                "access": str(
                    refresh.access_token
                ),
                "refresh": str(
                    refresh
                ),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
            status=status.HTTP_200_OK
        )


class LogoutView(APIView):

    def post(self, request):

        try:

            refresh_token = request.data[
                "refresh"
            ]

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

            return Response(
                {
                    "message":
                    "Logout successful"
                },
                status=status.HTTP_200_OK
            )

        except Exception:

            return Response(
                {
                    "message":
                    "Invalid token"
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class CollegeAdminCreateView(
    APIView
):

    def post(
        self,
        request
    ):

        serializer = (
            CollegeAdminCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = create_college_admin(
            first_name=serializer.validated_data[
                "first_name"
            ],
            last_name=serializer.validated_data[
                "last_name"
            ],
            email=serializer.validated_data[
                "email"
            ],
            college_id=serializer.validated_data[
                "college_id"
            ],
        )

        token = generate_setup_token(
            user
        )

        send_setup_email(
            user,
            token
        )

        return Response(
            {
                "message":
                "College Admin created successfully",

                "email":
                user.email,

                "role":
                user.role,

                "setup_token":
                str(token.token),
            },
            status=status.HTTP_201_CREATED,
        )


class SetupPasswordView(
    APIView
):

    def post(
        self,
        request
    ):

        serializer = (
            SetupPasswordSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            setup_password(
                serializer.validated_data[
                    "token"
                ],
                serializer.validated_data[
                    "password"
                ]
            )

        except ValueError as e:

            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message":
                "Password set successfully"
            },
            status=status.HTTP_200_OK
        )
class HODCreateView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def post(
        self,
        request
    ):

        serializer = (
            HODCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        college_admin_profile = (
            CollegeAdminProfile.objects.get(
                user=request.user
            )
        )

        department = Department.objects.get(
            id=serializer.validated_data[
                "department_id"
            ]
        )

        if (
            department.college
            !=
            college_admin_profile.college
        ):

            return Response(
                {
                    "message":
                    "You can only create HODs for your own college."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            user = create_hod(
                first_name=serializer.validated_data[
                    "first_name"
                ],
                last_name=serializer.validated_data[
                    "last_name"
                ],
                email=serializer.validated_data[
                    "email"
                ],
                phone=serializer.validated_data[
                    "phone"
                ],
                department_id=serializer.validated_data[
                    "department_id"
                ],
            )

        except ValueError as e:

            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token = generate_setup_token(
            user
        )

        send_setup_email(
            user,
            token
        )

        return Response(
            {
                "message":
                "HOD created successfully",

                "email":
                user.email,

                "role":
                user.role,

                "setup_token":
                str(token.token),
            },
            status=status.HTTP_201_CREATED,
        )
        
        
class HODListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsCollegeAdmin,
    ]

    def get(self, request):

        college = (
            CollegeAdminProfile.objects.get(
                user=request.user
            ).college
        )

        hods = User.objects.filter(
            role=User.Role.HOD,
            hodprofile__department__college=college
        )

        serializer = HODListSerializer(
            hods,
            many=True
        )

        return Response(serializer.data)    
    
    
class CollegeAdminListView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(
        self,
        request
    ):

        college_admins = (
            User.objects.filter(
                role=User.Role.COLLEGE_ADMIN
            )
            .select_related(
                "collegeadminprofile__college"
            )
            .order_by(
                "first_name"
            )
        )

        serializer = (
            CollegeAdminListSerializer(
                college_admins,
                many=True
            )
        )

        return Response(
            serializer.data
        )        