/**
 * Base URL for all API requests.
 * Paths in services already include `/api/...`, so BASE is the origin only.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://spoticode.vercel.app"
).replace(/\/$/, "");

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
