import type { CreateQaDto } from "@/api/models/CreateQaDto";
import { unwrapResponse } from "@/lib/admin-tickets";
import { apiGetNoMock, apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

type UnknownRecord = Record<string, unknown>;

export type CourseQaAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  caption?: string;
};

export type CourseQaReply = {
  senderName: string;
  role: "instructor" | "student";
  text: string;
  createdAt: string;
  createdAtIso?: string;
  attachments?: CourseQaAttachment[];
};

export type CourseLearningQuestion = {
  id: string;
  studentName: string;
  avatar?: string;
  title: string;
  text: string;
  description: string;
  errorText?: string;
  attachments?: CourseQaAttachment[];
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  createdAt: string;
  createdAtIso?: string;
  status: "new" | "answered";
  replies: CourseQaReply[];
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function extractList(value: unknown): unknown[] {
  const payload = unwrapResponse(value);
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ["items", "results", "list", "data"]) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function formatDate(value: unknown): { label: string; iso?: string } {
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      const date = new Date(parsed);
      return { label: date.toLocaleDateString("fa-IR"), iso: date.toISOString() };
    }
    return { label: value.trim() };
  }
  return { label: "" };
}

function normalizeStatus(value: unknown): CourseLearningQuestion["status"] {
  const raw = readString(value, "").toLowerCase();
  if (["answered", "answer", "replied", "resolved", "done"].includes(raw)) return "answered";
  return "new";
}

function normalizeAttachment(value: unknown): CourseQaAttachment | null {
  if (!isRecord(value)) return null;
  return {
    id: readString(value.id ?? value.fileId, `att-${Math.random().toString(36).slice(2, 8)}`),
    name: readString(value.name ?? value.fileName ?? value.title, "فایل"),
    size: typeof value.size === "number" ? value.size : Number(value.size ?? 0),
    type: readString(value.type ?? value.mimeType, "application/octet-stream"),
    previewUrl:
      typeof value.previewUrl === "string"
        ? value.previewUrl
        : typeof value.url === "string"
          ? value.url
          : undefined,
    caption: typeof value.caption === "string" ? value.caption : undefined,
  };
}

function normalizeReply(value: unknown, fallbackRole: CourseQaReply["role"]): CourseQaReply | null {
  if (!isRecord(value)) return null;
  const attachments = (Array.isArray(value.attachments) ? value.attachments : [])
    .map(normalizeAttachment)
    .filter(Boolean) as CourseQaAttachment[];
  const createdAt = formatDate(value.createdAt ?? value.date ?? value.timestamp);

  return {
    senderName: readString(
      value.senderName ?? value.authorName ?? value.name,
      fallbackRole === "instructor" ? "مدرس دوره" : "دانشجو"
    ),
    role: readString(value.role ?? value.senderRole, fallbackRole) === "student" ? "student" : "instructor",
    text: readString(value.text ?? value.answer ?? value.message),
    createdAt: createdAt.label,
    createdAtIso: createdAt.iso,
    ...(attachments.length ? { attachments } : {}),
  };
}

function splitQuestionContent(question: string): {
  title: string;
  description: string;
  errorText?: string;
} {
  const text = question.trim();
  if (!text) return { title: "سوال بدون عنوان", description: "" };

  const errorMatch = text.match(/\n*---\s*خطا\s*\/\s*لاگ\s*---\n([\s\S]*)$/i);
  const errorText = errorMatch?.[1]?.trim() || undefined;
  const withoutError = errorMatch ? text.slice(0, errorMatch.index).trim() : text;
  const lines = withoutError.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = lines[0] || "سوال بدون عنوان";
  const description = lines.slice(1).join("\n").trim() || withoutError;

  return { title, description, errorText };
}

export function mapCourseQaRecord(raw: unknown, index: number, fallbackCourseTitle = ""): CourseLearningQuestion {
  const row = (isRecord(raw) ? raw : {}) as UnknownRecord;
  const nestedQuestion = isRecord(row.question) ? (row.question as UnknownRecord) : undefined;
  const source = nestedQuestion ?? row;
  const questionText = readString(source.question ?? source.text ?? source.description ?? source.body);
  const split = splitQuestionContent(questionText);
  const createdAt = formatDate(source.createdAt ?? source.date ?? source.askedAt);

  const replies = (Array.isArray(source.replies) ? source.replies : [])
    .concat(Array.isArray(source.answers) ? source.answers : [])
    .concat(Array.isArray(source.messages) ? source.messages : [])
    .map((item) => normalizeReply(item, "instructor"))
    .filter(Boolean) as CourseQaReply[];

  const answerText = readString(source.answer);
  if (answerText && !replies.some((reply) => reply.role === "instructor")) {
    const answerDate = formatDate(source.answeredAt ?? source.updatedAt ?? source.createdAt);
    replies.push({
      senderName: readString(source.instructorName ?? source.teacherName, "مدرس دوره"),
      role: "instructor",
      text: answerText,
      createdAt: answerDate.label,
      createdAtIso: answerDate.iso,
    });
  }

  const attachments = (Array.isArray(source.attachments) ? source.attachments : [])
    .concat(Array.isArray(source.questionFiles) ? source.questionFiles : [])
    .concat(Array.isArray(source.files) ? source.files : [])
    .map(normalizeAttachment)
    .filter(Boolean) as CourseQaAttachment[];

  const courseRaw = isRecord(source.course) ? (source.course as UnknownRecord) : undefined;
  const lessonRaw = isRecord(source.lesson) ? (source.lesson as UnknownRecord) : undefined;

  return {
    id: readString(source.id ?? row.id ?? source.qaId, `QST-${index + 1}`),
    studentName: readString(
      source.studentName ?? source.userName ?? source.fullName ?? source.name ?? row.studentName,
      "دانشجو"
    ),
    avatar: typeof source.avatar === "string" ? source.avatar : undefined,
    title: readString(source.title ?? source.questionTitle ?? source.subject, split.title),
    text: readString(source.text, split.description),
    description: readString(source.description, split.description || questionText),
    errorText: readString(source.errorText ?? source.error ?? source.log, split.errorText),
    attachments: attachments.length ? attachments : undefined,
    courseId: readString(source.courseId ?? courseRaw?.id, ""),
    courseTitle: readString(
      source.courseTitle ?? courseRaw?.title ?? courseRaw?.name,
      fallbackCourseTitle || "دوره"
    ),
    lessonId: readString(source.lessonId ?? lessonRaw?.id, ""),
    lessonTitle: readString(source.lessonTitle ?? lessonRaw?.title ?? lessonRaw?.name, ""),
    createdAt: createdAt.label,
    createdAtIso: createdAt.iso,
    status: normalizeStatus(source.status ?? source.answerStatus ?? (answerText ? "answered" : "new")),
    replies,
  };
}

export function mapCourseQaList(
  response: unknown,
  fallbackCourseTitle = ""
): CourseLearningQuestion[] {
  return extractList(response).map((item, index) =>
    mapCourseQaRecord(item, index, fallbackCourseTitle)
  );
}

export function buildCourseQuestionText(input: {
  title?: string;
  description: string;
  errorText?: string;
}): string {
  const parts = [
    input.title?.trim(),
    input.description.trim(),
    input.errorText?.trim() ? `\n\n--- خطا / لاگ ---\n${input.errorText.trim()}` : "",
  ].filter(Boolean);

  return parts.join("\n\n");
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** GET /api/qas/my */
export async function fetchMyCourseQas(options: {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
}): Promise<CourseLearningQuestion[]> {
  const query = buildQuery({
    courseId: options.courseId,
    lessonId: options.lessonId,
  });
  const response = await apiGetNoMock<unknown>(`/api/qas/my${query}`, getAuthHeaders());
  return mapCourseQaList(response, options.courseTitle);
}

/** POST /api/qas */
export async function createCourseQuestion(input: {
  lessonId: string;
  question: string;
  questionFileIds?: string[];
}): Promise<CourseLearningQuestion> {
  const payload: CreateQaDto = {
    lessonId: input.lessonId,
    question: input.question,
    ...(input.questionFileIds?.length ? { questionFileIds: input.questionFileIds } : {}),
  };

  const response = await apiPostNoMock<unknown>("/api/qas", payload, getAuthHeaders());
  const mapped = mapCourseQaList(response);
  if (mapped[0]) return mapped[0];
  return mapCourseQaRecord(unwrapResponse(response), 0);
}
