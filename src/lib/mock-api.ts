import { initialUsersData } from "@/app/admin/users/_components/types";
import { ApplicationMainRoles } from "@/lib/application-roles";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type MockRequest = {
  method: HttpMethod;
  path: string;
  body?: unknown;
};

const now = new Date("2026-06-05T10:30:00.000Z");

const adminUserActivities = [
  {
    id: "ACT-1",
    title: "ورود به حساب",
    description: "ورود موفق به پنل کاربری از مرورگر کروم",
    timestamp: "2026-06-05T08:15:00.000Z",
    kind: "login",
  },
  {
    id: "ACT-2",
    title: "پرداخت موفق",
    description: "پرداخت موفق بابت خرید دوره",
    timestamp: "2026-06-04T17:20:00.000Z",
    kind: "payment",
  },
  {
    id: "ACT-3",
    title: "مشاهده درس",
    description: "مشاهده ویدیوی آموزشی از دوره فعال",
    timestamp: "2026-06-03T13:45:00.000Z",
    kind: "lesson",
  },
  {
    id: "ACT-4",
    title: "ثبت تیکت پشتیبانی",
    description: "ثبت درخواست پشتیبانی درباره مشکل آموزشی",
    timestamp: "2026-06-02T11:10:00.000Z",
    kind: "ticket",
  },
];

function findAdminUser(userId: string) {
  return initialUsersData.find((user) => user.id === userId) ?? initialUsersData[0];
}

function buildAdminUserOverview(userId: string) {
  const user = findAdminUser(userId);
  return {
    id: userId,
    userId,
    fullName: user.name,
    name: user.name,
    displayName: user.name,
    phoneNumber: user.phone,
    email: user.email,
    plan: user.plan,
    status: user.status === "فعال",
    role: user.role,
    joinedAt: user.joinedAt,
    joinedSince: user.joinedAt,
    createdAt: user.joinedAt,
    courses: user.courses,
    coursesCount: user.courses,
    purchasesCount: user.purchasesCount,
    successfulTransactionsCount: user.successfulTransactionsCount,
    supportTicketsCount: user.supportTicketsCount,
    lastLogin: user.lastLogin,
    lastCourseViewed: user.lastCourseViewed,
    ltv: user.ltv,
    internalNotes: user.internalNotes,
    purchasedCourses: user.purchasedCourses,
    recentTransactions: user.recentTransactions,
    recentTickets: user.recentTickets,
  };
}

const courses = [
  {
    id: "html",
    slug: "html",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-104",
    instructorSlug: "nima-alavi",
    title: "آشنایی با HTML",
    name: "آشنایی با HTML",
    shortDescription: "آشنایی با پایه و اساس وب و ساختار صفحات",
    description: "در این دوره از صفر با ساختار صفحات وب، تگ‌های معنایی و استانداردهای HTML آشنا می‌شوید.",
    instructorName: "نیما علوی",
    teacherName: "نیما علوی",
    instructorAvatar: "/images/inst3.jpg",
    cover: "/images/html-green.png",
    thumbnail: "/images/html-green.png",
    difficulty: "مقدماتی",
    level: "elementary",
    durationHours: 12,
    hours: "۱۲",
    studentsCount: 1850,
    price: 980000,
    rating: 4.7,
    status: "published",
    revenue: 1813000000,
    createdAt: "2026-01-12T08:30:00.000Z",
    chapters: [
      { title: "شروع HTML", lessons: [{ title: "ساختار سند" }, { title: "تگ‌های اصلی" }] },
      { title: "فرم‌ها و رسانه", lessons: [{ title: "فرم‌ها" }, { title: "تصاویر و ویدیو" }] },
    ],
  },
  {
    id: "css",
    slug: "css",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-103",
    instructorSlug: "sara-mohammadi",
    title: "استایل‌دهی با CSS",
    name: "استایل‌دهی با CSS",
    shortDescription: "جادوی بصری وب، Flexbox، Grid و طراحی واکنش‌گرا",
    description: "از مبانی CSS تا ساخت چیدمان‌های مدرن و responsive را با پروژه‌های واقعی تمرین می‌کنید.",
    instructorName: "سارا محمدی",
    teacherName: "سارا محمدی",
    instructorAvatar: "/images/inst2.jpg",
    cover: "/images/css-green.png",
    thumbnail: "/images/css-green.png",
    difficulty: "مقدماتی",
    level: "elementary",
    durationHours: 18,
    hours: "۱۸",
    studentsCount: 2120,
    price: 1450000,
    rating: 4.8,
    status: "published",
    revenue: 3074000000,
    createdAt: "2026-01-24T08:30:00.000Z",
    chapters: [
      {
        title: "مبانی CSS",
        lessons: [
          {
            title: "Selectors",
            isFreePreview: true,
            isLocked: false,
            duration: "00:10",
            videoUrl: "/videos/css-selectors-preview.mp4",
          },
          { title: "Box Model", isLocked: true },
        ],
      },
      { title: "Layout", lessons: [{ title: "Flexbox" }, { title: "Grid" }] },
    ],
  },
  {
    id: "javascript",
    slug: "javascript",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    instructorSlug: "amirreza-rezaei",
    title: "جادوی جاوااسکریپت",
    name: "جادوی جاوااسکریپت",
    shortDescription: "ES6، DOM، Fetch API و مدیریت داده",
    description: "در این مسیر منطق برنامه‌نویسی، تعامل با صفحه و ارتباط با API را به شکل عملی یاد می‌گیرید.",
    instructorName: "امیررضا رضایی",
    teacherName: "امیررضا رضایی",
    instructorAvatar: "/images/inst1.jpg",
    cover: "/images/js-green.png",
    thumbnail: "/images/js-green.png",
    difficulty: "متوسط",
    level: "intermediate",
    durationHours: 32,
    hours: "۳۲",
    studentsCount: 1650,
    price: 2200000,
    rating: 4.9,
    status: "published",
    revenue: 3630000000,
    createdAt: "2026-02-08T08:30:00.000Z",
    chapters: [
      { title: "زبان JavaScript", lessons: [{ title: "Variables" }, { title: "Functions" }] },
      { title: "وب تعاملی", lessons: [{ title: "DOM" }, { title: "Fetch" }] },
    ],
  },
  {
    id: "react",
    slug: "react",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-102",
    instructorSlug: "mehrdad-heidari",
    title: "فریمورک React",
    name: "فریمورک React",
    shortDescription: "تفکر کامپوننتی، هوک‌ها و مدیریت وضعیت",
    description: "React را با تمرکز روی معماری کامپوننتی، state management و ساخت اپلیکیشن‌های واقعی یاد می‌گیرید.",
    instructorName: "مهرداد حیدری",
    teacherName: "مهرداد حیدری",
    instructorAvatar: "/images/inst4.jpg",
    cover: "/images/react-green.png",
    thumbnail: "/images/react-green.png",
    difficulty: "متوسط",
    level: "intermediate",
    durationHours: 40,
    hours: "۴۰",
    studentsCount: 1240,
    price: 3500000,
    rating: 4.9,
    status: "published",
    revenue: 4340000000,
    createdAt: "2026-03-02T08:30:00.000Z",
    chapters: [
      { title: "Core React", lessons: [{ title: "Components" }, { title: "Hooks" }] },
      { title: "Project", lessons: [{ title: "Dashboard" }, { title: "API Integration" }] },
    ],
  },
  {
    id: "nextjs",
    slug: "nextjs",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    instructorSlug: "amirreza-rezaei",
    title: "متخصص React و Next.js",
    name: "متخصص React و Next.js",
    shortDescription: "مسیر صفر تا صد ورود به بازار کار جهانی با Next.js",
    description: "در این دوره با SSR، App Router، معماری مدرن وب و ساخت محصول واقعی آشنا می‌شوید.",
    instructorName: "امیررضا رضایی",
    teacherName: "امیررضا رضایی",
    instructorAvatar: "/images/inst1.jpg",
    cover: "/images/course3.jpg",
    thumbnail: "/images/course3.jpg",
    difficulty: "پیشرفته",
    level: "advanced",
    durationHours: 65,
    hours: "۶۵",
    studentsCount: 1340,
    price: 4500000,
    rating: 4.9,
    status: "published",
    revenue: 6030000000,
    createdAt: "2026-03-20T08:30:00.000Z",
    specialWord: "Next.js",
    chapters: [
      { title: "Next.js Fundamentals", lessons: [{ title: "Routing" }, { title: "Server Components" }] },
      { title: "Production", lessons: [{ title: "Auth" }, { title: "Deployment" }] },
    ],
  },
  {
    id: "typescript",
    slug: "typescript",
    category: "frontend",
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    instructorSlug: "amirreza-rezaei",
    title: "تایپ‌اسکریپت پیشرفته",
    name: "تایپ‌اسکریپت پیشرفته",
    shortDescription: "کدنویسی امن و مقیاس‌پذیر با Typeها، Interfaceها و Generics",
    description: "TypeScript را برای پروژه‌های بزرگ و تیمی به شکل عمیق و کاربردی یاد می‌گیرید.",
    instructorName: "امیررضا رضایی",
    teacherName: "امیررضا رضایی",
    instructorAvatar: "/images/inst1.jpg",
    cover: "/images/course2.jpg",
    thumbnail: "/images/course2.jpg",
    difficulty: "پیشرفته",
    level: "advanced",
    durationHours: 25,
    hours: "۲۵",
    studentsCount: 980,
    price: 1900000,
    rating: 4.6,
    status: "draft",
    revenue: 0,
    createdAt: "2026-04-10T08:30:00.000Z",
    chapters: [{ title: "Types", lessons: [{ title: "Generics" }, { title: "Utility Types" }] }],
  },
];

const comments = [
  {
    id: "comment-1",
    content: "پروژه‌های عملی این دوره باعث شد ترس من از کدنویسی بریزه. محتوا بسیار کاربردی و به‌روز است.",
    createdAt: "2026-05-12T09:00:00.000Z",
    user: {
      id: "user-1",
      fullName: "سهراب امینی",
      role: "توسعه‌دهنده React",
      avatar: "/images/student1.jpg",
    },
  },
  {
    id: "comment-2",
    content: "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در این دوره بود. منتورها واقعاً دلسوزانه کمک می‌کنند.",
    createdAt: "2026-05-02T09:00:00.000Z",
    user: {
      id: "user-2",
      fullName: "سارا رضایی",
      role: "توسعه‌دهنده فرانت‌اند",
      avatar: "/images/student2.jpg",
    },
  },
  {
    id: "comment-3",
    content: "محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴ ساعته واقعاً یک مزیت بزرگه.",
    createdAt: "2026-04-19T09:00:00.000Z",
    user: {
      id: "user-3",
      fullName: "نیما حسینی",
      role: "متخصص دیتاساینس",
      avatar: "/images/student3.jpg",
    },
  },
];

let instructorComments = [
  {
    id: "CMT-101",
    content: "آموزش Server Actions خیلی مفید بود، مخصوصاً بخش فرم‌ها.",
    createdAt: "2026-05-16T11:30:00.000Z",
    rating: 5,
    courseId: "nextjs",
    courseTitle: "متخصص React و Next.js",
    commentableType: "course",
    commentableId: "nextjs",
    parentId: "CMT-101",
    user: {
      id: "user-41",
      fullName: "نگار کریمی",
      avatar: "/images/student1.jpg",
    },
  },
  {
    id: "CMT-102",
    content: "پروژه‌ها کاربردی هستند ولی سرعت بعضی بخش‌ها بالاست.",
    createdAt: "2026-05-18T10:10:00.000Z",
    rating: 4,
    courseId: "react",
    courseTitle: "فریمورک React",
    commentableType: "course",
    commentableId: "react",
    parentId: "CMT-102",
    user: {
      id: "user-42",
      fullName: "علی مرادی",
      avatar: "/images/student2.jpg",
    },
    reply: {
      content: "ممنون از بازخورد دقیق شما. در نسخه بعدی زمان‌بندی بخش‌ها را متعادل‌تر می‌کنیم.",
      createdAt: "2026-05-19T08:40:00.000Z",
    },
  },
  {
    id: "CMT-103",
    content: "بخش‌های مربوط به معماری خیلی خوب و شفاف بود.",
    createdAt: "2026-05-21T13:20:00.000Z",
    rating: 5,
    courseId: "nextjs",
    courseTitle: "متخصص React و Next.js",
    commentableType: "course",
    commentableId: "nextjs",
    parentId: "CMT-103",
    user: {
      id: "user-43",
      fullName: "مریم صادقی",
      avatar: "/images/student3.jpg",
    },
  },
];

const tickets = [
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
        senderType: "user",
        senderName: "کاربر تست",
        message: "سلام، ویدیوهای بخش چهارم لود نمی‌شود و خطای اتصال می‌دهد.",
        text: "سلام، ویدیوهای بخش چهارم لود نمی‌شود و خطای اتصال می‌دهد.",
        timestamp: "۱۴۰۲/۰۸/۲۵ - ۱۰:۳۰",
      },
      {
        id: "m2",
        sender: "support",
        senderType: "support",
        senderName: "پشتیبانی اسپاتی‌کد",
        message: "سلام وقت بخیر. مشکل سرور پخش ویدیو برطرف شده، لطفاً دوباره بررسی کنید.",
        text: "سلام وقت بخیر. مشکل سرور پخش ویدیو برطرف شده، لطفاً دوباره بررسی کنید.",
        timestamp: "۱۴۰۲/۰۸/۲۵ - ۱۲:۱۵",
      },
    ],
    attachments: [],
    timeline: [],
  },
  {
    id: "TIC-8415",
    title: "درخواست بازگشت وجه خرید اشتباه",
    category: "مالی و پرداخت",
    status: "investigating",
    priority: "urgent",
    createdAt: "۱۴۰۲/۰۸/۲۲",
    updatedAt: "۱ روز پیش",
    messages: [
      {
        id: "m1",
        sender: "user",
        senderType: "user",
        senderName: "کاربر تست",
        message: "اشتباهی اشتراک یک ساله خریدم و درخواست اصلاح دارم.",
        text: "اشتباهی اشتراک یک ساله خریدم و درخواست اصلاح دارم.",
        timestamp: "۱۴۰۲/۰۸/۲۲ - ۰۹:۱۵",
      },
    ],
    attachments: [],
    timeline: [],
  },
];

const transactions = [
  {
    id: "TRX-1001",
    type: "payment",
    description: "خرید دوره متخصص React و Next.js",
    amount: 4500000,
    status: "success",
    createdAt: "2026-05-20T14:25:00.000Z",
    paymentMethod: "درگاه زرین‌پال",
    trackingCode: "ZP-835201",
    productTitle: "متخصص React و Next.js",
  },
  {
    id: "TRX-1002",
    type: "payment",
    description: "خرید دوره جاوااسکریپت",
    amount: 2200000,
    status: "pending",
    createdAt: "2026-05-18T11:10:00.000Z",
    paymentMethod: "درگاه بانکی",
    trackingCode: "BNK-922104",
    productTitle: "جادوی جاوااسکریپت",
  },
  {
    id: "TRX-1003",
    type: "refund",
    description: "بازگشت وجه سفارش آزمایشی",
    amount: 980000,
    status: "refunded",
    createdAt: "2026-05-11T09:45:00.000Z",
    paymentMethod: "کیف پول",
    trackingCode: "RF-113204",
    productTitle: "آشنایی با HTML",
  },
];

let instructorQuestions = [
  {
    id: "QST-001",
    studentName: "علیرضا رضایی",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    title: "خطای Hydration در استفاده از useState و localStorage",
    text: "سلام استاد وقت بخیر. من در پروژه‌ام مقدار اولیه useState را از localStorage می‌خوانم ولی با خطای Hydration Mismatch مواجه می‌شوم. چطور می‌توانم این مشکل را حل کنم؟",
    description: "سلام استاد وقت بخیر. من در پروژه‌ام مقدار اولیه useState را از localStorage می‌خوانم ولی با خطای Hydration Mismatch مواجه می‌شوم. چطور می‌توانم این مشکل را حل کنم؟",
    errorText: "Hydration failed because the initial UI does not match what was rendered on the server.",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    lessonTitle: "فولدر استراکچر جدید و سیستم Routing",
    createdAt: "1404/02/15",
    status: "new",
    replies: [
      {
        senderName: "علیرضا رضایی",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        text: "تصویر خطا را هم ضمیمه کردم. مقدار سمت کلاینت با سرور همخوانی ندارد چون در سرور localStorage وجود ندارد.",
        createdAt: "1404/02/15",
      },
    ],
  },
  {
    id: "QST-002",
    studentName: "سارا احمدی",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    title: "عدم شناسایی متغیرهای محیطی در Server Actions",
    text: "سلام خسته نباشید. متغیرهای محیطی که در فایل env.local قرار دادم در داخل Server Actionها لود نمی‌شوند و undefined برمی‌گردانند. علت چیست؟",
    description: "سلام خسته نباشید. متغیرهای محیطی که در فایل env.local قرار دادم در داخل Server Actionها لود نمی‌شوند و undefined برمی‌گردانند. علت چیست؟",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    lessonTitle: "مفهوم Server Actions در ری‌اکت ۱۹",
    createdAt: "1404/02/12",
    status: "answered",
    replies: [
      {
        senderName: "سارا احمدی",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        text: "متغیرها در کلاینت با پیشوند NEXT_PUBLIC به درستی کار می‌کنند ولی در اکشن‌ها که سمت سرور هستند خیر.",
        createdAt: "1404/02/12",
      },
      {
        senderName: "اصغر رضایی",
        role: "instructor",
        avatar: "",
        text: "سلام سارا جان. به یاد داشته باش که متغیرهای سرور در Next.js نیازی به پیشوند NEXT_PUBLIC ندارند اما دقت کن که سرور اکشن شما در حین بیلد فراخوانی نشود. همچنین مطمئن شو که اسم فایل دقیقاً .env.local باشد و سرور را بعد از تغییر متغیرها حتماً یکبار ری‌استارت کرده باشی. اگر مشکل حل نشد کدت رو بفرست.",
        createdAt: "1404/02/13",
      },
    ],
  },
];

let studentQuestions = [
  {
    id: "QST-STU-001",
    lessonId: "l1",
    courseId: "react",
    question: "خطای Hydration در useState\n\nسلام استاد. مقدار اولیه useState را از localStorage می‌خوانم و Hydration Mismatch می‌گیرم.\n\n--- خطا / لاگ ---\nHydration failed because the initial UI does not match what was rendered on the server.",
    status: "waiting",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    studentName: "کاربر تست",
    courseTitle: "مسترکلاس ری‌اکت",
    lessonTitle: "معرفی دوره و پیش‌نیازها",
    replies: [],
  },
];

const surveys = [
  {
    id: 1,
    fullName: "سهراب امینی",
    role: "توسعه‌دهنده React",
    avatar: "/images/student1.jpg",
    comment: "پروژه‌های عملی این آکادمی باعث شد ترس من از کدنویسی بریزه و الان در یک شرکت معتبر مشغولم.",
  },
  {
    id: 2,
    fullName: "سارا رضایی",
    role: "توسعه‌دهنده موبایل",
    avatar: "/images/student2.jpg",
    comment: "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در دوره موبایل بود. منتورها واقعاً دلسوزانه کمک می‌کنند.",
  },
  {
    id: 3,
    fullName: "نیما حسینی",
    role: "متخصص دیتاساینس",
    avatar: "/images/student3.jpg",
    comment: "محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴ ساعته واقعاً یک مزیت بزرگه.",
  },
];

const profile = {
  id: "mock-user-1",
  fullName: "کاربر تست",
  displayName: "کاربر تست",
  userName: "spoticode_user",
  phoneNumber: "+989100000004",
  bio: "عاشق یادگیری تکنولوژی‌های وب و ساخت رابط‌های کاربری مدرن.",
  avatar: "/images/user1.jpg",
  roleLabel: "Frontend Learner",
  location: "تهران، ایران",
  joinDate: "۱۴۰۲",
};

const myProfile = {
  occupation: profile.displayName,
  about: profile.bio,
  location: profile.location,
  githubLink: "https://github.com/spoticode_user",
  linkedinLink: "",
  mbtiType: "INTJ",
  personalWebsiteLink: "",
  contacts: "",
  skills: "JavaScript, React, Next.js, TypeScript, Tailwind CSS, Git, Figma",
  image: profile.avatar,
};

function json<T>(data: T) {
  return structuredClone(data);
}

function findCourse(path: string) {
  const id = decodeURIComponent(path.split("/").pop() || "");
  return courses.find((course) => course.id === id || course.slug === id) ?? courses[0];
}

export function getMockApiResponse<T>({ method, path, body }: MockRequest): T | undefined {
  const cleanPath = path.split("?")[0];

  if (method === "get" && cleanPath === "/api/courses/public") {
    return json({ data: courses }) as T;
  }

  if (method === "get" && cleanPath.startsWith("/api/courses/public/")) {
    return json({ data: findCourse(cleanPath) }) as T;
  }

  if (method === "post" && /^\/api\/courses\/lessons\/[^/]+\/complete$/.test(cleanPath)) {
    const lessonId = decodeURIComponent(cleanPath.split("/")[4] || "");
    return json({
      data: {
        id: lessonId,
        isCompleted: true,
        completed: true,
        isWatched: true,
        watched: true,
      },
    }) as T;
  }

  if (method === "get" && cleanPath === "/api/surveys") {
    return json({ data: surveys }) as T;
  }

  if (method === "get" && cleanPath.startsWith("/api/comments/course/")) {
    return json({ data: { items: comments, total: comments.length } }) as T;
  }

  if (method === "get" && cleanPath === "/api/dashboard/overview") {
    return json({
      data: {
        activeCourses: 3,
        activeCoursesCount: 3,
        learningHours: 86,
        totalLearningHours: 86,
        completedCourses: 1,
        completedCoursesCount: 1,
      },
    }) as T;
  }

  if (method === "get" && cleanPath === "/api/dashboard/my-courses") {
    return json({
      data: courses.slice(0, 4).map((course, index) => ({
        ...course,
        progress: [72, 48, 23, 91][index] ?? 0,
        progressPercent: [72, 48, 23, 91][index] ?? 0,
      })),
    }) as T;
  }

  if (method === "get" && cleanPath === "/api/instructor-dashboard/my-qas") {
    return json({ data: instructorQuestions }) as T;
  }

  if (method === "get" && cleanPath === "/api/qas/my") {
    return json({ data: studentQuestions }) as T;
  }

  if (method === "post" && cleanPath === "/api/qas") {
    const requestBody = body && typeof body === "object" ? (body as { lessonId?: string; courseId?: string; question?: string }) : {};
    const created = {
      id: `QST-${now.getTime()}`,
      lessonId: requestBody.lessonId ?? "",
      courseId: requestBody.courseId ?? "",
      question: requestBody.question ?? "",
      status: "questioned",
      createdAt: now.toISOString(),
      studentName: "کاربر تست",
      courseTitle: "دوره تست",
      lessonTitle: "درس فعال",
      replies: [],
    };
    studentQuestions = [created, ...studentQuestions];
    return json({ data: created }) as T;
  }

  if (method === "get" && cleanPath === "/api/dashboard/my-transactions") {
    return json({ data: transactions }) as T;
  }

  if (method === "get" && cleanPath === "/api/instructor-dashboard/my-comments") {
    return json({ data: instructorComments }) as T;
  }

  if (method === "get" && cleanPath === "/api/dashboard/my-tickets") {
    return json({ data: tickets }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/overview$/.test(cleanPath)) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    return json({ data: buildAdminUserOverview(userId) }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/courses$/.test(cleanPath)) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    const user = findAdminUser(userId);
    return json({
      data: user.purchasedCourses.map((course) => ({
        title: course.name,
        name: course.name,
        purchaseDate: course.purchaseDate,
        status: course.status,
        progress: course.progress,
      })),
    }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/transactions$/.test(cleanPath)) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    const user = findAdminUser(userId);
    return json({
      data: user.recentTransactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status === "موفق" ? "paid" : transaction.status === "در انتظار" ? "pending" : "failed",
        createdAt: transaction.date,
      })),
    }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/tickets$/.test(cleanPath)) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    const user = findAdminUser(userId);
    return json({
      data: user.recentTickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status === "باز" ? "open" : ticket.status === "در حال بررسی" ? "underReview" : "closed",
        createdAt: ticket.date,
      })),
    }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/activities$/.test(cleanPath)) {
    return json({ data: adminUserActivities }) as T;
  }

  if (method === "get" && /^\/api\/admin-dashboard\/users\/[^/]+\/internal-note$/.test(cleanPath)) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    return json({ data: { userId, internalAdminNote: findAdminUser(userId).internalNotes ?? "" } }) as T;
  }

  if (method === "get" && /^\/api\/users\/[^/]+$/.test(cleanPath)) {
    const segment = decodeURIComponent(cleanPath.split("/").pop() || "");
    if (segment !== "profile" && segment !== "find-all-by-rolename") {
      const user = findAdminUser(segment);
      return json({
        data: {
          id: segment,
          fullName: user.name,
          phoneNumber: user.phone,
          email: user.email,
          isActive: user.status === "فعال",
          roleName: user.role,
          internalAdminNote: user.internalNotes ?? "",
        },
      }) as T;
    }
  }

  if (method === "get" && /^\/api\/tickets\/admin\/[^/]+$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/")[4] || "");
    const ticket = tickets.find((item) => item.id === id) ?? tickets[0];
    return json({ data: ticket }) as T;
  }

  if (method === "get" && cleanPath === "/api/tickets") {
    return json(tickets) as T;
  }

  if (method === "get" && /^\/api\/tickets\/my\/[^/]+$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/").pop() || "");
    const ticket = tickets.find((item) => item.id === id) ?? tickets[0];
    return json({ data: ticket }) as T;
  }

  if (method === "get" && /^\/api\/tickets\/[^/]+$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/").pop() || "");
    return json(tickets.find((ticket) => ticket.id === id) ?? tickets[0]) as T;
  }

  if (method === "get" && /^\/api\/tickets\/my\/[^/]+\/messages$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/")[4] || "");
    const ticket = tickets.find((item) => item.id === id) ?? tickets[0];
    return json({ data: ticket.messages }) as T;
  }

  if (method === "get" && cleanPath === "/api/users/profile") {
    return json({ data: profile }) as T;
  }

  if (method === "get" && cleanPath === "/api/profiles/me") {
    return json({ data: myProfile }) as T;
  }

  if (method === "get" && cleanPath === "/api/instructor-dashboard/overview") {
    return json({
      data: {
        totalCourses: courses.length,
        publishedCourses: courses.filter((course) => course.status === "published").length,
        pendingCourses: 1,
        draftCourses: courses.filter((course) => course.status === "draft").length,
        totalStudents: courses.reduce((sum, course) => sum + Number(course.studentsCount ?? 0), 0),
        totalRevenue: courses.reduce((sum, course) => sum + Number(course.revenue ?? 0), 0),
        newQuestions: 6,
      },
    }) as T;
  }

  if (method === "get" && cleanPath === "/api/instructor-dashboard/my-courses") {
    return json({ data: courses }) as T;
  }

  if (method === "post" && cleanPath === "/api/auth/resend-verification-code") {
    const phoneNumber = (body as { phoneNumber?: string } | undefined)?.phoneNumber;
    return json({ data: { otp: "000000", phoneNumber } }) as T;
  }

  if (method === "post" && cleanPath === "/api/auth/register-by-phone") {
    const phoneNumber = (body as { phoneNumber?: string } | undefined)?.phoneNumber;
    return json({ data: { otp: "000000", phoneNumber } }) as T;
  }

  if (method === "post" && cleanPath === "/api/auth/verify-phone") {
    const phoneNumber = (body as { phoneNumber?: string } | undefined)?.phoneNumber ?? "+989100000004";
    return json({
      data: {
        id: "mock-user-1",
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        phoneNumber,
        fullName: "کاربر تست",
        roles: [{ name: "USER" }],
      },
    }) as T;
  }

  if (method === "post" && cleanPath === "/api/auth/refresh-token") {
    return json({
      data: {
        accessToken: "mock-access-token-refreshed",
        refreshToken: "mock-refresh-token",
      },
    }) as T;
  }

  if (method === "post" && cleanPath === "/api/orders") {
    return json({
      data: {
        id: `ORD-${now.getTime()}`,
        status: "created",
        paymentUrl: "#",
      },
    }) as T;
  }

  if (method === "post" && cleanPath === "/api/comments") {
    return json({
      data: {
        id: `comment-${now.getTime()}`,
        ...(body && typeof body === "object" ? body : {}),
        createdAt: now.toISOString(),
      },
    }) as T;
  }

  if (method === "post" && cleanPath === "/api/comments/reply/admin") {
    const requestBody = body && typeof body === "object" ? (body as { content?: string; commentableId?: string; parentId?: string; rating?: number }) : {};
    const parentId = typeof requestBody.parentId === "string" && requestBody.parentId.trim() ? requestBody.parentId : `CMT-${now.getTime()}`;
    const content = typeof requestBody.content === "string" ? requestBody.content : "";
    const updatedComment = instructorComments.find((comment) => comment.id === parentId || comment.parentId === parentId);

    if (updatedComment) {
      const next = {
        ...updatedComment,
        reply: {
          content,
          createdAt: now.toISOString(),
        },
      };
      instructorComments = instructorComments.map((comment) => (comment.id === updatedComment.id ? next : comment));
      return json(next) as T;
    }

    return json({
      id: parentId,
      content,
      createdAt: now.toISOString(),
      rating: typeof requestBody.rating === "number" ? requestBody.rating : 5,
      commentableType: "course",
      commentableId: requestBody.commentableId ?? "",
      parentId,
      reply: {
        content,
        createdAt: now.toISOString(),
      },
    }) as T;
  }

  if (method === "patch" && /^\/api\/qas\/[^/]+\/answer$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/")[3] || "");
    const requestBody = body && typeof body === "object" ? (body as { answer?: string; answerFileIds?: string[] }) : {};
    const answer = typeof requestBody.answer === "string" ? requestBody.answer : "";
    const answerFileIds = Array.isArray(requestBody.answerFileIds) ? requestBody.answerFileIds.filter(Boolean) : [];
    const existing = instructorQuestions.find((question) => question.id === id);

    if (existing) {
      const updated = {
        ...existing,
        status: "answered" as const,
        replies: [
          ...existing.replies,
          {
            senderName: "اصغر رضایی",
            role: "instructor" as const,
            avatar: "",
            text: answer,
            createdAt: now.toISOString(),
            ...(answerFileIds.length
              ? {
                  attachments: answerFileIds.map((fileId) => ({
                    id: fileId,
                    name: fileId,
                    size: 0,
                    type: "application/octet-stream",
                  })),
                }
              : {}),
          },
        ],
      };
      instructorQuestions = instructorQuestions.map((question) => (question.id === id ? updated : question));
      return json(updated) as T;
    }

    return json({
      id,
      status: "answered",
      replies: [
        {
          senderName: "اصغر رضایی",
          role: "instructor",
          avatar: "",
          text: answer,
          createdAt: now.toISOString(),
        },
      ],
    }) as T;
  }

  if (method === "post" && cleanPath === "/api/tickets/my") {
    return json({
      data: {
        id: `TIC-${now.getTime()}`,
        ...(body && typeof body === "object" ? body : {}),
        status: "open",
        createdAt: now.toISOString(),
      },
    }) as T;
  }

  if (method === "post" && /^\/api\/tickets\/my\/[^/]+\/messages$/.test(cleanPath)) {
    return json({
      data: {
        id: `msg-${now.getTime()}`,
        ...(body && typeof body === "object" ? body : {}),
        senderType: "user",
        senderName: "کاربر تست",
        createdAt: now.toISOString(),
      },
    }) as T;
  }

  if (method === "post" && /^\/api\/tickets\/admin\/[^/]+\/messages$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/")[4] || "");
    const ticket = tickets.find((item) => item.id === id);
    const msgBody =
      body && typeof body === "object" && "body" in body && typeof (body as { body?: unknown }).body === "string"
        ? (body as { body: string }).body
        : "";
    const newMsg = {
      id: `msg-${now.getTime()}`,
      sender: "support",
      senderType: "admin",
      senderName: "پشتیبانی ادمین",
      message: msgBody,
      text: msgBody,
      body: msgBody,
      timestamp: now.toISOString(),
      createdAt: now.toISOString(),
    };

    if (ticket) {
      ticket.messages = [...(ticket.messages ?? []), newMsg];
      ticket.status = "answered";
      ticket.updatedAt = "همین الان";
    }

    return json({ data: newMsg }) as T;
  }

  if (method === "patch" && /^\/api\/tickets\/my\/[^/]+\/close$/.test(cleanPath)) {
    const id = decodeURIComponent(cleanPath.split("/")[4] || "");
    const ticket = tickets.find((item) => item.id === id);
    if (ticket) {
      ticket.status = "closed";
      ticket.updatedAt = "همین الان";
      return json({ data: ticket }) as T;
    }
    return json({ data: { id, status: "closed", updatedAt: "همین الان" } }) as T;
  }

  if ((method === "patch" || method === "put") && cleanPath === "/api/users/profile") {
    return json({
      data: {
        ...profile,
        ...(body && typeof body === "object" ? body : {}),
        updatedAt: now.toISOString(),
      },
    }) as T;
  }

  if (method === "patch" && /^\/api\/users\/[^/]+$/.test(cleanPath)) {
    const segment = decodeURIComponent(cleanPath.split("/").pop() || "");
    if (segment !== "profile" && segment !== "find-all-by-rolename") {
      const user = findAdminUser(segment);
      const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
      return json({
        data: {
          id: segment,
          fullName: payload.fullName ?? user.name,
          phoneNumber: payload.phoneNumber ?? user.phone,
          email: payload.email ?? user.email,
          isActive: payload.isActive ?? user.status === "فعال",
          roleName: payload.roleName ?? ApplicationMainRoles.USER,
          internalAdminNote: payload.internalAdminNote ?? user.internalNotes ?? "",
        },
      }) as T;
    }
  }

  if (method === "put" && cleanPath === "/api/profiles/me") {
    Object.assign(
      myProfile,
      body && typeof body === "object" ? body : {}
    );
    return json({ data: myProfile }) as T;
  }

  if (
    (method === "post" || method === "patch") &&
    /^\/api\/admin-dashboard\/users\/[^/]+\/internal-note$/.test(cleanPath)
  ) {
    const userId = decodeURIComponent(cleanPath.split("/")[4] || "");
    return json({
      data: {
        userId,
        internalAdminNote: (body && typeof body === "object" ? (body as { note?: string }).note : "") ?? "",
        updatedAt: now.toISOString(),
      },
    }) as T;
  }

  return undefined;
}
