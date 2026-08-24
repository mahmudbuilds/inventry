const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TokenResponse {
  access: string;
  refresh?: string;
}

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setTokens = (access: string, refresh?: string): void => {
  localStorage.setItem("access_token", access);
  refresh && localStorage.setItem("refresh_token", refresh);
};

export const clearStoredTokens = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Handling expired access token
  if (response.status === 401 && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const data: TokenResponse = await refreshResponse.json();

        setTokens(data.access);

        // Retrying original request with new generated tokens

        (headers as Record<string, string>)["Authorization"] =
          `Bearer ${data.access}`;

        response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          ...options,
          headers,
        });
      }
    }
  }
  return response;
}
