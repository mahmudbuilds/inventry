from django.contrib import admin
from django.urls import path, include
from inventory.views import RegisterView, LoginView
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CurrentUserView,
    ChangePasswordView,
    LogoutView,
    UserManagementView,
    UserDetailManagementView,
    health_check,
)

urlpatterns = [
    path("", health_check, name="health_check"),
    path("admin/", admin.site.urls),
    path("api/inventory/", include("inventory.urls")),
    path("api/inventory", include("inventory.urls")),
    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token", CookieTokenObtainPairView.as_view()),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/refresh", CookieTokenRefreshView.as_view()),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/register", RegisterView.as_view()),
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/login", LoginView.as_view()),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/logout", LogoutView.as_view()),
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/auth/me", CurrentUserView.as_view()),
    path("api/auth/change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("api/auth/change-password", ChangePasswordView.as_view()),
    path("api/auth/users/", UserManagementView.as_view(), name="user_management_list"),
    path("api/auth/users", UserManagementView.as_view()),
    path("api/auth/users/<int:pk>/", UserDetailManagementView.as_view(), name="user_management_detail"),
    path("api/auth/users/<int:pk>", UserDetailManagementView.as_view()),
]

