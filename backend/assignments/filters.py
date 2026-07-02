import django_filters

from .models import Assignment


class AssignmentFilter(django_filters.FilterSet):

    class Meta:
        model = Assignment
        fields = [
            "subject",
            "target_year",
        ]