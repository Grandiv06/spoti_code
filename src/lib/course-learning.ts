import { apiGetNoMock, apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

type CourseRecord = Record<string, unknown>;

export function unwrapApiData<T = unknown>(payload: unknown): T | null {
  if (payload == null) return null;
  if (typeof payload !== "object") return payload as T;
  const wrapped = payload as { data?: unknown };
  if ("data" in wrapped && wrapped.data !== undefined) {
    return wrapped.data as T;
  }
  return payload as T;
}

export async function fetchCourseSteps(courseId: string): Promise<unknown> {
  const encodedId = encodeURIComponent(courseId);
  return apiGetNoMock<unknown>(
    `/api/courses/${encodedId}/steps?inclueLessons=true`,
    getAuthHeaders()
  );
}

export async function fetchCourseLearningPage(courseId: string): Promise<unknown> {
  const encodedId = encodeURIComponent(courseId);
  return apiGetNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedId}/learning`,
    getAuthHeaders()
  );
}

export async function fetchCourseLessonById(courseId: string, lessonId: string): Promise<unknown> {
  const encodedCourseId = encodeURIComponent(courseId);
  const encodedId = encodeURIComponent(lessonId);
  return apiGetNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedCourseId}/learning/lessons/${encodedId}`,
    getAuthHeaders()
  );
}

export async function fetchPublicCourseById(courseId: string): Promise<unknown> {
  const encodedId = encodeURIComponent(courseId);
  return apiGetNoMock<unknown>(
    `/api/courses/public/${encodedId}?inclueSteps=true&inclueLessons=true`,
    getAuthHeaders()
  );
}

export async function completeCourseLesson(courseId: string, lessonId: string): Promise<unknown> {
  const encodedCourseId = encodeURIComponent(courseId);
  const encodedId = encodeURIComponent(lessonId);
  return apiPostNoMock<unknown>(
    `/api/dashboard/my-courses/${encodedCourseId}/learning/lessons/${encodedId}/complete`,
    undefined,
    getAuthHeaders()
  );
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readDuration(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const totalSeconds = Math.max(0, Math.round(value));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  return "—";
}

function readAttachments(raw: unknown): Array<{ name: string; size: string }> {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const record = (item ?? {}) as CourseRecord;
      const name = readString(record.name ?? record.fileName ?? record.title, "");
      if (!name) return null;
      const sizeRaw = record.size ?? record.fileSize;
      const size =
        typeof sizeRaw === "number"
          ? `${(sizeRaw / (1024 * 1024)).toFixed(1)} MB`
          : readString(sizeRaw, "—");
      return { name, size };
    })
    .filter(Boolean) as Array<{ name: string; size: string }>;
}

export type MappedLesson = {
  id: string;
  title: string;
  duration: string;
  isWatched: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
  description: string;
  attachments: Array<{ name: string; size: string }>;
};

export type MappedChapter = {
  id: string;
  title: string;
  lessons: MappedLesson[];
};

export function mapLessonRecord(record: CourseRecord, index: number): MappedLesson {
  const id = readString(record.id ?? record.lessonId, `lesson-${index + 1}`);
  const isLocked = Boolean(record.isLocked ?? record.locked ?? false);
  const isCompleted = Boolean(record.isCompleted ?? record.completed ?? false);
  const isWatched = Boolean(record.isWatched ?? record.watched ?? isCompleted);

  return {
    id,
    title: readString(record.title ?? record.name, `درس ${index + 1}`),
    duration: readDuration(record.duration ?? record.durationSeconds ?? record.length),
    isWatched,
    isCompleted,
    isLocked,
    videoUrl: readString(record.videoUrl ?? record.video ?? record.mediaUrl, "") || undefined,
    description: readString(record.description ?? record.content ?? record.summary, ""),
    attachments: readAttachments(record.attachments ?? record.files ?? record.resources),
  };
}

export function mapStepsToChapters(steps: unknown): MappedChapter[] {
  const list = Array.isArray(steps) ? steps : [];
  return list.map((step, stepIndex) => {
    const record = (step ?? {}) as CourseRecord;
    const lessonsRaw = record.lessons ?? record.courseLessons ?? record.items;
    const lessons = Array.isArray(lessonsRaw)
      ? lessonsRaw.map((lesson, lessonIndex) => mapLessonRecord((lesson ?? {}) as CourseRecord, lessonIndex))
      : [];

    return {
      id: readString(record.id ?? record.stepId, `chapter-${stepIndex + 1}`),
      title: readString(record.title ?? record.name, `فصل ${stepIndex + 1}`),
      lessons,
    };
  });
}

export function readCourseId(source: unknown, fallback = ""): string {
  if (!source || typeof source !== "object") return fallback;
  const record = source as Record<string, unknown>;
  const nestedCourse =
    typeof record.course === "object" && record.course
      ? (record.course as Record<string, unknown>)
      : null;
  const nestedStep =
    typeof record.step === "object" && record.step
      ? (record.step as Record<string, unknown>)
      : null;

  return readString(
    record.courseId ??
      record.id ??
      nestedCourse?.id ??
      nestedStep?.courseId,
    fallback
  );
}

export function mergeLessonDetail(lesson: MappedLesson, detail: unknown): MappedLesson {
  if (!detail || typeof detail !== "object") return lesson;
  const record = detail as CourseRecord;
  return {
    ...lesson,
    ...mapLessonRecord({ ...lesson, ...record }, 0),
    id: lesson.id,
  };
}

export function readCourseMeta(course: CourseRecord) {
  const instructorRaw = course.instructor ?? course.teacher;
  const instructor =
    typeof instructorRaw === "object" && instructorRaw
      ? readString(
          (instructorRaw as CourseRecord).fullName ??
            (instructorRaw as CourseRecord).name ??
            (instructorRaw as CourseRecord).title
        )
      : readString(instructorRaw, "نامشخص");

  const progressRaw = Number(course.progress ?? course.progressPercent ?? course.completionPercent ?? 0);
  const progress = Number.isFinite(progressRaw) ? Math.max(0, Math.min(100, progressRaw)) : 0;
  const playerTypeRaw = readString(course.playerType ?? course.deliveryType, "internal").toLowerCase();

  return {
    id: readString(course.id ?? course.courseId ?? course.uuid, ""),
    title: readString(course.title ?? course.name, "دوره بدون عنوان"),
    instructor,
    progress,
    playerType: playerTypeRaw.includes("spot") ? ("spotplayer" as const) : ("internal" as const),
    licenseKey: readString(course.licenseKey ?? course.spotPlayerLicense, "") || undefined,
    downloadLinks:
      typeof course.downloadLinks === "object" && course.downloadLinks
        ? (course.downloadLinks as {
            windows: string;
            android: string;
            mac: string;
          })
        : undefined,
  };
}

export function findFirstUnlockedLessonId(chapters: MappedChapter[]): string | null {
  for (const chapter of chapters) {
    const lesson = chapter.lessons.find((item) => !item.isLocked);
    if (lesson) return lesson.id;
  }
  return chapters[0]?.lessons[0]?.id ?? null;
}
