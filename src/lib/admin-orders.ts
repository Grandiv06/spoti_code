type UnknownRecord = Record<string, unknown>;

export type AdminOrderItem = {
  id: string;
  user: string;
  course: string;
  amount: string;
  amountValue: number;
  status: string;
  date: string;
};

const ORDER_AMOUNT_KEYS = [
  "amount",
  "price",
  "total",
  "totalAmount",
  "finalPrice",
  "paidAmount",
  "sum",
  "value",
  "revenue",
  "fee",
];
const ORDER_USER_KEYS = ["user", "customer", "buyer", "owner", "fullName", "displayName", "userName", "name"];
const ORDER_COURSE_KEYS = ["course", "courseTitle", "product", "item", "title", "name"];

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
    for (const key of ["items", "orders", "results", "data", "list"] as const) {
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

function findByKeys(source: unknown, keys: string[], depth = 4): unknown {
  if (depth < 0) return undefined;

  if (Array.isArray(source)) {
    for (const item of source) {
      const found = findByKeys(item, keys, depth - 1);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  if (!isRecord(source)) return undefined;

  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(normalizeKey(key))) return value;
    const found = findByKeys(value, keys, depth - 1);
    if (found !== undefined) return found;
  }

  return undefined;
}

function normalizeDigits(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[۰-۹]/g, (digit) => String(persian.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabic.indexOf(digit)));
}

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function pickDisplayText(
  value: unknown,
  nestedKeys: string[] = ["fullName", "name", "displayName", "userName", "title", "courseTitle", "label"]
): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);

  if (isRecord(value)) {
    for (const key of nestedKeys) {
      const nested = value[key];
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    }
  }

  return "";
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(normalizeDigits(value).replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeStatus(rawStatus: unknown): string {
  const raw = normalizeString(rawStatus, "").toLowerCase();
  if (["paid", "completed", "success", "successful", "پرداخت شده"].includes(raw)) return "پرداخت شده";
  if (["pending", "waiting", "redirected", "open", "underreview", "reviewing", "باز", "در انتظار", "در حال بررسی"].includes(raw)) {
    return "در انتظار";
  }
  if (["canceled", "cancelled", "expired", "failed", "لغو شده", "inactive", "disabled", "rejected"].includes(raw)) {
    return "لغو شده";
  }
  return "در انتظار";
}

function formatDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    const timestamp = Date.parse(trimmed);
    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    return trimmed;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return "—";
}

function normalizeOrder(row: unknown, index: number): AdminOrderItem {
  const item = isRecord(row) ? row : {};

  const userRaw = findByKeys(item, ORDER_USER_KEYS);
  const user =
    pickDisplayText(userRaw) ||
    pickDisplayText(findByKeys(item, ["fullName", "displayName", "userName"])) ||
    "—";

  const courseRaw = findByKeys(item, ORDER_COURSE_KEYS);
  const course =
    pickDisplayText(courseRaw, ["title", "name", "courseTitle", "fullName", "label"]) ||
    pickDisplayText(findByKeys(item, ["productTitle", "courseName"])) ||
    "—";

  const amountRaw = findByKeys(item, ORDER_AMOUNT_KEYS);
  let amountValue = toNumber(amountRaw, 0);
  if (amountValue === 0 && isRecord(amountRaw)) {
    amountValue = toNumber(findByKeys(amountRaw, ORDER_AMOUNT_KEYS), 0);
  }

  const amount = amountValue > 0 ? amountValue.toLocaleString("fa-IR") : "۰";

  return {
    id: normalizeString(findByKeys(item, ["id", "orderId", "code", "trackingCode"]), `ORD-${index + 1}`),
    user,
    course,
    amount,
    amountValue,
    status: normalizeStatus(findByKeys(item, ["status", "state", "paymentStatus", "orderStatus"])),
    date: formatDate(findByKeys(item, ["createdAt", "date", "paidAt", "orderedAt", "updatedAt"])),
  };
}

export function normalizeAdminOrdersResponse(response: unknown): AdminOrderItem[] {
  return extractArray(response).map((item, index) => normalizeOrder(item, index));
}
