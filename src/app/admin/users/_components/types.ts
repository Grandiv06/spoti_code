import type { ApplicationMainRole } from "@/lib/application-roles";

export interface PurchasedCourse {
  name: string;
  purchaseDate: string;
  status: "فعال" | "منقضی شده" | "دسترسی محدود";
  progress: number;
}

export interface UserTransaction {
  id: string;
  amount: number;
  status: "موفق" | "ناموفق" | "در انتظار";
  date: string;
  productTitle?: string;
  paymentMethod?: string;
}

export interface UserTicket {
  id: string;
  title: string;
  status: "باز" | "بسته شده" | "در حال بررسی";
  date: string;
  priority?: string;
  updatedAt?: string;
}

export interface UserActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  kind: "login" | "payment" | "lesson" | "ticket" | "profile" | "order" | "other";
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: "Starter" | "Pro" | "Enterprise";
  status: "فعال" | "غیرفعال" | "معلق";
  role: ApplicationMainRole;
  joinedAt: string;
  courses: number;
  ltv: number;
  avatarColor?: string;
  lastLogin: string;
  purchasesCount: number;
  successfulTransactionsCount: number;
  supportTicketsCount: number;
  lastCourseViewed: string;
  internalNotes?: string;
  purchasedCourses: PurchasedCourse[];
  recentTransactions: UserTransaction[];
  recentTickets: UserTicket[];
}

export const initialUsersData: User[] = [
  {
    id: "USR-992",
    name: "نیما احمدی",
    phone: "09121111111",
    email: "nima.ahmadi@gmail.com",
    plan: "Pro",
    status: "فعال",
    role: "USER",
    joinedAt: "1404/08/12",
    courses: 8,
    ltv: 11400000,
    avatarColor: "from-emerald-400 to-teal-600",
    lastLogin: "۲ ساعت پیش",
    purchasesCount: 8,
    successfulTransactionsCount: 8,
    supportTicketsCount: 1,
    lastCourseViewed: "مسترکلاس Next.js",
    internalNotes: "از کاربران قدیمی و بسیار فعال در انجمن پرسش و پاسخ.",
    purchasedCourses: [
      { name: "مسترکلاس Next.js", purchaseDate: "1404/08/12", status: "فعال", progress: 92 },
      { name: "TypeScript پیشرفته", purchaseDate: "1404/09/01", status: "فعال", progress: 75 },
      { name: "React Performance", purchaseDate: "1404/10/15", status: "فعال", progress: 40 },
    ],
    recentTransactions: [
      { id: "TRX-4820", amount: 2900000, status: "موفق", date: "1404/12/18" },
      { id: "TRX-4512", amount: 1980000, status: "موفق", date: "1404/11/05" },
      { id: "TRX-4201", amount: 1640000, status: "موفق", date: "1404/10/15" },
    ],
    recentTickets: [
      { id: "T-1810", title: "مشکل در اجرای لوکال سورس کد جلسه ۱۲ دوره Next", status: "بسته شده", date: "1404/12/10" }
    ]
  },
  {
    id: "USR-991",
    name: "هانیه عابدی",
    phone: "09122222222",
    email: "hanieh.abedi@yahoo.com",
    plan: "Starter",
    status: "غیرفعال",
    role: "USER",
    joinedAt: "1404/09/02",
    courses: 2,
    ltv: 2120000,
    avatarColor: "from-blue-400 to-indigo-600",
    lastLogin: "۳ روز پیش",
    purchasesCount: 2,
    successfulTransactionsCount: 1,
    supportTicketsCount: 2,
    lastCourseViewed: "Node.js از صفر",
    internalNotes: "درخواست تخفیف برای ارتقای پلن به Pro ارسال کرده است.",
    purchasedCourses: [
      { name: "Node.js از صفر", purchaseDate: "1404/09/02", status: "فعال", progress: 18 },
      { name: "HTML & CSS مقدماتی", purchaseDate: "1404/09/02", status: "منقضی شده", progress: 100 }
    ],
    recentTransactions: [
      { id: "TRX-4819", amount: 2120000, status: "موفق", date: "1404/09/02" },
      { id: "TRX-4700", amount: 2900000, status: "ناموفق", date: "1404/08/29" }
    ],
    recentTickets: [
      { id: "T-1640", title: "عدم امکان اتصال به درگاه بانک کشاورزی", status: "بسته شده", date: "1404/09/02" },
      { id: "T-1711", title: "سوال فنی در مورد ساختار پوشه‌ها در Node", status: "بسته شده", date: "1404/09/15" }
    ]
  },
  {
    id: "USR-990",
    name: "رضا ملکی",
    phone: "09123333333",
    email: "reza.maleki@outlook.com",
    plan: "Pro",
    status: "فعال",
    role: "INSTRUCTOR",
    joinedAt: "1404/07/20",
    courses: 6,
    ltv: 8900000,
    avatarColor: "from-purple-400 to-pink-600",
    lastLogin: "دیروز",
    purchasesCount: 6,
    successfulTransactionsCount: 6,
    supportTicketsCount: 0,
    lastCourseViewed: "Docker & CI/CD",
    internalNotes: "به عنوان پشتیبان داوطلب در دوره پایگاه داده همکاری می‌کند.",
    purchasedCourses: [
      { name: "Docker & CI/CD", purchaseDate: "1404/07/20", status: "فعال", progress: 85 },
      { name: "Clean Architecture", purchaseDate: "1404/08/10", status: "فعال", progress: 60 }
    ],
    recentTransactions: [
      { id: "TRX-4420", amount: 2460000, status: "موفق", date: "1404/11/12" },
      { id: "TRX-4102", amount: 1800000, status: "موفق", date: "1404/09/05" }
    ],
    recentTickets: []
  },
  {
    id: "USR-989",
    name: "زهرا کیانی",
    phone: "09124444444",
    email: "zahra.kiani@live.com",
    plan: "Enterprise",
    status: "فعال",
    role: "ADMIN",
    joinedAt: "1404/06/15",
    courses: 13,
    ltv: 21700000,
    avatarColor: "from-amber-400 to-orange-600",
    lastLogin: "هم‌اکنون آنلاین",
    purchasesCount: 13,
    successfulTransactionsCount: 13,
    supportTicketsCount: 4,
    lastCourseViewed: "UI Design Systems",
    internalNotes: "خرید گروهی برای پرسنل شرکت فنی مهندسی انجام داده است.",
    purchasedCourses: [
      { name: "UI Design Systems", purchaseDate: "1404/06/15", status: "فعال", progress: 100 },
      { name: "Clean Architecture", purchaseDate: "1404/07/02", status: "فعال", progress: 95 },
      { name: "مسترکلاس Next.js", purchaseDate: "1404/08/12", status: "فعال", progress: 88 }
    ],
    recentTransactions: [
      { id: "TRX-4811", amount: 1980000, status: "موفق", date: "1404/12/18" },
      { id: "TRX-4601", amount: 2460000, status: "موفق", date: "1404/10/22" }
    ],
    recentTickets: [
      { id: "T-1809", title: "عدم نمایش ویدیو در مرورگر سافاری سیستم عامل iOS", status: "در حال بررسی", date: "1404/12/18" },
      { id: "T-1510", title: "درخواست فاکتور رسمی با کد اقتصادی", status: "بسته شده", date: "1404/06/20" }
    ]
  },
  {
    id: "USR-988",
    name: "مهسا زمانی",
    phone: "09125555555",
    email: "mahsa.zamani@gmail.com",
    plan: "Starter",
    status: "معلق",
    role: "USER",
    joinedAt: "1404/10/01",
    courses: 3,
    ltv: 3240000,
    avatarColor: "from-red-400 to-rose-600",
    lastLogin: "۱ هفته پیش",
    purchasesCount: 3,
    successfulTransactionsCount: 2,
    supportTicketsCount: 1,
    lastCourseViewed: "React Performance",
    internalNotes: "به دلیل استفاده چند کاربره از اکانت، حساب به صورت موقت معلق شده است.",
    purchasedCourses: [
      { name: "React Performance", purchaseDate: "1404/10/01", status: "دسترسی محدود", progress: 5 }
    ],
    recentTransactions: [
      { id: "TRX-4310", amount: 1640000, status: "موفق", date: "1404/10/01" }
    ],
    recentTickets: [
      { id: "T-1800", title: "درخواست بررسی رفع تعلیق حساب کاربری", status: "باز", date: "1404/12/15" }
    ]
  },
  {
    id: "USR-987",
    name: "آرمان ابراهیمی",
    phone: "09126666666",
    email: "arman.ebrahimi@gmail.com",
    plan: "Pro",
    status: "فعال",
    role: "USER",
    joinedAt: "1404/11/11",
    courses: 5,
    ltv: 7060000,
    avatarColor: "from-cyan-400 to-blue-600",
    lastLogin: "۳ ساعت پیش",
    purchasesCount: 5,
    successfulTransactionsCount: 5,
    supportTicketsCount: 0,
    lastCourseViewed: "TypeScript پیشرفته",
    internalNotes: "کاربر بسیار منظم، تمام تمرین‌ها را در گیت‌هاب ارسال کرده است.",
    purchasedCourses: [
      { name: "TypeScript پیشرفته", purchaseDate: "1404/11/11", status: "فعال", progress: 50 },
      { name: "Node.js از صفر", purchaseDate: "1404/12/01", status: "فعال", progress: 12 }
    ],
    recentTransactions: [
      { id: "TRX-4790", amount: 1980000, status: "موفق", date: "1404/11/11" },
      { id: "TRX-4802", amount: 2120000, status: "موفق", date: "1404/12/01" }
    ],
    recentTickets: []
  },
  {
    id: "USR-986",
    name: "سمیه فراهانی",
    phone: "09127777777",
    email: "somayeh.farahani@yahoo.com",
    plan: "Pro",
    status: "فعال",
    role: "USER",
    joinedAt: "1404/05/09",
    courses: 9,
    ltv: 13850000,
    avatarColor: "from-teal-400 to-emerald-600",
    lastLogin: "دیروز",
    purchasesCount: 9,
    successfulTransactionsCount: 8,
    supportTicketsCount: 2,
    lastCourseViewed: "مسترکلاس Next.js",
    internalNotes: "علاقه‌مند به مباحث معماری نرم‌افزار و داکر.",
    purchasedCourses: [
      { name: "مسترکلاس Next.js", purchaseDate: "1404/05/09", status: "فعال", progress: 95 },
      { name: "Docker & CI/CD", purchaseDate: "1404/06/12", status: "فعال", progress: 80 },
      { name: "Clean Architecture", purchaseDate: "1404/07/20", status: "فعال", progress: 70 }
    ],
    recentTransactions: [
      { id: "TRX-4670", amount: 2900000, status: "موفق", date: "1404/05/09" },
      { id: "TRX-4712", amount: 2460000, status: "موفق", date: "1404/07/20" }
    ],
    recentTickets: [
      { id: "T-1402", title: "دریافت مدرک پایان دوره Next.js", status: "بسته شده", date: "1404/08/30" }
    ]
  }
];
