import type { paths } from "@/types/openapi";
import { getMockApiResponse } from "./mock-api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://spoticode.vercel.app";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type PathWithMethod<M extends HttpMethod> = {
  [P in keyof paths]: M extends keyof paths[P] ? P : never;
}[keyof paths] & string;

interface ApiRequestOptions {
  headers?: HeadersInit;
  body?: unknown;
  useMock?: boolean;
}

export async function apiRequest<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const mockResponse = options.useMock === false
    ? undefined
    : getMockApiResponse<T>({ method, path, body: options.body });

  if (USE_MOCK_API && mockResponse !== undefined) {
    return mockResponse;
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const message = await response.text();
      if (mockResponse !== undefined) return mockResponse;
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (mockResponse !== undefined) return mockResponse;
    throw error;
  }
}

export function apiGet<P extends PathWithMethod<"get">, T>(path: P, headers?: HeadersInit): Promise<T>;
export function apiGet<T = unknown>(path: string, headers?: HeadersInit): Promise<T>;
export function apiGet(path: string, headers?: HeadersInit) {
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
