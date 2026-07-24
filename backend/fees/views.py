from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Exists, OuterRef, Subquery, CharField, DateTimeField

from students.models import Student
from .models import Fee, Payment
from .serializers import (
    FeeSerializer,
    CreateOrderSerializer,
    VerifyPaymentSerializer,
    PaymentSerializer,
    FeeListSerializer,
    FeeDetailSerializer,
    FeeCreateSerializer,
    FeeUpdateSerializer,
    FeeStatsSerializer
)
from .services.payment_service import PaymentService
from .services.hod_fee_service import HODFeeService
from .services.reminder_service import ReminderService
from .permissions import IsHOD


class FeeListAPIView(generics.ListAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student = Student.objects.get(user=self.request.user)
        
        student_payment = Payment.objects.filter(
            fee=OuterRef('pk'),
            student=student,
            status=Payment.Status.PAID
        )

        return Fee.objects.filter(
            department=student.department,
            is_active=True,
        ).annotate(
            is_paid=Exists(student_payment),
            paid_at=Subquery(student_payment.values('paid_at')[:1], output_field=DateTimeField())
        ).order_by("due_date")


class FeeDetailAPIView(generics.RetrieveAPIView):
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student = Student.objects.get(user=self.request.user)
        
        student_payment = Payment.objects.filter(
            fee=OuterRef('pk'),
            student=student,
            status=Payment.Status.PAID
        )

        return Fee.objects.filter(
            is_active=True
        ).annotate(
            is_paid=Exists(student_payment),
            paid_at=Subquery(student_payment.values('paid_at')[:1], output_field=DateTimeField())
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


class HODFeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for HOD to manage fees for their department.
    """
    permission_classes = [IsAuthenticated, IsHOD]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['semester', 'is_active', 'fee_type', 'due_date']
    search_fields = ['title', 'fee_type', 'description']
    ordering_fields = ['created_at', 'due_date', 'amount']
    ordering = ['-created_at']

    def get_department(self):
        try:
            return self.request.user.hodprofile.department
        except AttributeError:
            raise PermissionDenied("You do not have an associated HOD profile or department.")

    def get_queryset(self):
        return HODFeeService.get_queryset(self.get_department(), self.request.query_params)

    def get_serializer_class(self):
        if self.action == 'list':
            return FeeListSerializer
        elif self.action == 'create':
            return FeeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return FeeUpdateSerializer
        return FeeDetailSerializer

    def perform_create(self, serializer):
        # We don't save via serializer directly because service layer handles it
        pass

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fee = HODFeeService.create_fee(self.get_department(), serializer.validated_data)
        return Response(FeeDetailSerializer(fee).data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        pass

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        fee = HODFeeService.update_fee(instance.id, self.get_department(), serializer.validated_data)
        return Response(FeeDetailSerializer(fee).data)

    def perform_destroy(self, instance):
        pass

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        HODFeeService.delete_fee(instance.id, self.get_department())
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = HODFeeService.get_fee_stats(self.get_department())
        serializer = FeeStatsSerializer(stats)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def remind(self, request, pk=None):
        ReminderService.trigger_reminders(pk, self.get_department())
        return Response({"detail": "Reminders have been dispatched successfully."})

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        fee = self.get_object()
        
        payments = Payment.objects.filter(
            fee=fee, status=Payment.Status.PAID
        ).select_related('student', 'student__user').order_by('-paid_at')
        
        paid_student_ids = payments.values_list('student_id', flat=True)
        
        # Fixed: Removed is_active filter since it doesn't exist on Student model
        # If you want to exclude deactivated users, use user__is_active instead
        pending_students = Student.objects.filter(
            department=fee.department,
            semester=fee.semester,
            # Option 1: No user active filter
            # Option 2: Uncomment below to filter by active user accounts
            # user__is_active=True
        ).exclude(id__in=paid_student_ids).select_related('user')
        
        paid_data = [
            {
                "student_id": p.student.id,
                "roll_number": p.student.roll_number,
                "name": f"{p.student.user.first_name} {p.student.user.last_name}".strip(),
                "amount": str(p.amount),
                "paid_at": p.paid_at,
                "receipt_number": p.receipt_number,
                "status": p.status
            } for p in payments
        ]
        
        pending_data = [
            {
                "student_id": s.id,
                "roll_number": s.roll_number,
                "name": f"{s.user.first_name} {s.user.last_name}".strip(),
                "department": s.department.name,
                "semester": s.semester
            } for s in pending_students
        ]
        
        return Response({
            "fee_id": fee.id,
            "title": fee.title,
            "total_paid": len(paid_data),
            "total_pending": len(pending_data),
            "paid_students": paid_data,
            "pending_students": pending_data
        })