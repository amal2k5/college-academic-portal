from django.db.models import Sum, Count, Q, F
from django.db.models.functions import Coalesce
from django.core.exceptions import ValidationError
from fees.models import Fee, Payment
from students.models import Student
from decimal import Decimal

class HODFeeService:
    @staticmethod
    def get_queryset(department, filters=None):
        """
        Returns a base queryset for fees belonging to the given department.
        """
        qs = Fee.objects.filter(department=department)
        
        if filters:
            semester = filters.get("semester")
            if semester:
                qs = qs.filter(semester=semester)
                
            is_active = filters.get("is_active")
            if is_active is not None:
                qs = qs.filter(is_active=(is_active.lower() == 'true'))
                
            fee_type = filters.get("fee_type")
            if fee_type:
                qs = qs.filter(fee_type=fee_type)
                
            due_date = filters.get("due_date")
            if due_date:
                qs = qs.filter(due_date=due_date)
                
            search = filters.get("search")
            if search:
                qs = qs.filter(
                    Q(title__icontains=search) |
                    Q(fee_type__icontains=search) |
                    Q(description__icontains=search)
                )
                
        return qs

    @staticmethod
    def create_fee(department, validated_data):
        """
        Creates a new fee for the department.
        """
        fee = Fee(department=department, **validated_data)
        fee.full_clean()  # Ensure model validation runs
        fee.save()
        return fee

    @staticmethod
    def update_fee(fee_id, department, validated_data):
        """
        Updates an existing fee, ensuring it belongs to the department.
        """
        try:
            fee = Fee.objects.get(id=fee_id, department=department)
        except Fee.DoesNotExist:
            raise Fee.DoesNotExist("Fee not found or you don't have permission to modify it.")
            
        for attr, value in validated_data.items():
            setattr(fee, attr, value)
            
        fee.full_clean()
        fee.save()
        return fee

    @staticmethod
    def delete_fee(fee_id, department):
        """
        Soft-deletes a fee by setting is_active=False.
        """
        try:
            fee = Fee.objects.get(id=fee_id, department=department)
        except Fee.DoesNotExist:
            raise Fee.DoesNotExist("Fee not found or you don't have permission to delete it.")
            
        fee.is_active = False
        fee.save(update_fields=['is_active'])
        return fee

    @staticmethod
    def get_fee_stats(department):
        """
        Returns aggregated statistics for the department's fees without N+1 queries.
        """
        fees = Fee.objects.filter(department=department)
        
        # 1. Base fee aggregations
        fee_aggs = fees.aggregate(
            total_fees=Count('id'),
            active_fees=Count('id', filter=Q(is_active=True)),
            inactive_fees=Count('id', filter=Q(is_active=False)),
        )
        
        # 2. Payment aggregations
        # Join fees with their payments
        payment_aggs = Payment.objects.filter(fee__department=department).aggregate(
            total_paid_amount=Coalesce(Sum('amount', filter=Q(status=Payment.Status.PAID)), Decimal('0.00')),
            paid_students=Count('student', filter=Q(status=Payment.Status.PAID), distinct=True),
            late_payments=Count('id', filter=Q(status=Payment.Status.PAID, late_fee_applied=True)),
        )
        
        # 3. Calculate expected total potential amount & pending students
        # For each fee, all students in that department and semester are expected to pay.
        # This requires aggregating (students in dept+sem * fee amount)
        
        total_unpaid_amount = Decimal('0.00')
        pending_students = set()
        
        # We can iterate through active fees to calculate the unpaid portion, 
        # using a single query to get the paid students for each fee.
        # Note: In a massive database, this might be optimized further, but for typical ERP 
        # iterating through department fees is efficient enough.
        
        active_fees = fees.filter(is_active=True)
        paid_students_count = 0
        total_students_expected = 0
        
        for fee in active_fees:
            # All eligible students in this department and semester
            eligible_students = Student.objects.filter(
                department=department, 
                semester=fee.semester
            )
            total_expected_for_fee = eligible_students.count()
            total_students_expected += total_expected_for_fee
            
            # Paid students for this fee
            paid_for_fee = Payment.objects.filter(
                fee=fee, status=Payment.Status.PAID
            ).values_list('student_id', flat=True)
            
            paid_students_count += len(paid_for_fee)
            
            # Find unpaid students for this fee
            unpaid_student_ids = set(eligible_students.values_list('id', flat=True)) - set(paid_for_fee)
            
            # Update aggregates
            total_unpaid_amount += (len(unpaid_student_ids) * fee.amount)
            pending_students.update(unpaid_student_ids)
            
        payment_percentage = 0.0
        if total_students_expected > 0:
            payment_percentage = (paid_students_count / total_students_expected) * 100
            
        return {
            'total_fees': fee_aggs['total_fees'],
            'active_fees': fee_aggs['active_fees'],
            'inactive_fees': fee_aggs['inactive_fees'],
            'total_paid_amount': payment_aggs['total_paid_amount'],
            'total_unpaid_amount': total_unpaid_amount,
            'paid_students': payment_aggs['paid_students'],
            'pending_students': len(pending_students),
            'late_payments': payment_aggs['late_payments'],
            'payment_percentage': round(payment_percentage, 2),
        }
