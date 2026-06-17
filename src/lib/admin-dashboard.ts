type UnknownRecord = Record<string, unknown>;

export type AdminDashboardKpi = {
  title: string;
  value: string;
  delta: string;
  unit?: string;
};

export type AdminDashboardPoint = {
  label: string;
  value: number;
};

export type AdminDashboardChannel = AdminDashboardPoint & {
  color: string;
};

export type AdminDashboardOrder = {
  id: string;
  user: string;
  course: string;
  amount: string;
  date: string;
  status: string;
};

export type AdminDashboardTicket = {
  id: string;
  title: string;
  owner: string;
  updatedAt: string;
  status: string;
};

export type AdminDashboardViewModel = {
  kpis: AdminDashboardKpi[];
  monthlyRevenue: AdminDashboardPoint[];
  channelData: AdminDashboardChannel[];
  salesByCategory: AdminDashboardPoint[];
  recentOrders: AdminDashboardOrder[];
  ticketsData: AdminDashboardTicket[];
  revenueTrend: string;
  newUsersToday: string;
  conversionRateToday: string;
};

const CHANNEL_COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const POINT_LABEL_KEYS = ["label", "name", "month", "title", "category", "period", "date"];
const POINT_VALUE_KEYS = ["value", "count", "total", "amount", "revenue", "users", "sales", "score"];
const ORDER_AMOUNT_KEYS = ["amount", "price", "total", "sum", "value", "revenue"];
const ORDER_USER_KEYS = ["user", "customer", "buyer", "fullName", "displayName", "name"];
const ORDER_COURSE_KEYS = ["course", "courseTitle", "title", "product", "item"];
const TICKET_OWNER_KEYS = ["owner", "team", "assignee", "assignedTo", "department"];
const TICKET_TITLE_KEYS = ["title", "subject", "message", "summary"];
const TICKET_STATUS_KEYS = ["status", "state", "ticketStatus"];
const MONTH_REVENUE_KEYS = [
  "monthlyRevenue",
  "revenueByMonth",
  "revenueTimeline",
  "revenueHistory",
  "monthlyRevenueSeries",
  "monthlyIncome",
];
const CHANNEL_KEYS = ["channelData", "channels", "acquisitionChannels", "trafficSources", "userSources"];
const SALES_KEYS = ["salesByCategory", "categorySales", "salesPerCategory", "salesByType"];
const TICKET_KEYS = ["ticketsData", "recentTickets", "tickets", "supportTickets"];
const ORDER_KEYS = ["recentOrders", "orders", "salesOrders"];

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

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findByKeys(value: unknown, keys: string[], depth = 4): unknown {
  if (depth < 0) return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findByKeys(item, keys, depth - 1);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  if (!isRecord(value)) return undefined;

  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, nested] of Object.entries(value)) {
    if (normalizedKeys.includes(normalizeKey(key))) {
      return nested;
    }
    const found = findByKeys(nested, keys, depth - 1);
    if (found !== undefined) return found;
  }

  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").replace(/%/g, "").trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatCount(value: unknown): string {
  const numberValue = toNumber(value);
  if (numberValue === undefined) {
    return typeof value === "string" && value.trim() ? value : "—";
  }
  return formatNumber(Math.round(numberValue));
}

function formatCurrencyCompact(value: unknown): string {
  const numberValue = toNumber(value);
  if (numberValue === undefined) {
    return typeof value === "string" && value.trim() ? value : "—";
  }

  const absValue = Math.abs(numberValue);
  if (absValue >= 1_000_000_000) {
    return `${formatNumber(Number((numberValue / 1_000_000_000).toFixed(numberValue % 1_000_000_000 === 0 ? 0 : 1)))}B`;
  }

  if (absValue >= 1_000_000) {
    return `${formatNumber(Number((numberValue / 1_000_000).toFixed(numberValue % 1_000_000 === 0 ? 0 : 1)))}M`;
  }

  return formatNumber(Math.round(numberValue));
}

function formatPercent(value: unknown): string {
  const numberValue = toNumber(value);
  if (numberValue === undefined) {
    if (typeof value === "string" && value.trim()) return value;
    return "—";
  }

  const sign = numberValue > 0 ? "+" : "";
  const absValue = Math.abs(numberValue);
  const precision = Math.round(absValue) === absValue ? 0 : 1;
  return `${sign}${absValue.toFixed(precision)}%`;
}

function formatDelta(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  const numberValue = toNumber(value);
  if (numberValue === undefined) {
    return "—";
  }
  return formatPercent(numberValue);
}

function formatDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString("fa-IR");
  }
  return "—";
}

function pickText(source: unknown, keys: string[], fallback = "—"): string {
  const value = findByKeys(source, keys);
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return formatCount(value);
  return fallback;
}

function pickNumber(source: unknown, keys: string[], fallback = 0): number {
  const value = findByKeys(source, keys);
  const numberValue = toNumber(value);
  return numberValue ?? fallback;
}

function mapPointSeries(source: unknown): AdminDashboardPoint[] {
  const raw = unwrapResponse(source);

  if (Array.isArray(raw)) {
    return raw.map((item, index) => {
      if (isRecord(item)) {
        const label =
          pickText(item, POINT_LABEL_KEYS, String(index + 1)) ||
          String(index + 1);
        const value = pickNumber(item, POINT_VALUE_KEYS, 0);
        return { label, value };
      }

      return {
        label: String(index + 1),
        value: toNumber(item) ?? 0,
      };
    });
  }

  if (isRecord(raw)) {
    return Object.entries(raw).map(([label, item]) => {
      if (isRecord(item)) {
        return {
          label: pickText(item, POINT_LABEL_KEYS, label),
          value: pickNumber(item, POINT_VALUE_KEYS, 0),
        };
      }

      return {
        label,
        value: toNumber(item) ?? 0,
      };
    });
  }

  return [];
}

function mapChannelSeries(source: unknown): AdminDashboardChannel[] {
  const points = mapPointSeries(source);
  return points.map((point, index) => ({
    ...point,
    color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
  }));
}

function normalizeStatus(value: unknown, type: "order" | "ticket"): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) {
    return type === "order" ? "در انتظار" : "باز";
  }

  if (type === "order") {
    if (["paid", "completed", "success", "successful", "پرداخت شده"].includes(raw)) return "پرداخت شده";
    if (["pending", "waiting", "redirected", "در انتظار"].includes(raw)) return "در انتظار";
    return "لغو شده";
  }

  if (["open", "pending", "waiting", "باز"].includes(raw)) return "باز";
  if (["investigating", "underreview", "reviewing", "در حال بررسی"].includes(raw)) return "در حال بررسی";
  if (["closed", "resolved", "answered", "حل شده"].includes(raw)) return "حل شده";
  return "معلق";
}

function mapOrders(source: unknown): AdminDashboardOrder[] {
  const raw = unwrapResponse(source);
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const amountValue = findByKeys(row, ORDER_AMOUNT_KEYS);
    return {
      id: pickText(row, ["id", "orderId", "code", "trackingCode"], `ORD-${index + 1}`),
      user: pickText(row, ORDER_USER_KEYS, "کاربر"),
      course: pickText(row, ORDER_COURSE_KEYS, "دوره"),
      amount: formatCount(amountValue),
      date: formatDate(findByKeys(row, ["date", "createdAt", "paidAt", "orderedAt"])),
      status: normalizeStatus(findByKeys(row, ["status", "paymentStatus", "orderStatus"]), "order"),
    };
  });
}

function mapTickets(source: unknown): AdminDashboardTicket[] {
  const raw = unwrapResponse(source);
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      id: pickText(row, ["id", "ticketId", "code"], `T-${index + 1}`),
      title: pickText(row, TICKET_TITLE_KEYS, "تیکت پشتیبانی"),
      owner: pickText(row, TICKET_OWNER_KEYS, "تیم پشتیبانی"),
      updatedAt: pickText(row, ["updatedAt", "updated", "timeAgo", "lastUpdated"], "—"),
      status: normalizeStatus(findByKeys(row, TICKET_STATUS_KEYS), "ticket"),
    };
  });
}

function buildKpis(source: unknown): AdminDashboardKpi[] {
  const totalUsers = findByKeys(source, ["totalUsers", "usersCount", "usersTotal", "totalUsersCount"]);
  const activeUsers = findByKeys(source, ["activeUsers", "dailyActiveUsers", "activeUsersCount", "usersActive"]);
  const monthlyRevenue = findByKeys(source, ["monthlyRevenue", "revenueThisMonth", "currentMonthRevenue", "thisMonthRevenue"]);
  const churnRate = findByKeys(source, ["churnRate", "dropRate", "attritionRate", "churn"]);

  const userDelta = formatDelta(findByKeys(source, ["usersGrowth", "totalUsersGrowth", "usersDelta", "growthUsers"]));
  const activeDelta = formatDelta(findByKeys(source, ["activeUsersGrowth", "dailyActiveUsersGrowth", "activeUsersDelta"]));
  const revenueDelta = formatDelta(findByKeys(source, ["revenueGrowth", "monthlyRevenueGrowth", "revenueDelta"]));
  const churnDelta = formatDelta(findByKeys(source, ["churnChange", "churnDelta", "churnGrowth"]));

  return [
    {
      title: "کل کاربران",
      value: formatCount(totalUsers),
      delta: userDelta,
    },
    {
      title: "کاربران فعال روزانه",
      value: formatCount(activeUsers),
      delta: activeDelta,
    },
    {
      title: "درآمد این ماه",
      value: formatCurrencyCompact(monthlyRevenue),
      delta: revenueDelta,
      unit: "تومان",
    },
    {
      title: "نرخ ریزش",
      value: formatPercent(churnRate),
      delta: churnDelta,
    },
  ];
}

export function normalizeAdminDashboardOverview(response: unknown): AdminDashboardViewModel {
  const payload = unwrapResponse(response);

  const monthlyRevenueSource = findByKeys(payload, MONTH_REVENUE_KEYS);
  const channelSource = findByKeys(payload, CHANNEL_KEYS);
  const salesSource = findByKeys(payload, SALES_KEYS);
  const ticketSource = findByKeys(payload, TICKET_KEYS);
  const orderSource = findByKeys(payload, ORDER_KEYS);
  const revenueTrend = formatDelta(findByKeys(payload, ["revenueGrowth", "monthlyRevenueGrowth", "revenueDelta"]));

  return {
    kpis: buildKpis(payload),
    monthlyRevenue: mapPointSeries(monthlyRevenueSource),
    channelData: mapChannelSeries(channelSource),
    salesByCategory: mapPointSeries(salesSource),
    recentOrders: mapOrders(orderSource),
    ticketsData: mapTickets(ticketSource),
    revenueTrend,
    newUsersToday: formatCount(findByKeys(payload, ["newUsersToday", "dailyNewUsers", "todayNewUsers", "newSignupsToday"])),
    conversionRateToday: formatPercent(findByKeys(payload, ["conversionRateToday", "todayConversionRate", "conversionRate"])),
  };
}
