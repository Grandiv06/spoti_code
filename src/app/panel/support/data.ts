export interface Message {
  id: string;
  sender: "user" | "support";
  senderName: string;
  text: string;
  timestamp: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  icon: string;
  status: "completed" | "pending";
}

export type TicketUrgency = "low" | "medium" | "high";

export const TICKET_URGENCY_OPTIONS: { label: string; value: TicketUrgency }[] = [
  { label: "کم", value: "low" },
  { label: "متوسط", value: "medium" },
  { label: "زیاد", value: "high" },
];

export const TICKET_URGENCY_LABELS: Record<TicketUrgency, string> = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
};

export type TicketCategory = "technical" | "billing" | "account" | "featureRequest" | "bugReport" | "other";

export const TICKET_CATEGORY_OPTIONS: { label: string; value: TicketCategory }[] = [
  { label: "مشکلات فنی", value: "technical" },
  { label: "پرداخت", value: "billing" },
  { label: "حساب کاربری", value: "account" },
  { label: "درخواست ویژگی", value: "featureRequest" },
  { label: "گزارش باگ", value: "bugReport" },
  { label: "سایر موارد", value: "other" },
];

export function getTicketCategoryLabel(category: string): string {
  const trimmed = category.trim();
  if (!trimmed) return "—";

  const matched = TICKET_CATEGORY_OPTIONS.find(
    (option) => option.value.toLowerCase() === trimmed.toLowerCase()
  );
  if (matched) return matched.label;

  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const byNormalized = TICKET_CATEGORY_OPTIONS.find(
    (option) => option.value.toLowerCase().replace(/[^a-z0-9]+/g, "") === normalized
  );
  if (byNormalized) return byNormalized.label;

  return trimmed;
}

const TICKET_STATUS_LABELS: Record<string, string> = {
  open: "در حال بررسی",
  pending: "در انتظار",
  new: "جدید",
  newticket: "جدید",
  waiting: "در انتظار",

  underreview: "در حال بررسی",
  investigating: "در حال بررسی",
  inprogress: "در حال بررسی",
  reviewing: "در حال بررسی",

  waitingforadmin: "منتظر ادمین",
  waitingforuser: "پاسخ داده شده",
  waitingforcustomer: "پاسخ داده شده",
  waitingforclient: "پاسخ داده شده",
  waitingforstaff: "منتظر پشتیبانی",
  waitingforsupport: "منتظر پشتیبانی",

  answered: "پاسخ داده شده",
  resolved: "حل شده",
  replied: "پاسخ داده شده",
  reply: "پاسخ داده شده",

  closed: "بسته شده",
  close: "بسته شده",
  closedbyadmin: "بسته شده توسط ادمین",
  closedbyuser: "بسته شده توسط کاربر",

  باز: "در حال بررسی",
  درحالبررسی: "در حال بررسی",
  پاسخدادهشده: "پاسخ داده شده",
  بستهشده: "بسته شده",
  حلشده: "حل شده",
  معلق: "معلق",
};

const TICKET_STATUS_PART_LABELS: Record<string, string> = {
  waiting: "منتظر",
  for: "",
  user: "کاربر",
  admin: "ادمین",
  customer: "کاربر",
  client: "کاربر",
  support: "پشتیبانی",
  staff: "پشتیبانی",
  closed: "بسته",
  by: "توسط",
  open: "در حال بررسی",
  answered: "پاسخ داده شده",
  answer: "پاسخ",
  review: "بررسی",
  under: "",
  progress: "پیشرفت",
  pending: "در انتظار",
  new: "جدید",
  resolved: "حل شده",
  replied: "پاسخ داده شده",
  investigating: "در حال بررسی",
  ticket: "تیکت",
};

function translateUnknownTicketStatus(raw: string): string {
  const parts = raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const translated = parts
    .map((part) => TICKET_STATUS_PART_LABELS[part])
    .filter((part): part is string => Boolean(part && part.trim()));

  return translated.length > 0 ? translated.join(" ") : raw;
}

export function normalizeTicketStatusKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, "");
}

export function formatTicketStatusLabel(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "—";

  const known = TICKET_STATUS_LABELS[normalizeTicketStatusKey(raw)];
  if (known) return known;

  if (/[\u0600-\u06FF]/.test(raw)) return raw;

  return translateUnknownTicketStatus(raw);
}

export function isTicketUnderReview(value: unknown): boolean {
  const key = normalizeTicketStatusKey(value);
  if (!key) return false;
  if (key === "open") return true;
  return (
    key.includes("investigat") ||
    key.includes("review") ||
    key.includes("progress") ||
    key.includes("waitingforadmin") ||
    key.includes("waitingforstaff") ||
    key.includes("waitingforsupport")
  );
}

export function isTicketAnswered(value: unknown): boolean {
  const key = normalizeTicketStatusKey(value);
  return (
    key.includes("answer") ||
    key.includes("resolved") ||
    key.includes("reply") ||
    key.includes("waitingforuser") ||
    key.includes("waitingforcustomer") ||
    key.includes("waitingforclient")
  );
}

export function getTicketStatusClass(value: unknown): string {
  const key = normalizeTicketStatusKey(value);

  if (!key || ["pending", "new", "waiting", "newticket"].includes(key)) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
  if (isTicketAnswered(value)) {
    return "bg-green-500/10 text-green-500 border-green-500/20";
  }
  if (isTicketUnderReview(value)) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
  if (key.includes("close")) {
    return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }

  return "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

export function isTicketClosed(value: unknown): boolean {
  const key = normalizeTicketStatusKey(value);
  return Boolean(key) && key.includes("close");
}

export function matchesTicketStatusFilter(status: unknown, filter: string): boolean {
  if (filter === "all") return true;

  const key = normalizeTicketStatusKey(status);
  const filterKey = normalizeTicketStatusKey(filter);

  if (filterKey === "closed") return isTicketClosed(status);
  if (filterKey === "investigating" || filterKey === "open") {
    return isTicketUnderReview(status);
  }
  if (filterKey === "answered") {
    return isTicketAnswered(status);
  }

  return key === filterKey;
}

export interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: TicketUrgency;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  attachments: Attachment[];
  timeline: TimelineEvent[];
}

export const mockTickets: Ticket[] = [
  {
    id: "TIC-8421",
    title: "مشکل در تماشای ویدیوهای دوره ریکت و جاوااسکریپت",
    category: "دوره آموزشی",
    status: "answered",
    priority: "high",
    createdAt: "۱۴۰۲/۰۸/۲۵",
    updatedAt: "۲ ساعت پیش",
    messages: [
      {
        id: "m1",
        sender: "user",
        senderName: "کاربر تست",
        text: "سلام، من وقتی می‌خوام ویدیوهای بخش چهارم دوره ریکت رو تماشا کنم، پلیر لود نمیشه و خطای اتصال میده. لطفا بررسی کنید.",
        timestamp: "۱۴۰۲/۰۸/۲۵ - ۱۰:۳۰",
      },
      {
        id: "m2",
        sender: "support",
        senderName: "پشتیبانی اسپاتی‌کد",
        text: "سلام وقت بخیر. ممنون از اطلاع‌رسانی شما. مشکل مربوط به سرور پخش ویدیو بود که در حال حاضر برطرف شده. لطفاً مجدداً بررسی کنید و اگر همچنان مشکلی بود اطلاع بدید.",
        timestamp: "۱۴۰۲/۰۸/۲۵ - ۱۲:۱۵",
      },
    ],
    attachments: [
      { id: "a1", name: "screenshot-error.png", size: "۱.۲ مگابایت", type: "image" },
    ],
    timeline: [
      { id: "t1", title: "تیکت ثبت شد", time: "۱۰:۳۰", icon: "add", status: "completed" },
      { id: "t2", title: "توسط پشتیبانی بررسی شد", time: "۱۱:۰۰", icon: "visibility", status: "completed" },
      { id: "t3", title: "پاسخ ارسال شد", time: "۱۲:۱۵", icon: "reply", status: "completed" },
    ],
  },
  {
    id: "TIC-8415",
    title: "درخواست بازگشت وجه - خرید اشتباه اشتراک ویژه",
    category: "مالی و پرداخت",
    status: "investigating",
    priority: "high",
    createdAt: "۱۴۰۲/۰۸/۲۲",
    updatedAt: "۱ روز پیش",
    messages: [
      {
        id: "m1",
        sender: "user",
        senderName: "کاربر تست",
        text: "سلام، من قصد داشتم اشتراک یک ماهه بخرم ولی اشتباهاً اشتراک یک ساله برام ثبت شد. مبلغ از حسابم کسر شده ولی می‌خوام کنسل بشه و مبلغ برگرده تا اشتراک درست رو بخرم.",
        timestamp: "۱۴۰۲/۰۸/۲۲ - ۰۹:۱۵",
      },
    ],
    attachments: [
      { id: "a1", name: "payment-receipt.pdf", size: "۴۵۰ کیلوبایت", type: "pdf" },
    ],
    timeline: [
      { id: "t1", title: "تیکت ثبت شد", time: "۰۹:۱۵", icon: "add", status: "completed" },
      { id: "t2", title: "در حال بررسی توسط بخش مالی", time: "۱۰:۳۰", icon: "account_balance_wallet", status: "completed" },
    ],
  },
  {
    id: "TIC-8390",
    title: "خطای ۵۰۰ هنگام تغییر عکس پروفایل در پنل کاربری",
    category: "فنی و پنل",
    status: "closed",
    priority: "low",
    createdAt: "۱۴۰۲/۰۸/۱۵",
    updatedAt: "۳ روز پیش",
    messages: [
      {
        id: "m1",
        sender: "user",
        senderName: "کاربر تست",
        text: "وقتی می‌خوام عکس پروفایلم رو عوض کنم، بعد از آپلود ارور ۵۰۰ میده. عکس هم فرمتش jpg هست.",
        timestamp: "۱۴۰۲/۰۸/۱۵ - ۱۴:۲۰",
      },
      {
        id: "m2",
        sender: "support",
        senderName: "پشتیبانی اسپاتی‌کد",
        text: "سلام. این مشکل به دلیل محدودیت حجم فایل بود که الان به ۵ مگابایت افزایش پیدا کرد. مشکل شما برطرف شد.",
        timestamp: "۱۴۰۲/۰۸/۱۵ - ۱۶:۴۵",
      },
      {
        id: "m3",
        sender: "user",
        senderName: "کاربر تست",
        text: "ممنون، الان درست شد. خسته نباشید.",
        timestamp: "۱۴۰۲/۰۸/۱۵ - ۱۷:۱۰",
      },
    ],
    attachments: [],
    timeline: [
      { id: "t1", title: "تیکت ثبت شد", time: "۱۴:۲۰", icon: "add", status: "completed" },
      { id: "t2", title: "پاسخ ارسال شد", time: "۱۶:۴۵", icon: "reply", status: "completed" },
      { id: "t3", title: "تیکت بسته شد", time: "۱۷:۳۰", icon: "check_circle", status: "completed" },
    ],
  },
];

const DEFAULT_MOCK_MESSAGES: Message[] = [
  {
    id: "mock-user-1",
    sender: "user",
    senderName: "کاربر اسپاتی‌کد",
    text: "سلام، این تیکت را برای پیگیری درخواستم ثبت کرده‌ام. لطفاً بررسی کنید.",
    timestamp: new Date().toLocaleString("fa-IR"),
  },
  {
    id: "mock-support-1",
    sender: "support",
    senderName: "پشتیبانی اسپاتی‌کد",
    text: "سلام وقت بخیر. تیکت شما دریافت شد و به زودی توسط تیم پشتیبانی بررسی می‌شود.",
    timestamp: new Date().toLocaleString("fa-IR"),
  },
];

export function formatTicketDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildMockTicketDetails(ticketId: string, partial?: Partial<Ticket>): Ticket {
  const createdAt = partial?.createdAt ?? formatTicketDate(new Date().toISOString());
  const updatedAt = partial?.updatedAt ?? createdAt;

  return {
    id: ticketId,
    title: partial?.title ?? "تیکت پشتیبانی",
    status: partial?.status ?? "open",
    priority: partial?.priority ?? "low",
    category: partial?.category ?? "عمومی",
    createdAt,
    updatedAt,
    messages:
      partial?.messages && partial.messages.length > 0
        ? partial.messages
        : DEFAULT_MOCK_MESSAGES.map((message, index) => ({
            ...message,
            id: `${ticketId}-mock-${index + 1}`,
          })),
    attachments: partial?.attachments ?? [],
    timeline: partial?.timeline ?? [
      { id: "t1", title: "تیکت ثبت شد", time: createdAt, icon: "add", status: "completed" },
      { id: "t2", title: "در انتظار بررسی پشتیبانی", time: updatedAt, icon: "visibility", status: "pending" },
    ],
  };
}

export function readCachedTicket(ticketId: string): Ticket | null {
  if (typeof window === "undefined" || !ticketId) return null;
  try {
    const raw = sessionStorage.getItem(`support-ticket-${ticketId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Ticket>;
    return buildMockTicketDetails(ticketId, parsed);
  } catch {
    return null;
  }
}

export function cacheTicket(ticket: Ticket) {
  if (typeof window === "undefined" || !ticket.id) return;
  sessionStorage.setItem(`support-ticket-${ticket.id}`, JSON.stringify(ticket));
}

export function resolveTicketById(ticketId: string): Ticket {
  const fromMock = mockTickets.find((item) => item.id === ticketId);
  if (fromMock) return fromMock;

  const cached = readCachedTicket(ticketId);
  if (cached) return cached;

  return buildMockTicketDetails(ticketId);
}
