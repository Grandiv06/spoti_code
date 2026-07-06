/**
 * Base URL for all API requests.
 * Empty string = same-origin Next.js API routes (`src/app/api/...`).
 * Paths in services already include `/api/...`, so BASE is the origin only.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

/** Opt-in only: show OTP on login/register instead of SMS (local dev without MeliPayamak). */
export const SHOW_DEV_OTP = process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true";
