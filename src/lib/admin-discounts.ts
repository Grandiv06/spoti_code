type UnknownRecord = Record<string, unknown>;

export type AdminDiscountEntry = {
  id: string;
  title: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  scope: "all" | "specific";
  selectedCourseIds: string[];
  startAt: string;
  endAt: string;
  usageLimit: string;
  usagePerUser: string;
  applyType: "user" | "admin" | "both";
  isEnabled: boolean;
  usedCount: number;
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
    for (const key of ["items", "discounts", "results", "data", "list"] as const) {
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

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").replace(/٪/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalizeBool(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const raw = value.trim().toLowerCase();
    if (["true", "1", "yes", "active", "enabled", "on", "published", "enable"].includes(raw)) return true;
    if (["false", "0", "no", "inactive", "disabled", "off", "draft"].includes(raw)) return false;
  }
  return fallback;
}

function normalizeDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  return "";
}

function normalizeType(value: unknown): "percentage" | "fixed" {
  const raw = normalizeString(value, "percentage").toLowerCase();
  if (["fixed", "amount", "money", "mablagh", "fixedamount"].includes(raw)) return "fixed";
  return "percentage";
}

function normalizeScope(source: UnknownRecord): "all" | "specific" {
  const raw = normalizeString(findByKeys(source, ["scope", "applyScope", "courseScope", "typeScope"]), "").toLowerCase();
  if (["specific", "selected", "course", "courses", "limited"].includes(raw)) return "specific";
  const courseIds = findByKeys(source, ["selectedCourseIds", "courseIds", "courses", "targets"]);
  if (Array.isArray(courseIds) && courseIds.length > 0) return "specific";
  return "all";
}

function normalizeApplyType(value: unknown): "user" | "admin" | "both" {
  const raw = normalizeString(value, "user").toLowerCase();
  if (["admin", "automatic", "auto", "system"].includes(raw)) return "admin";
  if (["both", "all", "user+admin", "user_admin"].includes(raw)) return "both";
  return "user";
}

function normalizeCourseIds(source: UnknownRecord): string[] {
  const value = findByKeys(source, ["selectedCourseIds", "courseIds", "courses", "courseTargets"]);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (isRecord(item)) return normalizeString(item.id ?? item.courseId ?? item.code ?? item.slug, "");
        return "";
      })
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeDiscount(row: unknown, index: number): AdminDiscountEntry {
  const item = isRecord(row) ? row : {};
  const selectedCourseIds = normalizeCourseIds(item);
  const discountType = normalizeType(findByKeys(item, ["discountType", "type", "discount_kind"]));
  const discountValue = toNumber(findByKeys(item, ["discountValue", "value", "amount", "percent"]), 0);
  const isEnabled = normalizeBool(findByKeys(item, ["isEnabled", "enabled", "active", "isActive", "published"]), true);
  const usedCount = toNumber(findByKeys(item, ["usedCount", "uses", "usageCount", "consumedCount", "timesUsed"]), 0);

  return {
    id: normalizeString(findByKeys(item, ["id", "discountId", "codeId", "uuid"]), `discount-${index + 1}`),
    title: normalizeString(findByKeys(item, ["title", "name", "label", "description"]), "بدون عنوان"),
    code: normalizeString(findByKeys(item, ["code", "couponCode", "discountCode"]), `CODE${index + 1}`).toUpperCase(),
    discountType,
    discountValue,
    scope: normalizeScope(item),
    selectedCourseIds,
    startAt: normalizeDate(findByKeys(item, ["startAt", "startsAt", "validFrom", "beginAt"])),
    endAt: normalizeDate(findByKeys(item, ["endAt", "expiresAt", "validTo", "finishAt"])),
    usageLimit: normalizeString(findByKeys(item, ["usageLimit", "globalUsageLimit", "maxUsage", "limit"]), ""),
    usagePerUser: normalizeString(findByKeys(item, ["usagePerUser", "perUserUsageLimit", "perUserLimit", "perUser"]), ""),
    applyType: normalizeApplyType(findByKeys(item, ["applyType", "targetType", "scopeType", "appliesTo"])),
    isEnabled,
    usedCount,
  };
}

export function normalizeAdminDiscountsResponse(response: unknown): AdminDiscountEntry[] {
  return extractArray(response).map((item, index) => normalizeDiscount(item, index));
}
