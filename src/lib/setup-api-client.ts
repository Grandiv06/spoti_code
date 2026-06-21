import axios from "axios";
import {
  getAccessToken,
  refreshAccessToken,
  shouldAttemptTokenRefresh,
} from "@/lib/auth-tokens";

let initialized = false;

export function setupApiClient(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as (typeof error.config & { _retryAuth?: boolean }) | undefined;
      const requestUrl = String(originalRequest?.url || "");

      if (
        error.response?.status === 401 &&
        originalRequest &&
        shouldAttemptTokenRefresh(requestUrl, Boolean(originalRequest._retryAuth))
      ) {
        originalRequest._retryAuth = true;
        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
