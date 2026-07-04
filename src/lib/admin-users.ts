import type { User } from "@/app/admin/users/_components/types";
import {
  ApplicationMainRoles,
  normalizeApplicationMainRole,
  pickPrimaryApplicationRole,
  type ApplicationMainRole,
} from "@/lib/application-roles";
import { formatJalaliDate } from "@/lib/dates";

type UnknownRecord = Record<string, unknown>;

export type AdminUsersQueryParams = {
  search?: string;
  email?: string;
  phoneNumber?: string;
  nationalCode?: string;
  role?: string;
  page?: number;
  limit?: number;
};

export type AdminUsersResponse = {
  users: User[];
  total?: number;
  page?: number;
  limit?: number;
};

const ROLE_MAP: Record<string, ApplicationMainRole> = {
  super_admin: ApplicationMainRoles.SUPER_ADMIN,
  superadmin: ApplicationMainRoles.SUPER_ADMIN,
  admin: ApplicationMainRoles.ADMIN,
  administrator: ApplicationMainRoles.ADMIN,
  instructor: ApplicationMainRoles.INSTRUCTOR,
  teacher: ApplicationMainRoles.INSTRUCTOR,
  user: ApplicationMainRoles.USER,
  customer: ApplicationMainRoles.USER,
  student: ApplicationMainRoles.USER,
  support: ApplicationMainRoles.USER,
  support_agent: ApplicationMainRoles.USER,
  moderator: ApplicationMainRoles.USER,
  "کاربر عادی": ApplicationMainRoles.USER,
  ادمین: ApplicationMainRoles.ADMIN,
  پشتیبان: ApplicationMainRoles.USER,
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
  return formatJalaliDate(value);
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
  if (!raw) return "فعال";
  if (["active", "enabled", "activeuser", "فعال", "true", "1"].includes(raw)) return "فعال";
  if (["pending", "suspended", "blocked", "معلق"].includes(raw)) return "معلق";
  return "غیرفعال";
}

function normalizeRole(value: unknown): ApplicationMainRole {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw in ROLE_MAP) return ROLE_MAP[raw];
  return normalizeApplicationMainRole(value);
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
    role: roles.length > 0 ? pickPrimaryApplicationRole(roles) : normalizeRole(roleFromRoles || roleValue),
    joinedAt: formatDate(
      findByKeys(row, ["joinedSince", "joinedAt", "createdAt", "registeredAt", "signUpAt", "signupAt"])
    ),
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

export function normalizeAdminUser(response: unknown): User {
  const payload = unwrapResponse(response);
  if (Array.isArray(payload) && payload.length > 0) {
    return normalizeUser(payload[0], 0);
  }
  return normalizeUser(payload, 0);
}

export type AdminUserUpdateInput = {
  name: string;
  phone: string;
  email: string;
  status: User["status"];
  role: ApplicationMainRole;
  internalNotes: string;
};

function normalizePhoneForApi(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("98") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("09") && digits.length === 11) return `+98${digits.slice(1)}`;
  return phone.trim();
}

export function isValidIranPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^09\d{9}$/.test(digits) || /^989\d{9}$/.test(digits);
}

export function buildAdminUserUpdatePayload(input: AdminUserUpdateInput): Record<string, unknown> {
  const isActive = input.status === "فعال";
  const payload: Record<string, unknown> = {
    fullName: input.name.trim(),
    email: input.email.trim(),
    phoneNumber: normalizePhoneForApi(input.phone),
    isActive,
    status: input.status,
    roleName: input.role,
  };

  const note = input.internalNotes.trim();
  if (note) {
    payload.internalAdminNote = note;
  }

  return payload;
}
