from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from inventory.models import CompanyMembership, company_for_user


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # To set the HTTPOnly Cookies
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
                max_age=15 * 60,
            )

            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/",
                max_age=7 * 24 * 3600,
            )

            # Removing the tokens from the response data
            response.data = {"detail": "Login successful"}
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token") or request.data.get(
            "refresh"
        )
        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(data={"refresh": refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise InvalidToken(exc.args[0])

        access_token = serializer.validated_data.get("access")
        new_refresh = serializer.validated_data.get("refresh", refresh_token)

        response = Response(
            {"access": access_token, "detail": "Token Refreshed"},
            status=status.HTTP_200_OK,
        )

        # Set HTTPOnly Cookies
        response.set_cookie(
            "access_token",
            str(access_token),
            httponly=True,
            samesite="Lax",
            secure=not settings.DEBUG,
            path="/",
            max_age=24 * 3600,
        )

        if new_refresh:
            response.set_cookie(
                "refresh_token",
                str(new_refresh),
                httponly=True,
                samesite="Lax",
                secure=not settings.DEBUG,
                path="/",
                max_age=7 * 24 * 3600,
            )

        return response


class LogoutView(APIView):
    def post(self, request):
        from django.contrib.auth import logout as django_logout

        try:
            django_logout(request)
        except Exception:
            pass

        response = Response(
            {"detail": "Successfully logged out"},
            status=status.HTTP_200_OK,
        )

        # Overwrite with expired cookies explicitly
        response.set_cookie(
            "access_token",
            "",
            max_age=0,
            expires="Thu, 01 Jan 1970 00:00:00 GMT",
            path="/",
            httponly=True,
            samesite="Lax",
            secure=not settings.DEBUG,
        )
        response.set_cookie(
            "refresh_token",
            "",
            max_age=0,
            expires="Thu, 01 Jan 1970 00:00:00 GMT",
            path="/",
            httponly=True,
            samesite="Lax",
            secure=not settings.DEBUG,
        )
        response.delete_cookie(
            "access_token",
            path="/",
            samesite="Lax",
        )
        response.delete_cookie(
            "refresh_token",
            path="/",
            samesite="Lax",
        )
        response.delete_cookie(
            settings.SESSION_COOKIE_NAME,
            path="/",
        )
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        company = company_for_user(user)
        if company is None:
            return Response(
                {"detail": "User is not assigned to a company."},
                status=status.HTTP_403_FORBIDDEN,
            )
        role = (
            "Admin" if user.is_superuser else ("Staff" if user.is_staff else "Member")
        )
        name = user.get_full_name()
        if not name:
            name = user.username

        membership = getattr(user, 'company_membership', None)
        password_change_required = membership.password_change_required if membership else False

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": name,
                "role": role,
                "company": {"id": company.id, "name": company.name},
                "password_change_required": password_change_required,
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not old_password or not new_password or not confirm_password:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from django.contrib.auth.password_validation import validate_password

        try:
            validate_password(new_password)
        except ValidationError as exc:
            return Response(
                {"password": exc.messages if hasattr(exc, 'messages') else list(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        # Mark password change as complete
        try:
            membership = user.company_membership
            membership.password_change_required = False
            membership.save()
        except:
            pass

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only administrators can view users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from django.contrib.auth.models import User

        company = company_for_user(request.user)
        users = User.objects.filter(company_membership__company=company).order_by(
            "-date_joined"
        )
        search = request.query_params.get("search", "").strip().lower()

        user_list = []
        for u in users:
            role = "Admin" if u.is_superuser else ("Staff" if u.is_staff else "Member")
            name = u.get_full_name() or u.username
            if search:
                if (
                    search not in u.username.lower()
                    and search not in u.email.lower()
                    and search not in name.lower()
                    and search not in role.lower()
                ):
                    continue

            user_list.append(
                {
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "name": name,
                    "role": role,
                    "is_superuser": u.is_superuser,
                    "is_staff": u.is_staff,
                    "is_active": u.is_active,
                    "date_joined": u.date_joined.isoformat(),
                }
            )

        return Response(user_list, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only administrators can add users."},
                status=status.HTTP_403_FORBIDDEN,
            )
        company = company_for_user(request.user)
        username, email, password = (
            request.data.get("username"),
            request.data.get("email"),
            request.data.get("password"),
        )
        role = request.data.get("role", "Member")
        if not username or not email or not password:
            return Response(
                {"error": "Username, email, and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if role not in ("Admin", "Staff", "Member"):
            return Response(
                {"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST
            )
        if (
            User.objects.filter(username=username).exists()
            or User.objects.filter(email=email).exists()
        ):
            return Response(
                {"error": "Username or email already in use."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        from django.contrib.auth.password_validation import validate_password

        try:
            validate_password(password)
        except ValidationError as exc:
            return Response(
                {"password": exc.messages if hasattr(exc, "messages") else list(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=role in ("Admin", "Staff"),
            is_superuser=role == "Admin",
        )
        CompanyMembership.objects.create(
            company=company, user=user, password_change_required=True
        )
        return Response(
            {
                "id": user.id,
                "username": username,
                "email": email,
                "name": username,
                "role": role,
                "is_active": user.is_active,
                "date_joined": user.date_joined.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )


class UserDetailManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only administrators can modify user roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from django.contrib.auth.models import User

        try:
            target_user = User.objects.get(
                pk=pk, company_membership__company=company_for_user(request.user)
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        role = request.data.get("role")
        is_active = request.data.get("is_active")

        if role:
            if role == "Admin":
                target_user.is_superuser = True
                target_user.is_staff = True
            elif role == "Staff":
                target_user.is_superuser = False
                target_user.is_staff = True
            elif role == "Member":
                target_user.is_superuser = False
                target_user.is_staff = False
            else:
                return Response(
                    {"error": "Invalid role. Allowed roles: Admin, Staff, Member."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if is_active is not None:
            target_user.is_active = bool(is_active)

        target_user.save()

        updated_role = (
            "Admin"
            if target_user.is_superuser
            else ("Staff" if target_user.is_staff else "Member")
        )
        return Response(
            {
                "id": target_user.id,
                "username": target_user.username,
                "email": target_user.email,
                "name": target_user.get_full_name() or target_user.username,
                "role": updated_role,
                "is_superuser": target_user.is_superuser,
                "is_staff": target_user.is_staff,
                "is_active": target_user.is_active,
                "date_joined": target_user.date_joined.isoformat(),
                "detail": "User updated successfully",
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only administrators can delete users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from django.contrib.auth.models import User

        try:
            target_user = User.objects.get(
                pk=pk, company_membership__company=company_for_user(request.user)
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if target_user.id == request.user.id:
            return Response(
                {"error": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        target_user.delete()
        return Response(
            {"detail": "User deleted successfully."},
            status=status.HTTP_200_OK,
        )
