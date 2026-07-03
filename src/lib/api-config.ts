/**
 * Base URL for all API requests.
 * Empty string = same-origin Next.js API routes (`src/app/api/...`).
 * Paths in services already include `/api/...`, so BASE is the origin only.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
