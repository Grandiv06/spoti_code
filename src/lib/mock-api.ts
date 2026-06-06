type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type MockRequest = {
  method: HttpMethod;
  path: string;
  body?: unknown;
};

const now = new Date("2026-06-05T10:30:00.000Z");

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

  if (method === "get" && cleanPath === "/api/dashboard/my-transactions") {
    return json({ data: transactions }) as T;
  }

  if (method === "get" && cleanPath === "/api/dashboard/my-tickets") {
    return json({ data: tickets }) as T;
  }

  if (method === "get" && cleanPath === "/api/tickets") {
    return json(tickets) as T;
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
        phoneNumber,
        fullName: "کاربر تست",
        roles: [{ name: "USER" }],
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

  if ((method === "patch" || method === "put") && cleanPath === "/api/users/profile") {
    return json({
      data: {
        ...profile,
        ...(body && typeof body === "object" ? body : {}),
        updatedAt: now.toISOString(),
      },
    }) as T;
  }

  return undefined;
}
