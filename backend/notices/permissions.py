from rest_framework.permissions import BasePermission

from accounts.models import User


class IsNoticeOwner(BasePermission):
    """
    Only the creator of the notice can update/delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.posted_by == request.user


class IsDepartmentNoticeOwner(BasePermission):
    """
    HOD can manage only notices belonging to their department.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role != User.Role.HOD:
            return False

        return (
            obj.posted_by == request.user
            and obj.department == request.user.hodprofile.department
        )