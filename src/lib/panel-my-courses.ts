import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

export type PanelCourseItem = {
  enrollmentId: string;
  id: string;
  title: string;
  progress: number;
  image?: string;
  instructor: string;
};

function getCourseList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const row = payload as { data?: unknown; items?: unknown[] };
    if (Array.isArray(row.data)) return row.data;
    if (Array.isArray(row.items)) return row.items;
    if (row.data && typeof row.data === "object") {
      const nested = row.data as { items?: unknown[]; data?: unknown[] };
      if (Array.isArray(nested.items)) return nested.items;
      if (Array.isArray(nested.data)) return nested.data;
    }
  }
  return [];
}

export function mapMyCoursesResponse(result: unknown): PanelCourseItem[] {
  const rawList = getCourseList(result);

  return rawList.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const course =
      typeof row.course === "object" && row.course
        ? (row.course as Record<string, unknown>)
        : row;
    const progressRecord =
      typeof row.progress === "object" && row.progress
        ? (row.progress as Record<string, unknown>)
        : null;
    const thumbnailFile =
      typeof course.thumbnailFile === "object" && course.thumbnailFile
        ? (course.thumbnailFile as Record<string, unknown>)
        : null;
    const teacher =
      typeof course.teacher === "object" && course.teacher
        ? (course.teacher as Record<string, unknown>)
        : null;

    const id = String(course.id ?? row.courseId ?? index + 1);
    const enrollmentId = String(row.id ?? `${id}-${index}`);
    const title = String(course.title ?? course.name ?? row.title ?? row.name ?? "دوره بدون عنوان");
    const progressRaw = Number(
      progressRecord?.percentage ??
        row.progressPercent ??
        row.completionPercent ??
        (typeof row.progress === "number" ? row.progress : 0)
    );
    const progress = Number.isFinite(progressRaw) ? Math.max(0, Math.min(100, progressRaw)) : 0;
    const image =
      typeof thumbnailFile?.url === "string"
        ? thumbnailFile.url
        : typeof course.thumbnail === "string"
          ? course.thumbnail
          : typeof course.cover === "string"
            ? course.cover
            : typeof row.image === "string"
              ? row.image
              : undefined;
    const instructor = String(
      teacher?.fullName ??
        teacher?.name ??
        row.instructorName ??
        (typeof row.instructor === "object" && row.instructor
          ? (row.instructor as Record<string, unknown>).fullName ??
            (row.instructor as Record<string, unknown>).name
          : row.instructor) ??
        "نامشخص"
    );

    return { enrollmentId, id, title, progress, image, instructor };
  });
}

export async function fetchMyCourses(): Promise<PanelCourseItem[]> {
  const result = await apiGetNoMock<unknown>("/api/dashboard/my-courses", getAuthHeaders());
  return mapMyCoursesResponse(result);
}
