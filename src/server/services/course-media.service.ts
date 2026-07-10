import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Directory that backs the public "/uploads" URL prefix.
// - Local dev: defaults to public/uploads, so `next dev`/`next start` serve files statically.
// - Production: set UPLOAD_DIR to the persistent disk mount (e.g. /files) so uploaded
//   media survives redeploys/restarts instead of living on the ephemeral container FS.
export const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
export const MEDIA_ROOT = process.env.UPLOAD_DIR?.trim()
  ? path.resolve(process.env.UPLOAD_DIR.trim())
  : PUBLIC_UPLOADS_DIR;

const UPLOAD_ROOT = path.join(MEDIA_ROOT, "courses");
const MAX_BYTES = 50 * 1024 * 1024;

// Resolves URL path segments (everything after "/uploads/") to an absolute file
// path inside `baseDir`, rejecting anything that would escape the directory
// (path traversal). Returns null when the resolved path is outside the root.
export function resolveMediaPath(baseDir: string, segments: string[]): string | null {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(base, segments.join("/"));
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    return null;
  }
  return resolved;
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
}

function resolveVideoExtension(fileName: string, mimeType: string) {
  const fromName = path.extname(fileName).toLowerCase();
  if (fromName && fromName.length <= 8) return fromName;

  if (mimeType === "video/webm") return ".webm";
  if (mimeType === "video/quicktime") return ".mov";
  if (mimeType === "video/x-matroska") return ".mkv";
  return ".mp4";
}

function resolveAttachmentExtension(fileName: string) {
  const fromName = path.extname(fileName).toLowerCase();
  if (fromName && fromName.length <= 8) return fromName;
  return ".bin";
}

export async function saveCourseMediaFile(input: {
  courseId: string;
  file: File;
  kind: "intro" | "lesson" | "attachment";
  lessonId?: string;
}) {
  const courseId = sanitizeSegment(decodeURIComponent(input.courseId));
  if (!courseId) {
    throw new Error("شناسه دوره نامعتبر است");
  }

  const bytes = Buffer.from(await input.file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    throw new Error("حجم فایل نباید بیشتر از ۵۰ مگابایت باشد");
  }

  if (input.kind === "attachment") {
    const lessonPart = `attachment-${sanitizeSegment(input.lessonId ?? "unknown")}-`;
    const filename = `${lessonPart}${Date.now()}${resolveAttachmentExtension(input.file.name)}`;
    const dir = path.join(UPLOAD_ROOT, courseId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
    return `/uploads/courses/${courseId}/${filename}`;
  }

  if (!input.file.type.startsWith("video/")) {
    throw new Error("فقط فایل ویدیویی مجاز است");
  }

  const lessonPart =
    input.kind === "lesson" ? `lesson-${sanitizeSegment(input.lessonId ?? "unknown")}-` : "intro-";
  const filename = `${lessonPart}${Date.now()}${resolveVideoExtension(input.file.name, input.file.type)}`;
  const dir = path.join(UPLOAD_ROOT, courseId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  return `/uploads/courses/${courseId}/${filename}`;
}

export function isPersistableMediaUrl(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw || raw.startsWith("blob:")) return "";
  return raw;
}
