from rest_framework.permissions import BasePermission


class InventoryPermission(BasePermission):
    """Allow authenticated users to read, staff to write, and admins to delete."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        if request.method == "DELETE":
            return user.is_superuser
        return user.is_staff
