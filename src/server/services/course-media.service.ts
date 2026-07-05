import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "courses");
const MAX_BYTES = 50 * 1024 * 1024;

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
