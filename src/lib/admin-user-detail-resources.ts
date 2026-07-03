import type {
  PurchasedCourse,
  UserActivity,
  UserTicket,
  UserTransaction,
} from "@/app/admin/users/_components/types";

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

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeCourseStatus(value: unknown): PurchasedCourse["status"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw.includes("محدود") || raw.includes("limited")) return "دسترسی محدود";
  if (raw.includes("منقض") || raw.includes("expired")) return "منقضی شده";
  return "فعال";
}

function normalizeTransactionStatus(value: unknown): UserTransaction["status"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["success", "paid", "successful", "موفق"].includes(raw) || raw.includes("paid")) return "موفق";
  if (["pending", "waiting", "در انتظار"].includes(raw) || raw.includes("pending")) return "در انتظار";
  return "ناموفق";
}

function normalizeTicketStatus(value: unknown): UserTicket["status"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["open", "باز"].includes(raw) || raw.includes("open")) return "باز";
  if (["underreview", "investigating", "در حال بررسی"].includes(raw) || raw.includes("review")) return "در حال بررسی";
  return "بسته شده";
}

function normalizeActivityKind(value: unknown): UserActivity["kind"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw.includes("login") || raw.includes("signin")) return "login";
  if (raw.includes("payment") || raw.includes("transaction") || raw.includes("purchase")) return "payment";
  if (raw.includes("lesson") || raw.includes("course") || raw.includes("video")) return "lesson";
  if (raw.includes("ticket") || raw.includes("support")) return "ticket";
  if (raw.includes("profile") || raw.includes("account")) return "profile";
  if (raw.includes("order")) return "order";
  return "other";
}

function extractArray(response: unknown, keys: string[]): unknown[] {
  const payload = unwrapResponse(response);
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    for (const key of keys) {
      const candidate = payload[key];
      if (Array.isArray(candidate)) return candidate;
      if (isRecord(candidate)) {
        const nested = extractArray(candidate, keys);
        if (nested.length > 0) return nested;
      }
    }
    const nested = findNestedArray(payload, keys);
    if (nested.length > 0) return nested;
  }
  return [];
}

export function normalizePurchasedCoursesResponse(response: unknown): PurchasedCourse[] {
  return extractArray(response, ["items", "courses", "results", "data", "list", "rows", "records"]).map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      name: normalizeString(findByKeys(row, ["name", "title", "courseName"]), `دوره ${index + 1}`),
      purchaseDate: normalizeString(findByKeys(row, ["purchaseDate", "createdAt", "date", "boughtAt"])),
      status: normalizeCourseStatus(findByKeys(row, ["status", "courseStatus", "accessStatus"])),
      progress: toNumber(findByKeys(row, ["progress", "percent", "completion", "progressPercent"]), 0),
    };
  });
}

export function normalizeUserTransactionsResponse(response: unknown): UserTransaction[] {
  return extractArray(response, ["items", "transactions", "orders", "payments", "results", "data", "list"]).map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      id: normalizeString(findByKeys(row, ["id", "transactionId", "orderId", "code"]), `TRX-${index + 1}`),
      amount: toNumber(findByKeys(row, ["amount", "total", "value", "price"]), 0),
      status: normalizeTransactionStatus(findByKeys(row, ["status", "paymentStatus", "transactionStatus", "state"])),
      date: normalizeString(findByKeys(row, ["date", "createdAt", "paidAt", "updatedAt"])),
      productTitle: normalizeString(
        findByKeys(row, ["productTitle", "courseTitle", "courseName", "productName", "title", "description"]),
        ""
      ),
      paymentMethod: normalizeString(findByKeys(row, ["paymentMethod", "gateway", "provider", "method"]), ""),
    };
  });
}

export function normalizeUserTicketsResponse(response: unknown): UserTicket[] {
  return extractArray(response, ["items", "tickets", "results", "data", "list", "rows", "records"]).map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      id: normalizeString(findByKeys(row, ["id", "ticketId", "code"]), `T-${index + 1}`),
      title: normalizeString(findByKeys(row, ["title", "subject", "message", "summary"]), "تیکت پشتیبانی"),
      status: normalizeTicketStatus(findByKeys(row, ["status", "ticketStatus", "state"])),
      date: normalizeString(findByKeys(row, ["date", "createdAt", "updatedAt", "openedAt"])),
      updatedAt: normalizeString(findByKeys(row, ["updatedAt", "lastUpdatedAt", "lastReplyAt"]), ""),
    };
  });
}

export function normalizeUserActivitiesResponse(response: unknown): UserActivity[] {
  return extractArray(response, ["items", "activities", "results", "data", "list", "rows", "records"]).map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      id: normalizeString(findByKeys(row, ["id", "activityId", "code"]), `ACT-${index + 1}`),
      title: normalizeString(findByKeys(row, ["title", "name", "action", "type"]), `رویداد ${index + 1}`),
      description: normalizeString(
        findByKeys(row, ["description", "details", "message", "summary", "content"]),
        "بدون توضیح"
      ),
      timestamp: normalizeString(findByKeys(row, ["timestamp", "createdAt", "date", "time", "occurredAt"]), "—"),
      kind: normalizeActivityKind(findByKeys(row, ["kind", "type", "actionType", "category"])),
    };
  });
}

export function normalizeInternalNoteResponse(response: unknown): string {
  const payload = unwrapResponse(response);
  if (typeof payload === "string") return payload.trim();
  if (!isRecord(payload)) return "";

  const value = findByKeys(payload, [
    "internalAdminNote",
    "note",
    "internalNote",
    "internalNotes",
    "adminNote",
    "data",
    "value",
    "text",
  ]);
  if (typeof value === "string") return value.trim();
  if (isRecord(value)) {
    const nested = findByKeys(value, [
      "internalAdminNote",
      "note",
      "internalNote",
      "internalNotes",
      "adminNote",
      "text",
      "value",
    ]);
    if (typeof nested === "string") return nested.trim();
  }

  return "";
}
