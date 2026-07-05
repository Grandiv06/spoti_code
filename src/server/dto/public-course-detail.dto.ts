import type { Course, CourseLevel, Instructor, Prisma } from "@prisma/client";
import {
  toPublicCourseListItemDto,
  type PublicCourseListItemDto,
} from "@/server/dto/public-course.dto";
import { isPersistableMediaUrl } from "@/server/services/course-media.service";

export interface PublicCourseLessonDto {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
  isFree?: boolean;
  isFreePreview?: boolean;
  isUnlocked?: boolean;
  videoUrl?: string;
}

export interface PublicCourseChapterDto {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: PublicCourseLessonDto[];
}

export interface PublicCourseFaqDto {
  id: string;
  question: string;
  answer: string;
}

export interface PublicCourseFeatureDto {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface PublicCourseSpecialWordsDto {
  highlighted: string[];
  underlined: string[];
  color: string;
}

export interface PublicCourseInstructorDetailDto {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  avatar: string;
  displayTitle?: string;
  shortBio?: string;
  fullBiography?: string;
  bio?: string;
}

export interface PublicCourseDetailDto extends Omit<PublicCourseListItemDto, "level" | "duration" | "hours"> {
  level: string;
  levelLabel: string;
  duration: string;
  hours: string;
  about: string;
  aboutDescription: string;
  aboutTitle: string;
  aboutHighlights: string[];
  heroTitle: string;
  time: string;
  isFree: boolean;
  specialWord?: string;
  specialWords: PublicCourseSpecialWordsDto;
  features: PublicCourseFeatureDto[];
  introVideo?: string;
  introVideoDuration?: string;
  chapters: PublicCourseChapterDto[];
  faqs: PublicCourseFaqDto[];
  faq: PublicCourseFaqDto[];
  instructor: PublicCourseInstructorDetailDto;
  teacher: PublicCourseInstructorDetailDto;
}

export interface PublicCourseDetailResponseDto {
  data: PublicCourseDetailDto;
}

type CourseWithInstructor = Course & {
  instructor: Instructor;
  draftData?: Prisma.JsonValue | null;
};

type RawChapter = {
  id?: string;
  title?: string;
  subtitle?: string;
  lessons?: RawLesson[];
};

type RawLesson = {
  id?: string;
  title?: string;
  duration?: string;
  isLocked?: boolean;
  isFree?: boolean;
  isFreePreview?: boolean;
  isUnlocked?: boolean;
  videoUrl?: string;
};

type UnknownRecord = Record<string, unknown>;

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

function parseDraftData(value: Prisma.JsonValue | null | undefined): UnknownRecord | null {
  if (isRecord(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

function formatDurationLabel(hours: number) {
  return `${hours.toLocaleString("fa-IR")} ساعت`;
}

function formatLevelLabel(level: CourseLevel, difficulty: string) {
  if (level === "elementary" || difficulty === "beginner") return "مقدماتی";
  if (level === "advanced" || difficulty === "advanced") return "پیشرفته";
  return "متوسط";
}

function parseSpecialWords(
  rawSpecialWord: string | null | undefined,
  draftData: UnknownRecord | null
): PublicCourseSpecialWordsDto {
  const draftSpecialWords = draftData?.specialWords;
  if (isRecord(draftSpecialWords)) {
    return {
      highlighted: readStringArray(draftSpecialWords.highlighted),
      underlined: readStringArray(draftSpecialWords.underlined),
      color: readString(draftSpecialWords.color, "green"),
    };
  }

  if (rawSpecialWord?.trim()) {
    try {
      const parsed = JSON.parse(rawSpecialWord);
      if (isRecord(parsed)) {
        return {
          highlighted: readStringArray(parsed.highlighted),
          underlined: readStringArray(parsed.underlined),
          color: readString(parsed.color, "green"),
        };
      }
    } catch {
      return {
        highlighted: [],
        underlined: [rawSpecialWord.trim()],
        color: "green",
      };
    }
  }

  return { highlighted: [], underlined: [], color: "green" };
}

function normalizeCategoryDisplayLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "frontend") return "فرانت‌اند";
  if (normalized === "backend") return "بک‌اند";
  if (normalized === "ai") return "هوش مصنوعی";
  if (normalized === "base") return "مبانی";
  if (normalized === "mobile") return "موبایل";
  if (normalized === "devops") return "دواپس";
  return value;
}

function normalizeFeatures(draftData: UnknownRecord | null): PublicCourseFeatureDto[] {
  if (!Array.isArray(draftData?.features)) return [];

  return draftData.features
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = readString(item.title);
      if (!title) return null;
      return {
        id: readString(item.id, `feature-${index + 1}`),
        title,
        icon: readString(item.icon, "star"),
        color: readString(item.color, "primary"),
      };
    })
    .filter((item): item is PublicCourseFeatureDto => item !== null);
}

function normalizeChapters(
  raw: Prisma.JsonValue | null | undefined,
  draftData: UnknownRecord | null = null
): PublicCourseChapterDto[] {
  const draftLessonVideos = new Map<string, string>();
  if (Array.isArray(draftData?.chapters)) {
    for (const chapter of draftData.chapters) {
      if (!isRecord(chapter) || !Array.isArray(chapter.lessons)) continue;
      for (const lesson of chapter.lessons) {
        if (!isRecord(lesson)) continue;
        const lessonId = readString(lesson.id);
        const videoUrl = isPersistableMediaUrl(lesson.videoUrl);
        if (lessonId && videoUrl) draftLessonVideos.set(lessonId, videoUrl);
      }
    }
  }

  if (!Array.isArray(raw)) return [];

  return raw.map((chapter, chapterIndex) => {
    const row = (chapter ?? {}) as RawChapter;
    const lessons = Array.isArray(row.lessons) ? row.lessons : [];

    return {
      id: String(row.id ?? `chapter-${chapterIndex + 1}`),
      number: String(chapterIndex + 1).padStart(2, "0"),
      title: typeof row.title === "string" ? row.title : "",
      subtitle: typeof row.subtitle === "string" ? row.subtitle : "",
      lessons: lessons.map((lesson, lessonIndex) => {
        const lessonRow = (lesson ?? {}) as RawLesson;
        const isFreePreview = lessonRow.isFreePreview === true || lessonRow.isFree === true;
        const isLocked = lessonRow.isLocked ?? !isFreePreview;
        const lessonId = String(lessonRow.id ?? `lesson-${chapterIndex + 1}-${lessonIndex + 1}`);
        const videoUrl =
          isPersistableMediaUrl(lessonRow.videoUrl) || draftLessonVideos.get(lessonId) || undefined;

        return {
          id: lessonId,
          title: typeof lessonRow.title === "string" ? lessonRow.title : "",
          duration: typeof lessonRow.duration === "string" ? lessonRow.duration : "",
          isLocked,
          isFree: lessonRow.isFree,
          isFreePreview,
          isUnlocked: lessonRow.isUnlocked ?? isFreePreview,
          videoUrl,
        };
      }),
    };
  });
}

function normalizeFaqs(raw: Prisma.JsonValue | null | undefined): PublicCourseFaqDto[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      const row = (item ?? {}) as { id?: string; question?: string; answer?: string };
      if (typeof row.question !== "string" || typeof row.answer !== "string") return null;
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id : `faq-${index + 1}`,
        question: row.question,
        answer: row.answer,
      };
    })
    .filter((item): item is PublicCourseFaqDto => item !== null);
}

function toInstructorDetailDto(instructor: Instructor): PublicCourseInstructorDetailDto {
  return {
    id: instructor.id,
    slug: instructor.slug,
    name: instructor.name,
    fullName: instructor.name,
    avatar: instructor.avatar,
    displayTitle: instructor.displayTitle ?? undefined,
    shortBio: instructor.shortBio ?? undefined,
    fullBiography: instructor.fullBiography ?? undefined,
    bio: instructor.shortBio ?? instructor.fullBiography ?? undefined,
  };
}

export function toPublicCourseDetailDto(course: CourseWithInstructor): PublicCourseDetailDto {
  const base = toPublicCourseListItemDto(course);
  const instructor = toInstructorDetailDto(course.instructor);
  const draftData = parseDraftData(course.draftData);
  const durationLabel = formatDurationLabel(course.durationHours);
  const aboutDescription = course.aboutDescription?.trim() || course.description?.trim() || "";
  const chapters = normalizeChapters(course.chapters, draftData);
  const faqs = normalizeFaqs(course.faqs);
  const specialWords = parseSpecialWords(course.specialWord, draftData);
  const features = normalizeFeatures(draftData);
  const heroTitle = readString(draftData?.heroTitle) || course.title;
  const aboutTitle = readString(draftData?.aboutTitle) || "درباره این دوره";
  const aboutHighlights =
    readStringArray(draftData?.aboutHighlights).length > 0
      ? readStringArray(draftData?.aboutHighlights)
      : readStringArray(draftData?.objectives);
  const isFree = draftData?.isPaid === "free" || course.price <= 0;
  const levelLabel = formatLevelLabel(course.level, course.difficulty);
  const introVideo =
    isPersistableMediaUrl(course.introVideo) || isPersistableMediaUrl(draftData?.introVideo) || undefined;

  return {
    ...base,
    categoryTitle: normalizeCategoryDisplayLabel(base.categoryTitle || base.categoryName || base.category),
    categoryName: normalizeCategoryDisplayLabel(base.categoryName || base.categoryTitle || base.category),
    about: aboutDescription,
    aboutDescription,
    aboutTitle,
    aboutHighlights,
    heroTitle,
    time: durationLabel,
    duration: durationLabel,
    hours: durationLabel,
    difficulty: course.difficulty,
    level: course.level,
    levelLabel,
    isFree,
    specialWord: course.specialWord ?? undefined,
    specialWords,
    features,
    introVideo,
    introVideoDuration: course.introVideoDuration ?? undefined,
    chapters,
    faqs,
    faq: faqs,
    instructor,
    teacher: instructor,
    instructorName: instructor.name,
    teacherName: instructor.name,
    instructorAvatar: instructor.avatar,
    teacherAvatar: instructor.avatar,
    instructorSlug: instructor.slug,
    instructorId: instructor.id,
  };
}
