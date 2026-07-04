import type { CreateQaDto } from "@/types/api-dtos";
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
  id?: string;
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
  studentId?: string;
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

function normalizeReply(
  value: unknown,
  fallbackRole: CourseQaReply["role"],
  index = 0
): CourseQaReply | null {
  if (typeof value === "string" && value.trim()) {
    return {
      id: `reply-text-${index}`,
      senderName: fallbackRole === "instructor" ? "مدرس دوره" : "دانشجو",
      role: fallbackRole,
      text: value.trim(),
      createdAt: "",
    };
  }

  if (!isRecord(value)) return null;

  const attachments = (Array.isArray(value.attachments) ? value.attachments : [])
    .concat(Array.isArray(value.answerFiles) ? value.answerFiles : [])
    .concat(Array.isArray(value.files) ? value.files : [])
    .map(normalizeAttachment)
    .filter(Boolean) as CourseQaAttachment[];
  const createdAt = formatDate(
    value.createdAtIso ??
      value.isoCreatedAt ??
      value.timestampIso ??
      value.answeredAtIso ??
      value.updatedAtIso ??
      value.createdAt ??
      value.date ??
      value.timestamp ??
      value.answeredAt ??
      value.updatedAt
  );
  const text = readString(
    value.text ??
      value.answer ??
      value.message ??
      value.content ??
      value.body ??
      value.answerText ??
      value.messageText ??
      value.replyText
  );
  if (!text) return null;

  const id = readString(value.id ?? value.replyId ?? value.messageId ?? value.answerId, "");
  const roleRaw = readString(value.role ?? value.senderRole ?? value.authorRole, fallbackRole);

  return {
    ...(id ? { id } : { id: `reply-${index}-${text.slice(0, 24)}` }),
    senderName: readString(
      value.senderName ?? value.authorName ?? value.name ?? value.instructorName ?? value.teacherName,
      fallbackRole === "instructor" ? "مدرس دوره" : "دانشجو"
    ),
    role: roleRaw === "student" ? "student" : "instructor",
    text,
    createdAt: createdAt.label,
    ...(createdAt.iso ? { createdAtIso: createdAt.iso } : {}),
    ...(attachments.length ? { attachments } : {}),
  };
}

export function extractQaRepliesFromSource(source: UnknownRecord): unknown[] {
  const merged: unknown[] = [];
  for (const key of [
    "replies",
    "answers",
    "messages",
    "instructorReplies",
    "answerHistory",
    "answerMessages",
    "answerList",
    "qaAnswers",
    "answerRecords",
  ]) {
    const value = source[key];
    if (Array.isArray(value)) merged.push(...value);
  }

  if (isRecord(source.answer) && !Array.isArray(source.answer)) {
    merged.push(source.answer);
  }

  return merged;
}

function isExactDuplicateReply(a: CourseQaReply, b: CourseQaReply): boolean {
  if (a.id && b.id && a.id === b.id) return true;
  if (
    a.role === b.role &&
    a.text.trim() === b.text.trim() &&
    a.createdAtIso &&
    b.createdAtIso &&
    a.createdAtIso === b.createdAtIso
  ) {
    return true;
  }
  return false;
}

export function dedupeQaReplies<T extends CourseQaReply>(replies: T[]): T[] {
  const ordered: T[] = [];
  for (const reply of replies) {
    if (ordered.some((existing) => isExactDuplicateReply(existing, reply))) continue;
    ordered.push(reply);
  }
  return ordered;
}

export function mergeQaReplies<T extends CourseQaReply>(local: T[], remote: T[]): T[] {
  const localInstructor = local.filter((reply) => reply.role === "instructor");
  const remoteInstructor = remote.filter((reply) => reply.role === "instructor");
  const merged = dedupeQaReplies([...local, ...remote]);
  const mergedInstructor = merged.filter((reply) => reply.role === "instructor");

  if (mergedInstructor.length >= Math.max(localInstructor.length, remoteInstructor.length)) {
    return sortQaRepliesChronologically(merged);
  }

  return sortQaRepliesChronologically(
    dedupeQaReplies([
      ...local.filter((reply) => reply.role !== "instructor"),
      ...remote.filter((reply) => reply.role !== "instructor"),
      ...localInstructor,
      ...remoteInstructor,
    ])
  );
}

function normalizePersianDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

function parseJalaliDateParts(value: string): { year: number; month: number; day: number } | null {
  const normalized = normalizePersianDigits(value);
  const match = normalized.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function jalaliToGregorian(jy: number, jm: number, jd: number): { year: number; month: number; day: number } {
  const jdn =
    Math.floor((jy + 979) * 365.25) +
    Math.floor((jm - 1) * 30.6) +
    jd +
    1948320 -
    Math.floor((jy + 979) / 33) * 8 +
    Math.floor(((jy + 979) % 33 + 3) / 4);
  const gregorianDays = jdn - 1721119;
  const year = Math.floor((gregorianDays * 4 + 3) / 1461);
  const dayOfYear = gregorianDays - Math.floor((1461 * year) / 4);
  const month = Math.floor((dayOfYear * 4 + 3) / 122);
  const day = dayOfYear - Math.floor((122 * month) / 4) + 1;
  return { year, month: month + 1, day };
}

export function parseQaTimestamp(iso?: string, label?: string): number {
  if (iso) {
    const parsedIso = Date.parse(iso);
    if (!Number.isNaN(parsedIso)) return parsedIso;
  }
  if (label) {
    const parsedLabel = Date.parse(label);
    if (!Number.isNaN(parsedLabel)) return parsedLabel;

    const normalized = normalizePersianDigits(label);
    const jalali = parseJalaliDateParts(normalized);
    const timeMatch = normalized.match(/(\d{1,2}):(\d{2})/);

    if (jalali) {
      const { year, month, day } = jalaliToGregorian(jalali.year, jalali.month, jalali.day);
      const date = new Date(year, month - 1, day);
      if (timeMatch) {
        date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
      }
      return date.getTime();
    }

    if (timeMatch) {
      const now = new Date();
      now.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
      return now.getTime();
    }
  }
  return 0;
}

export function sortQaRepliesChronologically<T extends CourseQaReply>(replies: T[]): T[] {
  return [...replies].sort((a, b) => {
    const diff =
      parseQaTimestamp(a.createdAtIso, a.createdAt) - parseQaTimestamp(b.createdAtIso, b.createdAt);
    return diff !== 0 ? diff : a.text.localeCompare(b.text);
  });
}

function appendAnswerFieldReplies(
  source: UnknownRecord,
  replies: CourseQaReply[],
  fallbackInstructorName: string
): CourseQaReply[] {
  const answerCandidates = [
    readString(source.answer),
    readString(source.latestAnswer),
    readString(source.lastAnswer),
  ].filter(Boolean);

  const next = [...replies];
  for (const answerText of answerCandidates) {
    if (next.some((reply) => reply.role === "instructor" && reply.text.trim() === answerText.trim())) {
      continue;
    }
    const answerDate = formatDate(
      source.answeredAtIso ??
        source.updatedAtIso ??
        source.createdAtIso ??
        source.answeredAt ??
        source.updatedAt ??
        source.createdAt
    );
    next.push({
      senderName: readString(source.instructorName ?? source.teacherName, fallbackInstructorName),
      role: "instructor",
      text: answerText,
      createdAt: answerDate.label,
      createdAtIso: answerDate.iso,
    });
  }

  return dedupeQaReplies(next);
}

function collectQaRepliesFromRecords(
  ...records: UnknownRecord[]
): CourseQaReply[] {
  const collected: CourseQaReply[] = [];
  let index = 0;

  for (const record of records) {
    for (const item of extractQaRepliesFromSource(record)) {
      const normalized = normalizeReply(item, "instructor", index++);
      if (normalized) collected.push(normalized);
    }
  }

  return collected;
}

export function buildQaRepliesFromSource(
  source: UnknownRecord,
  fallbackInstructorName = "مدرس دوره",
  extraSources: UnknownRecord[] = []
): CourseQaReply[] {
  const replies = dedupeQaReplies(collectQaRepliesFromRecords(source, ...extraSources));

  return sortQaRepliesChronologically(appendAnswerFieldReplies(source, replies, fallbackInstructorName));
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
  const createdAt = formatDate(
    source.createdAtIso ?? source.isoCreatedAt ?? source.createdAt ?? source.date ?? source.askedAt
  );

  const repliesWithAnswer = buildQaRepliesFromSource(source, "مدرس دوره", row !== source ? [row] : []);

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
    studentId: readString(
      source.studentId ??
        source.userId ??
        row.userId ??
        (isRecord(source.user) ? (source.user as UnknownRecord).id : undefined),
      ""
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
    status: normalizeStatus(
      source.status ?? source.answerStatus ?? (repliesWithAnswer.some((reply) => reply.role === "instructor") ? "answered" : "new")
    ),
    replies: repliesWithAnswer,
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

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

function mergeQuestionRecords(
  existing: CourseLearningQuestion,
  incoming: CourseLearningQuestion
): CourseLearningQuestion {
  return {
    ...(parseQaTimestamp(existing.createdAtIso, existing.createdAt) >=
    parseQaTimestamp(incoming.createdAtIso, incoming.createdAt)
      ? existing
      : incoming),
    replies: sortQaRepliesChronologically(mergeQaReplies(existing.replies, incoming.replies)),
  };
}

async function fetchMyCourseQasPage(options: {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
  page: number;
  limit: number;
}): Promise<CourseLearningQuestion[]> {
  const query = buildQuery({
    courseId: options.courseId,
    lessonId: options.lessonId,
    page: options.page,
    limit: options.limit,
  });
  const response = await apiGetNoMock<unknown>(`/api/qas/my${query}`, getAuthHeaders());
  return mapCourseQaList(response, options.courseTitle);
}

/** GET /api/qas/my — all pages merged */
export async function fetchAllMyCourseQas(options: {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
}): Promise<CourseLearningQuestion[]> {
  const pageSize = 50;
  const byId = new Map<string, CourseLearningQuestion>();

  for (let page = 1; page <= 20; page += 1) {
    const batch = await fetchMyCourseQasPage({ ...options, page, limit: pageSize });
    if (!batch.length) break;

    for (const item of batch) {
      const existing = byId.get(item.id);
      byId.set(item.id, existing ? mergeQuestionRecords(existing, item) : item);
    }

    if (batch.length < pageSize) break;
  }

  return Array.from(byId.values()).sort(
    (a, b) =>
      parseQaTimestamp(a.createdAtIso, a.createdAt) - parseQaTimestamp(b.createdAtIso, b.createdAt)
  );
}

/** GET /api/qas/instructor */
export async function fetchInstructorCourseQas(options: {
  courseId?: string;
  lessonId?: string;
  userId?: string;
  courseTitle?: string;
}): Promise<CourseLearningQuestion[]> {
  const query = buildQuery({
    courseId: options.courseId,
    lessonId: options.lessonId,
    userId: options.userId,
  });
  const response = await apiGetNoMock<unknown>(`/api/qas/instructor${query}`, getAuthHeaders());
  return mapCourseQaList(response, options.courseTitle);
}

/** GET /api/qas/my — first page only (legacy) */
export async function fetchMyCourseQas(options: {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
}): Promise<CourseLearningQuestion[]> {
  return fetchAllMyCourseQas(options);
}

export type LessonChatMessage = {
  id: string;
  qaId: string;
  role: "student" | "instructor";
  senderName: string;
  text: string;
  createdAt: string;
  createdAtIso: string;
  attachments?: CourseQaAttachment[];
  errorText?: string;
};

export type LessonChatResult = {
  messages: LessonChatMessage[];
  instructorName: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined): boolean {
  return Boolean(value && UUID_RE.test(value.trim()));
}

function isLessonChatMessageRecord(raw: unknown): boolean {
  if (!isRecord(raw)) return false;
  return Boolean(readString(raw.senderType) || readString(raw.body));
}

export function buildLessonChatFromQaRecords(
  questions: CourseLearningQuestion[],
  options: { studentName: string; instructorName: string }
): LessonChatMessage[] {
  const messages: LessonChatMessage[] = [];
  const sortedQuestions = [...questions].sort(
    (a, b) =>
      parseQaTimestamp(a.createdAtIso, a.createdAt) - parseQaTimestamp(b.createdAtIso, b.createdAt)
  );

  for (const thread of sortedQuestions) {
    messages.push({
      id: `${thread.id}-question`,
      qaId: thread.id,
      role: "student",
      senderName: thread.studentName || options.studentName,
      text: thread.description || thread.text || thread.title,
      errorText: thread.errorText,
      attachments: thread.attachments,
      createdAt: thread.createdAt,
      createdAtIso: thread.createdAtIso || thread.createdAt,
    });

    for (const [replyIndex, reply] of sortQaRepliesChronologically(thread.replies).entries()) {
      messages.push({
        id: `${thread.id}-reply-${reply.id ?? replyIndex}`,
        qaId: thread.id,
        role: reply.role,
        senderName: reply.senderName,
        text: reply.text,
        attachments: reply.attachments,
        createdAt: reply.createdAt,
        createdAtIso: reply.createdAtIso || reply.createdAt,
      });
    }
  }

  return messages.sort(
    (a, b) =>
      parseQaTimestamp(a.createdAtIso, a.createdAt) - parseQaTimestamp(b.createdAtIso, b.createdAt)
  );
}

export function mergeLessonChatMessages(
  local: LessonChatMessage[],
  remote: LessonChatMessage[]
): LessonChatMessage[] {
  const merged = new Map<string, LessonChatMessage>();
  for (const message of remote) merged.set(message.id, message);

  for (const message of local) {
    if (!message.id.startsWith("local-")) continue;
    const duplicate = [...merged.values()].some(
      (existing) =>
        existing.role === message.role &&
        existing.text.trim() === message.text.trim() &&
        Math.abs(
          parseQaTimestamp(existing.createdAtIso, existing.createdAt) -
            parseQaTimestamp(message.createdAtIso, message.createdAt)
        ) < 120_000
    );
    if (!duplicate) merged.set(message.id, message);
  }

  return [...merged.values()].sort(
    (a, b) =>
      parseQaTimestamp(a.createdAtIso, a.createdAt) - parseQaTimestamp(b.createdAtIso, b.createdAt)
  );
}

function mapLessonChatItem(
  raw: unknown,
  index: number,
  options: { instructorName: string; studentName: string }
): LessonChatMessage | null {
  if (!isRecord(raw)) return null;

  const text = readString(
    raw.body ?? raw.text ?? raw.message ?? raw.content ?? raw.answer ?? raw.question
  );
  if (!text) return null;

  const hasSenderType = Boolean(readString(raw.senderType));
  const role: LessonChatMessage["role"] = hasSenderType
    ? readString(raw.senderType, "").toLowerCase() === "instructor"
      ? "instructor"
      : "student"
    : readString(raw.answer) && !readString(raw.question)
      ? "instructor"
      : "student";
  const createdAt = formatDate(raw.createdAt ?? raw.date ?? raw.timestamp ?? raw.answeredAt);

  return {
    id: readString(raw.id ?? raw.messageId ?? raw.qaId, `msg-${index}`),
    qaId: readString(raw.qaId ?? raw.qa_id ?? raw.id, ""),
    role,
    senderName:
      role === "instructor"
        ? options.instructorName
        : readString(raw.senderName ?? raw.studentName ?? raw.userName, options.studentName),
    text,
    createdAt: createdAt.label || readString(raw.createdAt),
    createdAtIso: createdAt.iso || readString(raw.createdAt),
  };
}

function extractLessonChatPayload(response: unknown): {
  items: unknown[];
  instructorName: string;
  hasMore: boolean;
  page: number;
} {
  const payload = unwrapResponse(response);
  const record = isRecord(payload) ? payload : {};
  const items = Array.isArray(record.items) ? record.items : extractList(payload);
  const instructor = isRecord(record.instructor) ? record.instructor : null;
  const instructorName = readString(
    instructor?.fullName ?? instructor?.name ?? instructor?.displayName,
    "مدرس دوره"
  );
  const meta = isRecord(record.meta) ? record.meta : null;
  const currentPage = typeof meta?.currentPage === "number" ? meta.currentPage : 1;
  const totalPages = typeof meta?.totalPages === "number" ? meta.totalPages : currentPage;

  return {
    items,
    instructorName,
    hasMore: currentPage < totalPages,
    page: currentPage,
  };
}

async function fetchLessonChatPage(options: {
  courseId: string;
  lessonId: string;
  endpoint: "my" | "instructor";
  userId?: string;
  page: number;
  limit: number;
}): Promise<ReturnType<typeof extractLessonChatPayload>> {
  const query = buildQuery({
    courseId: options.courseId,
    lessonId: options.lessonId,
    userId: options.userId,
    page: options.page,
    limit: options.limit,
  });
  const response = await apiGetNoMock<unknown>(
    `/api/qas/${options.endpoint}${query}`,
    getAuthHeaders()
  );
  return extractLessonChatPayload(response);
}

async function fetchLessonChatFromApi(options: {
  courseId: string;
  lessonId: string;
  endpoint: "my" | "instructor";
  userId?: string;
  studentName: string;
}): Promise<LessonChatResult | null> {
  if (!isUuid(options.courseId) || !isUuid(options.lessonId)) return null;

  const pageSize = 50;
  const allItems: unknown[] = [];
  let instructorName = "مدرس دوره";

  for (let page = 1; page <= 20; page += 1) {
    const batch = await fetchLessonChatPage({
      courseId: options.courseId,
      lessonId: options.lessonId,
      endpoint: options.endpoint,
      userId: options.userId,
      page,
      limit: pageSize,
    });
    instructorName = batch.instructorName || instructorName;
    if (!batch.items.length) break;
    allItems.push(...batch.items);
    if (!batch.hasMore) break;
  }

  if (!allItems.length) return null;
  if (!allItems.some(isLessonChatMessageRecord)) return null;

  const messages = allItems
    .map((item, index) =>
      mapLessonChatItem(item, index, { instructorName, studentName: options.studentName })
    )
    .filter(Boolean) as LessonChatMessage[];

  messages.sort(
    (a, b) =>
      parseQaTimestamp(a.createdAtIso, a.createdAt) -
      parseQaTimestamp(b.createdAtIso, b.createdAt)
  );

  return { messages, instructorName };
}

async function fetchLessonChatFromQaList(options: {
  courseId?: string;
  lessonId: string;
  endpoint?: "my" | "instructor";
  userId?: string;
  studentName: string;
}): Promise<LessonChatResult & { resolvedCourseId?: string }> {
  const endpoint = options.endpoint ?? "my";
  const fetchQas =
    endpoint === "instructor" ? fetchInstructorCourseQas : fetchAllMyCourseQas;

  const questions = await fetchQas({
    courseId: isUuid(options.courseId) ? options.courseId : undefined,
    lessonId: isUuid(options.lessonId) ? options.lessonId : undefined,
    userId: isUuid(options.userId) ? options.userId : undefined,
  });

  const filtered = questions.filter((question) => {
    if (question.lessonId && question.lessonId !== options.lessonId) return false;
    if (options.userId && question.studentId && question.studentId !== options.userId) {
      return false;
    }
    return true;
  });

  const instructorName =
    filtered
      .flatMap((question) => question.replies)
      .find((reply) => reply.role === "instructor")?.senderName || "مدرس دوره";

  return {
    messages: buildLessonChatFromQaRecords(filtered, {
      studentName: options.studentName,
      instructorName,
    }),
    instructorName,
    resolvedCourseId: filtered.find((question) => isUuid(question.courseId))?.courseId,
  };
}

/** GET /api/qas/my or /api/qas/instructor — lesson chat with legacy fallback */
export async function fetchLessonChatMessages(options: {
  courseId: string;
  lessonId: string;
  endpoint?: "my" | "instructor";
  userId?: string;
  studentName?: string;
}): Promise<LessonChatResult> {
  const endpoint = options.endpoint ?? "my";
  const studentName = options.studentName || "دانشجو";

  try {
    const chat = await fetchLessonChatFromApi({
      courseId: options.courseId,
      lessonId: options.lessonId,
      endpoint,
      userId: options.userId,
      studentName,
    });
    if (chat?.messages.length) return chat;
  } catch {
    // Fall back to QA list below.
  }

  let legacy = await fetchLessonChatFromQaList({
    courseId: options.courseId,
    lessonId: options.lessonId,
    endpoint,
    userId: options.userId,
    studentName,
  });

  const resolvedCourseId =
    (isUuid(options.courseId) ? options.courseId : undefined) ||
    legacy.resolvedCourseId;

  if (resolvedCourseId && isUuid(resolvedCourseId) && isUuid(options.lessonId)) {
    try {
      const chat = await fetchLessonChatFromApi({
        courseId: resolvedCourseId,
        lessonId: options.lessonId,
        endpoint,
        userId: options.userId,
        studentName,
      });
      if (chat?.messages.length) return chat;
    } catch {
      // Keep legacy result.
    }
  }

  if (!legacy.messages.length) {
    legacy = await fetchLessonChatFromQaList({
      lessonId: options.lessonId,
      endpoint,
      userId: options.userId,
      studentName,
    });
  }

  return {
    messages: legacy.messages,
    instructorName: legacy.instructorName,
  };
}

export async function fetchLearningLessonChatMessages(options: {
  courseId: string;
  lessonId: string;
  studentName?: string;
}): Promise<LessonChatResult> {
  const encodedCourseId = encodeURIComponent(options.courseId);
  const encodedLessonId = encodeURIComponent(options.lessonId);
  const response = await apiGetNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedCourseId}/learning/lessons/${encodedLessonId}/qa`,
    getAuthHeaders()
  );
  const payload = extractLessonChatPayload(response);
  const studentName = options.studentName || "دانشجو";
  const messages = payload.items
    .map((item, index) =>
      mapLessonChatItem(item, index, {
        instructorName: payload.instructorName,
        studentName,
      })
    )
    .filter(Boolean) as LessonChatMessage[];

  return {
    messages,
    instructorName: payload.instructorName,
  };
}

export async function fetchLearningCourseChatMessages(options: {
  courseId: string;
  studentName?: string;
}): Promise<LessonChatResult> {
  const encodedCourseId = encodeURIComponent(options.courseId);
  const response = await apiGetNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedCourseId}/learning/qa`,
    getAuthHeaders()
  );
  const payload = extractLessonChatPayload(response);
  const studentName = options.studentName || "دانشجو";
  const messages = payload.items
    .map((item, index) =>
      mapLessonChatItem(item, index, {
        instructorName: payload.instructorName,
        studentName,
      })
    )
    .filter(Boolean) as LessonChatMessage[];

  return {
    messages,
    instructorName: payload.instructorName,
  };
}

export function resolveReplyTargetQaId(
  messages: LessonChatMessage[],
  fallbackQaId: string
): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "student" && message.qaId) return message.qaId;
  }
  return fallbackQaId;
}

export function hasInstructorReply(messages: LessonChatMessage[]): boolean {
  return messages.some((message) => message.role === "instructor");
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

export async function createLearningCourseQuestion(input: {
  courseId: string;
  lessonId: string;
  question: string;
  attachments?: CourseQaAttachment[];
}): Promise<CourseLearningQuestion> {
  const encodedCourseId = encodeURIComponent(input.courseId);
  const response = await apiPostNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedCourseId}/learning/qa`,
    {
      lessonId: input.lessonId,
      question: input.question,
      ...(input.attachments?.length ? { attachments: input.attachments } : {}),
    },
    getAuthHeaders()
  );
  const payload = unwrapResponse(response);
  const record = isRecord(payload) ? payload : {};
  const items = Array.isArray(record.items) ? record.items : extractList(payload);
  const lastUserMessage = [...items].reverse().find((item) => {
    if (!isRecord(item)) return false;
    return readString(item.senderType) !== "instructor";
  });
  const message = isRecord(lastUserMessage) ? lastUserMessage : {};

  return {
    id: readString(message.qaId ?? message.id, `qa-${Date.now()}`),
    studentName: "شما",
    title: input.question.split("\n")[0] || "سوال جدید",
    text: input.question,
    description: input.question,
    courseId: input.courseId,
    courseTitle: "",
    lessonId: input.lessonId,
    createdAt: readString(message.createdAt, new Date().toISOString()),
    createdAtIso: readString(message.createdAt, new Date().toISOString()),
    status: "new",
    replies: [],
  };
}
