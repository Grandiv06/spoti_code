import type { User, PurchasedCourse, UserTicket, UserTransaction } from "@/app/admin/users/_components/types";

type UnknownRecord = Record<string, unknown>;

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

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findByKeys(source: unknown, keys: string[]): unknown {
  if (!isRecord(source)) return undefined;
  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(normalizeKey(key))) return value;
    if (isRecord(value)) {
      const nested = findByKeys(value, keys);
      if (nested !== undefined) return nested;
    }
  }
  return undefined;
}

function findNestedArray(source: unknown, keys: string[]): unknown[] {
  if (!isRecord(source)) return [];
  for (const key of keys) {
    const direct = source[key];
    if (Array.isArray(direct)) return direct;
  }
  for (const value of Object.values(source)) {
    if (Array.isArray(value)) return value;
    const nested = findNestedArray(value, keys);
    if (nested.length > 0) return nested;
  }
  return [];
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
  if (typeof value === "string" && value.trim()) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("fa-IR");
  }
  return "—";
}

function normalizeStatus(value: unknown): User["status"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["active", "enabled", "فعال", "true", "1"].includes(raw)) return "فعال";
  if (["pending", "suspended", "blocked", "معلق"].includes(raw)) return "معلق";
  return "غیرفعال";
}

function normalizePlan(value: unknown): User["plan"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["pro", "premium"].includes(raw)) return "Pro";
  if (["enterprise", "business"].includes(raw)) return "Enterprise";
  return "Starter";
}

function normalizeRole(value: unknown): User["role"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw.includes("admin")) return "ادمین";
  if (raw.includes("support") || raw.includes("moderator")) return "پشتیبان";
  return "کاربر عادی";
}

function hashToGradientSeed(input: string): string {
  const palettes = [
    "from-emerald-400 to-teal-600",
    "from-blue-400 to-indigo-600",
    "from-purple-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-cyan-400 to-blue-600",
    "from-red-400 to-rose-600",
  ];
  const hash = input.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

function mapPurchasedCourses(source: unknown): PurchasedCourse[] {
  const items = findNestedArray(source, ["purchasedCourses", "courses", "enrolledCourses"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      name: normalizeString(findByKeys(row, ["name", "title", "courseName"]), `دوره ${index + 1}`),
      purchaseDate: normalizeString(findByKeys(row, ["purchaseDate", "createdAt", "date", "boughtAt"])),
      status:
        String(findByKeys(row, ["status", "courseStatus"]) ?? "")
          .trim()
          .includes("محدود")
          ? "دسترسی محدود"
          : String(findByKeys(row, ["status", "courseStatus"]) ?? "")
              .trim()
              .includes("منقضی")
            ? "منقضی شده"
            : "فعال",
      progress: toNumber(findByKeys(row, ["progress", "percent", "completion"]), 0),
    };
  });
}

function mapTransactions(source: unknown): UserTransaction[] {
  const items = findNestedArray(source, ["recentTransactions", "transactions", "orders", "payments"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const statusRaw = String(findByKeys(row, ["status", "paymentStatus", "transactionStatus"]) ?? "").trim().toLowerCase();
    const status: UserTransaction["status"] =
      statusRaw.includes("success") || statusRaw.includes("paid") || statusRaw.includes("موفق")
        ? "موفق"
        : statusRaw.includes("pending") || statusRaw.includes("waiting") || statusRaw.includes("در انتظار")
          ? "در انتظار"
          : "ناموفق";
    return {
      id: normalizeString(findByKeys(row, ["id", "transactionId", "orderId", "code"]), `TRX-${index + 1}`),
      amount: toNumber(findByKeys(row, ["amount", "total", "value", "price"]), 0),
      status,
      date: normalizeString(findByKeys(row, ["date", "createdAt", "paidAt", "updatedAt"])),
    };
  });
}

function mapTickets(source: unknown): UserTicket[] {
  const items = findNestedArray(source, ["recentTickets", "tickets", "supportTickets"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const statusRaw = String(findByKeys(row, ["status", "ticketStatus"]) ?? "").trim().toLowerCase();
    const status: UserTicket["status"] =
      statusRaw.includes("open") || statusRaw.includes("باز")
        ? "باز"
        : statusRaw.includes("review") || statusRaw.includes("investig")
          ? "در حال بررسی"
          : "بسته شده";
    return {
      id: normalizeString(findByKeys(row, ["id", "ticketId", "code"]), `T-${index + 1}`),
      title: normalizeString(findByKeys(row, ["title", "subject", "message", "summary"]), "تیکت پشتیبانی"),
      status,
      date: normalizeString(findByKeys(row, ["date", "createdAt", "updatedAt"])),
    };
  });
}

export function normalizeAdminUserDetail(response: unknown): User {
  const payload = unwrapResponse(response);
  const row = isRecord(payload) ? payload : {};
  const id = normalizeString(findByKeys(row, ["id", "userId", "code", "username", "userName"]), "—");
  const purchasedCourses = mapPurchasedCourses(row);
  const recentTransactions = mapTransactions(row);
  const recentTickets = mapTickets(row);
  const coursesCount = toNumber(findByKeys(row, ["courses", "coursesCount", "enrolledCoursesCount"]), purchasedCourses.length);

  return {
    id,
    name: normalizeString(findByKeys(row, ["fullName", "name", "displayName", "userName"]), "کاربر"),
    phone: normalizeString(findByKeys(row, ["phoneNumber", "phone", "mobile"]), "—"),
    email: normalizeString(findByKeys(row, ["email", "mail", "userName"]), "—"),
    plan: normalizePlan(findByKeys(row, ["plan", "subscriptionPlan", "membershipPlan", "tier"])),
    status:
      typeof findByKeys(row, ["status", "accountStatus", "userStatus", "isActive"]) === "boolean"
        ? findByKeys(row, ["status", "accountStatus", "userStatus", "isActive"])
          ? "فعال"
          : "غیرفعال"
        : normalizeStatus(findByKeys(row, ["status", "accountStatus", "userStatus", "isActive"])),
    role: normalizeRole(findByKeys(row, ["role", "roleName", "userRole", "primaryRole"])),
    joinedAt: formatDate(findByKeys(row, ["joinedAt", "createdAt", "registeredAt", "signUpAt", "signupAt"])),
    courses: coursesCount ?? 0,
    ltv: toNumber(findByKeys(row, ["ltv", "lifetimeValue", "totalSpent", "spend", "revenue"]), 0),
    avatarColor: hashToGradientSeed(id),
    lastLogin: normalizeString(findByKeys(row, ["lastLogin", "lastLoginAt", "lastSeen", "updatedAt"]), "—"),
    purchasesCount: toNumber(findByKeys(row, ["purchasesCount", "purchaseCount", "ordersCount"]), purchasedCourses.length) ?? purchasedCourses.length,
    successfulTransactionsCount: toNumber(findByKeys(row, ["successfulTransactionsCount", "paidTransactionsCount", "transactionsSuccessCount"]), recentTransactions.filter((t) => t.status === "موفق").length) ?? recentTransactions.filter((t) => t.status === "موفق").length,
    supportTicketsCount: toNumber(findByKeys(row, ["supportTicketsCount", "ticketsCount", "openTicketsCount"]), recentTickets.length) ?? recentTickets.length,
    lastCourseViewed: normalizeString(findByKeys(row, ["lastCourseViewed", "lastViewedCourse", "recentCourse", "courseName"]), purchasedCourses[0]?.name ?? "—"),
    internalNotes: normalizeString(findByKeys(row, ["internalNotes", "notes", "adminNote"]), ""),
    purchasedCourses,
    recentTransactions,
    recentTickets,
  };
}
