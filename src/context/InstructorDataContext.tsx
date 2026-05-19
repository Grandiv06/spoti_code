"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- TYPES ---
export interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "text" | "exercise" | "quiz";
  duration: string;
  isFree: boolean;
  status: "published" | "draft" | "locked";
  fileName?: string;
  fileSize?: string;
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
  avatar?: string;
  purchaseDate: string;
  progress: number;
  status: "active" | "inactive" | "suspended";
}

export interface CourseReview {
  id: string;
  studentName: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  lessonName?: string;
  reply?: {
    instructorName: string;
    text: string;
    createdAt: string;
  };
}

export interface StudentQuestion {
  id: string;
  studentName: string;
  avatar?: string;
  title: string;
  text: string;
  courseId: string;
  courseTitle: string;
  lessonTitle?: string;
  createdAt: string;
  status: "new" | "answered" | "closed";
  replies: {
    senderName: string;
    role: "instructor" | "student";
    avatar?: string;
    text: string;
    createdAt: string;
  }[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  cover: string;
  introVideo?: string;
  status: "published" | "draft" | "pending" | "inactive";
  category: "Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX";
  level: "elementary" | "intermediate" | "advanced";
  language: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  instructorId: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  revenue: number;
  completionRate: number;
  chapters: Chapter[];
  reviews: CourseReview[];
  questions: StudentQuestion[];
  createdAt: string;
  updatedAt: string;
  introText?: string;
  objectives?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
}

export interface SaleTransaction {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  instructorShare: number;
  date: string;
  status: "success" | "pending" | "failed";
}

export interface PayoutRequest {
  id: string;
  amount: number;
  shaba: string;
  requestDate: string;
  status: "paid" | "pending" | "rejected";
  payDate?: string;
}

export interface InstructorProfile {
  name: string;
  specialty: string;
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  socials: {
    linkedin?: string;
    github?: string;
    telegram?: string;
    website?: string;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface InstructorDataContextType {
  courses: Course[];
  questions: StudentQuestion[];
  transactions: SaleTransaction[];
  payouts: PayoutRequest[];
  profile: InstructorProfile;
  toasts: Toast[];
  isLoading: boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  addCourse: (course: Partial<Course>) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addChapter: (courseId: string, title: string) => void;
  updateChapter: (courseId: string, chapterId: string, updates: Partial<Chapter>) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  addLesson: (courseId: string, chapterId: string, lesson: Partial<Lesson>) => void;
  updateLesson: (courseId: string, chapterId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, chapterId: string, lessonId: string) => void;
  replyToReview: (courseId: string, reviewId: string, text: string) => void;
  replyToQuestion: (questionId: string, text: string) => void;
  closeQuestion: (questionId: string) => void;
  requestPayout: (amount: number, shaba: string) => boolean;
  updateProfile: (profile: InstructorProfile) => void;
}

type CourseStatus = Course["status"];

const normalizeCourseStatus = (status: unknown): CourseStatus => {
  if (status === "approved") return "published";
  if (status === "published" || status === "draft" || status === "pending" || status === "inactive") {
    return status;
  }
  return "draft";
};

const normalizeCourseRecord = (course: Course): Course => ({
  ...course,
  status: normalizeCourseStatus(course.status),
});

// --- INITIAL MOCK DATA ---
const initialProfile: InstructorProfile = {
  name: "اصغر رضایی",
  displayName: "استاد رضایی",
  specialty: "مدرس ارشد فرانت‌اند و فریم‌ورک‌های جاوااسکریپت",
  email: "a.rezaei@spoticode.com",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  bio: "بیش از ۱۰ سال سابقه توسعه نرم‌افزار در شرکت‌های بزرگ داخلی و خارجی، عاشق تدریس جاوااسکریپت، ری‌اکت و لبه‌های تکنولوژی وب.",
  avatar: "",
  socials: {
    linkedin: "linkedin.com/in/arezaei",
    github: "github.com/arezaei",
    telegram: "t.me/arezaei_dev",
    website: "rezaei.dev",
  },
};

const initialCourses: Course[] = [
  {
    id: "CRS-410",
    title: "متخصص React و Next.js",
    slug: "react-nextjs-pro",
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    introVideo: "/videos/intro.mp4",
    status: "published",
    category: "Frontend",
    level: "advanced",
    language: "فارسی",
    shortDescription: "دوره جامع پروژه محور برای تبدیل شدن به متخصص ری‌اکت و ورود به بازار کار با معماری Next.js 15 App Router.",
    description: "توسعه وب مدرن بدون ری‌اکت و نکست‌جی‌اس عملاً ناممکن است. در این دوره یاد خواهید گرفت چگونه اپلیکیشن‌هایی با رندینگ سمت سرور (SSR) بسازید که از لحاظ سئو و عملکرد بی‌رقیب باشند.",
    price: 4500000,
    discountPrice: 3200000,
    instructorId: "INS-001",
    studentsCount: 1840,
    rating: 4.9,
    reviewsCount: 326,
    revenue: 248000000,
    completionRate: 68,
    createdAt: "1404/01/12",
    updatedAt: "1404/02/20",
    introText: "به دنیای توسعه وب پیشرفته خوش آمدید. با این دوره مهارت فرانت‌اند خود را به اوج برسانید.",
    objectives: ["تسلط بر Next.js Server Actions", "طراحی هوشمندانه پرفورمنس وب", "استقرار در سرورهای لینوکسی و Vercel"],
    prerequisites: ["تسلط بر جاوااسکریپت ES6+", "آشنایی متوسط با React.js"],
    targetAudience: ["توسعه‌دهندگان فرانت‌اند که می‌خواهند نکست‌جی‌اس یاد بگیرند", "دانشجویان و علاقه‌مندان به بازار کار دلاری"],
    chapters: [
      {
        id: "CHP-001",
        title: "فصل اول: مقدمات و مهاجرت به App Router",
        duration: "۲ ساعت و ۴۵ دقیقه",
        lessons: [
          {
            id: "LES-001",
            title: "معرفی Next.js 15 و سرفصل‌ها",
            type: "video",
            duration: "18:30",
            isFree: true,
            status: "published",
            fileName: "nextjs-intro.mp4",
            fileSize: "240MB",
          },
          {
            id: "LES-002",
            title: "فولدر استراکچر جدید و سیستم Routing",
            type: "video",
            duration: "24:15",
            isFree: false,
            status: "published",
            fileName: "folder-structure.mp4",
            fileSize: "320MB",
          },
          {
            id: "LES-003",
            title: "تمرین ساخت اولین صفحه با Layout اختصاصی",
            type: "exercise",
            duration: "15:00",
            isFree: false,
            status: "published",
          },
        ],
      },
      {
        id: "CHP-002",
        title: "فصل دوم: کار با داده‌ها و Server Actions",
        duration: "۳ ساعت و ۲۰ دقیقه",
        lessons: [
          {
            id: "LES-004",
            title: "مفهوم Server Actions در ری‌اکت ۱۹",
            type: "video",
            duration: "35:10",
            isFree: false,
            status: "published",
            fileName: "server-actions.mp4",
            fileSize: "410MB",
          },
          {
            id: "LES-005",
            title: "هندل کردن فرم‌ها با useActionState",
            type: "video",
            duration: "28:40",
            isFree: false,
            status: "published",
            fileName: "forms-useactionstate.mp4",
            fileSize: "350MB",
          },
          {
            id: "LES-006",
            title: "کتابچه راهنمای بهینه‌سازی فرم‌های ری‌اکت",
            type: "pdf",
            duration: "10:00",
            isFree: true,
            status: "published",
            fileName: "react-forms-guide.pdf",
            fileSize: "14MB",
          },
        ],
      },
    ],
    reviews: [
      {
        id: "REV-001",
        studentName: "مهدی امینی",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
        rating: 5,
        comment: "دوره بسیار کاربردی و کامل بود. بخش Server Actions عالی تدریس شده.",
        createdAt: "1404/02/10",
        lessonName: "مفهوم Server Actions در ری‌اکت ۱۹",
      },
      {
        id: "REV-002",
        studentName: "زهرا حسینی",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        rating: 4,
        comment: "مطالب خیلی به‌روز هستند ولی کمی سرعت تدریس بالاست. در کل واقعاً ارزش خرید داشت.",
        createdAt: "1404/02/18",
        lessonName: "هندل کردن فرم‌ها با useActionState",
      },
    ],
    questions: [],
  },
  {
    id: "CRS-398",
    title: "Docker & CI/CD برای برنامه‌نویسان",
    slug: "docker-cicd-pro",
    cover: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
    status: "draft",
    category: "DevOps",
    level: "intermediate",
    language: "فارسی",
    shortDescription: "آموزش داکر، کانتینرها و ایجاد پایپ‌لاین‌های اتوماتیک گیت‌هاب اکشنز برای دیپلوی پروژه‌ها.",
    description: "بسته‌بندی برنامه‌ها در کانتینرها و اتوماتیک کردن فرآیند ساخت و انتشار جزو مهارت‌های ضروری هر برنامه‌نویس ارشد است.",
    price: 1850000,
    discountPrice: 1500000,
    instructorId: "INS-001",
    studentsCount: 0,
    rating: 0,
    reviewsCount: 0,
    revenue: 0,
    completionRate: 0,
    createdAt: "1404/02/01",
    updatedAt: "1404/02/14",
    chapters: [],
    reviews: [],
    questions: [],
  },
  {
    id: "CRS-407",
    title: "TypeScript پیشرفته و معماری نرم‌افزار",
    slug: "advanced-typescript-architecture",
    cover: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
    status: "pending",
    category: "Frontend",
    level: "advanced",
    language: "فارسی",
    shortDescription: "آموزش تایپ‌های شرطی پیشرفته، ژنریک‌ها، دکوراتورها و طراحی معماری تمیز با TypeScript.",
    description: "در این دوره مباحث عمیق تایپ‌اسکریپت را یاد می‌گیرید تا بتوانید کدهای بسیار منعطف، بازطراحی‌پذیر و عاری از باگ بنویسید.",
    price: 1980000,
    instructorId: "INS-001",
    studentsCount: 0,
    rating: 0,
    reviewsCount: 0,
    revenue: 0,
    completionRate: 0,
    createdAt: "1404/01/20",
    updatedAt: "1404/02/19",
    chapters: [],
    reviews: [],
    questions: [],
  },
];

const initialQuestions: StudentQuestion[] = [
  {
    id: "QST-001",
    studentName: "علیرضا رضایی",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    title: "خطای Hydration در استفاده از useState و localStorage",
    text: "سلام استاد وقت بخیر. من در پروژه‌ام مقدار اولیه useState را از localStorage می‌خوانم ولی با خطای Hydration Mismatch مواجه می‌شوم. چطور می‌توانم این مشکل را حل کنم؟",
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

const initialTransactions: SaleTransaction[] = [
  {
    id: "TRX-98231",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    studentName: "مهدی امینی",
    amount: 3200000,
    instructorShare: 2240000,
    date: "1404/02/18",
    status: "success",
  },
  {
    id: "TRX-98220",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    studentName: "مریم حسینی",
    amount: 3200000,
    instructorShare: 2240000,
    date: "1404/02/16",
    status: "success",
  },
  {
    id: "TRX-98104",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    studentName: "سعید کرمی",
    amount: 4500000,
    instructorShare: 3150000,
    date: "1404/02/10",
    status: "success",
  },
  {
    id: "TRX-97880",
    courseId: "CRS-410",
    courseTitle: "متخصص React و Next.js",
    studentName: "پوریا صفوی",
    amount: 3200000,
    instructorShare: 2240000,
    date: "1404/02/05",
    status: "success",
  },
];

const initialPayouts: PayoutRequest[] = [
  {
    id: "PAY-1002",
    amount: 15400000,
    shaba: "IR120120000000012345678901",
    requestDate: "1404/02/10",
    status: "paid",
    payDate: "1404/02/11",
  },
  {
    id: "PAY-1003",
    amount: 9800000,
    shaba: "IR120120000000012345678901",
    requestDate: "1404/02/17",
    status: "pending",
  },
];

// --- PROVIDER IMPLEMENTATION ---
const InstructorDataContext = createContext<InstructorDataContextType | undefined>(undefined);

export function InstructorDataProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [profile, setProfile] = useState<InstructorProfile>(initialProfile);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage sync on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCourses = localStorage.getItem("spoticode_inst_courses");
      const storedQuestions = localStorage.getItem("spoticode_inst_questions");
      const storedTransactions = localStorage.getItem("spoticode_inst_transactions");
      const storedPayouts = localStorage.getItem("spoticode_inst_payouts");
      const storedProfile = localStorage.getItem("spoticode_inst_profile");

      if (storedCourses) {
        const parsed = JSON.parse(storedCourses) as Course[];
        const normalized = parsed.map(normalizeCourseRecord);
        setCourses(normalized);
        localStorage.setItem("spoticode_inst_courses", JSON.stringify(normalized));
      }
      else {
        setCourses(initialCourses);
        localStorage.setItem("spoticode_inst_courses", JSON.stringify(initialCourses));
      }

      if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
      else {
        setQuestions(initialQuestions);
        localStorage.setItem("spoticode_inst_questions", JSON.stringify(initialQuestions));
      }

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      else {
        setTransactions(initialTransactions);
        localStorage.setItem("spoticode_inst_transactions", JSON.stringify(initialTransactions));
      }

      if (storedPayouts) setPayouts(JSON.parse(storedPayouts));
      else {
        setPayouts(initialPayouts);
        localStorage.setItem("spoticode_inst_payouts", JSON.stringify(initialPayouts));
      }

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      else {
        setProfile(initialProfile);
        localStorage.setItem("spoticode_inst_profile", JSON.stringify(initialProfile));
      }

      setIsLoading(false);
    }
  }, []);

  // Sync helpers
  const syncCourses = (data: Course[]) => {
    setCourses(data);
    localStorage.setItem("spoticode_inst_courses", JSON.stringify(data));
  };

  const syncQuestions = (data: StudentQuestion[]) => {
    setQuestions(data);
    localStorage.setItem("spoticode_inst_questions", JSON.stringify(data));
  };

  const syncTransactions = (data: SaleTransaction[]) => {
    setTransactions(data);
    localStorage.setItem("spoticode_inst_transactions", JSON.stringify(data));
  };

  const syncPayouts = (data: PayoutRequest[]) => {
    setPayouts(data);
    localStorage.setItem("spoticode_inst_payouts", JSON.stringify(data));
  };

  const syncProfile = (data: InstructorProfile) => {
    setProfile(data);
    localStorage.setItem("spoticode_inst_profile", JSON.stringify(data));
  };

  // Toast notifier
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Course handlers
  const addCourse = (newCourse: Partial<Course>) => {
    const nextId = `CRS-${Math.floor(100 + Math.random() * 900)}`;
    const prepared: Course = {
      id: nextId,
      title: newCourse.title || "دوره جدید بدون نام",
      slug: newCourse.slug || "new-course",
      cover: newCourse.cover || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
      introVideo: newCourse.introVideo,
      status: normalizeCourseStatus(newCourse.status),
      category: newCourse.category || "Frontend",
      level: newCourse.level || "intermediate",
      language: newCourse.language || "فارسی",
      shortDescription: newCourse.shortDescription || "",
      description: newCourse.description || "",
      price: newCourse.price || 0,
      discountPrice: newCourse.discountPrice,
      instructorId: "INS-001",
      studentsCount: 0,
      rating: 0,
      reviewsCount: 0,
      revenue: 0,
      completionRate: 0,
      chapters: [],
      reviews: [],
      questions: [],
      createdAt: "1404/02/20",
      updatedAt: "1404/02/20",
      introText: newCourse.introText,
      objectives: newCourse.objectives || [],
      prerequisites: newCourse.prerequisites || [],
      targetAudience: newCourse.targetAudience || [],
    };
    const updated = [prepared, ...courses];
    syncCourses(updated);
    showToast(`دوره «${prepared.title}» با موفقیت ایجاد شد.`, "success");
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          ...updates,
          status: normalizeCourseStatus(updates.status ?? c.status),
          updatedAt: "1404/02/20",
        };
      }
      return c;
    });
    syncCourses(updated);
    showToast("اطلاعات دوره با موفقیت ویرایش شد.", "success");
  };

  const deleteCourse = (courseId: string) => {
    const deleted = courses.filter((c) => c.id !== courseId);
    syncCourses(deleted);
    showToast("دوره با موفقیت حذف شد.", "info");
  };

  // Chapter handlers
  const addChapter = (courseId: string, title: string) => {
    const nextChapterId = `CHP-${Math.floor(100 + Math.random() * 900)}`;
    const newChapter: Chapter = {
      id: nextChapterId,
      title,
      duration: "۰ دقیقه",
      lessons: [],
    };

    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          chapters: [...c.chapters, newChapter],
          updatedAt: "1404/02/20",
        };
      }
      return c;
    });
    syncCourses(updated);
    showToast(`فصل «${title}» با موفقیت اضافه شد.`, "success");
  };

  const updateChapter = (courseId: string, chapterId: string, updates: Partial<Chapter>) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const newChapters = c.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return { ...ch, ...updates };
          }
          return ch;
        });
        return { ...c, chapters: newChapters, updatedAt: "1404/02/20" };
      }
      return c;
    });
    syncCourses(updated);
    showToast("فصل با موفقیت ویرایش شد.", "success");
  };

  const deleteChapter = (courseId: string, chapterId: string) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          chapters: c.chapters.filter((ch) => ch.id !== chapterId),
          updatedAt: "1404/02/20",
        };
      }
      return c;
    });
    syncCourses(updated);
    showToast("فصل با موفقیت حذف شد.", "info");
  };

  // Lesson handlers
  const addLesson = (courseId: string, chapterId: string, newLesson: Partial<Lesson>) => {
    const nextId = `LES-${Math.floor(100 + Math.random() * 900)}`;
    const prepared: Lesson = {
      id: nextId,
      title: newLesson.title || "درس بدون نام",
      type: newLesson.type || "video",
      duration: newLesson.duration || "10:00",
      isFree: !!newLesson.isFree,
      status: newLesson.status || "published",
      fileName: newLesson.fileName,
      fileSize: newLesson.fileSize,
    };

    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const newChapters = c.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              lessons: [...ch.lessons, prepared],
            };
          }
          return ch;
        });
        return { ...c, chapters: newChapters, updatedAt: "1404/02/20" };
      }
      return c;
    });
    syncCourses(updated);
    showToast(`درس «${prepared.title}» با موفقیت اضافه شد.`, "success");
  };

  const updateLesson = (courseId: string, chapterId: string, lessonId: string, updates: Partial<Lesson>) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const newChapters = c.chapters.map((ch) => {
          if (ch.id === chapterId) {
            const newLessons = ch.lessons.map((les) => {
              if (les.id === lessonId) {
                return { ...les, ...updates };
              }
              return les;
            });
            return { ...ch, lessons: newLessons };
          }
          return ch;
        });
        return { ...c, chapters: newChapters, updatedAt: "1404/02/20" };
      }
      return c;
    });
    syncCourses(updated);
    showToast("درس با موفقیت ویرایش شد.", "success");
  };

  const deleteLesson = (courseId: string, chapterId: string, lessonId: string) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const newChapters = c.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              lessons: ch.lessons.filter((l) => l.id !== lessonId),
            };
          }
          return ch;
        });
        return { ...c, chapters: newChapters, updatedAt: "1404/02/20" };
      }
      return c;
    });
    syncCourses(updated);
    showToast("درس با موفقیت حذف شد.", "info");
  };

  // Reviews reply
  const replyToReview = (courseId: string, reviewId: string, text: string) => {
    const updatedCourses = courses.map((c) => {
      if (c.id === courseId) {
        const updatedReviews = c.reviews.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              reply: {
                instructorName: profile.name,
                text,
                createdAt: "1404/02/20",
              },
            };
          }
          return r;
        });
        return { ...c, reviews: updatedReviews };
      }
      return c;
    });
    syncCourses(updatedCourses);
    showToast("پاسخ شما با موفقیت برای دیدگاه دانشجو ثبت شد.", "success");
  };

  // Questions replies
  const replyToQuestion = (questionId: string, text: string) => {
    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          status: "answered" as const,
          replies: [
            ...q.replies,
            {
              senderName: profile.name,
              role: "instructor" as const,
              text,
              createdAt: "1404/02/20",
            },
          ],
        };
      }
      return q;
    });
    syncQuestions(updated);
    showToast("پاسخ شما به سوال دانشجو با موفقیت ثبت شد.", "success");
  };

  const closeQuestion = (questionId: string) => {
    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, status: "closed" as const };
      }
      return q;
    });
    syncQuestions(updated);
    showToast("سوال با موفقیت بسته شد.", "info");
  };

  // Earnings
  const requestPayout = (amount: number, shaba: string): boolean => {
    const nextPayoutId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: PayoutRequest = {
      id: nextPayoutId,
      amount,
      shaba,
      requestDate: "1404/02/20",
      status: "pending",
    };
    const updated = [newRequest, ...payouts];
    syncPayouts(updated);
    showToast("درخواست تسویه حساب شما ثبت شد و در حال بررسی است.", "success");
    return true;
  };

  // Profile update
  const updateProfile = (newProfile: InstructorProfile) => {
    syncProfile(newProfile);
    showToast("پروفایل مدرس با موفقیت بروزرسانی شد.", "success");
  };

  return (
    <InstructorDataContext.Provider
      value={{
        courses,
        questions,
        transactions,
        payouts,
        profile,
        toasts,
        isLoading,
        showToast,
        addCourse,
        updateCourse,
        deleteCourse,
        addChapter,
        updateChapter,
        deleteChapter,
        addLesson,
        updateLesson,
        deleteLesson,
        replyToReview,
        replyToQuestion,
        closeQuestion,
        requestPayout,
        updateProfile,
      }}
    >
      {children}
    </InstructorDataContext.Provider>
  );
}

export function useInstructorData() {
  const context = useContext(InstructorDataContext);
  if (!context) {
    throw new Error("useInstructorData must be used within an InstructorDataProvider");
  }
  return context;
}
