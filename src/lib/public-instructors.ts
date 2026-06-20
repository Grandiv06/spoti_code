export type PublicInstructorCourse = {
  id: string;
  title: string;
  image: string;
  level: "مقدماتی" | "متوسط" | "پیشرفته";
  duration: string;
  studentsCount: number;
  rating: number;
  price: number;
  discountPrice?: number;
  instructorSlug: string;
};

export type PublicInstructorExperience = {
  type: "work" | "teaching";
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type PublicInstructorCertificate = {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
};

export type PublicInstructorProject = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
};

export type PublicInstructorReview = {
  studentName: string;
  rating: number;
  reviewText: string;
  relatedCourse: string;
  date: string;
};

export type PublicInstructor = {
  id: string;
  slug: string;
  fullName: string;
  displayTitle: string;
  mainExpertise: string;
  shortBio: string;
  fullBiography?: string;
  teachingStyle?: string;
  professionalBackground?: string;
  verified: boolean;
  avatar: string;
  coverImage?: string;
  yearsOfExperience: number;
  skills: string[];
  experiences?: PublicInstructorExperience[];
  certificates?: PublicInstructorCertificate[];
  projects?: PublicInstructorProject[];
  reviews?: PublicInstructorReview[];
  socials?: {
    github?: string;
    linkedin?: string;
    telegram?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  publicVisibility?: {
    email?: boolean;
    phone?: boolean;
  };
};

export const PUBLIC_INSTRUCTOR_COURSES: PublicInstructorCourse[] = [
  {
    id: "html",
    title: "آشنایی با HTML",
    image: "/images/html-green.png",
    level: "مقدماتی",
    duration: "۱۲ ساعت",
    studentsCount: 1850,
    rating: 4.7,
    price: 980000,
    discountPrice: 790000,
    instructorSlug: "nima-alavi",
  },
  {
    id: "css",
    title: "استایل‌دهی با CSS",
    image: "/images/css-green.png",
    level: "مقدماتی",
    duration: "۱۸ ساعت",
    studentsCount: 2120,
    rating: 4.8,
    price: 1450000,
    discountPrice: 1190000,
    instructorSlug: "sara-mohammadi",
  },
  {
    id: "responsive-design",
    title: "طراحی واکنش‌گرا حرفه‌ای",
    image: "/images/css-cover.png",
    level: "مقدماتی",
    duration: "۲۲ ساعت",
    studentsCount: 1740,
    rating: 4.8,
    price: 1680000,
    discountPrice: 1340000,
    instructorSlug: "sara-mohammadi",
  },
  {
    id: "flexbox-grid",
    title: "Flexbox و Grid در عمل",
    image: "/images/css-green.png",
    level: "مقدماتی",
    duration: "۱۶ ساعت",
    studentsCount: 1960,
    rating: 4.7,
    price: 1320000,
    discountPrice: 1090000,
    instructorSlug: "sara-mohammadi",
  },
  {
    id: "css-architecture",
    title: "CSS Architecture و سیستم‌های طراحی",
    image: "/images/course4.jpg",
    level: "متوسط",
    duration: "۲۴ ساعت",
    studentsCount: 1210,
    rating: 4.9,
    price: 2190000,
    discountPrice: 1790000,
    instructorSlug: "sara-mohammadi",
  },
  {
    id: "ui-ux-styling",
    title: "UI Styling برای محصولات واقعی",
    image: "/images/course5.jpg",
    level: "متوسط",
    duration: "۲۰ ساعت",
    studentsCount: 1380,
    rating: 4.8,
    price: 1890000,
    discountPrice: 1490000,
    instructorSlug: "sara-mohammadi",
  },
  {
    id: "javascript",
    title: "جادوی جاوااسکریپت",
    image: "/images/js-green.png",
    level: "متوسط",
    duration: "۳۲ ساعت",
    studentsCount: 1650,
    rating: 4.9,
    price: 2200000,
    discountPrice: 1790000,
    instructorSlug: "amirreza-rezaei",
  },
  {
    id: "react",
    title: "فریمورک React",
    image: "/images/react-green.png",
    level: "متوسط",
    duration: "۴۰ ساعت",
    studentsCount: 1240,
    rating: 4.9,
    price: 3500000,
    discountPrice: 2890000,
    instructorSlug: "mehrdad-heidari",
  },
  {
    id: "nextjs",
    title: "متخصص React و Next.js",
    image: "/images/course3.jpg",
    level: "پیشرفته",
    duration: "۶۵ ساعت",
    studentsCount: 1340,
    rating: 4.9,
    price: 4500000,
    discountPrice: 3200000,
    instructorSlug: "amirreza-rezaei",
  },
  {
    id: "amiriar-developing",
    title: "دوره ی برنامه نویسی با امیریار",
    image: "/images/course3.jpg",
    level: "مقدماتی",
    duration: "۱۵۰ ساعت",
    studentsCount: 2,
    rating: 4.5,
    price: 69696969,
    discountPrice: 69696969,
    instructorSlug: "amir-bozorg",
  },
  {
    id: "typescript",
    title: "تایپ‌اسکریپت پیشرفته",
    image: "/images/course2.jpg",
    level: "پیشرفته",
    duration: "۲۵ ساعت",
    studentsCount: 980,
    rating: 4.6,
    price: 1900000,
    discountPrice: 1550000,
    instructorSlug: "amirreza-rezaei",
  },
];

export const PUBLIC_INSTRUCTORS: PublicInstructor[] = [
  {
    id: "INS-101",
    slug: "amirreza-rezaei",
    fullName: "امیررضا رضایی",
    displayTitle: "مدرس ارشد فرانت‌اند و معماری وب",
    mainExpertise: "React.js، Next.js، TypeScript و طراحی معماری مقیاس‌پذیر",
    shortBio: "بیش از ۹ سال تجربه در ساخت محصولات SaaS، لید فنی تیم‌های فرانت‌اند و منتورینگ توسعه‌دهندگان در مسیر ورود به بازار کار.",
    fullBiography:
      "امیررضا رضایی در سال‌های اخیر روی طراحی و توسعه پنل‌های پیچیده، فروشگاه‌های آنلاین و ابزارهای داخلی برای تیم‌های محصول کار کرده است. تمرکز اصلی او روی ساخت تجربه‌های سریع، مقیاس‌پذیر و قابل نگهداری با React و Next.js است و در کنار توسعه محصول، سال‌ها سابقه منتورینگ و آموزش پروژه‌محور دارد.",
    teachingStyle:
      "سبک تدریس او عمیق، پروژه‌محور و نزدیک به شرایط واقعی شرکت‌هاست؛ هر مبحث با سناریوی واقعی، تمرین لایه‌لایه و بازخورد مهندسی جمع‌بندی می‌شود.",
    professionalBackground:
      "او سابقه همکاری با تیم‌های محصول در حوزه‌های فین‌تک، آموزش آنلاین و SaaS را دارد و روی طراحی معماری فرانت، performance، SSR و DX تیمی تمرکز می‌کند.",
    verified: true,
    avatar: "/images/inst1.jpg",
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
        type: "work",
        title: "Senior Frontend Engineer",
        organization: "استارتاپ SaaS سازمانی",
        startDate: "۱۳۹۸",
        endDate: "۱۴۰۱",
        description: "پیاده‌سازی معماری فرانت‌اند، SSR، احراز هویت و داشبوردهای داده‌محور برای مشتریان B2B.",
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
      {
        title: "Advanced React Architecture",
        issuer: "Frontend Masters",
        date: "۲۰۲۴",
        link: "https://frontendmasters.com",
      },
      {
        title: "Performance for Web Apps",
        issuer: "Google",
        date: "۲۰۲۳",
      },
    ],
    projects: [
      {
        title: "داشبورد تحلیل عملکرد فروش",
        description: "طراحی و پیاده‌سازی داشبورد مدیریتی با فیلترهای زنده، نمودارهای تحلیلی و معماری component-driven.",
        technologies: ["Next.js", "TypeScript", "Recharts", "Tailwind"],
        githubUrl: "https://github.com/arezaei/sales-dashboard",
        liveUrl: "https://demo.spoticode.ir/sales-dashboard",
        image: "/images/course3.jpg",
      },
      {
        title: "پلتفرم آموزش آنلاین سازمانی",
        description: "ساخت تجربه یادگیری چندمرحله‌ای، پنل مدرس و سیستم مدیریت ویدیو برای سازمان‌ها و تیم‌های داخلی.",
        technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
        liveUrl: "https://demo.spoticode.ir/lms-suite",
        image: "/images/react-cover.png",
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
      {
        studentName: "نرگس صفری",
        rating: 5,
        reviewText: "از بین دوره‌هایی که دیده بودم، این اولین دوره‌ای بود که واقعاً معماری و تصمیم‌گیری مهندسی را آموزش می‌داد.",
        relatedCourse: "جادوی جاوااسکریپت",
        date: "فروردین ۱۴۰۵",
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
    publicVisibility: {
      email: true,
      phone: false,
    },
  },
  {
    id: "INS-102",
    slug: "mehrdad-heidari",
    fullName: "مهرداد حیدری",
    displayTitle: "مدرس React و توسعه رابط کاربری",
    mainExpertise: "React، State Management، Design Systems",
    shortBio: "تمرکز مهرداد روی تبدیل مفاهیم پیچیده رابط کاربری به پروژه‌های قابل فهم و آماده بازار کار است.",
    fullBiography:
      "مهرداد حیدری سال‌ها روی توسعه رابط‌های کاربری برای محصولات B2B و B2C کار کرده و در آموزش React، الگوهای state management و ساخت design system تخصص دارد.",
    teachingStyle:
      "رویکرد او بر یادگیری مرحله‌ای، ساخت پروژه‌های قابل ارائه و توضیح چرایی تصمیم‌های فنی استوار است.",
    professionalBackground:
      "او سابقه کار روی پنل‌های تحلیلی، اپلیکیشن‌های مدیریت مشتری و سامانه‌های آموزشی را در نقش frontend engineer و tech lead دارد.",
    verified: true,
    avatar: "/images/inst4.jpg",
    yearsOfExperience: 7,
    skills: ["React.js", "SWR", "Design Systems", "Accessibility", "Tailwind CSS", "Testing"],
    experiences: [
      {
        type: "work",
        title: "Senior Frontend Engineer",
        organization: "پلتفرم مدیریت مشتری",
        startDate: "۱۴۰۰",
        endDate: "اکنون",
        description: "توسعه رابط‌های داده‌محور، کامپوننت‌های reusable و الگوهای دسترس‌پذیری برای محصول سازمانی.",
      },
      {
        type: "teaching",
        title: "مدرس React",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۲",
        endDate: "اکنون",
        description: "آموزش React، ساخت design system و مدیریت state در دوره‌های میان‌رده و پیشرفته.",
      },
    ],
    projects: [
      {
        title: "کتابخانه Design System داخلی",
        description: "مجموعه‌ای از کامپوننت‌های استاندارد برای محصولات سازمانی با تمرکز روی سرعت توسعه و سازگاری ظاهری.",
        technologies: ["React", "Storybook", "TypeScript"],
        githubUrl: "https://github.com/mheidari/design-system",
      },
    ],
    socials: {
      github: "https://github.com/mheidari",
      linkedin: "https://linkedin.com/in/mheidari",
      telegram: "https://t.me/mheidari_ui",
    },
    publicVisibility: {
      email: false,
      phone: false,
    },
  },
  {
    id: "INS-103",
    slug: "sara-mohammadi",
    fullName: "سارا محمدی",
    displayTitle: "مدرس UI Styling و CSS Architecture",
    mainExpertise: "CSS، طراحی واکنش‌گرا، Flexbox، Grid و سیستم‌های طراحی",
    shortBio: "سارا روی آموزش استایل‌دهی مدرن، طراحی واکنش‌گرا و ساخت تجربه‌های تمیز و مقیاس‌پذیر برای وب تمرکز دارد.",
    fullBiography:
      "سارا محمدی با سابقه طراحی و پیاده‌سازی رابط‌های کاربری برای فروشگاه‌های آنلاین و محصولات محتوایی، مباحث CSS و طراحی واکنش‌گرا را به‌شکل عملی و پروژه‌ای آموزش می‌دهد.",
    verified: true,
    avatar: "/images/inst2.jpg",
    yearsOfExperience: 6,
    skills: ["CSS", "Responsive Design", "Flexbox", "Grid", "UI/UX", "Figma"],
    experiences: [
      {
        type: "work",
        title: "UI Engineer",
        organization: "استودیو طراحی محصول",
        startDate: "۱۳۹۹",
        endDate: "اکنون",
        description: "توسعه رابط‌های بصری و responsive برای محصولات وب و صفحات فرود با تمرکز روی consistency.",
      },
      {
        type: "teaching",
        title: "مدرس CSS Architecture",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۲",
        endDate: "اکنون",
        description: "آموزش معماری CSS، component styling و پیاده‌سازی design tokens در پروژه‌های واقعی.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/saramohammadi",
      website: "https://saramohammadi.design",
    },
    publicVisibility: {
      email: false,
      phone: false,
    },
  },
  {
    id: "INS-104",
    slug: "nima-alavi",
    fullName: "نیما علوی",
    displayTitle: "مدرس مبانی توسعه وب",
    mainExpertise: "HTML، ساختار وب، فرم‌ها و استانداردهای دسترس‌پذیری",
    shortBio: "نیما روی آموزش اصول پایه توسعه وب برای کسانی تمرکز دارد که می‌خواهند مسیر برنامه‌نویسی را درست و اصولی شروع کنند.",
    fullBiography:
      "نیما علوی سال‌ها در تیم‌های محتوا و آموزش فنی فعالیت کرده و تجربه او در انتقال مفاهیم پایه، شروع مسیر یادگیری را برای هنرجویان ساده و حرفه‌ای می‌کند.",
    verified: true,
    avatar: "/images/inst3.jpg",
    yearsOfExperience: 5,
    skills: ["HTML", "Semantic Markup", "Accessibility", "Forms", "SEO Basics"],
    experiences: [
      {
        type: "teaching",
        title: "مدرس مبانی وب",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۱",
        endDate: "اکنون",
        description: "طراحی مسیر یادگیری پایه برای ورود هنرجویان به فرانت‌اند با تمرکز بر اصول درست از روز اول.",
      },
    ],
    socials: {
      github: "https://github.com/nalavi",
      telegram: "https://t.me/nima_web",
    },
    publicVisibility: {
      email: false,
      phone: false,
    },
  },
  {
    id: "81bf99e7-3d0c-4457-9764-cd1d964a5eac",
    slug: "amir-bozorg",
    fullName: "استاد امیر بزرگ",
    displayTitle: "مدرس برنامه‌نویسی و توسعه نرم‌افزار",
    mainExpertise: "برنامه‌نویسی، الگوریتم، پروژه‌محور",
    shortBio: "من امیرم، برنامه‌نویسم و سال‌ها تجربه تدریس و منتورینگ در مسیر ورود به بازار کار دارم.",
    fullBiography:
      "استاد امیر بزرگ بیش از یک دهه در آموزش برنامه‌نویسی فعالیت دارد. تمرکز او بر آموزش عملی، حل مسئله و ساخت پروژه‌های واقعی است تا هنرجویان بتوانند با اعتمادبه‌نفس وارد تیم‌های توسعه شوند.",
    teachingStyle:
      "سبک تدریس پروژه‌محور و گام‌به‌گام است؛ هر مفهوم با مثال واقعی و تمرین عملی جمع‌بندی می‌شود.",
    professionalBackground:
      "سابقه همکاری با تیم‌های استارتاپی و آموزشگاه‌های برنامه‌نویسی در حوزه وب و مبانی نرم‌افزار.",
    verified: true,
    avatar: "/images/inst1.jpg",
    coverImage: "/images/hero_image.jpg",
    yearsOfExperience: 8,
    skills: ["JavaScript", "Python", "Algorithms", "Data Structures", "Git", "Problem Solving"],
    experiences: [
      {
        type: "teaching",
        title: "مدرس برنامه‌نویسی",
        organization: "اسپاتی‌کد",
        startDate: "۱۴۰۰",
        endDate: "اکنون",
        description: "طراحی و تدریس دوره‌های پروژه‌محور برای ورود هنرجویان به بازار کار.",
      },
      {
        type: "work",
        title: "Senior Software Developer",
        organization: "استارتاپ فناوری",
        startDate: "۱۳۹۶",
        endDate: "۱۴۰۰",
        description: "توسعه سامانه‌های وب و منتورینگ تیم‌های جوان.",
      },
    ],
    reviews: [
      {
        studentName: "سارا احمدی",
        rating: 5,
        reviewText: "توضیحات استاد امیر بسیار روان و کاربردی بود. پروژه‌های دوره واقعاً کمک کرد.",
        relatedCourse: "دوره ی برنامه نویسی با امیریار",
        date: "خرداد ۱۴۰۵",
      },
    ],
    socials: {
      telegram: "https://t.me/amir_bozorg_dev",
      github: "https://github.com/amir-bozorg",
    },
    publicVisibility: {
      email: false,
      phone: false,
    },
  },
];

export const MOCK_API_TEACHER_ID = "81bf99e7-3d0c-4457-9764-cd1d964a5eac";

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getPublicInstructorSlugs() {
  return PUBLIC_INSTRUCTORS.map((item) => item.slug);
}

export function getPublicInstructorBySlug(slug: string) {
  return PUBLIC_INSTRUCTORS.find((item) => item.slug === slug);
}

export function getPublicInstructorById(id: string) {
  return PUBLIC_INSTRUCTORS.find((item) => item.id === id);
}

export function findPublicInstructorByName(name: string) {
  const normalized = normalizeName(name);
  return PUBLIC_INSTRUCTORS.find((item) => normalizeName(item.fullName) === normalized);
}

export function getCoursesForInstructor(slug: string) {
  return PUBLIC_INSTRUCTOR_COURSES.filter((course) => course.instructorSlug === slug);
}

export function getInstructorStats(slug: string) {
  const courses = getCoursesForInstructor(slug);
  const studentsCount = courses.reduce((sum, course) => sum + course.studentsCount, 0);
  const averageRating =
    courses.length > 0
      ? Number((courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1))
      : 0;

  return {
    coursesCount: courses.length,
    studentsCount,
    averageRating,
  };
}
