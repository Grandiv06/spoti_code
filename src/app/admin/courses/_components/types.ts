export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isFree?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface CourseStudent {
  id: string;
  name: string;
  purchaseDate: string;
  progress: number; // 0 - 100
  status: "فعال" | "غیرفعال" | "معلق";
}

export interface CourseReview {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: "Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX";
  students: number;
  completion: number; // average completion percentage
  revenue: number; // numeric value for sorting and calculation
  status: "منتشر شده" | "پیش‌نویس" | "در انتظار بررسی" | "غیرفعال";
  price: number; // numeric value (e.g. 2900000)
  publishDate: string;
  updatedAt: string;
  shortDescription: string;
  description: string;
  level: "مقدماتی" | "متوسط" | "پیشرفته";
  duration: string; // e.g. "45 ساعت"
  coverImage?: string;
  tags: string[];
  prerequisites: string[];
  chapters: Chapter[];
  studentsList: CourseStudent[];
  reviews: CourseReview[];
  refundRate: number; // e.g. 1.2%
}

export interface SalesByCategory {
  label: "Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX";
  value: number;
  growth: number; // e.g. 12 (represents +12% growth)
  color: string;
  description: string;
}

export const initialSalesByCategory: SalesByCategory[] = [
  { label: "Frontend", value: 268, growth: 24, color: "#22c55e", description: "شامل دوره‌های HTML, CSS, React, Next.js و Tailwind" },
  { label: "Backend", value: 224, growth: 18, color: "#06b6d4", description: "شامل دوره‌های Node.js, Express, databases و معماری سیستم" },
  { label: "DevOps", value: 148, growth: 8, color: "#f59e0b", description: "شامل دوره‌های Docker, CI/CD, Kubernetes و استقرار" },
  { label: "Mobile", value: 112, growth: -3, color: "#a855f7", description: "شامل دوره‌های React Native, Flutter و اندروید نیتیو" },
  { label: "UI/UX", value: 97, growth: 12, color: "#ec4899", description: "شامل دوره‌های Figma, دیزاین سیستم و طراحی تجربه کاربری" },
];

export const initialCoursesData: Course[] = [
  {
    id: "CRS-410",
    title: "مسترکلاس Next.js",
    instructor: "سروش مشایخی",
    category: "Frontend",
    students: 1840,
    completion: 68,
    revenue: 248000000,
    status: "منتشر شده",
    price: 2900000,
    publishDate: "1404/05/20",
    updatedAt: "1404/12/15",
    shortDescription: "آموزش صفر تا صد فریم‌ورک Next.js همراه با پروژه‌های واقعی و بهینه‌سازی پیشرفته کارایی.",
    description: "در این مسترکلاس جامع، شما فریم‌ورک قدرتمند Next.js را از پایه تا سطح فوق‌پیشرفته یاد می‌گیرید. تمرکز ما روی معماری App Router، بهینه‌سازی سئو، امنیت، SSR و تولید استاتیک، و همچنین پیاده‌سازی تست‌ها خواهد بود. پروژه عملی پایانی یک فروشگاه پیشرفته با درگاه پرداخت مستقیم و سیستم چت آنلاین است.",
    level: "پیشرفته",
    duration: "48 ساعت",
    tags: ["React", "Next.js", "SSR", "TypeScript", "Performance"],
    prerequisites: ["تسلط بر React.js", "آشنایی با TypeScript"],
    refundRate: 0.8,
    chapters: [
      {
        id: "CH-1",
        title: "فصل اول: مقدمات و مهاجرت به App Router",
        duration: "6 ساعت",
        lessons: [
          { id: "L-1-1", title: "معرفی دوره و پیش‌نیازها", duration: "15:00", isFree: true },
          { id: "L-1-2", title: "چرا Next.js؟ بررسی تفاوت‌ها با React خام", duration: "25:00", isFree: true },
          { id: "L-1-3", title: "راه‌اندازی پروژه و ساختار جدید پوشه‌ها", duration: "40:00" },
          { id: "L-1-4", title: "مفهوم Routing در App Router", duration: "45:00" },
        ],
      },
      {
        id: "CH-2",
        title: "فصل دوم: رندرینگ سمت سرور (SSR) و کلاینت (CSR)",
        duration: "10 ساعت",
        lessons: [
          { id: "L-2-1", title: "Server Components چیست و چرا؟", duration: "35:00" },
          { id: "L-2-2", title: "Client Components و زمان استفاده مناسب", duration: "30:00" },
          { id: "L-2-3", title: "مدیریت داده‌ها با fetch در Next.js", duration: "50:00" },
          { id: "L-2-4", title: "بررسی کامل Caching و Revalidation", duration: "45:00" },
        ],
      },
      {
        id: "CH-3",
        title: "فصل سوم: پروژه‌های عملی و بهینه‌سازی سئو",
        duration: "14 ساعت",
        lessons: [
          { id: "L-3-1", title: "تنظیمات Metadata و سئوی پیشرفته", duration: "30:00" },
          { id: "L-3-2", title: "پروژه فروشگاهی: ساخت سبد خرید", duration: "60:00" },
          { id: "L-3-3", title: "اتصال به درگاه پرداخت و امنیت تراکنش‌ها", duration: "45:00" },
        ],
      },
    ],
    studentsList: [
      { id: "USR-992", name: "نیما احمدی", purchaseDate: "1404/12/18", progress: 95, status: "فعال" },
      { id: "USR-990", name: "رضا ملکی", purchaseDate: "1404/12/15", progress: 68, status: "فعال" },
      { id: "USR-989", name: "زهرا کیانی", purchaseDate: "1404/12/10", progress: 82, status: "فعال" },
      { id: "USR-987", name: "آرمان ابراهیمی", purchaseDate: "1404/12/05", progress: 10, status: "فعال" },
      { id: "USR-988", name: "مهسا زمانی", purchaseDate: "1404/11/25", progress: 42, status: "معلق" },
    ],
    reviews: [
      { id: "RV-1", userName: "علی یوسفی", rating: 5, comment: "بهترین و کامل‌ترین دوره‌ای بود که توی این زمینه دیدم. تسلط مدرس واقعاً بی‌نظیر بود.", date: "1404/12/16" },
      { id: "RV-2", userName: "مریم حسینی", rating: 4, comment: "محتوا عالی بود. ای کاش بخش مربوط به استقرار روی سرورهای ابری طولانی‌تر بود.", date: "1404/12/12" },
      { id: "RV-3", userName: "سعید کرمی", rating: 5, comment: "پاسخگویی پشتیبانی عالیه و پروژه‌های عملی هم بسیار کاربردی طراحی شدند.", date: "1404/12/08" },
    ],
  },
  {
    id: "CRS-407",
    title: "TypeScript پیشرفته",
    instructor: "الهام بهشتی",
    category: "Frontend",
    students: 1320,
    completion: 59,
    revenue: 187500000,
    status: "منتشر شده",
    price: 1980000,
    publishDate: "1404/06/15",
    updatedAt: "1404/12/12",
    shortDescription: "آموزش عمیق تایپ‌اسکریپت، از مفاهیم اولیه تا مباحث پیچیده مانند تایپ‌های شرطی، ژنریک‌های پیشرفته و دکوراتورها.",
    description: "تایپ‌اسکریپت امروزه به یک استاندارد در دنیای فرانت‌اند و بک‌اند تبدیل شده است. در این دوره ما از مباحث پایه‌ای فراتر رفته و روی الگوهای طراحی پیشرفته با تایپ‌ها کار می‌کنیم تا بتوانید کدهای بسیار ایمن‌تر و خطایاب‌تر بنویسید.",
    level: "پیشرفته",
    duration: "30 ساعت",
    tags: ["TypeScript", "Generics", "OOP", "Webpack"],
    prerequisites: ["تسلط خوب بر JavaScript ES6+"],
    refundRate: 1.5,
    chapters: [
      {
        id: "CH-1",
        title: "فصل اول: یادآوری و ورود به دنیای پیشرفته",
        duration: "5 ساعت",
        lessons: [
          { id: "L-2-1", title: "مفهوم Structural Typing", duration: "25:00", isFree: true },
          { id: "L-2-2", title: "کاربرد Union و Intersection", duration: "35:00" },
        ],
      },
      {
        id: "CH-2",
        title: "فصل دوم: Generics و Conditional Types",
        duration: "12 ساعت",
        lessons: [
          { id: "L-2-3", title: "ژنریک‌ها در توابع و اینترفیس‌ها", duration: "45:00" },
          { id: "L-2-4", title: "تایپ‌های شرطی و کلمه کلیدی infer", duration: "55:00" },
          { id: "L-2-5", title: "پروژه عملی: ساخت کتابخانه اعتبارسنجی فرم", duration: "60:00" },
        ],
      },
    ],
    studentsList: [
      { id: "USR-992", name: "نیما احمدی", purchaseDate: "1404/12/14", progress: 90, status: "فعال" },
      { id: "USR-989", name: "زهرا کیانی", purchaseDate: "1404/12/11", progress: 59, status: "فعال" },
      { id: "USR-986", name: "سمیه فراهانی", purchaseDate: "1404/11/30", progress: 28, status: "فعال" },
    ],
    reviews: [
      { id: "RV-4", userName: "حسام کریمی", rating: 5, comment: "عالی، یادگیری Conditional Types همیشه برام سخت بود ولی اینجا خیلی خوب جا افتاد.", date: "1404/12/10" },
    ],
  },
  {
    id: "CRS-402",
    title: "Node.js از صفر",
    instructor: "امیر محمدی",
    category: "Backend",
    students: 980,
    completion: 54,
    revenue: 131000000,
    status: "منتشر شده",
    price: 2400000,
    publishDate: "1404/07/02",
    updatedAt: "1404/12/01",
    shortDescription: "ساخت وب‌سرویس‌های مقیاس‌پذیر و سریع با Node.js، Express، MongoDB و PostgreSQL از پایه.",
    description: "در این دوره، معماری غیرهمزمان Node.js و نحوه توسعه سرورهای مدرن را یاد می‌گیرید. مباحثی مانند امنیت، احراز هویت با JWT، وب‌ساکت‌ها و دیتابیس‌های رابطه‌ای و غیررابطه‌ای را همراه با پیاده‌سازی ساختارهای ماژولار و تمیز فرا خواهید گرفت.",
    level: "متوسط",
    duration: "40 ساعت",
    tags: ["Node.js", "Express", "REST API", "Database", "Security"],
    prerequisites: ["آشنایی مقدماتی با برنامه‌نویسی و وب"],
    refundRate: 2.1,
    chapters: [
      {
        id: "CH-1",
        title: "فصل اول: مفاهیم پایه و راه‌اندازی Node",
        duration: "8 ساعت",
        lessons: [
          { id: "L-3-1", title: "موتور V8 و ساختار غیرهمزمان Node.js", duration: "30:00", isFree: true },
          { id: "L-3-2", title: "Event Loop و ماژول‌های داخلی", duration: "40:00", isFree: true },
        ],
      },
    ],
    studentsList: [
      { id: "USR-991", name: "هانیه عابدی", purchaseDate: "1404/12/17", progress: 54, status: "فعال" },
      { id: "USR-987", name: "آرمان ابراهیمی", purchaseDate: "1404/12/02", progress: 85, status: "فعال" },
    ],
    reviews: [
      { id: "RV-5", userName: "پیمان اسدی", rating: 4, comment: "بسیار خوب و روان توضیح داده شده بود. بخش دیتابیس می‌تونست عمیق‌تر باشه.", date: "1404/11/25" },
    ],
  },
  {
    id: "CRS-398",
    title: "Docker & CI/CD",
    instructor: "آیدا رضایی",
    category: "DevOps",
    students: 744,
    completion: 47,
    revenue: 102300000,
    status: "پیش‌نویس",
    price: 1850000,
    publishDate: "1404/09/10",
    updatedAt: "1404/12/14",
    shortDescription: "کانتینرایز کردن اپلیکیشن‌ها با Docker و ایجاد پایپ‌لاین‌های پیشرفته CI/CD با GitHub Actions و GitLab.",
    description: "یاد بگیرید چطور برنامه‌های خود را در کانتینرها بسته‌بندی کنید تا در هر محیطی بدون مشکل اجرا شوند. سپس فرآیند تست، ساخت و انتشار پروژه را به صورت کاملاً اتوماتیک راه‌اندازی کنید.",
    level: "متوسط",
    duration: "25 ساعت",
    tags: ["Docker", "CI/CD", "GitHub Actions", "DevOps"],
    prerequisites: ["آشنایی با خط فرمان لینوکس", "آشنایی با توسعه وب"],
    refundRate: 0.5,
    chapters: [
      {
        id: "CH-1",
        title: "فصل اول: مقدمات Docker و مفاهیم اولیه",
        duration: "5 ساعت",
        lessons: [
          { id: "L-4-1", title: "کانتینر چیست؟ تفاوت با ماشین مجازی", duration: "20:00", isFree: true },
          { id: "L-4-2", title: "نصب و راه‌اندازی داکر در سیستم‌عامل‌های مختلف", duration: "30:00", isFree: true },
        ],
      },
    ],
    studentsList: [
      { id: "USR-992", name: "نیما احمدی", purchaseDate: "1404/12/10", progress: 47, status: "فعال" },
    ],
    reviews: [],
  },
  {
    id: "CRS-390",
    title: "UI Design Systems",
    instructor: "ناهید کشاورز",
    category: "UI/UX",
    students: 520,
    completion: 73,
    revenue: 88000000,
    status: "منتشر شده",
    price: 1600000,
    publishDate: "1404/04/10",
    updatedAt: "1404/11/20",
    shortDescription: "ساخت دیزاین سیستم‌های استاندارد، مقیاس‌پذیر و هماهنگ در Figma برای پروژه‌های بزرگ وب و موبایل.",
    description: "دیزاین سیستم ستون فقرات محصولات دیجیتال است. یاد بگیرید چطور متغیرهای رنگی، تایپوگرافی، کامپوننت‌های تعاملی و مستندات را طوری طراحی کنید که برنامه‌نویسان بتوانند دقیقاً همان را در کدهای خود پیاده کنند.",
    level: "پیشرفته",
    duration: "20 ساعت",
    tags: ["Figma", "UI/UX", "Design System", "Tokens"],
    prerequisites: ["آشنایی خوب با نرم‌افزار Figma"],
    refundRate: 1.1,
    chapters: [
      {
        id: "CH-1",
        title: "فصل اول: تعاریف و اصول دیزاین سیستم",
        duration: "4 ساعت",
        lessons: [
          { id: "L-5-1", title: "دیزاین سیستم چیست؟ چرا به آن نیاز داریم؟", duration: "25:00", isFree: true },
          { id: "L-5-2", title: "آناتومی یک دیزاین سیستم جامع", duration: "35:00", isFree: true },
        ],
      },
    ],
    studentsList: [
      { id: "USR-990", name: "رضا ملکی", purchaseDate: "1404/11/15", progress: 73, status: "فعال" },
    ],
    reviews: [
      { id: "RV-6", userName: "سعید راد", rating: 5, comment: "این دوره تحول بزرگی توی کار گروهی ما ایجاد کرد. مستندسازی فیگما عالی بود.", date: "1404/11/18" },
    ],
  },
];
