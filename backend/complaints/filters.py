import django_filters

from .models import Complaint


class ComplaintFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        field_name="status",
        choices=Complaint.Status.choices,
        lookup_expr="exact",
        label="Complaint Status",
    )

    category = django_filters.ChoiceFilter(
        field_name="category",
        choices=Complaint.Category.choices,
        lookup_expr="exact",
        label="Complaint Category",
    )

    scope = django_filters.ChoiceFilter(
        field_name="scope",
        choices=Complaint.Scope.choices,
        lookup_expr="exact",
        label="Complaint Scope",
    )

    college = django_filters.NumberFilter(
        field_name="college__id",
        lookup_expr="exact",
        label="College ID",
    )

    department = django_filters.NumberFilter(
        field_name="department__id",
        lookup_expr="exact",
        label="Department ID",
    )

    tracking_code = django_filters.CharFilter(
        field_name="tracking_code",
        lookup_expr="icontains",
        label="Tracking Code",
    )

    created_after = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
        label="Created After",
    )

    created_before = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
        label="Created Before",
    )

    ordering = django_filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("updated_at", "updated_at"),
            ("status", "status"),
        )
    )

    class Meta:
        model = Complaint

        fields = [
            "status",
            "category",
            "scope",
            "college",
            "department",
            "tracking_code",
        ]