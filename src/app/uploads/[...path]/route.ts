import { NextRequest } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import path from "path";
import {
  MEDIA_ROOT,
  PUBLIC_UPLOADS_DIR,
  resolveMediaPath,
} from "@/server/services/course-media.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/x-m4v",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".zip": "application/zip",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function contentTypeFor(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

// Picks the first readable candidate: the persistent disk first, then the
// bundled public/uploads (covers files that haven't been migrated yet).
async function locateFile(segments: string[]): Promise<{ filePath: string; size: number } | null> {
  const candidates = [resolveMediaPath(MEDIA_ROOT, segments)];
  if (MEDIA_ROOT !== PUBLIC_UPLOADS_DIR) {
    candidates.push(resolveMediaPath(PUBLIC_UPLOADS_DIR, segments));
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        return { filePath: candidate, size: info.size };
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path: segments } = await context.params;
  if (!segments || segments.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const located = await locateFile(segments);
  if (!located) {
    return new Response("Not found", { status: 404 });
  }

  const { filePath, size } = located;
  const contentType = contentTypeFor(filePath);
  // Filenames are content-addressed (they include a timestamp), so they never
  // change — safe to cache aggressively for instant repeat loads.
  const cacheControl = "public, max-age=31536000, immutable";

  const range = request.headers.get("range");
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    let start = match?.[1] ? Number.parseInt(match[1], 10) : 0;
    let end = match?.[2] ? Number.parseInt(match[2], 10) : size - 1;

    if (Number.isNaN(start)) start = 0;
    if (Number.isNaN(end) || end >= size) end = size - 1;

    if (start > end || start >= size) {
      return new Response("Range Not Satisfiable", {
        status: 416,
        headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" },
      });
    }

    const nodeStream = createReadStream(filePath, { start, end });
    return new Response(Readable.toWeb(nodeStream) as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      },
    });
  }

  const nodeStream = createReadStream(filePath);
  return new Response(Readable.toWeb(nodeStream) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
    },
  });
}
