from django.contrib.auth import authenticate

from rest_framework import status  # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.views import APIView  # type: ignore

from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore

from .serializers import (
    LoginSerializer,
    CollegeAdminCreateSerializer,
)

from .services import (
    create_college_admin,
    generate_setup_token,
    send_setup_email,
)


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