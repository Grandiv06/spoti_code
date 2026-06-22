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

export interface Ticket {
  id: string;
  title: string;
  status: "open" | "investigating" | "answered" | "closed";
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
