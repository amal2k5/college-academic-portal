from django.contrib.auth import authenticate

from rest_framework import status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore

from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

from .serializers import LoginSerializer


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
                    "message":
                    "Invalid credentials"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(
            user
        )

        return Response(
            {
                "access":
                str(refresh.access_token),

                "refresh":
                str(refresh),

                "email":
                user.email,

                "first_name":
                user.first_name,

                "last_name":
                user.last_name,

                "role":
                user.role,
            },
            status=status.HTTP_200_OK
        )