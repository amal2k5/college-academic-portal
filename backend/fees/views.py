from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from students.models import Student
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from students.models import Student
from .serializers import CreateOrderSerializer
from .services import PaymentService

from .models import Fee, Payment
from .serializers import (
    FeeSerializer,
    CreateOrderSerializer,
    VerifyPaymentSerializer,
    PaymentSerializer,
)
from .services.payment_service import PaymentService



class FeeListAPIView(generics.ListAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("Authenticated:", self.request.user.email)

        student = Student.objects.get(user=self.request.user)

        print("Department:", student.department)
        print("Semester:", student.semester)

        qs = Fee.objects.filter(
            department=student.department,
            semester=student.semester,
            is_active=True,
        ).order_by("due_date")

        print("Fees found:", qs.count())

        return qs


class FeeDetailAPIView(generics.RetrieveAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    queryset = Fee.objects.filter(
        is_active=True
    )





class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            student = Student.objects.get(
                user=request.user
            )
        except Student.DoesNotExist:
            raise NotFound(
                detail="Student profile not found for this user."
            )

        result = PaymentService.create_order(
            student=student,
            fee_id=serializer.validated_data["fee_id"],
        )

        return Response(
            {
                "success": True,
                "order": result["order"],
                "amount": str(result["amount"]),
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        payment = PaymentService.verify_payment(
            user=request.user,
            **serializer.validated_data,
        )

        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_200_OK,
        )


class PaymentHistoryAPIView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student = Student.objects.get(
            user=self.request.user
        )

        return (
            Payment.objects.filter(
                student=student
            )
            .select_related(
                "fee",
                "student",
                "student__user",
            )
            .order_by("-created_at")
        )                            