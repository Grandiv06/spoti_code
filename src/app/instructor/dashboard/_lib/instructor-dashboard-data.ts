type UnknownRecord = Record<string, unknown>;

export type DashboardOverview = {
  instructorName: string;
  totalCourses: number;
  students: number;
  revenue: number;
  avgRating: string;
  unreadComments: number;
  newQuestions: number;
};

export type DashboardCourseRow = {
  id: string;
  cover: string;
  title: string;
  status: "published" | "draft" | "pending" | "inactive";
  category: string;
  studentsCount: number;
  revenue: number;
  updatedAt: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function unwrapApiPayload(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current) || !("data" in current) || current.data == null) break;
    current = current.data;
  }
  return current;
}

export function extractApiList(value: unknown): UnknownRecord[] {
  const payload = unwrapApiPayload(value);
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (isRecord(payload)) {
    for (const key of ["items", "courses", "data", "results", "list"] as const) {
      const candidate = payload[key];
      if (Array.isArray(candidate)) {
        return candidate.filter(isRecord);
      }
    }
  }

  return [];
}

function toFiniteNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function readNestedString(source: UnknownRecord, path: string[]): string {
  let current: unknown = source;
  for (const key of path) {
    if (!isRecord(current)) return "";
    current = current[key];
  }

  return typeof current === "string" ? current.trim() : "";
}

export function normalizeOverview(raw: UnknownRecord | null): DashboardOverview {
  if (!raw) {
    return {
      instructorName: "",
      totalCourses: 0,
      students: 0,
      revenue: 0,
      avgRating: "0",
      unreadComments: 0,
      newQuestions: 0,
    };
  }

  const avgRaw = toFiniteNumber(raw.avgCourseStars ?? raw.avgRating);

  return {
    instructorName: readNestedString(raw, ["instructor", "fullName"]) || readNestedString(raw, ["instructor", "name"]),
    totalCourses: toFiniteNumber(raw.coursesCount ?? raw.totalCourses),
    students: toFiniteNumber(raw.studentsCount ?? raw.totalStudents),
    revenue: toFiniteNumber(raw.totalIncome ?? raw.totalRevenue),
    avgRating: clampAvgRating(avgRaw),
    unreadComments: toFiniteNumber(raw.unreadCommentsCount),
    newQuestions: toFiniteNumber(raw.unreadQasCount ?? raw.newQuestions),
  };
}

function clampAvgRating(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  return Math.min(value, 5).toFixed(1);
}

function resolveCourseStatus(row: UnknownRecord): DashboardCourseRow["status"] {
  const status = String(row.status ?? "").toLowerCase();
  if (status === "published" || status === "draft" || status === "pending" || status === "inactive") {
    return status;
  }
  if (row.isPublished === true) return "published";
  return "draft";
}

function resolveCourseCover(row: UnknownRecord): string {
  const direct = row.cover ?? row.thumbnail ?? row.thumbnailUrl;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const thumbnailFile = row.thumbnailFile;
  if (isRecord(thumbnailFile)) {
    const url = thumbnailFile.url ?? thumbnailFile.path;
    if (typeof url === "string" && url.trim()) return url.trim();
  }

  return "";
}

export function normalizeCourseRow(row: UnknownRecord, idx: number): DashboardCourseRow {
  return {
    id: String(row.id ?? row.courseId ?? idx + 1),
    cover: resolveCourseCover(row),
    title: String(row.title ?? row.name ?? "بدون عنوان"),
    status: resolveCourseStatus(row),
    category: String(row.category ?? row.categoryTitle ?? "عمومی"),
    studentsCount: toFiniteNumber(row.studentsCount ?? row.students),
    revenue: toFiniteNumber(row.revenue ?? row.totalRevenue ?? row.income),
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : "",
  };
}

export function countCourseStatuses(courses: DashboardCourseRow[]) {
  return courses.reduce(
    (acc, course) => {
      if (course.status === "published") acc.published += 1;
      else if (course.status === "draft") acc.draft += 1;
      else if (course.status === "pending") acc.pending += 1;
      return acc;
    },
    { published: 0, draft: 0, pending: 0 }
  );
}
