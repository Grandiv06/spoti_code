import {
  getAccessToken,
  refreshAccessToken,
  shouldAttemptTokenRefresh,
} from "@/lib/auth-tokens";
import { API_BASE_URL, USE_MOCK_API } from "./api-config";
import { getMockApiResponse } from "./mock-api";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface ApiRequestOptions {
  headers?: HeadersInit;
  body?: unknown;
  useMock?: boolean;
  _retryAuth?: boolean;
}

function sanitizeApiErrorMessage(message: string, status: number): string {
  const trimmed = message.trim();
  if (!trimmed) return `Request failed (${status})`;

  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<body") ||
    trimmed.includes("<script")
  ) {
    if (status === 404) return "مسیر درخواست‌شده یافت نشد.";
    return `خطا در ارتباط با سرور (${status})`;
  }

  try {
    const parsed = JSON.parse(trimmed) as { message?: unknown; error?: unknown };
    if (typeof parsed.message === "string" && parsed.message.trim()) return parsed.message;
    if (typeof parsed.error === "string" && parsed.error.trim()) return parsed.error;
  } catch {
    // Not JSON — use raw text below.
  }

  if (trimmed.length > 240) return `${trimmed.slice(0, 240)}…`;
  return trimmed;
}

function buildRequestHeaders(token: string | null, extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (extra) {
    for (const [key, value] of Object.entries(extra as Record<string, string>)) {
      if (value) headers[key] = String(value);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const mockResponse =
    USE_MOCK_API && options.useMock !== false
      ? getMockApiResponse<T>({ method, path, body: options.body })
      : undefined;

  if (USE_MOCK_API && mockResponse !== undefined) {
    return mockResponse;
  }

  const token = getAccessToken();
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      cache: "no-store",
      headers: buildRequestHeaders(token, options.headers),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (
      response.status === 401 &&
      shouldAttemptTokenRefresh(path, Boolean(options._retryAuth))
    ) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiRequest<T>(method, path, { ...options, _retryAuth: true });
      }
    }

    if (!response.ok) {
      const message = await response.text();
      if (USE_MOCK_API && mockResponse !== undefined) return mockResponse;
      throw new Error(sanitizeApiErrorMessage(message, response.status));
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (USE_MOCK_API && mockResponse !== undefined) return mockResponse;
    throw error;
  }
}

export function apiGet<T = unknown>(path: string, headers?: HeadersInit): Promise<T> {
  return apiRequest("get", path, { headers });
}

export function apiGetNoMock<T = unknown>(path: string, headers?: HeadersInit) {
  return apiRequest<T>("get", path, { headers, useMock: false });
}

export function apiPost<T>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("post", path, { body, headers });
}

export function apiPostNoMock<T = unknown>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("post", path, { body, headers, useMock: false });
}

export function apiPut<T>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("put", path, { body, headers });
}

export function apiPutNoMock<T = unknown>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("put", path, { body, headers, useMock: false });
}

export function apiPatch<T>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("patch", path, { body, headers });
}

export function apiPatchNoMock<T = unknown>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("patch", path, { body, headers, useMock: false });
}

export function apiDelete<T>(path: string, headers?: HeadersInit) {
  return apiRequest<T>("delete", path, { headers });
}

export function apiDeleteNoMock<T = unknown>(path: string, headers?: HeadersInit) {
  return apiRequest<T>("delete", path, { headers, useMock: false });
}
