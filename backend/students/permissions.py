from rest_framework.permissions import BasePermission

from accounts.models import User


class IsHOD(BasePermission):

    message = "Only HOD users can perform this action."

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and
            request.user.role == User.Role.HOD
        )


class IsStudent(BasePermission):

    message = "Only Student users can perform this action."

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and
            request.user.role == User.Role.STUDENT
        )