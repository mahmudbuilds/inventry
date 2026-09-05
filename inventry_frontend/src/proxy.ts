// proxy.ts (in project root or src/)

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const jsonStr = atob(padded);
    const payload = JSON.parse(jsonStr);
    if (typeof payload.exp !== "number") return false;
    // Consider expired 5 seconds early to account for clock skew
    return Date.now() >= (payload.exp - 5) * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const hasValidAccess = !isTokenExpired(accessToken);
  const hasValidRefresh = !isTokenExpired(refreshToken);
  const isAuthenticated = hasValidAccess || hasValidRefresh;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublicRoute = pathname === "/" || isAuthPage;
  const isProtectedRoute = !isPublicRoute;

  // 1. If accessing a protected route without valid tokens, redirect to login & clear stale cookies
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (accessToken) response.cookies.delete("access_token");
    if (refreshToken) response.cookies.delete("refresh_token");
    return response;
  }

  // 2. If authenticated and accessing login or signup, redirect to dashboard root "/dashboard"
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Clear stale/expired cookies if present on public routes
  if (!isAuthenticated && (accessToken || refreshToken)) {
    const response = NextResponse.next();
    if (accessToken) response.cookies.delete("access_token");
    if (refreshToken) response.cookies.delete("refresh_token");
    return response;
  }

  return NextResponse.next();
}

export const proxy = middleware;
export default middleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
