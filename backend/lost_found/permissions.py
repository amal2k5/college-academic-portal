from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Allow everyone to view posts.
    Only the owner can edit or delete the post.
    """

    def has_object_permission(self, request, view, obj):

        # Allow read-only requests
        if request.method in SAFE_METHODS:
            return True

        # User must be authenticated
        if not request.user.is_authenticated:
            return False

        # Only the owner can update/delete
        return obj.student.user == request.user


class IsStudent(BasePermission):
    """
    Allow access only to authenticated students.
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return request.user.role == request.user.Role.STUDENT


class IsModerator(BasePermission):
    """
    Allow Platform Admin, College Admin and HOD to moderate posts.
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        allowed_roles = [
            request.user.Role.PLATFORM_ADMIN,
            request.user.Role.COLLEGE_ADMIN,
            request.user.Role.HOD,
        ]

        return request.user.role in allowed_roles