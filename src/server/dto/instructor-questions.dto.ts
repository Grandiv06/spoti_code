import type { Comment, Course, Instructor } from "@prisma/client";

export type InstructorQuestionAttachmentDto = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  caption?: string;
};

export type InstructorQuestionReplyDto = {
  id: string;
  senderName: string;
  role: "instructor" | "student";
  text: string;
  createdAt: string;
  createdAtIso: string;
  attachments?: InstructorQuestionAttachmentDto[];
};

export type InstructorQuestionDto = {
  id: string;
  studentName: string;
  avatar?: string;
  title: string;
  text: string;
  description: string;
  errorText?: string;
  attachments?: InstructorQuestionAttachmentDto[];
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  studentId?: string;
  createdAt: string;
  createdAtIso: string;
  status: "new" | "answered";
  replies: InstructorQuestionReplyDto[];
};

export type InstructorQuestionsResponseDto = {
  items: InstructorQuestionDto[];
  stats: {
    total: number;
    new: number;
    answered: number;
  };
};

export type AnswerInstructorQuestionDto = {
  answer?: unknown;
  text?: unknown;
  attachments?: unknown;
};

type QuestionPayload = {
  kind: "lesson-qa";
  lessonId: string;
  text: string;
  attachments?: unknown[];
};

type ReplyPayload = {
  kind: "lesson-qa-reply";
  text: string;
  attachments?: unknown[];
};

type CommentWithReplies = Comment & {
  replies: Comment[];
  course: Course & { instructor: Instructor };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

export function parseLessonQaPayload(content: string): QuestionPayload | null {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!isRecord(parsed) || parsed.kind !== "lesson-qa") return null;
    const lessonId = readString(parsed.lessonId);
    const text = readString(parsed.text);
    if (!lessonId || !text) return null;
    return {
      kind: "lesson-qa",
      lessonId,
      text,
      attachments: Array.isArray(parsed.attachments) ? parsed.attachments : undefined,
    };
  } catch {
    return null;
  }
}

export function parseLessonQaReplyPayload(content: string): ReplyPayload | null {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!isRecord(parsed) || parsed.kind !== "lesson-qa-reply") return null;
    const text = readString(parsed.text);
    if (!text) return null;
    return {
      kind: "lesson-qa-reply",
      text,
      attachments: Array.isArray(parsed.attachments) ? parsed.attachments : undefined,
    };
  } catch {
    return null;
  }
}

export function stringifyLessonQaReplyPayload(input: Omit<ReplyPayload, "kind">) {
  return JSON.stringify({
    kind: "lesson-qa-reply",
    ...input,
  });
}

function normalizeAttachment(value: unknown, index: number): InstructorQuestionAttachmentDto | null {
  if (!isRecord(value)) return null;
  const name = readString(value.name ?? value.fileName ?? value.title);
  if (!name) return null;

  return {
    id: readString(value.id ?? value.fileId, `att-${index + 1}`),
    name,
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

function normalizeAttachments(value: unknown[] | undefined) {
  return (value ?? []).map(normalizeAttachment).filter(Boolean) as InstructorQuestionAttachmentDto[];
}

function splitQuestionText(text: string) {
  const errorMatch = text.match(/\n*---\s*خطا\s*\/\s*لاگ\s*---\n([\s\S]*)$/i);
  const errorText = errorMatch?.[1]?.trim();
  const withoutError = errorMatch ? text.slice(0, errorMatch.index).trim() : text.trim();
  const lines = withoutError.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = lines[0] || "سوال بدون عنوان";
  const description = lines.slice(1).join("\n").trim() || withoutError;

  return { title, description, errorText };
}

function readLessonTitle(course: Pick<Course, "id" | "chapters">, lessonId: string) {
  if (!Array.isArray(course.chapters)) return "";

  for (const chapter of course.chapters) {
    if (!isRecord(chapter) || !Array.isArray(chapter.lessons)) continue;
    for (const lesson of chapter.lessons) {
      if (!isRecord(lesson)) continue;
      const currentId = readString(lesson.id ?? lesson.lessonId);
      if (currentId !== lessonId) continue;
      return readString(lesson.title ?? lesson.name);
    }
  }

  return "";
}

function mapReply(reply: Comment): InstructorQuestionReplyDto {
  const payload = parseLessonQaReplyPayload(reply.content);
  const attachments = normalizeAttachments(payload?.attachments);
  const role = reply.isInstructorReply ? "instructor" : "student";

  return {
    id: reply.id,
    senderName: reply.authorName,
    role,
    text: payload?.text ?? reply.content,
    createdAt: reply.createdAt.toLocaleDateString("fa-IR"),
    createdAtIso: reply.createdAt.toISOString(),
    ...(attachments.length ? { attachments } : {}),
  };
}

export function toInstructorQuestionDto(comment: CommentWithReplies): InstructorQuestionDto | null {
  const payload = parseLessonQaPayload(comment.content);
  if (!payload) return null;

  const split = splitQuestionText(payload.text);
  const replies = comment.replies.map(mapReply).sort((a, b) => Date.parse(a.createdAtIso) - Date.parse(b.createdAtIso));
  const hasInstructorReply = replies.some((reply) => reply.role === "instructor");
  const attachments = normalizeAttachments(payload.attachments);
  const lessonTitle = readLessonTitle(comment.course, payload.lessonId);

  return {
    id: comment.id,
    studentName: comment.authorName,
    avatar: comment.authorAvatar,
    title: split.title || lessonTitle || "سوال بدون عنوان",
    text: payload.text,
    description: split.description || payload.text,
    errorText: split.errorText,
    ...(attachments.length ? { attachments } : {}),
    courseId: comment.courseId,
    courseTitle: comment.course.title,
    lessonId: payload.lessonId,
    lessonTitle,
    studentId: comment.authorId ?? undefined,
    createdAt: comment.createdAt.toLocaleDateString("fa-IR"),
    createdAtIso: comment.createdAt.toISOString(),
    status: hasInstructorReply ? "answered" : "new",
    replies,
  };
}

export function toInstructorQuestionsResponseDto(comments: CommentWithReplies[]): InstructorQuestionsResponseDto {
  const items = comments
    .map(toInstructorQuestionDto)
    .filter((item): item is InstructorQuestionDto => Boolean(item))
    .sort((a, b) => {
      const aLast = Math.max(Date.parse(a.createdAtIso), ...a.replies.map((reply) => Date.parse(reply.createdAtIso)));
      const bLast = Math.max(Date.parse(b.createdAtIso), ...b.replies.map((reply) => Date.parse(reply.createdAtIso)));
      return bLast - aLast;
    });

  return {
    items,
    stats: {
      total: items.length,
      new: items.filter((item) => item.status === "new").length,
      answered: items.filter((item) => item.status === "answered").length,
    },
  };
}

export function readAnswerText(input: AnswerInstructorQuestionDto) {
  return readString(input.answer ?? input.text);
}

export function readAnswerAttachments(input: AnswerInstructorQuestionDto) {
  return Array.isArray(input.attachments) ? input.attachments : undefined;
}
