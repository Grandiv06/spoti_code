import type { Course } from "@/app/admin/courses/_components/types";

type UnknownRecord = Record<string, unknown>;

const CATEGORY_MAP: Record<string, Course["category"]> = {
  frontend: "Frontend",
  front: "Frontend",
  web: "Frontend",
  base: "Frontend",
  backend: "Backend",
  back: "Backend",
  api: "Backend",
  ai: "Backend",
  devops: "DevOps",
  mobile: "Mobile",
  android: "Mobile",
  ios: "Mobile",
  uiux: "UI/UX",
  ui: "UI/UX",
  ux: "UI/UX",
  design: "UI/UX",
};

const LEVEL_MAP: Record<string, Course["level"]> = {
  beginner: "مقدماتی",
  basic: "مقدماتی",
  intro: "مقدماتی",
  intermediate: "متوسط",
  medium: "متوسط",
  advanced: "پیشرفته",
  expert: "پیشرفته",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current) || !("data" in current) || current.data == null) break;
    current = current.data;
  }
  return current;
}

function extractArray(value: unknown): unknown[] {
  const payload = unwrapResponse(value);
  if (Array.isArray(payload)) return payload;

  if (isRecord(payload)) {
    for (const key of ["items", "courses", "data", "results", "list"] as const) {
      const candidate = payload[key];
      if (Array.isArray(candidate)) return candidate;
      if (isRecord(candidate)) {
        const nested = extractArray(candidate);
        if (nested.length > 0) return nested;
      }
    }
  }

  return [];
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findByKeys(source: unknown, keys: string[], depth = 3): unknown {
  if (depth < 0) return undefined;
  if (!isRecord(source)) return undefined;

  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(normalizeKey(key))) return value;
  }

  for (const value of Object.values(source)) {
    if (isRecord(value)) {
      const nested = findByKeys(value, keys, depth - 1);
      if (nested !== undefined) return nested;
    }
  }

  return undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function formatDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? value.trim() : new Date(timestamp).toLocaleDateString("fa-IR");
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("fa-IR");
  }
  return "—";
}

function normalizeCategory(value: unknown): Course["category"] {
  const raw = normalizeString(value, "Frontend");
  const key = normalizeKey(raw);
  return CATEGORY_MAP[key] ?? (["Frontend", "Backend", "DevOps", "Mobile", "UI/UX"].includes(raw) ? (raw as Course["category"]) : "Frontend");
}

function normalizeStatus(source: UnknownRecord): Course["status"] {
  const approvalStatus = normalizeString(findByKeys(source, ["approvalStatus", "reviewStatus", "publishApprovalStatus"]), "").toLowerCase();
  if (["pending", "review", "underreview"].includes(approvalStatus)) return "در انتظار بررسی";
  if (["rejected"].includes(approvalStatus)) return "غیرفعال";
  if (["draft"].includes(approvalStatus)) return "پیش‌نویس";

  const isPublished = findByKeys(source, ["isPublished", "published"]);
  if (typeof isPublished === "boolean") return isPublished ? "منتشر شده" : "پیش‌نویس";

  const raw = normalizeString(findByKeys(source, ["status", "publishStatus", "state"]), "").toLowerCase();
  if (["published", "active", "accepted", "منتشر شده"].includes(raw)) return "منتشر شده";
  if (["pending", "review", "underreview", "در انتظار بررسی"].includes(raw)) return "در انتظار بررسی";
  if (["inactive", "disabled", "archived", "غیرفعال"].includes(raw)) return "غیرفعال";
  return "پیش‌نویس";
}

function normalizeLevel(value: unknown): Course["level"] {
  const raw = normalizeString(value, "متوسط");
  const key = normalizeKey(raw);
  return LEVEL_MAP[key] ?? (["مقدماتی", "متوسط", "پیشرفته"].includes(raw) ? (raw as Course["level"]) : "متوسط");
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (isRecord(item)) return normalizeString(item.title ?? item.name ?? item.label, "");
        return "";
      })
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeInstructor(source: UnknownRecord): string {
  const instructor = findByKeys(source, ["instructor", "teacher", "mentor"]);
  if (isRecord(instructor)) {
    return normalizeString(instructor.fullName ?? instructor.name ?? instructor.title ?? instructor.userName, "مدرس اسپاتی‌کد");
  }
  return normalizeString(
    findByKeys(source, ["instructorName", "teacherName", "mentorName", "authorName"]),
    "مدرس اسپاتی‌کد"
  );
}

function normalizeDuration(source: UnknownRecord): string {
  const rawDuration = findByKeys(source, ["duration", "durationText", "totalDuration"]);
  if (typeof rawDuration === "string" && rawDuration.trim()) return rawDuration.trim();

  const hours = toNumber(findByKeys(source, ["durationHours", "hours", "totalHours"]), 0);
  return hours > 0 ? `${hours.toLocaleString("fa-IR")} ساعت` : "—";
}

function normalizeCourse(raw: unknown, index: number): Course {
  const row = isRecord(raw) ? raw : {};
  const title = normalizeString(findByKeys(row, ["title", "name", "courseTitle"]), "دوره بدون عنوان");
  const id = normalizeString(findByKeys(row, ["id", "courseId", "code", "slug"]), `CRS-${index + 1}`);
  const students = toNumber(findByKeys(row, ["students", "studentsCount", "enrolledCount", "usersCount", "ordersCount"]), 0);
  const price = toNumber(findByKeys(row, ["price", "amount", "finalPrice", "regularPrice"]), 0);
  const revenue = toNumber(findByKeys(row, ["revenue", "totalRevenue", "sales", "income", "paidAmount"]), students * price);
  const completion = Math.min(
    100,
    Math.max(0, toNumber(findByKeys(row, ["completion", "completionRate", "averageCompletion", "progress"]), 0))
  );

  return {
    id,
    title,
    instructor: normalizeInstructor(row),
    category: normalizeCategory(findByKeys(row, ["category", "type", "courseCategory"])),
    students,
    completion,
    revenue,
    status: normalizeStatus(row),
    price,
    publishDate: formatDate(findByKeys(row, ["publishDate", "publishedAt", "createdAt"])),
    updatedAt: formatDate(findByKeys(row, ["updatedAt", "modifiedAt", "lastUpdated"])),
    shortDescription: normalizeString(findByKeys(row, ["shortDescription", "summary", "excerpt"]), ""),
    description: normalizeString(findByKeys(row, ["description", "content", "body"]), ""),
    level: normalizeLevel(findByKeys(row, ["level", "difficulty"])),
    duration: normalizeDuration(row),
    coverImage: normalizeString(findByKeys(row, ["coverImage", "cover", "thumbnail", "image"]), ""),
    tags: normalizeStringList(findByKeys(row, ["tags", "keywords"])),
    prerequisites: normalizeStringList(findByKeys(row, ["prerequisites", "requirements"])),
    chapters: [],
    studentsList: [],
    reviews: [],
    refundRate: toNumber(findByKeys(row, ["refundRate", "refundPercent"]), 0),
  };
}

export function normalizeAdminCoursesResponse(response: unknown): Course[] {
  return extractArray(response).map((item, index) => normalizeCourse(item, index));
}
