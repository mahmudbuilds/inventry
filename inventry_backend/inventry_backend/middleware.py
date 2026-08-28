from django.http import JsonResponse
from django.middleware.csrf import _does_token_match, get_token


class CookieCSRFMiddleware:
    """Require a matching CSRF token for authenticated cookie-based writes."""

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS", "TRACE"}
    EXEMPT_PATHS = {"/api/auth/login", "/api/auth/register", "/api/token/refresh"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method not in self.SAFE_METHODS and request.path.rstrip("/") not in self.EXEMPT_PATHS:
            if request.COOKIES.get("access_token"):
                cookie_token = request.COOKIES.get("csrftoken")
                header_token = request.headers.get("X-CSRFToken")
                if not cookie_token or not header_token or not _does_token_match(header_token, cookie_token):
                    return JsonResponse({"detail": "CSRF token missing or invalid."}, status=403)

        response = self.get_response(request)
        if "csrftoken" not in request.COOKIES:
            get_token(request)
        return response
