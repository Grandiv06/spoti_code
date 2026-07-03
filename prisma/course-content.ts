export type CourseChapterSeed = {
  title: string;
  subtitle?: string;
  lessons: Array<{
    title: string;
    duration?: string;
    isLocked?: boolean;
    isFreePreview?: boolean;
    isFree?: boolean;
    videoUrl?: string;
  }>;
};

export type CourseFaqSeed = {
  question: string;
  answer: string;
};

export const COURSE_CONTENT_BY_ID: Record<
  string,
  {
    aboutDescription?: string;
    specialWord?: string;
    introVideo?: string;
    introVideoDuration?: string;
    chapters?: CourseChapterSeed[];
    faqs?: CourseFaqSeed[];
  }
> = {
  html: {
    aboutDescription:
      "در این دوره از صفر با ساختار صفحات وب، تگ‌های معنایی و استانداردهای HTML آشنا می‌شوید و یاد می‌گیرید صفحات قابل نگهداری بسازید.",
    chapters: [
      { title: "شروع HTML", lessons: [{ title: "ساختار سند", duration: "08:20" }, { title: "تگ‌های اصلی", duration: "11:40" }] },
      { title: "فرم‌ها و رسانه", lessons: [{ title: "فرم‌ها", duration: "14:10" }, { title: "تصاویر و ویدیو", duration: "09:55" }] },
    ],
    faqs: [{ question: "آیا پیش‌نیاز لازم دارد؟", answer: "خیر، این دوره از صفر شروع می‌شود." }],
  },
  css: {
    aboutDescription:
      "از مبانی CSS تا ساخت چیدمان‌های مدرن و responsive را با پروژه‌های واقعی تمرین می‌کنید و اصول طراحی بصری وب را یاد می‌گیرید.",
    chapters: [
      {
        title: "مبانی CSS",
        lessons: [
          {
            title: "Selectors",
            duration: "10:00",
            isFreePreview: true,
            isLocked: false,
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
          },
          { title: "Box Model", duration: "12:30", isLocked: true },
        ],
      },
      { title: "Layout", lessons: [{ title: "Flexbox", duration: "18:00" }, { title: "Grid", duration: "16:45" }] },
    ],
    faqs: [{ question: "آیا HTML بلد باشم کافی است؟", answer: "بله، آشنایی پایه با HTML برای این دوره کافی است." }],
  },
  javascript: {
    aboutDescription:
      "در این مسیر منطق برنامه‌نویسی، تعامل با صفحه و ارتباط با API را به شکل عملی یاد می‌گیرید و برای ورود به React آماده می‌شوید.",
    chapters: [
      { title: "زبان JavaScript", lessons: [{ title: "Variables", duration: "15:00" }, { title: "Functions", duration: "17:20" }] },
      { title: "وب تعاملی", lessons: [{ title: "DOM", duration: "22:10" }, { title: "Fetch", duration: "19:40" }] },
    ],
    faqs: [{ question: "چند پروژه عملی داریم؟", answer: "در طول دوره چند پروژه کوچک و یک پروژه جمع‌بندی دارید." }],
  },
  react: {
    aboutDescription:
      "React را با تمرکز روی معماری کامپوننتی، state management و ساخت اپلیکیشن‌های واقعی یاد می‌گیرید.",
    chapters: [
      { title: "Core React", lessons: [{ title: "Components", duration: "20:00" }, { title: "Hooks", duration: "24:30" }] },
      { title: "Project", lessons: [{ title: "Dashboard", duration: "28:00" }, { title: "API Integration", duration: "26:15" }] },
    ],
    faqs: [{ question: "آیا جاوااسکریپت لازم است؟", answer: "بله، تسلط متوسط به JavaScript برای این دوره لازم است." }],
  },
  nextjs: {
    aboutDescription:
      "امیررضا رضایی در سال‌های اخیر روی طراحی و توسعه پنل‌های پیچیده، فروشگاه‌های آنلاین و ابزارهای داخلی برای تیم‌های محصول کار کرده است. تمرکز اصلی او روی ساخت تجربه‌های سریع، مقیاس‌پذیر و قابل نگهداری با React و Next.js است.\n\nدر طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید؛ از بهینه‌سازی پرفورمنس گرفته تا مدیریت state‌های پیچیده و پیاده‌سازی Authentication امن در Next.js.",
    specialWord: "Next.js",
    introVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    introVideoDuration: "05:34",
    chapters: [
      {
        title: "Next.js Fundamentals",
        subtitle: "مسیریابی و رندر سمت سرور",
        lessons: [
          {
            title: "Routing",
            duration: "18:40",
            isFreePreview: true,
            isLocked: false,
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
          },
          { title: "Server Components", duration: "21:10", isLocked: true },
        ],
      },
      {
        title: "Production",
        subtitle: "استقرار و احراز هویت",
        lessons: [
          { title: "Auth", duration: "25:00", isLocked: true },
          { title: "Deployment", duration: "16:30", isLocked: true },
        ],
      },
    ],
    faqs: [
      { question: "آیا React بلد باشم کافی است؟", answer: "بله، آشنایی عملی با React و Hooks پیش‌نیاز اصلی این دوره است." },
      { question: "پروژه نهایی چیست؟", answer: "یک محصول واقعی با App Router، احراز هویت و استقرار production-grade." },
    ],
  },
  typescript: {
    aboutDescription: "TypeScript را برای پروژه‌های بزرگ و تیمی به شکل عمیق و کاربردی یاد می‌گیرید.",
    chapters: [{ title: "Types", lessons: [{ title: "Generics", duration: "19:00" }, { title: "Utility Types", duration: "17:45" }] }],
    faqs: [{ question: "این دوره برای چه کسانی است؟", answer: "توسعه‌دهندگانی که JavaScript را بلدند و می‌خواهند TypeScript حرفه‌ای یاد بگیرند." }],
  },
};
