from rest_framework.permissions import BasePermission

class IsHOD(BasePermission):
    """
    Custom permission to only allow users with the 'HOD' role to access the view.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == 'HOD'
        )
