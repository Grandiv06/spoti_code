import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { MEDIA_ROOT } from "@/server/services/course-media.service";

/**
 * Central guard that keeps inline media (base64 `data:` / `blob:` URLs) out of the DB.
 *
 * - Write side: `persistInlineMediaDeep` converts any `data:image/...;base64` string in a
 *   Prisma write payload into a real file under `/uploads/media/...` and stores the URL.
 * - Read side: `sanitizeMediaUrl` / `stripInlineMediaDeep` make sure an inline value never
 *   reaches an API response (falls back to a default image instead).
 */

export const DEFAULT_COURSE_IMAGES = [1, 2, 3, 4, 5].map((n) => `/images/course${n}.jpg`);
export const DEFAULT_USER_AVATARS = [
  "/images/user1.jpg",
  "/images/user2.jpg",
  "/images/user3.jpg",
  "/images/student1.jpg",
  "/images/student2.jpg",
  "/images/student3.jpg",
];
export const DEFAULT_INSTRUCTOR_AVATARS = [1, 2, 3, 4, 5, 6].map((n) => `/images/inst${n}.jpg`);

/** Real media URLs are short paths/URLs; anything longer is treated as junk. */
const MAX_MEDIA_URL_LENGTH = 2048;
const MAX_INLINE_IMAGE_BYTES = 5 * 1024 * 1024;
const MEDIA_SUBDIR = "media";

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const DATA_IMAGE_RE = /^data:(image\/[a-z0-9.+-]+);base64,/i;

export function isInlineMedia(value: unknown): value is string {
  return typeof value === "string" && (value.startsWith("data:") || value.startsWith("blob:"));
}

/** Deterministic pick so the same record always gets the same default image. */
export function pickDefault(pool: readonly string[], seed?: string | null) {
  if (!seed) return pool[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return pool[Math.abs(hash) % pool.length];
}

/** Read-side: never return inline / oversized media. */
export function sanitizeMediaUrl<T extends string | null | undefined>(value: T, fallback: string): T | string {
  if (typeof value !== "string") return value;
  const raw: string = value;
  if (raw.startsWith("data:") || raw.startsWith("blob:") || raw.length > MAX_MEDIA_URL_LENGTH) return fallback;
  return value;
}

/** Read-side: recursively strip inline media from JSON blobs (e.g. Course.draftData). */
export function stripInlineMediaDeep<T>(value: T, fallback = ""): T {
  if (isInlineMedia(value)) return fallback as T;
  if (Array.isArray(value)) return value.map((item) => stripInlineMediaDeep(item, fallback)) as T;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = stripInlineMediaDeep(item, fallback);
    }
    return out as T;
  }
  return value;
}

/** Decode a `data:image/...;base64,` string, save it to disk and return its public URL. */
export async function saveInlineImage(dataUrl: string, folder: string): Promise<string | null> {
  const match = DATA_IMAGE_RE.exec(dataUrl);
  if (!match) return null;

  const extension = IMAGE_EXTENSIONS[match[1].toLowerCase()];
  if (!extension) return null;

  const bytes = Buffer.from(dataUrl.slice(match[0].length), "base64");
  if (bytes.length === 0 || bytes.length > MAX_INLINE_IMAGE_BYTES) return null;

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "misc";
  const dir = path.join(MEDIA_ROOT, MEDIA_SUBDIR, safeFolder);
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${MEDIA_SUBDIR}/${safeFolder}/${filename}`;
}

/**
 * Write-side: walk a Prisma write payload and replace every inline media string.
 * `data:image/*` → saved to disk (URL stored); any other inline value (blob:, non-image
 * data:, undecodable or oversized) → "" so it can never be persisted.
 */
export async function persistInlineMediaDeep<T>(value: T, folder: string): Promise<T> {
  if (isInlineMedia(value)) {
    const url = value.startsWith("data:") ? await saveInlineImage(value, folder).catch(() => null) : null;
    return (url ?? "") as T;
  }
  if (Array.isArray(value)) {
    return (await Promise.all(value.map((item) => persistInlineMediaDeep(item, folder)))) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date) && !Buffer.isBuffer(value)) {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(
        async ([key, item]) => [key, await persistInlineMediaDeep(item, folder)] as const
      )
    );
    return Object.fromEntries(entries) as T;
  }
  return value;
}

/** Cheap pre-check so the walker only runs when a payload actually contains inline media. */
export function containsInlineMedia(value: unknown): boolean {
  if (isInlineMedia(value)) return true;
  if (Array.isArray(value)) return value.some(containsInlineMedia);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.values(value as Record<string, unknown>).some(containsInlineMedia);
  }
  return false;
}
