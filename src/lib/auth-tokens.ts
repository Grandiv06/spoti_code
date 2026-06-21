import { OpenAPI } from "@/api";
import { API_BASE_URL } from "@/lib/api-config";
import { unwrapResponse } from "@/lib/admin-tickets";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

type AuthTokenPayload = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: AuthTokenPayload;
};

let refreshPromise: Promise<string | null> | null = null;
const sessionExpiredListeners = new Set<() => void>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function syncOpenApiToken(token?: string | null): void {
  OpenAPI.TOKEN = token || getAccessToken() || "";
}

export function setAuthTokens(accessToken: string, refreshToken?: string | null): void {
  if (!isBrowser()) return;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  syncOpenApiToken(accessToken);
}

export function clearAuthTokens(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  syncOpenApiToken("");
}

export function getAuthHeaders(): HeadersInit | undefined {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function extractTokensFromAuthResponse(response: unknown): {
  accessToken?: string;
  refreshToken?: string;
} {
  const unwrapped = unwrapResponse(response);
  const source =
    typeof unwrapped === "object" && unwrapped !== null
      ? (unwrapped as AuthTokenPayload)
      : (response as AuthTokenPayload);

  const nested =
    typeof source.data === "object" && source.data !== null ? source.data : undefined;

  const accessToken =
    source.accessToken ||
    source.token ||
    nested?.accessToken ||
    nested?.token ||
    (typeof response === "object" && response !== null
      ? (response as AuthTokenPayload).accessToken ||
        (response as AuthTokenPayload).token
      : undefined);

  const refreshToken =
    source.refreshToken ||
    nested?.refreshToken ||
    (typeof response === "object" && response !== null
      ? (response as AuthTokenPayload).refreshToken
      : undefined);

  return { accessToken, refreshToken };
}

export function onAuthSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

export function notifyAuthSessionExpired(): void {
  clearAuthTokens();
  sessionExpiredListeners.forEach((listener) => listener());
}

function isAuthRequestPath(path: string): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.startsWith("/api/auth/");
}

export async function refreshAccessToken(): Promise<string | null> {
  if (!isBrowser()) return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    const currentAccessToken = getAccessToken();
    const bearerToken = refreshToken || currentAccessToken;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers,
        cache: "no-store",
        body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          notifyAuthSessionExpired();
        }
        return null;
      }

      const payload = (await response.json()) as unknown;
      const { accessToken, refreshToken: nextRefreshToken } = extractTokensFromAuthResponse(payload);

      if (!accessToken) {
        notifyAuthSessionExpired();
        return null;
      }

      setAuthTokens(accessToken, nextRefreshToken ?? refreshToken);
      return accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function shouldAttemptTokenRefresh(path: string, retried: boolean): boolean {
  return !retried && !isAuthRequestPath(path) && Boolean(getAccessToken() || getRefreshToken());
}
