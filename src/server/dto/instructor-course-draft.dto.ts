import { CourseCategory, CourseLevel } from "@prisma/client";

type UnknownRecord = Record<string, unknown>;

export type CourseApprovalStatus = "draft" | "pending" | "approved" | "rejected";

export type InstructorCourseLessonAttachmentDraftDto = {
  id?: string;
  name: string;
  url: string;
  size?: string | number;
};

export type InstructorCourseLessonDraftDto = {
  id: string;
  title: string;
  duration: string;
  type: string;
  access: "free" | "locked";
  videoUrl?: string;
  description?: string;
  attachments?: InstructorCourseLessonAttachmentDraftDto[];
};

export type InstructorCourseChapterDraftDto = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: InstructorCourseLessonDraftDto[];
};

export type InstructorCourseFeatureDraftDto = {
  id: string;
  title: string;
  icon: string;
  color: string;
};

export type InstructorCourseFaqDraftDto = {
  id: string;
  question: string;
  answer: string;
};

export type InstructorCourseDraftDto = {
  courseId?: string;
  step: number;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  language: string;
  duration: string;
  price: number;
  isPaid: "free" | "paid";
  cover: string;
  introVideo: string;
  shortDescription: string;
  heroTitle: string;
  specialWords: {
    highlighted: string[];
    underlined: string[];
    color: string;
  };
  aboutTitle: string;
  aboutDescription: string;
  aboutHighlights: string[];
  features: InstructorCourseFeatureDraftDto[];
  chapters: InstructorCourseChapterDraftDto[];
  faqs: InstructorCourseFaqDraftDto[];
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => readString(item)).filter(Boolean);
}

function readNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value ?? fallback);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeCategory(value: unknown): CourseCategory {
  const raw = readString(value).toLowerCase();
  if (raw === "backend") return CourseCategory.backend;
  if (raw === "ai") return CourseCategory.ai;
  if (raw === "base") return CourseCategory.base;
  if (raw === "mobile") return CourseCategory.mobile;
  if (raw === "devops") return CourseCategory.devops;
  return CourseCategory.frontend;
}

function normalizeLevel(value: unknown): CourseLevel {
  if (value === CourseLevel.elementary || value === "beginner") return CourseLevel.elementary;
  if (value === CourseLevel.advanced) return CourseLevel.advanced;
  return CourseLevel.intermediate;
}

function normalizeAttachment(value: unknown): InstructorCourseLessonAttachmentDraftDto | null {
  if (!isRecord(value)) return null;
  const name = readString(value.name ?? value.fileName ?? value.title);
  const url = readString(value.url ?? value.previewUrl);
  if (!name || !url) return null;
  const id = readString(value.id) || undefined;
  const sizeRaw = value.size ?? value.fileSize;
  const size =
    typeof sizeRaw === "number"
      ? `${(sizeRaw / (1024 * 1024)).toFixed(1)} MB`
      : readString(sizeRaw) || undefined;
  return { ...(id ? { id } : {}), name, url, ...(size ? { size } : {}) };
}

function normalizeAttachments(value: unknown): InstructorCourseLessonAttachmentDraftDto[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeAttachment(item))
    .filter((item): item is InstructorCourseLessonAttachmentDraftDto => Boolean(item));
}

function normalizeLesson(value: unknown, index: number): InstructorCourseLessonDraftDto | null {
  if (!isRecord(value)) return null;
  const title = readString(value.title);
  if (!title) return null;
  const access = value.access === "free" ? "free" : "locked";
  const videoUrl = readString(value.videoUrl);
  const description = readString(value.description ?? value.content ?? value.summary);
  const attachments = normalizeAttachments(value.attachments ?? value.files ?? value.resources);
  return {
    id: readString(value.id, `lesson-${Date.now()}-${index}`),
    title,
    duration: readString(value.duration, "00:00"),
    type: readString(value.type, "video"),
    access,
    ...(videoUrl ? { videoUrl } : {}),
    ...(description ? { description } : {}),
    ...(attachments.length ? { attachments } : {}),
  };
}

function normalizeChapter(value: unknown, index: number): InstructorCourseChapterDraftDto | null {
  if (!isRecord(value)) return null;
  const title = readString(value.title);
  if (!title) return null;
  const lessons = Array.isArray(value.lessons)
    ? value.lessons.map(normalizeLesson).filter((item): item is InstructorCourseLessonDraftDto => Boolean(item))
    : [];
  return {
    id: readString(value.id, `chapter-${Date.now()}-${index}`),
    number: readString(value.number, String(index + 1).padStart(2, "0")),
    title,
    subtitle: readString(value.subtitle),
    lessons,
  };
}

function normalizeFeature(value: unknown, index: number): InstructorCourseFeatureDraftDto | null {
  if (!isRecord(value)) return null;
  const title = readString(value.title);
  if (!title) return null;
  return {
    id: readString(value.id, `feature-${Date.now()}-${index}`),
    title,
    icon: readString(value.icon, "all_inclusive"),
    color: readString(value.color, "primary"),
  };
}

function normalizeFaq(value: unknown, index: number): InstructorCourseFaqDraftDto | null {
  if (!isRecord(value)) return null;
  const question = readString(value.question);
  const answer = readString(value.answer);
  if (!question || !answer) return null;
  return {
    id: readString(value.id, `faq-${Date.now()}-${index}`),
    question,
    answer,
  };
}

export function normalizeInstructorCourseDraftDto(input: unknown): InstructorCourseDraftDto {
  const record = isRecord(input) ? input : {};
  const specialWords = isRecord(record.specialWords) ? record.specialWords : {};
  const isPaid = record.isPaid === "free" ? "free" : "paid";
  const price = isPaid === "free" ? 0 : Math.max(0, Math.round(readNumber(record.price, 0)));

  return {
    courseId: readString(record.courseId) || undefined,
    step: Math.max(1, Math.min(5, Math.round(readNumber(record.step, 1)))),
    title: readString(record.title),
    category: normalizeCategory(record.category),
    level: normalizeLevel(record.level),
    language: readString(record.language, "فارسی"),
    duration: readString(record.duration, "0"),
    price,
    isPaid,
    cover: readString(record.cover),
    introVideo: readString(record.introVideo),
    shortDescription: readString(record.shortDescription),
    heroTitle: readString(record.heroTitle),
    specialWords: {
      highlighted: readStringArray(specialWords.highlighted),
      underlined: readStringArray(specialWords.underlined),
      color: readString(specialWords.color, "green"),
    },
    aboutTitle: readString(record.aboutTitle, "درباره این دوره"),
    aboutDescription: readString(record.aboutDescription),
    aboutHighlights: readStringArray(record.aboutHighlights),
    features: Array.isArray(record.features)
      ? record.features.map(normalizeFeature).filter((item): item is InstructorCourseFeatureDraftDto => Boolean(item))
      : [],
    chapters: Array.isArray(record.chapters)
      ? record.chapters.map(normalizeChapter).filter((item): item is InstructorCourseChapterDraftDto => Boolean(item))
      : [],
    faqs: Array.isArray(record.faqs)
      ? record.faqs.map(normalizeFaq).filter((item): item is InstructorCourseFaqDraftDto => Boolean(item))
      : [],
  };
}

export function courseApprovalStatusLabel(status: CourseApprovalStatus) {
  if (status === "approved") return "تایید شده";
  if (status === "rejected") return "رد شده";
  if (status === "pending") return "در انتظار تایید";
  return "پیش‌نویس";
}
