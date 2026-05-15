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

export interface Ticket {
  id: string;
  title: string;
  status: "open" | "investigating" | "answered" | "closed";
  priority: "normal" | "high" | "urgent";
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
    priority: "urgent",
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
    priority: "normal",
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
