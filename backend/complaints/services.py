from django.core.cache import cache
from django.db.models import Count, Q

from .models import Complaint, ComplaintStatusHistory


def create_complaint(validated_data):
    """
    Create a new anonymous complaint.

    - Department complaints:
        Automatically assign the college from the department.
    - College complaints:
        College must already be present in validated_data
        (usually assigned in the view).
    """

    department = validated_data.get("department")
    scope = validated_data.get("scope")

    if scope == Complaint.Scope.DEPARTMENT:
        if department is None:
            raise ValueError(
                "Department is required for department complaints."
            )

        validated_data["college"] = department.college

    complaint = Complaint.objects.create(**validated_data)

    # Clear dashboard cache
    if complaint.scope == Complaint.Scope.COLLEGE:
        cache.delete(
            f"complaint_dashboard_college_{complaint.college.id}"
        )
        cache.delete(
            f"college_complaint_count_{complaint.college.id}"
        )

    elif complaint.scope == Complaint.Scope.DEPARTMENT:
        cache.delete(
            f"complaint_dashboard_department_{complaint.department.id}"
        )
        cache.delete(
            f"hod_complaint_count_{complaint.department.id}"
        )

    return complaint


def get_complaint_by_tracking_code(tracking_code):
    return (
        Complaint.objects
        .select_related("college", "department")
        .prefetch_related("status_history__changed_by")
        .filter(tracking_code=tracking_code)
        .first()
    )


def get_department_complaints(department):
    return (
        Complaint.objects
        .filter(
            scope=Complaint.Scope.DEPARTMENT,
            department=department,
        )
        .select_related("college", "department")
        .order_by("-created_at")
    )


def get_college_complaints(college):
    return (
        Complaint.objects
        .filter(
            scope=Complaint.Scope.COLLEGE,
            college=college,
        )
        .select_related("college", "department")
        .order_by("-created_at")
    )


def update_complaint_status(
    complaint,
    status,
    changed_by,
    note="",
    resolution_note="",
):
    old_status = complaint.status

    complaint.status = status

    if resolution_note:
        complaint.resolution_note = resolution_note

    complaint.save(
        update_fields=[
            "status",
            "resolution_note",
            "updated_at",
        ]
    )

    ComplaintStatusHistory.objects.create(
        complaint=complaint,
        old_status=old_status,
        new_status=status,
        changed_by=changed_by,
        note=note,
    )

    if complaint.scope == Complaint.Scope.COLLEGE:
        cache.delete(
            f"complaint_dashboard_college_{complaint.college.id}"
        )
        cache.delete(
            f"college_complaint_count_{complaint.college.id}"
        )

    elif complaint.scope == Complaint.Scope.DEPARTMENT:
        cache.delete(
            f"complaint_dashboard_department_{complaint.department.id}"
        )
        cache.delete(
            f"hod_complaint_count_{complaint.department.id}"
        )

    return complaint


def get_dashboard_statistics(queryset):
    status_counts = queryset.aggregate(
        total=Count("id"),
        submitted=Count(
            "id",
            filter=Q(status=Complaint.Status.SUBMITTED),
        ),
        seen=Count(
            "id",
            filter=Q(status=Complaint.Status.SEEN),
        ),
        resolved=Count(
            "id",
            filter=Q(status=Complaint.Status.RESOLVED),
        ),
    )

    category_counts = dict(
        queryset.values_list("category").annotate(
            count=Count("id")
        )
    )

    department_counts = dict(
        queryset.exclude(
            department__isnull=True
        ).values_list(
            "department__name"
        ).annotate(
            count=Count("id")
        )
    )

    return {
        **status_counts,
        "categories": category_counts,
        "departments": department_counts,
    }


def get_hod_complaint_count(department):
    cache_key = f"hod_complaint_count_{department.id}"

    count = cache.get(cache_key)

    if count is None:
        count = Complaint.objects.filter(
            scope=Complaint.Scope.DEPARTMENT,
            department=department,
        ).count()

        cache.set(cache_key, count, timeout=300)

    return count


def get_college_complaint_count(college):
    cache_key = f"college_complaint_count_{college.id}"

    count = cache.get(cache_key)

    if count is None:
        count = Complaint.objects.filter(
            scope=Complaint.Scope.COLLEGE,
            college=college,
        ).count()

        cache.set(cache_key, count, timeout=300)

    return count