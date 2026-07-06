"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGetNoMock, apiPatchNoMock, apiPutNoMock } from "@/lib/api";
import { buildQaRepliesFromSource, dedupeQaReplies, mergeQaReplies } from "@/lib/course-qa";

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

export interface CourseFeature {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
}

export interface CourseFaq {
  id: string;
  question: string;
  answer: string;
}

export interface CourseSpecialWords {
  highlighted: string[];
  underlined: string[];
  color: string;
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
  description?: string;
  errorText?: string;
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
    caption?: string;
  }[];
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  studentId?: string;
  createdAt: string;
  createdAtIso?: string;
  status: "new" | "answered";
  replies: {
    id?: string;
    senderName: string;
    role: "instructor" | "student";
    avatar?: string;
    text: string;
    createdAt: string;
    createdAtIso?: string;
    attachments?: {
      id: string;
      name: string;
      size: number;
      type: string;
      previewUrl?: string;
      caption?: string;
    }[];
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
  heroTitle?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutHighlights?: string[];
  features?: CourseFeature[];
  faqs?: CourseFaq[];
  specialWords?: CourseSpecialWords;
  tags?: string[];
  badges?: string[];
  benefits?: string[];
  publicDescription?: string;
  visibility?: "public" | "private" | "unlisted";
  needsReviewAfterChanges?: boolean;
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
  headline: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  fullBiography: string;
  teachingStyle: string;
  professionalBackground: string;
  avatar: string;
  coverImage: string;
  yearsOfExperience: string;
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    telegram?: string;
    website?: string;
  };
  publicVisibility: {
    email: boolean;
    phone: boolean;
    socials: boolean;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface InstructorDataContextType {
  courses: Course[];
  profileCourses: Course[];
  questions: StudentQuestion[];
  transactions: SaleTransaction[];
  payouts: PayoutRequest[];
  profile: InstructorProfile;
  toasts: Toast[];
  isLoading: boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  addCourse: (course: Partial<Course>) => string;
  upsertCourseSilent: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addChapter: (courseId: string, title: string) => void;
  updateChapter: (courseId: string, chapterId: string, updates: Partial<Chapter>) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  addLesson: (courseId: string, chapterId: string, lesson: Partial<Lesson>) => void;
  updateLesson: (courseId: string, chapterId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, chapterId: string, lessonId: string) => void;
  replyToReview: (courseId: string, reviewId: string, text: string) => void;
  replyToQuestion: (
    questionId: string,
    text: string,
    attachments?: {
      id: string;
      name: string;
      size: number;
      type: string;
      previewUrl?: string;
      caption?: string;
    }[]
  ) => Promise<void>;
  requestPayout: (amount: number, shaba: string) => boolean;
  updateProfile: (profile: InstructorProfile) => Promise<void>;
}

type CourseStatus = Course["status"];

const normalizeCourseStatus = (status: unknown): CourseStatus => {
  if (status === "approved") return "published";
  if (status === "published" || status === "draft" || status === "pending" || status === "inactive") {
    return status;
  }
  return "draft";
};

const normalizeCourseCategory = (value: unknown): Course["category"] => {
  const raw = normalizeString(value).toLowerCase();
  if (raw === "backend") return "Backend";
  if (raw === "devops") return "DevOps";
  if (raw === "mobile") return "Mobile";
  if (raw === "ui/ux") return "UI/UX";
  return "Frontend";
};

const normalizeCourseLevel = (value: unknown): Course["level"] => {
  if (value === "elementary" || value === "intermediate" || value === "advanced") return value;
  return "intermediate";
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value ?? fallback);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function unwrapApiPayload(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current) || !("data" in current) || current.data == null) break;
    current = current.data;
  }
  return current;
}

function extractApiArray(value: unknown, keys: string[]): unknown[] {
  const payload = unwrapApiPayload(value);
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of keys) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parseStringList(parsed);
    } catch {
      // Fall back to comma-separated parsing.
    }
  }

  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}

function normalizeInstructorProfile(raw: unknown): InstructorProfile | null {
  if (!isRecord(raw)) return null;
  const socials = isRecord(raw.socials) ? raw.socials : {};
  const publicVisibility = isRecord(raw.publicVisibility) ? raw.publicVisibility : {};

  return {
    ...emptyInstructorProfile,
    name: normalizeString(raw.name ?? raw.fullName ?? raw.displayName, emptyInstructorProfile.name),
    displayName: normalizeString(raw.displayName ?? raw.fullName ?? raw.name, emptyInstructorProfile.displayName),
    specialty: normalizeString(raw.specialty ?? raw.headline ?? raw.displayTitle, emptyInstructorProfile.specialty),
    headline: normalizeString(raw.headline ?? raw.specialty ?? raw.displayTitle, emptyInstructorProfile.headline),
    location: normalizeString(raw.location, ""),
    email: normalizeString(raw.email, ""),
    phone: normalizeString(raw.phone, ""),
    bio: normalizeString(raw.bio ?? raw.shortBio, ""),
    fullBiography: normalizeString(raw.fullBiography, ""),
    teachingStyle: normalizeString(raw.teachingStyle, ""),
    professionalBackground: normalizeString(raw.professionalBackground, ""),
    avatar: normalizeString(raw.avatar, emptyInstructorProfile.avatar),
    coverImage: normalizeString(raw.coverImage, ""),
    yearsOfExperience: normalizeString(raw.yearsOfExperience, ""),
    skills: parseStringList(raw.skills),
    socials: {
      linkedin: normalizeString(socials.linkedin, ""),
      github: normalizeString(socials.github, ""),
      telegram: normalizeString(socials.telegram, ""),
      website: normalizeString(socials.website, ""),
    },
    publicVisibility: {
      email: publicVisibility.email === true,
      phone: publicVisibility.phone === true,
      socials: publicVisibility.socials !== false,
    },
  };
}

function normalizeApiCourseRecord(raw: unknown, index: number): Course {
  const row = isRecord(raw) ? raw : {};
  const id = normalizeString(row.id ?? row.courseId, `course-${index + 1}`);
  const title = normalizeString(row.title ?? row.name, "دوره بدون عنوان");

  return normalizeCourseRecord({
    id,
    title,
    slug: normalizeString(row.slug, id),
    cover: normalizeString(row.cover ?? row.thumbnail, "/images/course3.jpg"),
    introVideo: normalizeString(row.introVideo) || undefined,
    status: normalizeCourseStatus(row.status),
    category: normalizeCourseCategory(row.category),
    level: normalizeCourseLevel(row.level),
    language: normalizeString(row.language, "فارسی"),
    shortDescription: normalizeString(row.shortDescription, ""),
    description: normalizeString(row.description, ""),
    price: normalizeNumber(row.price),
    discountPrice: row.discountPrice === undefined ? undefined : normalizeNumber(row.discountPrice),
    instructorId: normalizeString(row.instructorId, ""),
    studentsCount: normalizeNumber(row.studentsCount ?? row.students),
    rating: normalizeNumber(row.rating),
    reviewsCount: normalizeNumber(row.reviewsCount),
    revenue: normalizeNumber(row.revenue),
    completionRate: normalizeNumber(row.completionRate),
    chapters: Array.isArray(row.chapters) ? (row.chapters as Chapter[]) : [],
    reviews: Array.isArray(row.reviews) ? (row.reviews as CourseReview[]) : [],
    questions: Array.isArray(row.questions) ? (row.questions as StudentQuestion[]) : [],
    createdAt: normalizeString(row.createdAt, ""),
    updatedAt: normalizeString(row.updatedAt, ""),
    aboutDescription: normalizeString(row.aboutDescription) || undefined,
    publicDescription: normalizeString(row.publicDescription) || undefined,
    visibility: row.visibility === "private" || row.visibility === "unlisted" ? row.visibility : "public",
  });
}

const normalizeCourseRecord = (course: Course): Course => ({
  ...course,
  status: normalizeCourseStatus(course.status),
  category: normalizeCourseCategory(course.category),
  level: normalizeCourseLevel(course.level),
});

function extractQaArray(value: unknown): unknown[] {
  const candidates = [value];
  for (let i = 0; i < candidates.length; i += 1) {
    const current = candidates[i];
    if (Array.isArray(current)) return current;
    if (!isRecord(current)) continue;

    if (Array.isArray(current.data)) return current.data;
    if (Array.isArray(current.items)) return current.items;
    if (Array.isArray(current.results)) return current.results;
    if (Array.isArray(current.list)) return current.list;
    if (isRecord(current.data)) candidates.push(current.data);
    if (isRecord(current.items)) candidates.push(current.items);
    if (isRecord(current.results)) candidates.push(current.results);
    if (isRecord(current.list)) candidates.push(current.list);
  }
  return [];
}

function formatQaDate(value: unknown): { label: string; iso?: string } {
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      const date = new Date(parsed);
      return { label: date.toLocaleDateString("fa-IR"), iso: date.toISOString() };
    }
    return { label: value.trim() };
  }
  return { label: "" };
}

function dedupeQuestionReplies(replies: StudentQuestion["replies"]): StudentQuestion["replies"] {
  return dedupeQaReplies(replies) as StudentQuestion["replies"];
}

function normalizeQaStatus(value: unknown): StudentQuestion["status"] {
  const raw = normalizeString(value, "").toLowerCase();
  if (["answered", "answer", "replied", "resolved", "done"].includes(raw)) return "answered";
  return "new";
}

function normalizeQaAttachment(value: unknown): { id: string; name: string; size: number; type: string; previewUrl?: string; caption?: string } | null {
  if (!isRecord(value)) return null;
  return {
    id: normalizeString(value.id ?? value.fileId ?? value._id, `att-${Math.random().toString(36).slice(2, 8)}`),
    name: normalizeString(value.name ?? value.fileName ?? value.title, "فایل"),
    size: typeof value.size === "number" ? value.size : Number(value.size ?? 0),
    type: normalizeString(value.type ?? value.mimeType, "application/octet-stream"),
    previewUrl: typeof value.previewUrl === "string" ? value.previewUrl : typeof value.url === "string" ? value.url : undefined,
    caption: typeof value.caption === "string" ? value.caption : undefined,
  };
}

function mergeStudentQuestion(existing: StudentQuestion, incoming: StudentQuestion): StudentQuestion {
  const mergedReplies = mergeQaReplies(existing.replies, incoming.replies) as StudentQuestion["replies"];
  const hasInstructorReply = mergedReplies.some((reply) => reply.role === "instructor");

  return {
    ...existing,
    ...incoming,
    title: incoming.title && incoming.title !== "سوال بدون عنوان" ? incoming.title : existing.title,
    text: incoming.text || existing.text,
    description: incoming.description || existing.description,
    studentName: incoming.studentName && incoming.studentName !== "دانشجو" ? incoming.studentName : existing.studentName,
    courseTitle: incoming.courseTitle && incoming.courseTitle !== "دوره نامشخص" ? incoming.courseTitle : existing.courseTitle,
    courseId: incoming.courseId && incoming.courseId !== "unknown-course" ? incoming.courseId : existing.courseId,
    lessonId: incoming.lessonId || existing.lessonId,
    lessonTitle: incoming.lessonTitle || existing.lessonTitle,
    avatar: incoming.avatar ?? existing.avatar,
    createdAt: incoming.createdAt || existing.createdAt,
    createdAtIso: incoming.createdAtIso || existing.createdAtIso,
    replies: mergedReplies,
    status: hasInstructorReply || incoming.status === "answered" ? "answered" : existing.status,
  };
}

function normalizeStudentQuestion(raw: unknown, index: number): StudentQuestion {
  const row = (isRecord(raw) ? raw : {}) as UnknownRecord;
  const nestedQuestion = isRecord(row.question)
    ? (row.question as UnknownRecord)
    : isRecord(row.data)
      ? (row.data as UnknownRecord)
      : undefined;
  const source = nestedQuestion ?? row;
  const qaReplies = buildQaRepliesFromSource(source, "مدرس اسپاتی‌کد");
  const replies: StudentQuestion["replies"] = qaReplies.map((reply) => ({
    ...(reply.id ? { id: reply.id } : {}),
    senderName: reply.senderName,
    role: reply.role,
    text: reply.text,
    createdAt: reply.createdAt,
    ...(reply.createdAtIso ? { createdAtIso: reply.createdAtIso } : {}),
    ...(reply.attachments?.length ? { attachments: reply.attachments } : {}),
  }));
  const hasInstructorReply = replies.some((reply) => reply.role === "instructor");
  const attachments = extractQaArray(source.attachments ?? source.files ?? source.questionFiles)
    .map(normalizeQaAttachment)
    .filter(Boolean) as NonNullable<StudentQuestion["attachments"]>;
  const questionCreatedAt = formatQaDate(
    source.createdAtIso ?? source.isoCreatedAt ?? source.createdAt ?? source.date ?? source.askedAt
  );

  return {
    id: normalizeString(source.id ?? row.id ?? source.qaId ?? source.questionId, `QST-${String(index + 1).padStart(3, "0")}`),
    studentName: normalizeString(
      source.studentName ?? source.userName ?? source.fullName ?? source.name ?? row.studentName,
      "دانشجو"
    ),
    avatar: typeof source.avatar === "string" ? source.avatar : undefined,
    title: normalizeString(source.title ?? source.questionTitle ?? source.subject ?? source.lessonTitle, "سوال بدون عنوان"),
    text: normalizeString(source.text ?? source.question ?? source.body ?? source.description),
    description: normalizeString(source.description ?? source.questionDescription ?? source.text ?? source.question),
    errorText: normalizeString(source.errorText ?? source.error ?? source.log ?? source.stack),
    courseId: normalizeString(
      source.courseId ??
        (isRecord(source.course) ? (source.course as UnknownRecord).id ?? (source.course as UnknownRecord).courseId : undefined),
      "unknown-course"
    ),
    courseTitle: normalizeString(
      source.courseTitle ??
        (isRecord(source.course) ? (source.course as UnknownRecord).title ?? (source.course as UnknownRecord).name : undefined),
      "دوره نامشخص"
    ),
    lessonId: normalizeString(
      source.lessonId ?? (isRecord(source.lesson) ? (source.lesson as UnknownRecord).id : undefined),
      ""
    ),
    lessonTitle: normalizeString(
      source.lessonTitle ??
        (isRecord(source.lesson) ? (source.lesson as UnknownRecord).title : undefined),
      ""
    ),
    studentId: normalizeString(
      source.studentId ??
        source.userId ??
        row.userId ??
        (isRecord(source.user) ? (source.user as UnknownRecord).id : undefined) ??
        (isRecord(row.user) ? (row.user as UnknownRecord).id : undefined) ??
        (isRecord(source.student) ? (source.student as UnknownRecord).id : undefined),
      ""
    ),
    createdAt: questionCreatedAt.label,
    ...(questionCreatedAt.iso ? { createdAtIso: questionCreatedAt.iso } : {}),
    status: normalizeQaStatus(source.status ?? source.answerStatus ?? (hasInstructorReply ? "answered" : "new")),
    replies: dedupeQuestionReplies(replies),
    ...(attachments.length ? { attachments } : {}),
  };
}

const emptyInstructorProfile: InstructorProfile = {
  name: "",
  displayName: "",
  specialty: "",
  headline: "",
  location: "",
  email: "",
  phone: "",
  bio: "",
  fullBiography: "",
  teachingStyle: "",
  professionalBackground: "",
  avatar: "",
  coverImage: "",
  yearsOfExperience: "",
  skills: [],
  socials: {},
  publicVisibility: {
    email: false,
    phone: false,
    socials: true,
  },
};

// Legacy mock data kept for local-only flows; real instructor pages load from API.
const initialProfile: InstructorProfile = {
  name: "اصغر رضایی",
  displayName: "استاد رضایی",
  specialty: "مدرس ارشد فرانت‌اند و فریم‌ورک‌های جاوااسکریپت",
  headline: "معمار فرانت‌اند و مدرس پروژه‌محور",
  location: "تهران، ایران",
  email: "a.rezaei@spoticode.com",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  bio: "بیش از ۱۰ سال سابقه توسعه نرم‌افزار در شرکت‌های بزرگ داخلی و خارجی، عاشق تدریس جاوااسکریپت، ری‌اکت و لبه‌های تکنولوژی وب.",
  fullBiography:
    "من روی آموزش پروژه‌محور و انتقال تجربه واقعی بازار کار تمرکز دارم. هدفم این است که دانشجو فقط syntax یاد نگیرد، بلکه بتواند معماری، تصمیم‌گیری فنی و اجرای محصول واقعی را هم مدیریت کند.",
  teachingStyle:
    "دقیق، مرحله‌ای و همراه با مثال‌های واقعی. هر مفهوم با تمرین و سناریوی پروژه‌ای جمع‌بندی می‌شود.",
  professionalBackground:
    "سابقه همکاری با تیم‌های محصول، استارتاپ‌ها و پروژه‌های سازمانی در حوزه فرانت‌اند، معماری رابط کاربری و performance.",
  avatar: "",
  coverImage: "",
  yearsOfExperience: "۱۰+ سال",
  skills: ["JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"],
  socials: {
    linkedin: "linkedin.com/in/arezaei",
    github: "github.com/arezaei",
    telegram: "t.me/arezaei_dev",
    website: "rezaei.dev",
  },
  publicVisibility: {
    email: true,
    phone: true,
    socials: true,
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

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function InstructorDataProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [profileCourses, setProfileCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [transactions] = useState<SaleTransaction[]>(initialTransactions);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(initialPayouts);
  const [profile, setProfile] = useState<InstructorProfile>(emptyInstructorProfile);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isLoading = false;

  // Sync helpers
  const syncCourses = (data: Course[]) => {
    setCourses(data);
    localStorage.setItem("spoticode_inst_courses", JSON.stringify(data));
  };

  const syncQuestions = (updater: StudentQuestion[] | ((prev: StudentQuestion[]) => StudentQuestion[])) => {
    setQuestions((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  };

  const syncPayouts = (data: PayoutRequest[]) => {
    setPayouts(data);
    localStorage.setItem("spoticode_inst_payouts", JSON.stringify(data));
  };

  const syncProfile = (data: InstructorProfile) => {
    setProfile(data);
    localStorage.setItem("spoticode_inst_profile", JSON.stringify(data));
  };

  useEffect(() => {
    let cancelled = false;

    const loadInstructorProfile = async () => {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1200);
      });
      if (cancelled) return;

      try {
        const response = await apiGetNoMock<unknown>("/api/instructor-dashboard/profile");
        const payload = unwrapApiPayload(response);
        if (!isRecord(payload) || cancelled) return;

        const remoteProfile = normalizeInstructorProfile(payload.profile ?? payload.instructor);
        const remoteCourses = extractApiArray(payload.courses, ["courses", "items"]).map(normalizeApiCourseRecord);

        if (remoteProfile) {
          syncProfile(remoteProfile);
        }
        if (remoteCourses.length > 0) {
          setProfileCourses(remoteCourses);
          syncCourses(remoteCourses);
        }
      } catch {
        // Keep empty instructor data when the backend is unreachable.
      }
    };

    void loadInstructorProfile();

    return () => {
      cancelled = true;
    };
  }, []);

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
    const nextId = newCourse.id || `CRS-${Math.floor(100 + Math.random() * 900)}`;
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
      heroTitle: newCourse.heroTitle || newCourse.title || "",
      aboutTitle: newCourse.aboutTitle,
      aboutDescription: newCourse.aboutDescription,
      aboutHighlights: newCourse.aboutHighlights || [],
      features: newCourse.features || [],
      faqs: newCourse.faqs || [],
      specialWords: newCourse.specialWords || { highlighted: [], underlined: [], color: "green" },
      tags: newCourse.tags || [],
      badges: newCourse.badges || [],
      benefits: newCourse.benefits || [],
      publicDescription: newCourse.publicDescription || newCourse.description || "",
      visibility: newCourse.visibility || "public",
      needsReviewAfterChanges: newCourse.needsReviewAfterChanges || false,
    };
    const updated = [prepared, ...courses];
    syncCourses(updated);
    showToast(`دوره «${prepared.title}» با موفقیت ایجاد شد.`, "success");
    return prepared.id;
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

  const upsertCourseSilent = useCallback((record: Course) => {
    setCourses((prev) => {
      const prepared = normalizeCourseRecord(record);
      const exists = prev.some((course) => course.id === prepared.id);
      const updated = exists
        ? prev.map((course) => (course.id === prepared.id ? { ...course, ...prepared } : course))
        : [prepared, ...prev];
      localStorage.setItem("spoticode_inst_courses", JSON.stringify(updated));
      return updated;
    });
  }, []);

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
  const replyToQuestion = async (
    questionId: string,
    text: string,
    attachments?: {
      id: string;
      name: string;
      size: number;
      type: string;
      previewUrl?: string;
      caption?: string;
    }[]
  ) => {
    const answerFileIds = attachments?.map((attachment) => attachment.id).filter(Boolean);
    const now = new Date();
    const optimisticReplyId = `optimistic-${now.getTime()}`;
    const optimisticReply: StudentQuestion["replies"][number] = {
      id: optimisticReplyId,
      senderName: profile.displayName || profile.name,
      role: "instructor",
      text,
      createdAt: now.toLocaleDateString("fa-IR"),
      createdAtIso: now.toISOString(),
      ...(attachments?.length ? { attachments } : {}),
    };

    syncQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              status: "answered",
              replies: [...question.replies, optimisticReply],
            }
          : question
      )
    );

    try {
      const response = await apiPatchNoMock<unknown>(
        `/api/instructor-dashboard/questions/${encodeURIComponent(questionId)}/answer`,
        {
          answer: text,
          ...(attachments?.length ? { attachments } : {}),
          ...(answerFileIds?.length ? { answerFileIds } : {}),
        }
      );

      const records = extractQaArray(response);
      const normalizedResponse = records.length
        ? records.map((item, index) => normalizeStudentQuestion(item, index))
        : isRecord(response)
          ? [normalizeStudentQuestion(response, 0)]
          : [];

      if (normalizedResponse.length > 0) {
        const [updatedQuestion] = normalizedResponse;
        syncQuestions((prev) =>
          prev.map((question) => {
            if (question.id !== questionId && question.id !== updatedQuestion.id) return question;
            const withoutOptimistic = {
              ...question,
              replies: question.replies.filter((reply) => reply.id !== optimisticReplyId),
            };
            return mergeStudentQuestion(withoutOptimistic, updatedQuestion);
          })
        );
      }

      showToast("پاسخ شما به سوال دانشجو با موفقیت ثبت شد.", "success");
    } catch (error) {
      syncQuestions((prev) =>
        prev.map((question) => {
          if (question.id !== questionId) return question;
          const nextReplies = question.replies.filter((reply) => reply.id !== optimisticReplyId);
          return {
            ...question,
            replies: nextReplies,
            status: nextReplies.some((reply) => reply.role === "instructor") ? "answered" : "new",
          };
        })
      );
      showToast("خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید.", "error");
      throw error;
    }
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
  const updateProfile = async (newProfile: InstructorProfile) => {
    const response = await apiPutNoMock<unknown>("/api/instructor-dashboard/profile/edit", {
      displayName: newProfile.displayName || newProfile.name,
      headline: newProfile.headline || newProfile.specialty,
      bio: newProfile.bio,
      fullBiography: newProfile.fullBiography,
      skills: newProfile.skills,
      socials: newProfile.socials,
    });
    const payload = unwrapApiPayload(response);
    const remoteProfile = isRecord(payload)
      ? normalizeInstructorProfile(payload.profile ?? payload.form ?? payload.instructor)
      : null;
    const remoteCourses = isRecord(payload)
      ? extractApiArray(payload.courses, ["courses", "items"]).map(normalizeApiCourseRecord)
      : [];

    syncProfile(remoteProfile ?? newProfile);
    if (isRecord(payload) && Array.isArray(payload.courses)) {
      setProfileCourses(remoteCourses);
    }
    showToast("پروفایل مدرس با موفقیت بروزرسانی شد.", "success");
  };

  return (
    <InstructorDataContext.Provider
      value={{
        courses,
        profileCourses,
        questions,
        transactions,
        payouts,
        profile,
        toasts,
        isLoading,
        showToast,
        addCourse,
        upsertCourseSilent,
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
