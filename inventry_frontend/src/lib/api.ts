import { cookies } from "next/headers";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

// Helper to get access and refresh tokens individually
async function getAuthTokens(overrideToken?: string) {
  if (typeof window !== "undefined")
    return { accessToken: undefined, refreshToken: undefined };

  const cookieStore = await cookies();
  const accessToken = overrideToken ?? cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  return { accessToken, refreshToken };
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  hasRetried = false,
  accessTokenOverride?: string,
): Promise<Response> {
  const { accessToken, refreshToken } =
    await getAuthTokens(accessTokenOverride);

  // Set up request headers using Bearer auth
  const requestHeaders = new Headers(options.headers);
  requestHeaders.set("Content-Type", "application/json");

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const response = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  });

  // Return immediately if request succeeded or already retried
  if (response.status !== 401 || hasRetried) {
    return response;
  }

  // Pass refresh token in request body or header depending on backend requirements
  const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
    credentials: "include",
  });

  if (!refreshResponse.ok) return response;

  const data = await refreshResponse.json();
  const newAccessToken = data.access; // Assuming API returns { access: "..." }

  // Retry the request with the new Bearer token
  return fetchWithAuth(endpoint, options, true, newAccessToken);
}
