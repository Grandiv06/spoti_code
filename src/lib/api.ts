import type { paths } from "@/types/openapi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://spoticode.runflare.run";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type PathWithMethod<M extends HttpMethod> = {
  [P in keyof paths]: M extends keyof paths[P] ? P : never;
}[keyof paths] & string;

interface ApiRequestOptions {
  headers?: HeadersInit;
  body?: unknown;
}

export async function apiRequest<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export function apiGet<P extends PathWithMethod<"get">, T>(path: P, headers?: HeadersInit) {
  return apiRequest<T>("get", path, { headers });
}

export function apiPost<T>(path: string, body?: unknown, headers?: HeadersInit) {
  return apiRequest<T>("post", path, { body, headers });
}
