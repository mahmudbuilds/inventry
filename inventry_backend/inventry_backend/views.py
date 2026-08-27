from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings


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
                max_age=15 * 60,
            )

            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=7 * 24 * 3600,
            )

            # Removing the tokens from the response data
            response.data = {"detail": "Login successful"}
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
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

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # To set the HTTPOnly Cookies
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                samesite="Lax",
                secure=not settings.DEBUG,
                max_age=15 * 60,
            )

            if refresh_token:
                response.set_cookie(
                    "refresh_token",
                    refresh_token,
                    httponly=True,
                    samesite="Lax",
                    secure=not settings.DEBUG,
                    max_age=7 * 24 * 3600,
                )

            # Removing the tokens from the response data
            response.data = {"detail": "Token Refreshed"}
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = "Admin" if user.is_superuser else ("Staff" if user.is_staff else "Member")
        name = user.get_full_name()
        if not name:
            name = user.username

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": name,
                "role": role,
            },
            status=status.HTTP_200_OK,
        )
