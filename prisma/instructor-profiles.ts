export const INSTRUCTOR_PROFILE_SEED = {
  "INS-101": {
    displayTitle: "مدرس ارشد فرانت‌اند و معماری وب",
    shortBio:
      "بیش از ۹ سال تجربه در ساخت محصولات SaaS، لید فنی تیم‌های فرانت‌اند و منتورینگ توسعه‌دهندگان در مسیر ورود به بازار کار.",
    fullBiography:
      "امیررضا رضایی در سال‌های اخیر روی طراحی و توسعه پنل‌های پیچیده، فروشگاه‌های آنلاین و ابزارهای داخلی برای تیم‌های محصول کار کرده است. تمرکز اصلی او روی ساخت تجربه‌های سریع، مقیاس‌پذیر و قابل نگهداری با React و Next.js است و در کنار توسعه محصول، سال‌ها سابقه منتورینگ و آموزش پروژه‌محور دارد.",
    mainExpertise: "React.js، Next.js، TypeScript و طراحی معماری مقیاس‌پذیر",
    teachingStyle:
      "سبک تدریس او عمیق، پروژه‌محور و نزدیک به شرایط واقعی شرکت‌هاست؛ هر مبحث با سناریوی واقعی، تمرین لایه‌لایه و بازخورد مهندسی جمع‌بندی می‌شود.",
    professionalBackground:
      "او سابقه همکاری با تیم‌های محصول در حوزه‌های فین‌تک، آموزش آنلاین و SaaS را دارد و روی طراحی معماری فرانت، performance، SSR و DX تیمی تمرکز می‌کند.",
    verified: true,
    coverImage: "/images/hero_image.jpg",
    yearsOfExperience: 9,
    skills: ["JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "UI Architecture", "Performance", "Git"],
    experiences: [
      {
        type: "work",
        title: "لید فرانت‌اند",
        organization: "اسنپ",
        startDate: "۱۴۰۱",
        endDate: "اکنون",
        description: "هدایت توسعه پنل‌های عملیاتی، بازطراحی design system و بهینه‌سازی عملکرد در پروژه‌های پرترافیک.",
      },
      {
        type: "teaching",
        title: "مدرس بوت‌کمپ فرانت‌اند",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۰",
        endDate: "اکنون",
        description: "آموزش پروژه‌محور React، Next.js و TypeScript به همراه منتورینگ فردی برای ورود به بازار کار.",
      },
    ],
    certificates: [
      { title: "Advanced React Architecture", issuer: "Frontend Masters", date: "۲۰۲۴", link: "https://frontendmasters.com" },
      { title: "Performance for Web Apps", issuer: "Google", date: "۲۰۲۳" },
    ],
    projects: [
      {
        title: "داشبورد تحلیل عملکرد فروش",
        description: "طراحی و پیاده‌سازی داشبورد مدیریتی با فیلترهای زنده و نمودارهای تحلیلی.",
        technologies: ["Next.js", "TypeScript", "Recharts", "Tailwind"],
        githubUrl: "https://github.com/arezaei/sales-dashboard",
        liveUrl: "https://demo.spoticode.ir/sales-dashboard",
        image: "/images/course3.jpg",
      },
    ],
    reviews: [
      {
        studentName: "مهدی امینی",
        rating: 5,
        reviewText: "شیوه تدریس استاد رضایی کاملاً پروژه‌محور است و دقیقاً حس کار در تیم واقعی را منتقل می‌کند.",
        relatedCourse: "متخصص React و Next.js",
        date: "اردیبهشت ۱۴۰۵",
      },
    ],
    socials: {
      github: "https://github.com/arezaei",
      linkedin: "https://linkedin.com/in/arezaei",
      telegram: "https://t.me/arezaei_dev",
      website: "https://rezaei.dev",
      email: "amirreza@spoticode.ir",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
    },
    publicVisibility: { email: true, phone: false },
  },
  "INS-102": {
    displayTitle: "مدرس React و توسعه رابط کاربری",
    shortBio: "تمرکز مهرداد روی تبدیل مفاهیم پیچیده رابط کاربری به پروژه‌های قابل فهم و آماده بازار کار است.",
    fullBiography:
      "مهرداد حیدری سال‌ها روی توسعه رابط‌های کاربری برای محصولات B2B و B2C کار کرده و در آموزش React، الگوهای state management و ساخت design system تخصص دارد.",
    mainExpertise: "React، State Management، Design Systems",
    teachingStyle: "رویکرد او بر یادگیری مرحله‌ای، ساخت پروژه‌های قابل ارائه و توضیح چرایی تصمیم‌های فنی استوار است.",
    professionalBackground:
      "او سابقه کار روی پنل‌های تحلیلی، اپلیکیشن‌های مدیریت مشتری و سامانه‌های آموزشی را در نقش frontend engineer دارد.",
    verified: true,
    yearsOfExperience: 7,
    skills: ["React.js", "SWR", "Design Systems", "Accessibility", "Tailwind CSS", "Testing"],
    experiences: [
      {
        type: "work",
        title: "Senior Frontend Engineer",
        organization: "پلتفرم مدیریت مشتری",
        startDate: "۱۴۰۰",
        endDate: "اکنون",
        description: "توسعه رابط‌های داده‌محور و کامپوننت‌های reusable برای محصول سازمانی.",
      },
    ],
    projects: [
      {
        title: "کتابخانه Design System داخلی",
        description: "مجموعه‌ای از کامپوننت‌های استاندارد برای محصولات سازمانی.",
        technologies: ["React", "Storybook", "TypeScript"],
        githubUrl: "https://github.com/mheidari/design-system",
      },
    ],
    socials: {
      github: "https://github.com/mheidari",
      linkedin: "https://linkedin.com/in/mheidari",
      telegram: "https://t.me/mheidari_ui",
    },
    publicVisibility: { email: false, phone: false },
  },
  "INS-103": {
    displayTitle: "مدرس UI Styling و CSS Architecture",
    shortBio:
      "سارا روی آموزش استایل‌دهی مدرن، طراحی واکنش‌گرا و ساخت تجربه‌های تمیز و مقیاس‌پذیر برای وب تمرکز دارد.",
    fullBiography:
      "سارا محمدی با سابقه طراحی و پیاده‌سازی رابط‌های کاربری برای فروشگاه‌های آنلاین و محصولات محتوایی، مباحث CSS و طراحی واکنش‌گرا را به‌شکل عملی و پروژه‌ای آموزش می‌دهد.",
    mainExpertise: "CSS، طراحی واکنش‌گرا، Flexbox، Grid و سیستم‌های طراحی",
    verified: true,
    yearsOfExperience: 6,
    skills: ["CSS", "Responsive Design", "Flexbox", "Grid", "UI/UX", "Figma"],
    experiences: [
      {
        type: "work",
        title: "UI Engineer",
        organization: "استودیو طراحی محصول",
        startDate: "۱۳۹۹",
        endDate: "اکنون",
        description: "توسعه رابط‌های بصری و responsive برای محصولات وب.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/saramohammadi",
      website: "https://saramohammadi.design",
    },
    publicVisibility: { email: false, phone: false },
  },
  "INS-104": {
    displayTitle: "مدرس مبانی توسعه وب",
    shortBio:
      "نیما روی آموزش اصول پایه توسعه وب برای کسانی تمرکز دارد که می‌خواهند مسیر برنامه‌نویسی را درست و اصولی شروع کنند.",
    fullBiography:
      "نیما علوی سال‌ها در تیم‌های محتوا و آموزش فنی فعالیت کرده و تجربه او در انتقال مفاهیم پایه، شروع مسیر یادگیری را برای هنرجویان ساده و حرفه‌ای می‌کند.",
    mainExpertise: "HTML، ساختار وب، فرم‌ها و استانداردهای دسترس‌پذیری",
    verified: true,
    yearsOfExperience: 5,
    skills: ["HTML", "Semantic Markup", "Accessibility", "Forms", "SEO Basics"],
    experiences: [
      {
        type: "teaching",
        title: "مدرس مبانی وب",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۱",
        endDate: "اکنون",
        description: "طراحی مسیر یادگیری پایه برای ورود هنرجویان به فرانت‌اند.",
      },
    ],
    socials: {
      github: "https://github.com/nalavi",
      telegram: "https://t.me/nima_web",
    },
    publicVisibility: { email: false, phone: false },
  },
} as const;

const NEXTJS_COMMENT_AUTHORS = [
  { id: "user-1", name: "سهراب امینی", role: "توسعه‌دهنده React", avatar: "/images/student1.jpg" },
  { id: "user-2", name: "سارا رضایی", role: "توسعه‌دهنده فرانت‌اند", avatar: "/images/student2.jpg" },
  { id: "user-3", name: "نیما حسینی", role: "متخصص دیتاساینس", avatar: "/images/student3.jpg" },
  { id: "user-4", name: "نگار کریمی", role: "دانشجو", avatar: "/images/student1.jpg" },
  { id: "user-5", name: "علی مرادی", role: "دانشجو", avatar: "/images/student2.jpg" },
  { id: "user-6", name: "مریم جعفری", role: "توسعه‌دهنده Next.js", avatar: "/images/student3.jpg" },
  { id: "user-7", name: "پارسا نوری", role: "دانشجوی برنامه‌نویسی", avatar: "/images/student1.jpg" },
  { id: "user-8", name: "الهام رستمی", role: "فرانت‌اند دولوپر", avatar: "/images/student2.jpg" },
  { id: "user-9", name: "کاوه احمدی", role: "دانشجو", avatar: "/images/student3.jpg" },
  { id: "user-10", name: "نیلوفر صادقی", role: "جونیور دولوپر", avatar: "/images/student1.jpg" },
  { id: "user-11", name: "رضا موسوی", role: "توسعه‌دهنده وب", avatar: "/images/student2.jpg" },
  { id: "user-12", name: "حانیه کاظمی", role: "دانشجو", avatar: "/images/student3.jpg" },
  { id: "user-13", name: "امیرحسین طاهری", role: "React Developer", avatar: "/images/student1.jpg" },
  { id: "user-14", name: "سپیده باقری", role: "دانشجوی دوره", avatar: "/images/student2.jpg" },
  { id: "user-15", name: "مهدی شریفی", role: "برنامه‌نویس فرانت", avatar: "/images/student3.jpg" },
] as const;

const NEXTJS_COMMENT_TEXTS = [
  "پروژه‌های عملی این دوره باعث شد ترس من از کدنویسی بریزه. محتوا بسیار کاربردی و به‌روز است.",
  "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در این دوره بود. منتورها واقعاً دلسوزانه کمک می‌کنند.",
  "محتوای آموزشی بسیار به‌روز و با کیفیت است. پشتیبانی سریع هم یک مزیت بزرگ است.",
  "بخش App Router و Server Components را دقیق و قابل‌فهم توضیح دادند. عالی بود.",
  "برای کسی که React بلد است و می‌خواهد Next.js یاد بگیرد، این دوره کامل و کاربردی است.",
  "تمرین‌ها مرحله‌به‌مرحله طراحی شده و حس پروژه واقعی می‌دهد.",
  "از نظر کیفیت ویدیو و تدوین هم سطح دوره‌های خارجی است.",
  "بعد از این دوره توانستم رزومه‌ام را برای موقعیت Next.js قوی‌تر کنم.",
  "مبحث احراز هویت و deployment خیلی به‌دردم خورد.",
  "گاهی سرعت توضیح در بخش‌های پیشرفته کمی بالا بود، ولی جزوه‌ها کمک کرد.",
  "ساختار دوره منطقی است و از مفاهیم پایه تا پروژه نهایی پیش می‌رود.",
  "پاسخ‌گویی تیم پشتیبانی در Q&A واقعاً سریع و دقیق بود.",
  "پروژه نهایی دوره برای پورتفولیو عالی است.",
  "اگر وقت محدود دارید، حتماً جلسات رایگان را ببینید؛ کیفیت کل دوره را نشان می‌دهد.",
  "به‌عنوان کسی که از جاوااسکریپت آمده بودم، انتقال به Next.js در این دوره خیلی روان بود.",
] as const;

const NEXTJS_COMMENT_RATINGS = [5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5] as const;

function buildNextjsComments() {
  const baseDate = new Date("2026-06-01T10:00:00.000Z");

  return NEXTJS_COMMENT_TEXTS.map((content, index) => {
    const author = NEXTJS_COMMENT_AUTHORS[index];
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() - index * 3);

    return {
      id: `comment-nextjs-${index + 1}`,
      courseId: "nextjs",
      content,
      rating: NEXTJS_COMMENT_RATINGS[index],
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      authorAvatar: author.avatar,
      createdAt,
    };
  });
}

export const COMMENT_SEED = [
  ...buildNextjsComments(),
  {
    id: "comment-nextjs-2-reply",
    courseId: "nextjs",
    parentId: "comment-nextjs-2",
    content: "خوشحالیم که تجربه خوبی داشتید. موفق باشید!",
    authorName: "امیررضا رضایی",
    authorRole: "مدرس",
    authorAvatar: "/images/inst1.jpg",
    isInstructorReply: true,
    createdAt: new Date("2026-05-28T09:00:00.000Z"),
  },
  {
    id: "comment-nextjs-10-reply",
    courseId: "nextjs",
    parentId: "comment-nextjs-10",
    content: "ممنون از بازخورد دقیق شما. در آپدیت بعدی سرعت بخش‌های پیشرفته را متعادل‌تر می‌کنیم.",
    authorName: "امیررضا رضایی",
    authorRole: "مدرس",
    authorAvatar: "/images/inst1.jpg",
    isInstructorReply: true,
    createdAt: new Date("2026-05-15T11:00:00.000Z"),
  },
  {
    id: "comment-react-1",
    courseId: "react",
    content: "هوک‌ها و state management خیلی خوب توضیح داده شد.",
    rating: 5,
    authorId: "user-4",
    authorName: "نگار کریمی",
    authorRole: "دانشجو",
    authorAvatar: "/images/student1.jpg",
    createdAt: new Date("2026-05-16T11:30:00.000Z"),
  },
  {
    id: "comment-js-1",
    courseId: "javascript",
    content: "از صفر تا Fetch API عالی پیش رفت. برای شروع عالیه.",
    rating: 5,
    authorId: "user-5",
    authorName: "علی مرادی",
    authorRole: "دانشجو",
    authorAvatar: "/images/student2.jpg",
    createdAt: new Date("2026-05-18T10:10:00.000Z"),
  },
] as const;
