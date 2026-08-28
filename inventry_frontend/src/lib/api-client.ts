"use client";

/**
 * Client-side API fetch utility that handles credentials, automatic JWT token refreshing,
 * request retries, and error formatting.
 */

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

function onTokenRefreshed() {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
}

async function refreshAuthToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res.ok;
  } catch (err) {
    console.error("Token refresh network failure", err);
    return false;
  }
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  hasRetried = false,
): Promise<Response> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "include",
  });

  // If unauthorized and we haven't retried yet, attempt silent refresh
  if (response.status === 401 && !hasRetried && !endpoint.includes("/api/auth/login") && !endpoint.includes("/api/token/refresh/")) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshed = await refreshAuthToken();
      isRefreshing = false;

      if (refreshed) {
        onTokenRefreshed();
        return apiFetch(endpoint, options, true);
      } else {
        onTokenRefreshed();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
          window.location.href = "/login";
        }
        return response;
      }
    } else {
      // Wait for ongoing refresh to complete then retry
      return new Promise<Response>((resolve) => {
        pendingRequests.push(async () => {
          resolve(await apiFetch(endpoint, options, true));
        });
      });
    }
  }

  return response;
}

/**
 * Formats API error payloads (DRF validation dictionaries, string errors, etc.) into clean messages
 */
export function formatApiError(data: unknown, defaultMsg = "An unexpected error occurred"): string {
  if (!data) return defaultMsg;
  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (typeof obj.detail === "string") return obj.detail;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;

    // Handle token error payloads
    if (obj.code === "token_not_valid") {
      return "Your session has expired. Please sign in again.";
    }

    // Handle field error objects e.g. { name: ["Field required"], sku: ["Already exists"] }
    const messages: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (key === "code" || key === "messages") continue;
      if (Array.isArray(value)) {
        const joined = value.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(" ");
        messages.push(`${key}: ${joined}`);
      } else if (typeof value === "string") {
        messages.push(`${key}: ${value}`);
      } else if (typeof value === "object" && value !== null) {
        messages.push(`${key}: ${JSON.stringify(value)}`);
      }
    }

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return defaultMsg;
}
