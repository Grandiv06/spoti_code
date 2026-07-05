import {
  extractApiList,
  type DashboardCourseRow,
  normalizeCourseRow,
} from "@/app/instructor/dashboard/_lib/instructor-dashboard-data";

type UnknownRecord = Record<string, unknown>;

export type InstructorCourseRow = DashboardCourseRow & {
  slug: string;
  shortDescription: string;
  level: string;
  price: number;
  rating: number;
  durationHours: number;
  createdAt: string;
  draftStep: number;
};

function toFiniteNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function resolveLevel(row: UnknownRecord): string {
  const level = String(row.level ?? "").trim().toLowerCase();
  if (level === "elementary" || level === "intermediate" || level === "advanced") {
    return level;
  }

  const difficulty = String(row.difficulty ?? "").trim().toLowerCase();
  if (difficulty.includes("مقدم") || difficulty === "beginner" || difficulty === "elementary") {
    return "elementary";
  }
  if (difficulty.includes("پیشرف") || difficulty === "advanced") {
    return "advanced";
  }
  if (difficulty.includes("متوسط") || difficulty === "intermediate") {
    return "intermediate";
  }

  return "";
}

export function levelToDifficultyLabel(level: string): string | undefined {
  if (level === "elementary") return "مقدماتی";
  if (level === "intermediate") return "متوسط";
  if (level === "advanced") return "پیشرفته";
  return undefined;
}

export function normalizeInstructorCourseRow(row: UnknownRecord, idx: number): InstructorCourseRow {
  const base = normalizeCourseRow(row, idx);
  const cover = base.cover || "/images/course1.jpg";

  return {
    ...base,
    cover,
    slug: String(row.slug ?? "").trim(),
    shortDescription: String(row.shortDescription ?? row.description ?? "").trim(),
    level: resolveLevel(row),
    price: toFiniteNumber(row.price),
    rating: toFiniteNumber(row.rating),
    durationHours: toFiniteNumber(row.durationHours ?? row.hours),
    createdAt: typeof row.createdAt === "string" ? row.createdAt : "",
    draftStep: Math.min(Math.max(toFiniteNumber(row.draftStep) || 1, 1), 5),
  };
}

export function extractInstructorCourses(value: unknown): InstructorCourseRow[] {
  return extractApiList(value).map(normalizeInstructorCourseRow);
}

export type InstructorCoursesProfile = {
  name: string;
  avatar: string;
};

export function normalizeInstructorCoursesProfile(payload: unknown): InstructorCoursesProfile {
  if (typeof payload !== "object" || payload === null) {
    return { name: "", avatar: "" };
  }

  const root = payload as UnknownRecord;
  const profile =
    typeof root.profile === "object" && root.profile !== null
      ? (root.profile as UnknownRecord)
      : typeof root.instructor === "object" && root.instructor !== null
        ? (root.instructor as UnknownRecord)
        : root;

  const name =
    [profile.displayName, profile.fullName, profile.name].find(
      (value): value is string => typeof value === "string" && value.trim().length > 0
    )?.trim() ?? "";

  const avatar =
    typeof profile.avatar === "string" && profile.avatar.trim() ? profile.avatar.trim() : "";

  return {
    name: name ?? "",
    avatar,
  };
}
