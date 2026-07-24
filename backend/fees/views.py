from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from accounts.permissions import IsStudent
from accounts.permissions import IsHOD
from .models import Fee
from .serializers import FeeSerializer
from students.models import Student
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from students.models import Student
from .serializers import CreateOrderSerializer
from .services import PaymentService
from django.core.cache import cache
from django.db.models import Sum

from accounts.permissions import IsHOD
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
        
class FeeManageListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]

    def get(self, request):
        department = request.user.hodprofile.department

        fees = Fee.objects.filter(
            department=department
        ).order_by("-created_at")

        serializer = FeeSerializer(
            fees,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = FeeSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            department=request.user.hodprofile.department
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
class FeeManageDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]

    def get_object(self, request, pk):
        return get_object_or_404(
            Fee,
            pk=pk,
            department=request.user.hodprofile.department
        )

    def put(self, request, pk):
        fee = self.get_object(request, pk)

        serializer = FeeSerializer(
            fee,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        fee = self.get_object(request, pk)

        fee.delete()

        return Response(
            {
                "message": "Fee deleted successfully."
            },
            status=status.HTTP_200_OK
        )
class PendingFeesAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = Student.objects.get(user=request.user)

        paid_fee_ids = (
            Payment.objects.filter(
                student=student,
                status=Payment.Status.PAID,
            )
            .values_list("fee_id", flat=True)
        )

        pending_fees = Fee.objects.filter(
            department=student.department,
            semester=student.semester,
            is_active=True,
        ).exclude(
            id__in=paid_fee_ids
        ).order_by("due_date")

        serializer = FeeSerializer(
            pending_fees,
            many=True,
        )

        return Response(serializer.data)
    
class FeeSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]

    def get(self, request):
        department = request.user.hodprofile.department

        cache_key = f"fee_summary_{department.id}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        total_students = Student.objects.filter(
            department=department
        ).count()

        paid_students = (
            Payment.objects.filter(
                fee__department=department,
                status=Payment.Status.PAID,
            )
            .values("student")
            .distinct()
            .count()
        )

        unpaid_students = total_students - paid_students

        total_collection = (
            Payment.objects.filter(
                fee__department=department,
                status=Payment.Status.PAID,
            ).aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )

        total_fees = Fee.objects.filter(
            department=department,
            is_active=True
        ).count()

        data = {
            "total_fees": total_fees,
            "total_students": total_students,
            "paid_students": paid_students,
            "unpaid_students": unpaid_students,
            "total_collection": str(total_collection),
        }

        cache.set(cache_key, data, timeout=600)

        return Response(data)