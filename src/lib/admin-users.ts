import type { User } from "@/app/admin/users/_components/types";

type UnknownRecord = Record<string, unknown>;

export type AdminUsersQueryParams = {
  search?: string;
  email?: string;
  phoneNumber?: string;
  nationalCode?: string;
  page?: number;
  limit?: number;
};

export type AdminUsersResponse = {
  users: User[];
  total?: number;
  page?: number;
  limit?: number;
};

const ROLE_MAP: Record<string, User["role"]> = {
  admin: "ادمین",
  administrator: "ادمین",
  superadmin: "ادمین",
  super_admin: "ادمین",
  user: "کاربر عادی",
  customer: "کاربر عادی",
  student: "کاربر عادی",
  support: "پشتیبان",
  support_agent: "پشتیبان",
  moderator: "پشتیبان",
};

const PLAN_MAP: Record<string, User["plan"]> = {
  starter: "Starter",
  basic: "Starter",
  free: "Starter",
  pro: "Pro",
  premium: "Pro",
  enterprise: "Enterprise",
  business: "Enterprise",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current) || !("data" in current) || current.data == null) {
      break;
    }
    current = current.data;
  }
  return current;
}

function extractArray(value: unknown): unknown[] {
  const payload = unwrapResponse(value);
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    for (const key of ["items", "data", "results", "users", "list"] as const) {
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

function findByKeys(source: unknown, keys: string[]): unknown {
  if (!isRecord(source)) return undefined;
  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(normalizeKey(key))) return value;
  }
  return undefined;
}

function toNumber(value: unknown, fallback?: number): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("fa-IR");
  }
  return "—";
}

function formatMoney(value: unknown): number {
  return toNumber(value, 0) ?? 0;
}

function normalizePlan(value: unknown): User["plan"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw in PLAN_MAP) return PLAN_MAP[raw];
  return "Starter";
}

function normalizeStatus(value: unknown): User["status"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["active", "enabled", "activeuser", "فعال", "true", "1"].includes(raw)) return "فعال";
  if (["pending", "suspended", "blocked", "معلق"].includes(raw)) return "معلق";
  return "غیرفعال";
}

function normalizeRole(value: unknown): User["role"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw in ROLE_MAP) return ROLE_MAP[raw];
  if (raw.includes("admin")) return "ادمین";
  if (raw.includes("support")) return "پشتیبان";
  return "کاربر عادی";
}

function getRoles(raw: UnknownRecord): string[] {
  const roles = findByKeys(raw, ["roles", "role"]);
  if (Array.isArray(roles)) {
    return roles
      .map((item) => {
        if (typeof item === "string") return item;
        if (isRecord(item)) return String(item.name ?? item.title ?? "");
        return "";
      })
      .filter(Boolean);
  }
  if (typeof roles === "string") return [roles];
  return [];
}

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalizeUser(raw: unknown, index: number): User {
  const row = isRecord(raw) ? raw : {};
  const roles = getRoles(row);
  const roleValue = findByKeys(row, ["role", "roleName", "userRole"]);
  const roleFromRoles = roles[0];
  const planValue = findByKeys(row, ["plan", "subscriptionPlan", "membershipPlan", "tier"]);
  const statusValue = findByKeys(row, ["status", "accountStatus", "userStatus", "isActive"]);

  return {
    id: normalizeString(findByKeys(row, ["id", "userId", "code", "username", "userName"]), `USR-${index + 1}`),
    name: normalizeString(findByKeys(row, ["fullName", "name", "displayName", "userName"]), "کاربر"),
    phone: normalizeString(findByKeys(row, ["phoneNumber", "phone", "mobile"]), "—"),
    email: normalizeString(findByKeys(row, ["email", "mail", "userName"]), "—"),
    plan: normalizePlan(planValue),
    status:
      typeof statusValue === "boolean"
        ? statusValue
          ? "فعال"
          : "غیرفعال"
        : normalizeStatus(statusValue),
    role: normalizeRole(roleFromRoles || roleValue),
    joinedAt: formatDate(findByKeys(row, ["joinedAt", "createdAt", "registeredAt", "signUpAt", "signupAt"])),
    courses: toNumber(findByKeys(row, ["courses", "coursesCount", "enrolledCoursesCount", "purchasedCoursesCount"]), 0) ?? 0,
    ltv: formatMoney(findByKeys(row, ["ltv", "lifetimeValue", "totalSpent", "spend", "revenue"])),
    avatarColor: normalizeString(findByKeys(row, ["avatarColor", "avatarGradient"]), ""),
    lastLogin: normalizeString(findByKeys(row, ["lastLogin", "lastLoginAt", "lastSeen", "lastActiveAt"]), "—"),
    purchasesCount: toNumber(findByKeys(row, ["purchasesCount", "purchaseCount", "ordersCount", "transactionsCount"]), 0) ?? 0,
    successfulTransactionsCount: toNumber(findByKeys(row, ["successfulTransactionsCount", "paidTransactionsCount", "transactionsSuccessCount"]), 0) ?? 0,
    supportTicketsCount: toNumber(findByKeys(row, ["supportTicketsCount", "ticketsCount", "openTicketsCount"]), 0) ?? 0,
    lastCourseViewed: normalizeString(findByKeys(row, ["lastCourseViewed", "lastViewedCourse", "recentCourse", "courseName"]), "—"),
    internalNotes: normalizeString(
      findByKeys(row, ["internalAdminNote", "internalNotes", "internalNote", "notes", "adminNote"]),
      ""
    ),
    purchasedCourses: [],
    recentTransactions: [],
    recentTickets: [],
  };
}

export function normalizeAdminUsersResponse(response: unknown): AdminUsersResponse {
  const items = extractArray(response);
  const payload = unwrapResponse(response);
  const meta = isRecord(payload) ? (payload.meta as UnknownRecord | undefined) : undefined;

  return {
    users: items.map((item, index) => normalizeUser(item, index)),
    total: toNumber(meta?.total ?? meta?.itemCount ?? meta?.count),
    page: toNumber(meta?.page),
    limit: toNumber(meta?.limit),
  };
}
