import type { Course, Instructor } from "@prisma/client";

export type LearningAttachmentDto = {
  name: string;
  size: string;
  url?: string;
};

export type LearningLessonDto = {
  id: string;
  title: string;
  duration: string;
  isWatched: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
  description: string;
  attachments: LearningAttachmentDto[];
};

export type LearningChapterDto = {
  id: string;
  title: string;
  lessons: LearningLessonDto[];
};

export type CourseLearningPageDto = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  playerType: "internal" | "spotplayer";
  chapters: LearningChapterDto[];
  licenseKey?: string;
  downloadLinks?: {
    windows: string;
    android: string;
    mac: string;
  };
};

export type CourseLearningLessonDto = LearningLessonDto & {
  courseId: string;
};

export type CourseLearningCompleteLessonDto = {
  id: string;
  isCompleted: boolean;
  completed: boolean;
  isWatched: boolean;
  watched: boolean;
  progress: number;
};

export type CourseLearningQaAttachmentDto = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  caption?: string;
};

export type CourseLearningQaMessageDto = {
  id: string;
  qaId: string;
  senderType: "user" | "instructor";
  senderName: string;
  body: string;
  createdAt: string;
  attachments?: CourseLearningQaAttachmentDto[];
};

export type CourseLearningQaThreadDto = {
  items: CourseLearningQaMessageDto[];
  instructor: {
    id: string;
    name: string;
    fullName: string;
    avatar: string;
  };
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

export type CreateCourseLearningQaDto = {
  lessonId?: unknown;
  question?: unknown;
  body?: unknown;
  text?: unknown;
  attachments?: unknown;
};

type RawChapter = {
  id?: unknown;
  title?: unknown;
  name?: unknown;
  lessons?: unknown;
};

type RawLesson = {
  id?: unknown;
  lessonId?: unknown;
  title?: unknown;
  name?: unknown;
  duration?: unknown;
  durationSeconds?: unknown;
  isLocked?: unknown;
  locked?: unknown;
  isFree?: unknown;
  isFreePreview?: unknown;
  videoUrl?: unknown;
  video?: unknown;
  mediaUrl?: unknown;
  description?: unknown;
  content?: unknown;
  summary?: unknown;
  attachments?: unknown;
  files?: unknown;
  resources?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function readDuration(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) {
    const totalSeconds = Math.max(0, Math.round(value));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  return "—";
}

function readAttachments(value: unknown): LearningAttachmentDto[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const name = readString(item.name ?? item.fileName ?? item.title);
      if (!name) return null;
      const sizeRaw = item.size ?? item.fileSize;
      const size =
        typeof sizeRaw === "number"
          ? `${(sizeRaw / (1024 * 1024)).toFixed(1)} MB`
          : readString(sizeRaw, "—");
      const url = readString(item.url ?? item.previewUrl);
      return { name, size, ...(url ? { url } : {}) };
    })
    .filter(Boolean) as LearningAttachmentDto[];
}

function readChapters(course: Pick<Course, "id" | "chapters" | "introVideo" | "aboutDescription" | "description">) {
  const rawChapters = Array.isArray(course.chapters) ? (course.chapters as RawChapter[]) : [];

  return rawChapters.map((chapter, chapterIndex) => {
    const lessonsRaw = Array.isArray(chapter.lessons) ? (chapter.lessons as RawLesson[]) : [];

    return {
      id: readString(chapter.id, `${course.id}-chapter-${chapterIndex + 1}`),
      title: readString(chapter.title ?? chapter.name, `فصل ${chapterIndex + 1}`),
      lessons: lessonsRaw.map((lesson, lessonIndex) => ({
        chapterIndex,
        lessonIndex,
        id: readString(lesson.id ?? lesson.lessonId, `${course.id}-lesson-${chapterIndex + 1}-${lessonIndex + 1}`),
        title: readString(lesson.title ?? lesson.name, `درس ${lessonIndex + 1}`),
        duration: readDuration(lesson.duration ?? lesson.durationSeconds),
        isLocked: Boolean(lesson.isLocked ?? lesson.locked ?? false),
        isFree: lesson.isFree === true || lesson.isFreePreview === true,
        videoUrl: readString(lesson.videoUrl ?? lesson.video ?? lesson.mediaUrl ?? course.introVideo) || undefined,
        description: readString(lesson.description ?? lesson.content ?? lesson.summary),
        attachments: readAttachments(lesson.attachments ?? lesson.files ?? lesson.resources),
      })),
    };
  });
}

function completedCountFromProgress(totalLessons: number, progress: number) {
  if (totalLessons <= 0) return 0;
  return Math.floor((Math.max(0, Math.min(100, progress)) / 100) * totalLessons);
}

export function buildCourseLearningDto(
  course: Course & { instructor: Instructor },
  progress: number
): CourseLearningPageDto {
  const sourceChapters = readChapters(course);
  const totalLessons = sourceChapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const completedCount = completedCountFromProgress(totalLessons, progress);
  let lessonOrder = 0;

  const chapters = sourceChapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessons: chapter.lessons.map((lesson) => {
      lessonOrder += 1;
      const isCompleted = lessonOrder <= completedCount;
      return {
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        isWatched: isCompleted,
        isCompleted,
        isLocked: false,
        videoUrl: lesson.videoUrl,
        description: lesson.description,
        attachments: lesson.attachments,
      };
    }),
  }));

  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor.name,
    progress: Math.max(0, Math.min(100, progress)),
    playerType: course.specialWord?.toLowerCase().includes("spotplayer") ? "spotplayer" : "internal",
    chapters,
  };
}

export function findLearningLesson(
  course: Course & { instructor: Instructor },
  lessonId: string,
  progress: number
): CourseLearningLessonDto | null {
  const learning = buildCourseLearningDto(course, progress);
  for (const chapter of learning.chapters) {
    const lesson = chapter.lessons.find((item) => item.id === lessonId);
    if (lesson) return { ...lesson, courseId: course.id };
  }
  return null;
}

export function calculateProgressAfterLesson(course: Course, lessonId: string, currentProgress: number) {
  const chapters = readChapters(course);
  const lessons = chapters.flatMap((chapter) => chapter.lessons);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1 || lessons.length === 0) return currentProgress;
  const nextProgress = Math.round(((index + 1) / lessons.length) * 100);
  return Math.max(currentProgress, nextProgress);
}

export function readQaQuestionText(input: CreateCourseLearningQaDto) {
  return readString(input.question ?? input.body ?? input.text);
}
