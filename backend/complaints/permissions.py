from rest_framework.permissions import BasePermission

from accounts.permissions import (
    IsCollegeAdmin,
    IsHOD,
    IsStudent,
)

from .models import Complaint


class CanCreateComplaint(BasePermission):
    """
    Allows only students to create complaints.
    """

    def has_permission(self, request, view):
        return IsStudent().has_permission(request, view)


class CanViewDepartmentComplaint(BasePermission):
    """
    Allows HOD to view complaints
    belonging to their department.
    """

    def has_permission(self, request, view):
        return IsHOD().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Complaint):
            return False

        hod_profile = getattr(
            request.user,
            "hodprofile",
            None,
        )

        if hod_profile is None:
            return False

        return (
            obj.scope == Complaint.Scope.DEPARTMENT
            and obj.department == hod_profile.department
        )


class CanViewCollegeComplaint(BasePermission):
    """
    Allows College Admin to view
    complaints belonging to their college.
    """

    def has_permission(self, request, view):
        return IsCollegeAdmin().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Complaint):
            return False

        admin_profile = getattr(
            request.user,
            "collegeadminprofile",
            None,
        )

        if admin_profile is None:
            return False

        return (
            obj.scope == Complaint.Scope.COLLEGE
            and obj.college == admin_profile.college
        )


class CanUpdateComplaintStatus(BasePermission):
    """
    Allows HOD and College Admin
    to update complaint status.
    """

    def has_permission(self, request, view):
        return (
            IsHOD().has_permission(request, view)
            or IsCollegeAdmin().has_permission(request, view)
        )

    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Complaint):
            return False

        if IsCollegeAdmin().has_permission(request, view):
            admin_profile = getattr(
                request.user,
                "collegeadminprofile",
                None,
            )

            return (
                admin_profile is not None
                and obj.scope == Complaint.Scope.COLLEGE
                and obj.college == admin_profile.college
            )

        if IsHOD().has_permission(request, view):
            hod_profile = getattr(
                request.user,
                "hodprofile",
                None,
            )

            return (
                hod_profile is not None
                and obj.scope == Complaint.Scope.DEPARTMENT
                and obj.department == hod_profile.department
            )

        return False