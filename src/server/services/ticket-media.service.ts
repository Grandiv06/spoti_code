import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { MEDIA_ROOT, resolveMediaPath } from "@/server/services/course-media.service";

const TICKET_UPLOAD_ROOT = path.join(MEDIA_ROOT, "tickets");
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".txt",
  ".log",
  ".zip",
]);

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
}

function resolveExtension(fileName: string, mimeType: string) {
  const fromName = path.extname(fileName).toLowerCase();
  if (fromName && ALLOWED_EXTENSIONS.has(fromName)) return fromName;

  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "text/plain") return ".txt";
  if (mimeType === "application/zip") return ".zip";
  return ".bin";
}

export async function saveTicketAttachmentFile(input: { userId: string; file: File }) {
  const userId = sanitizeSegment(input.userId);
  if (!userId) {
    throw new Error("شناسه کاربر نامعتبر است");
  }

  const bytes = Buffer.from(await input.file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    throw new Error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
  }

  const extension = resolveExtension(input.file.name, input.file.type);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("فرمت فایل پشتیبانی نمی‌شود. فقط تصویر، PDF، TXT، LOG و ZIP مجاز است");
  }

  const filename = `att-${Date.now()}${extension}`;
  const dir = path.join(TICKET_UPLOAD_ROOT, userId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  return {
    name: input.file.name.trim() || filename,
    url: `/uploads/tickets/${userId}/${filename}`,
    size: bytes.length,
    type: input.file.type || "application/octet-stream",
  };
}

export function resolveTicketMediaPath(segments: string[]): string | null {
  return resolveMediaPath(TICKET_UPLOAD_ROOT, segments);
}
