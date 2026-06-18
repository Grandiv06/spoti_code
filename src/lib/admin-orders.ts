type UnknownRecord = Record<string, unknown>;

export type AdminOrderItem = {
  id: string;
  user: string;
  course: string;
  amount: string;
  status: string;
  date: string;
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
    for (const key of ["items", "orders", "tickets", "results", "data", "list"] as const) {
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

  for (const value of Object.values(source)) {
    if (isRecord(value)) {
      const nested = findByKeys(value, keys);
      if (nested !== undefined) return nested;
    }
  }

  return undefined;
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

function normalizeStatus(rawStatus: unknown): string {
  const raw = normalizeString(rawStatus, "").toLowerCase();
  if (["paid", "completed", "success", "successful", "resolved", "answered", "closed", "پرداخت شده"].includes(raw)) return "پرداخت شده";
  if (["pending", "waiting", "open", "underreview", "reviewing", "باز", "در انتظار", "در حال بررسی"].includes(raw)) return "در انتظار";
  if (["canceled", "cancelled", "expired", "لغو شده", "inactive", "disabled", "rejected"].includes(raw)) return "لغو شده";
  return "در انتظار";
}

function normalizeDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toLocaleDateString("fa-IR");
  return "—";
}

function normalizeOrder(row: unknown, index: number): AdminOrderItem {
  const item = isRecord(row) ? row : {};
  const title = normalizeString(findByKeys(item, ["title", "subject", "message", "summary", "name", "code"]), "مورد");
  const owner = normalizeString(findByKeys(item, ["owner", "team", "assignee", "assignedTo", "user", "customer", "buyer", "fullName", "displayName", "name"]), "پشتیبانی");
  const amountValue = toNumber(findByKeys(item, ["amount", "price", "value", "total", "sum", "revenue", "fee"]), 0);
  const amount = amountValue > 0 ? amountValue.toLocaleString("fa-IR") : "0";

  return {
    id: normalizeString(findByKeys(item, ["id", "orderId", "code", "trackingCode", "ticketId"]), `ORD-${index + 1}`),
    user: owner,
    course: title,
    amount,
    status: normalizeStatus(findByKeys(item, ["status", "state", "ticketStatus", "paymentStatus", "orderStatus"])),
    date: normalizeDate(findByKeys(item, ["date", "createdAt", "updatedAt", "lastUpdated", "startAt", "expiresAt"])),
  };
}

export function normalizeAdminOrdersResponse(response: unknown): AdminOrderItem[] {
  return extractArray(response).map((item, index) => normalizeOrder(item, index));
}
