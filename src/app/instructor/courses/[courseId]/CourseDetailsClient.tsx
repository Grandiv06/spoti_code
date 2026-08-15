"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  Layers,
  Video,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  Plus,
  PlusCircle,
  Trash2,
  Edit,
  Play,
  Check,
  UploadCloud,
  X,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
  FileText,
  Image as ImageIcon,
  HelpCircle as QuizIcon,
  Paperclip,
  CircleDollarSign,
  AlertCircle,
  User,
  Star,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { useInstructorData, type Course, type Chapter, type Lesson, type LessonAttachment } from "@/context/InstructorDataContext";
import { apiGetNoMock, apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { uploadCourseMediaFile } from "@/lib/course-media-upload";
import { cn } from "@/lib/utils";
import InstructorQuestionsBoard from "@/components/instructor/InstructorQuestionsBoard";
import CourseCard from "@/app/components/CourseCard";
import CustomSelect from "@/components/ui/CustomSelect";
import HighlightableTextareaWithBadges from "@/components/ui/HighlightableTextareaWithBadges";
import VideoPreviewModal from "@/app/instructor/courses/create/_components/VideoPreviewModal";
import CourseDetailsSkeleton from "./CourseDetailsSkeleton";
import { formatVideoDuration, readVideoDurationFromFile } from "@/lib/video-duration";

const FEATURE_ICON_OPTIONS = [
  { value: "all_inclusive", label: "بینهایت / مادام‌العمر", icon: "all_inclusive" },
  { value: "workspace_premium", label: "مدرک تحصیلی", icon: "workspace_premium" },
  { value: "forum", label: "پشتیبانی / تالار", icon: "forum" },
  { value: "video_library", label: "ویدیوی کلاسی", icon: "video_library" },
  { value: "architecture", label: "پروژه‌محور", icon: "architecture" },
] as const;

type CourseCategory = "Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX";
type CourseLevel = "elementary" | "intermediate" | "advanced";
type CourseStatus = "published" | "draft" | "pending" | "inactive";
type SettingsFeature = {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
};

type SettingsFaq = {
  id: string;
  question: string;
  answer: string;
};

type SettingsForm = {
  title: string;
  slug: string;
  category: CourseCategory;
  level: CourseLevel;
  cover: string;
  introVideo: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice: number;
  status: CourseStatus;
  pricingType: "free" | "paid";
  duration: string;
  heroTitle: string;
  introText: string;
  specialWords: {
    highlighted: string[];
    underlined: string[];
    color: string;
  };
  tags: string[];
  badges: string[];
  aboutTitle: string;
  aboutDescription: string;
  aboutHighlights: string[];
  objectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  features: SettingsFeature[];
  faqs: SettingsFaq[];
  benefits: string[];
  publicDescription: string;
  visibility: "public" | "private" | "unlisted";
  needsReviewAfterChanges: boolean;
};

const COURSE_ID_ALIASES: Record<string, string> = {
  html: "CRS-410",
  css: "CRS-410",
  javascript: "CRS-410",
  react: "CRS-410",
  nextjs: "CRS-410",
  typescript: "CRS-407",
};

const studentProgressFilterOptions = [
  { value: "all", label: "همه پیشرفت‌ها" },
  { value: "high", label: "پیشرفت بالا (۷۰٪ به بالا)" },
  { value: "mid", label: "پیشرفت متوسط (۴۰٪ تا ۶۹٪)" },
  { value: "low", label: "پیشرفت پایین (زیر ۴۰٪)" },
];

const studentDateSortOptions = [
  { value: "newest", label: "جدیدترین ثبت‌نام" },
  { value: "oldest", label: "قدیمی‌ترین ثبت‌نام" },
];

const filterSelectClassName =
  "h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function mapApiCategory(value: unknown): CourseCategory {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (raw === "backend" || raw.includes("بک") || raw.includes("backend")) return "Backend";
  if (raw === "devops" || raw.includes("دواپس") || raw.includes("devops")) return "DevOps";
  if (raw === "mobile" || raw.includes("موبایل") || raw.includes("mobile")) return "Mobile";
  if (raw === "base" || raw === "ui/ux" || raw.includes("مبانی") || raw.includes("ui")) return "UI/UX";
  if (raw === "ai" || raw.includes("هوش")) return "Frontend";
  if (raw === "frontend" || raw.includes("فرانت")) return "Frontend";
  return "Frontend";
}

function mapCategoryToApi(category: CourseCategory): string {
  switch (category) {
    case "Backend":
      return "backend";
    case "DevOps":
      return "devops";
    case "Mobile":
      return "mobile";
    case "UI/UX":
      return "base";
    default:
      return "frontend";
  }
}

function readDurationHours(draftData: Record<string, unknown>, root: Record<string, unknown>): number {
  const fromDraft = Number(draftData.duration ?? "");
  if (Number.isFinite(fromDraft) && fromDraft >= 0 && String(draftData.duration ?? "").trim() !== "") {
    return Math.round(fromDraft);
  }
  const fromColumn = Number(root.durationHours ?? root.duration ?? 0);
  return Number.isFinite(fromColumn) && fromColumn >= 0 ? Math.round(fromColumn) : 0;
}

function mapApiLevel(value: unknown): CourseLevel {
  if (value === "elementary" || value === "advanced") return value;
  return "intermediate";
}

function mapApiStatus(value: unknown, approvalStatus?: unknown): CourseStatus {
  const approval = typeof approvalStatus === "string" ? approvalStatus : "";
  if (approval === "pending") return "pending";
  if (approval === "approved" || value === "published") return "published";
  if (value === "inactive") return "inactive";
  return "draft";
}

function mapApiAttachments(value: unknown): LessonAttachment[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const row = isRecord(item) ? item : {};
      const name = String(row.name ?? "").trim();
      const url = String(row.url ?? "").trim();
      if (!name || !url || url.startsWith("blob:")) return null;
      return {
        id: String(row.id ?? `file-${index + 1}`),
        name,
        url,
        ...(typeof row.size === "string" ? { size: row.size } : {}),
      };
    })
    .filter((item): item is LessonAttachment => item !== null);
}

function mapApiLessons(rawLessons: unknown): Lesson[] {
  if (!Array.isArray(rawLessons)) return [];
  return rawLessons.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const type = row.type;
    const videoUrl = typeof row.videoUrl === "string" ? row.videoUrl.trim() : "";
    const description = typeof row.description === "string" ? row.description.trim() : "";
    const attachments = mapApiAttachments(row.attachments);
    return {
      id: String(row.id ?? `LES-${index + 1}`),
      title: String(row.title ?? "درس بدون عنوان"),
      type:
        type === "pdf" || type === "text" || type === "exercise" || type === "quiz"
          ? type
          : "video",
      duration: String(row.duration ?? "00:00"),
      isFree: row.isFree === true || row.access === "free",
      status: row.status === "draft" || row.status === "locked" ? row.status : "published",
      ...(videoUrl && !videoUrl.startsWith("blob:") ? { videoUrl } : {}),
      ...(description ? { description } : {}),
      ...(attachments.length ? { attachments } : {}),
    };
  });
}

function buildLessonMediaMapsFromChapters(chapters: Chapter[]) {
  const videos: Record<string, { name: string; url: string }> = {};
  const descriptions: Record<string, string> = {};
  const files: Record<string, { id: string; name: string; url: string }[]> = {};

  for (const chapter of chapters) {
    const lessons = Array.isArray(chapter?.lessons) ? chapter.lessons : [];
    for (const lesson of lessons) {
      const videoUrl = lesson.videoUrl?.trim();
      if (videoUrl && !videoUrl.startsWith("blob:")) {
        videos[lesson.id] = { name: lesson.title, url: videoUrl };
      }

      const description = lesson.description?.trim();
      if (description) {
        descriptions[lesson.id] = description;
      }

      if (lesson.attachments?.length) {
        files[lesson.id] = lesson.attachments.map((file) => ({
          id: file.id,
          name: file.name,
          url: file.url,
        }));
      }
    }
  }

  return { videos, descriptions, files };
}

function serializeChaptersForDraft(
  chapters: Chapter[],
  lessonVideoMap: Record<string, { name: string; url: string }> = {},
  lessonDescriptionMap: Record<string, string> = {},
  lessonFileMap: Record<string, { id: string; name: string; url: string }[]> = {}
) {
  return chapters
    .filter((chapter) => chapter && typeof chapter === "object")
    .map((chapter, index) => {
      const lessons = Array.isArray(chapter.lessons) ? chapter.lessons : [];
      return {
        id: chapter.id || `CHP-${index + 1}`,
        number: String(index + 1).padStart(2, "0"),
        title: chapter.title?.trim() || `فصل ${index + 1}`,
        subtitle: "",
        lessons: lessons.map((lesson) => {
          const mappedVideo = lessonVideoMap[lesson.id]?.url?.trim();
          const videoUrl =
            mappedVideo && !mappedVideo.startsWith("blob:")
              ? mappedVideo
              : lesson.videoUrl && !lesson.videoUrl.startsWith("blob:")
                ? lesson.videoUrl
                : undefined;
          const description =
            lessonDescriptionMap[lesson.id]?.trim() || lesson.description?.trim() || "";
          const attachments = (lessonFileMap[lesson.id] ?? lesson.attachments ?? [])
            .filter((file) => file.url && !file.url.startsWith("blob:"))
            .map((file) => ({
              id: file.id,
              name: file.name,
              url: file.url,
            }));

          return {
            id: lesson.id,
            title: lesson.title || "درس جدید",
            duration: lesson.duration || "00:00",
            type: lesson.type || "video",
            access: lesson.isFree ? "free" : "locked",
            ...(videoUrl ? { videoUrl } : {}),
            ...(description ? { description } : {}),
            ...(attachments.length ? { attachments } : {}),
          };
        }),
      };
    });
}

function createChapterId() {
  return `CHP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createLessonId() {
  return `LES-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapApiChapters(value: unknown): Chapter[] {
  const parsed = parseJsonValue(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const lessons = mapApiLessons(row.lessons);
    return {
      id: String(row.id ?? `CHP-${index + 1}`),
      title: String(row.title ?? "فصل بدون عنوان"),
      duration: String(row.duration ?? `${lessons.length} جلسه`),
      lessons,
    };
  });
}

type CourseStudentRow = {
  id: string;
  name: string;
  date: string;
  enrolledAt: string;
  progress: number;
  status: string;
  avatar: string | null;
};

function extractApiStudents(payload: unknown): CourseStudentRow[] {
  const root = isRecord(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : null;
  if (!root || !Array.isArray(root.students)) return [];

  return root.students
    .map((item, index) => {
      const row = isRecord(item) ? item : {};
      const enrolledAt = String(row.enrolledAt ?? row.createdAt ?? "");
      return {
        id: String(row.id ?? `STU-${index + 1}`),
        name: String(row.name ?? "دانشجو"),
        date: String(row.date ?? ""),
        enrolledAt,
        progress: Number(row.progress ?? 0),
        status: String(row.status ?? "فعال"),
        avatar: typeof row.avatar === "string" && row.avatar.trim() ? row.avatar.trim() : null,
      };
    })
    .filter((student) => student.id);
}

function mapInstructorCourseApiToCourse(payload: unknown): Course | null {
  const root = isRecord(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : null;
  if (!root) return null;

  const draftData = isRecord(parseJsonValue(root.draftData)) ? (parseJsonValue(root.draftData) as Record<string, unknown>) : {};
  const specialWordsRaw = parseJsonValue(root.specialWord ?? draftData.specialWords);
  const specialWords = isRecord(specialWordsRaw)
    ? {
        highlighted: Array.isArray(specialWordsRaw.highlighted)
          ? specialWordsRaw.highlighted.map((item) => String(item))
          : [],
        underlined: Array.isArray(specialWordsRaw.underlined)
          ? specialWordsRaw.underlined.map((item) => String(item))
          : [],
        color: String(specialWordsRaw.color ?? "green"),
      }
    : { highlighted: [] as string[], underlined: [] as string[], color: "green" };

  const faqsRaw = parseJsonValue(root.faqs ?? draftData.faqs);
  const faqs = Array.isArray(faqsRaw)
    ? faqsRaw
        .map((item, index) => {
          const row = isRecord(item) ? item : {};
          return {
            id: String(row.id ?? `faq-${index + 1}`),
            question: String(row.question ?? ""),
            answer: String(row.answer ?? ""),
          };
        })
        .filter((item) => item.question && item.answer)
    : [];

  const featuresRaw = Array.isArray(draftData.features) ? draftData.features : [];
  const features = featuresRaw
    .map((item, index) => {
      const row = isRecord(item) ? item : {};
      return {
        id: String(row.id ?? `feat-${index + 1}`),
        title: String(row.title ?? ""),
        icon: String(row.icon ?? "all_inclusive"),
        color: String(row.color ?? "primary"),
      };
    })
    .filter((item) => item.title);

  const courseId = String(root.id ?? root.courseId ?? "");
  if (!courseId) return null;

  // Prefer draftData (wizard source of truth) then Course columns.
  const title = String(draftData.title ?? root.title ?? "دوره بدون عنوان").trim() || "دوره بدون عنوان";
  const coverRaw = String(draftData.cover ?? root.cover ?? root.thumbnail ?? "").trim();
  const cover = coverRaw.startsWith("blob:") ? "" : coverRaw;
  const introVideo = String(draftData.introVideo ?? root.introVideo ?? "").trim();
  const overview = isRecord(root.overview) ? root.overview : {};
  const price = Number(draftData.price ?? root.price ?? 0);
  const pricingType: "free" | "paid" =
    draftData.isPaid === "free" || draftData.isPaid === "paid"
      ? draftData.isPaid
      : price > 0
        ? "paid"
        : "free";
  const durationHours = readDurationHours(draftData, root);
  const shortDescription = String(draftData.shortDescription ?? root.shortDescription ?? "");
  const aboutDescription = String(
    draftData.aboutDescription ?? root.aboutDescription ?? root.description ?? ""
  );

  return {
    id: courseId,
    title,
    slug: String(root.slug ?? courseId),
    cover,
    introVideo: introVideo && !introVideo.startsWith("blob:") ? introVideo : undefined,
    status: mapApiStatus(root.status, root.approvalStatus),
    // Always prefer Prisma enum `category` over Persian `categoryTitle`.
    category: mapApiCategory(root.category ?? draftData.category ?? root.categoryTitle),
    level: mapApiLevel(draftData.level ?? root.level),
    language: String(draftData.language ?? "فارسی"),
    shortDescription,
    description: aboutDescription || String(root.description ?? ""),
    price: pricingType === "free" ? 0 : Number.isFinite(price) ? price : 0,
    instructorId: String(root.instructorId ?? ""),
    studentsCount: Number(root.studentsCount ?? overview.studentsCount ?? 0),
    rating: Number(root.rating ?? overview.rating ?? 0),
    reviewsCount: Number(root.reviewsCount ?? overview.reviewsCount ?? 0),
    revenue: Number(root.revenue ?? root.instructorRevenue ?? overview.revenue ?? 0),
    completionRate: Number(root.completionRate ?? overview.completionRate ?? 0),
    chapters: mapApiChapters(root.chapters ?? draftData.chapters),
    reviews: [],
    questions: [],
    createdAt: String(root.createdAt ?? ""),
    updatedAt: String(root.updatedAt ?? ""),
    introText: shortDescription,
    objectives: Array.isArray(draftData.aboutHighlights)
      ? draftData.aboutHighlights.map((item) => String(item))
      : [],
    heroTitle: String(draftData.heroTitle ?? title),
    aboutTitle: String(draftData.aboutTitle ?? "درباره این دوره"),
    aboutDescription,
    aboutHighlights: Array.isArray(draftData.aboutHighlights)
      ? draftData.aboutHighlights.map((item) => String(item))
      : [],
    features,
    faqs,
    specialWords,
    visibility: "public",
    durationHours,
    pricingType,
    draftStep: Number(draftData.step ?? root.draftStep ?? 5) || 5,
  };
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const canonicalCourseId = COURSE_ID_ALIASES[courseId] || courseId;

  const {
    courses,
    upsertCourseSilent,
    replyToReview,
    showToast,
  } = useInstructorData();

  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  /** Local chapter/lesson edits that are not yet posted to the drafts API. */
  const [isContentDirty, setIsContentDirty] = useState(false);
  const [courseStudents, setCourseStudents] = useState<CourseStudentRow[]>([]);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCourse = async () => {
      setIsLoadingCourse(true);
      setLoadError("");
      try {
        let response: unknown;
        try {
          response = await apiGetNoMock<unknown>(
            `/api/instructor-dashboard/courses/${encodeURIComponent(canonicalCourseId)}`
          );
        } catch {
          response = await apiGetNoMock<unknown>(
            `/api/instructor-dashboard/courses/${encodeURIComponent(canonicalCourseId)}/draft`
          );
        }
        if (cancelled) return;
        const mapped = mapInstructorCourseApiToCourse(response);
        if (mapped) {
          setDetailCourse(mapped);
          upsertCourseSilent(mapped);
          const media = buildLessonMediaMapsFromChapters(mapped.chapters);
          setLessonVideoMap(media.videos);
          setLessonDescriptionMap(media.descriptions);
          setLessonFileMap(media.files);
        } else {
          setLoadError("اطلاعات دوره از سرور قابل خواندن نبود.");
        }
        setCourseStudents(extractApiStudents(response));
      } catch (error) {
        if (!cancelled) {
          setCourseStudents([]);
          setLoadError(error instanceof Error ? error.message : "دریافت دوره انجام نشد.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCourse(false);
        }
      }
    };

    void loadCourse();

    return () => {
      cancelled = true;
    };
  }, [canonicalCourseId, upsertCourseSilent]);

  // Prefer locally loaded detail (survives context/localStorage failures).
  const courseFromContext = useMemo(() => {
    return courses.find((c) => c.id === canonicalCourseId || c.slug === courseId) ?? null;
  }, [courses, canonicalCourseId, courseId]);
  const course = detailCourse ?? courseFromContext;

  const chaptersRef = useRef<Chapter[]>([]);
  useEffect(() => {
    if (course?.chapters) {
      chaptersRef.current = course.chapters;
    }
  }, [course?.chapters]);

  useEffect(() => {
    const firstChapterId = course?.chapters[0]?.id;
    if (!firstChapterId) return;
    setExpandedChapters((prev) => (prev[firstChapterId] ? prev : { ...prev, [firstChapterId]: true }));
  }, [course?.chapters]);

  useEffect(() => {
    if (!course?.chapters.length) return;
    const media = buildLessonMediaMapsFromChapters(course.chapters);
    setLessonVideoMap((prev) => ({ ...media.videos, ...prev }));
    setLessonDescriptionMap((prev) => ({ ...media.descriptions, ...prev }));
    setLessonFileMap((prev) => ({ ...media.files, ...prev }));
  }, [course?.chapters]);

  const resolveLessonVideo = (lesson: Lesson) =>
    lessonVideoMap[lesson.id] ??
    (lesson.videoUrl ? { name: lesson.title, url: lesson.videoUrl } : undefined);

  const resolveLessonDescription = (lesson: Lesson) =>
    lessonDescriptionMap[lesson.id] ?? lesson.description ?? "";

  const resolveLessonFiles = (lesson: Lesson) =>
    lessonFileMap[lesson.id] ??
    lesson.attachments?.map((file) => ({ id: file.id, name: file.name, url: file.url })) ??
    [];

  // Current Active Tab
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSettingsSection, setActiveSettingsSection] = useState("card");

  // Read tab parameter from URL if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "content", "students", "reviews", "questions", "settings"].includes(tabParam)) {
      const timeoutId = window.setTimeout(() => setActiveTab(tabParam), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [searchParams]);

  // State for Add Chapter
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [draggedChapterId, setDraggedChapterId] = useState<string | null>(null);
  const [dragOverChapterId, setDragOverChapterId] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ chapterId: string; lessonId: string } | null>(null);
  const [dragOverLesson, setDragOverLesson] = useState<{ chapterId: string; lessonId: string } | null>(null);

  // State for Accordion collapse/expand (chapter IDs)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "CHP-001": true, // open first by default
  });
  const [editingChapterTitleId, setEditingChapterTitleId] = useState<string | null>(null);
  const [editingLessonTitleId, setEditingLessonTitleId] = useState<string | null>(null);
  const [chapterTitleDraft, setChapterTitleDraft] = useState("");
  const [lessonTitleDraft, setLessonTitleDraft] = useState("");
  const [lessonUploadProgress, setLessonUploadProgress] = useState<Record<string, number>>({});
  const [lessonVideoMap, setLessonVideoMap] = useState<Record<string, { name: string; url: string }>>({});
  const [lessonFileMap, setLessonFileMap] = useState<Record<string, { id: string; name: string; url: string }[]>>({});
  const [lessonDescriptionMap, setLessonDescriptionMap] = useState<Record<string, string>>({});
  const [lessonDescriptionEditor, setLessonDescriptionEditor] = useState<{ open: boolean; lessonId: string; value: string }>({ open: false, lessonId: "", value: "" });
  const [lessonFilesModal, setLessonFilesModal] = useState<{ open: boolean; lessonId: string }>({ open: false, lessonId: "" });
  const [lessonVideoPreview, setLessonVideoPreview] = useState<{ open: boolean; title: string; url: string }>({
    open: false,
    title: "",
    url: "",
  });
  const [lessonFilesError, setLessonFilesError] = useState("");
  const [pendingMediaVersion, setPendingMediaVersion] = useState(0);
  const lessonVideoFilesRef = useRef<Record<string, File>>({});
  const lessonAttachmentFilesRef = useRef<Record<string, Record<string, File>>>({});
  const bumpPendingMedia = () => setPendingMediaVersion((v) => v + 1);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; title: string; message: string; action: (() => void) | null }>({
    open: false,
    title: "",
    message: "",
    action: null,
  });
  const MAX_LESSON_FILES = 3;

  const toggleChapter = (chId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chId]: !prev[chId],
    }));
  };

  // State for Add Lesson Modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [newLessonData, setNewLessonData] = useState({
    title: "",
    type: "video" as "video" | "pdf" | "text" | "exercise" | "quiz",
    isFree: false,
    status: "published" as "published" | "draft" | "locked",
    fileName: "",
    fileSize: "",
  });

  // Simulated lesson upload progress
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonFile, setLessonFile] = useState<File | null>(null);

  // State for Review Reply Box
  const [activeReviewReplyId, setActiveReviewReplyId] = useState("");
  const [reviewReplyText, setReviewReplyText] = useState("");

  // State for Question Reply Box
  const [activeQuestionId, setActiveQuestionId] = useState("");
  const [studentProgressFilter, setStudentProgressFilter] = useState("all");
  const [studentDateSort, setStudentDateSort] = useState("newest");

  // Local settings form state
  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    title: "",
    slug: "",
    category: "Frontend",
    level: "intermediate",
    cover: "",
    introVideo: "",
    shortDescription: "",
    description: "",
    price: 0,
    discountPrice: 0,
    status: "draft",
    pricingType: "paid" as "free" | "paid",
    duration: "",
    heroTitle: "",
    introText: "",
    specialWords: { highlighted: [] as string[], underlined: [] as string[], color: "green" },
    tags: [] as string[],
    badges: [] as string[],
    aboutTitle: "",
    aboutDescription: "",
    aboutHighlights: [] as string[],
    objectives: [] as string[],
    prerequisites: [] as string[],
    targetAudience: [] as string[],
    features: [] as { id: string; title: string; icon: string; color: string; description?: string }[],
    faqs: [] as { id: string; question: string; answer: string }[],
    benefits: [] as string[],
    publicDescription: "",
    visibility: "public",
    needsReviewAfterChanges: false,
  });
  const [settingsNewHighlightWord, setSettingsNewHighlightWord] = useState("");
  const [settingsNewUnderlineWord, setSettingsNewUnderlineWord] = useState("");
  const [settingsNewHighlight, setSettingsNewHighlight] = useState("");
  const [settingsFeatureDraft, setSettingsFeatureDraft] = useState({
    title: "",
    icon: "all_inclusive",
    color: "primary",
  });
  const [settingsEditingFeatureId, setSettingsEditingFeatureId] = useState<string | null>(null);
  const [settingsOpenFaqId, setSettingsOpenFaqId] = useState<string | null>(null);

  // Load course details into settings form from real API-mapped course fields.
  useEffect(() => {
    if (course) {
      const hours = Number.isFinite(course.durationHours) ? Math.max(0, Number(course.durationHours)) : 0;
      const nextSettingsForm: SettingsForm = {
        title: course.title,
        slug: course.slug,
        category: course.category,
        level: course.level,
        cover: course.cover || "",
        introVideo: course.introVideo || "",
        shortDescription: course.shortDescription,
        description: course.description,
        price: course.price,
        discountPrice: course.discountPrice || 0,
        status: course.status,
        pricingType: course.pricingType ?? (course.price > 0 ? "paid" : "free"),
        duration: String(hours),
        heroTitle: course.heroTitle || course.title,
        introText: course.introText || course.shortDescription,
        specialWords: course.specialWords || { highlighted: [], underlined: [], color: "green" },
        tags: course.tags || [],
        badges: course.badges || [],
        aboutTitle: course.aboutTitle || "درباره این دوره",
        aboutDescription: course.aboutDescription || course.description,
        aboutHighlights: course.aboutHighlights || [],
        objectives: course.objectives || [],
        prerequisites: course.prerequisites || [],
        targetAudience: course.targetAudience || [],
        features: course.features || [],
        faqs: course.faqs || [],
        benefits: course.benefits || [],
        publicDescription: course.publicDescription || course.description,
        visibility: course.visibility || "public",
        needsReviewAfterChanges: course.needsReviewAfterChanges || false,
      };
      const timeoutId = window.setTimeout(() => setSettingsForm(nextSettingsForm), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [course]);

  const hasAnyPendingMedia = () => {
    void pendingMediaVersion;
    return (
      Object.keys(lessonVideoFilesRef.current).length > 0 ||
      Object.values(lessonVideoMap).some((entry) => entry.url.startsWith("blob:")) ||
      Object.values(lessonAttachmentFilesRef.current).some((files) => Object.keys(files).length > 0) ||
      Object.values(lessonFileMap).some((files) => files.some((file) => file.url.startsWith("blob:")))
    );
  };

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isContentDirty && !hasAnyPendingMedia()) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isContentDirty, pendingMediaVersion, lessonVideoMap, lessonFileMap]);

  if (isLoadingCourse && !course) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-lg font-black text-gray-900 dark:text-white">دوره مورد نظر یافت نشد!</h2>
        {loadError ? (
          <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">{loadError}</p>
        ) : null}
        <button onClick={() => router.push("/instructor/courses")} className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">
          بازگشت به دوره‌ها
        </button>
      </div>
    );
  }

  // Calculations
  const lessonsCount = (course.chapters || []).reduce(
    (sum, ch) => sum + (Array.isArray(ch.lessons) ? ch.lessons.length : 0),
    0
  );

  const reloadCourseFromApi = async () => {
    let response: unknown;
    try {
      response = await apiGetNoMock<unknown>(
        `/api/instructor-dashboard/courses/${encodeURIComponent(course.id)}`,
        getAuthHeaders()
      );
    } catch {
      response = await apiGetNoMock<unknown>(
        `/api/instructor-dashboard/courses/${encodeURIComponent(course.id)}/draft`,
        getAuthHeaders()
      );
    }
    const mapped = mapInstructorCourseApiToCourse(response);
    if (mapped) {
      setDetailCourse(mapped);
      upsertCourseSilent(mapped);
      const media = buildLessonMediaMapsFromChapters(mapped.chapters);
      setLessonVideoMap((prev) => {
        const next = { ...media.videos };
        for (const [lessonId, entry] of Object.entries(prev)) {
          // Keep in-progress blob previews until server URL arrives.
          if (entry.url.startsWith("blob:") && !next[lessonId]) {
            next[lessonId] = entry;
          }
        }
        return next;
      });
      setLessonDescriptionMap(media.descriptions);
      setLessonFileMap(media.files);
    }
    return mapped;
  };

  const normalizeChapters = (nextChapters: Chapter[]): Chapter[] =>
    nextChapters.map((chapter, index) => ({
      ...chapter,
      id: chapter.id || `CHP-${index + 1}`,
      title: chapter.title?.trim() || `فصل ${index + 1}`,
      lessons: Array.isArray(chapter.lessons) ? chapter.lessons : [],
    }));

  /** CMS-style local-first edit: update UI immediately, persist only on explicit save. */
  const applyChaptersLocally = (nextChapters: Chapter[]) => {
    if (!course) return;
    const safeChapters = normalizeChapters(nextChapters);
    chaptersRef.current = safeChapters;
    const nextCourse = { ...course, chapters: safeChapters };
    setDetailCourse(nextCourse);
    upsertCourseSilent(nextCourse);
    setIsContentDirty(true);
  };

  const persistCourseChapters = async (
    nextChapters: Chapter[],
    successMessage: string,
    options?: {
      manageSavingState?: boolean;
      videoMap?: Record<string, { name: string; url: string }>;
      fileMap?: Record<string, { id: string; name: string; url: string }[]>;
      descriptionMap?: Record<string, string>;
    }
  ) => {
    const manageSavingState = options?.manageSavingState !== false;
    const videoMap = options?.videoMap ?? lessonVideoMap;
    const fileMap = options?.fileMap ?? lessonFileMap;
    const descriptionMap = options?.descriptionMap ?? lessonDescriptionMap;
    const safeChapters = normalizeChapters(nextChapters);
    chaptersRef.current = safeChapters;
    const nextCourse = { ...course, chapters: safeChapters };
    setDetailCourse(nextCourse);
    upsertCourseSilent(nextCourse);
    if (manageSavingState) setIsSavingContent(true);
    try {
      // Prefer non-data-URL cover so we don't re-post multi-MB base64 on every chapter move.
      const persistableCover =
        course.cover && !course.cover.startsWith("data:") && !course.cover.startsWith("blob:")
          ? course.cover
          : "";

      await apiPostNoMock(
        "/api/instructor-dashboard/courses/drafts",
        {
          courseId: course.id,
          step: course.draftStep ?? 5,
          title: course.title,
          category: mapCategoryToApi(course.category),
          level: course.level,
          language: course.language || "فارسی",
          duration: String(course.durationHours ?? 0),
          price: course.price ?? 0,
          isPaid: course.pricingType === "free" || (course.price ?? 0) === 0 ? "free" : "paid",
          cover: persistableCover,
          introVideo: course.introVideo || "",
          shortDescription: course.shortDescription || "",
          heroTitle: course.heroTitle || course.title,
          specialWords: course.specialWords || {
            highlighted: [],
            underlined: [],
            color: "green",
          },
          aboutTitle: course.aboutTitle || "درباره این دوره",
          aboutDescription: course.aboutDescription || course.description || "",
          aboutHighlights: course.aboutHighlights || [],
          features: (course.features || []).map((feature) => ({
            id: feature.id,
            title: feature.title,
            icon: feature.icon,
            color: feature.color,
          })),
          chapters: serializeChaptersForDraft(
            safeChapters,
            videoMap,
            descriptionMap,
            fileMap
          ),
          faqs: (course.faqs || []).map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          })),
        },
        getAuthHeaders()
      );

      await reloadCourseFromApi();
      setIsContentDirty(false);
      showToast(successMessage, "success");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "ذخیره سرفصل‌ها انجام نشد.";
      showToast(message, "error");
      try {
        await reloadCourseFromApi();
      } catch {
        // keep optimistic local state if reload also fails
      }
      return false;
    } finally {
      if (manageSavingState) setIsSavingContent(false);
    }
  };

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newChapterTitle.trim();
    if (!title || isSavingContent) return;

    const nextChapters: Chapter[] = [
      ...chaptersRef.current,
      {
        id: createChapterId(),
        title,
        duration: "۰ دقیقه",
        lessons: [],
      },
    ];

    setNewChapterTitle("");
    setIsAddingChapter(false);
    const created = nextChapters[nextChapters.length - 1];
    setExpandedChapters((prev) => ({ ...prev, [created.id]: true }));
    applyChaptersLocally(nextChapters);
  };

  const addLessonInline = (chapterId: string) => {
    if (isSavingContent) return;
    const newLesson: Lesson = {
      id: createLessonId(),
      title: "درس جدید",
      type: "video",
      duration: "00:00",
      isFree: false,
      status: "published",
    };
    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, lessons: [...chapter.lessons, newLesson], duration: `${chapter.lessons.length + 1} جلسه` }
        : chapter
    );
    applyChaptersLocally(nextChapters);
  };

  const moveChapter = (index: number, direction: "up" | "down") => {
    if (isSavingContent) return;
    const target = direction === "up" ? index - 1 : index + 1;
    const source = chaptersRef.current;
    if (target < 0 || target >= source.length) return;
    const chapters = [...source];
    const [moved] = chapters.splice(index, 1);
    chapters.splice(target, 0, moved);
    applyChaptersLocally(chapters);
  };

  const reorderChapters = (sourceId: string, targetId: string) => {
    if (isSavingContent || sourceId === targetId) return;
    const chapters = [...chaptersRef.current];
    const from = chapters.findIndex((chapter) => chapter.id === sourceId);
    const to = chapters.findIndex((chapter) => chapter.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = chapters.splice(from, 1);
    chapters.splice(to, 0, moved);
    applyChaptersLocally(chapters);
  };

  const reorderLessons = (
    sourceChapterId: string,
    sourceLessonId: string,
    targetChapterId: string,
    targetLessonId?: string
  ) => {
    if (isSavingContent || !sourceChapterId || !sourceLessonId || !targetChapterId) return;

    const nextChapters = chaptersRef.current.map((chapter) => ({
      ...chapter,
      lessons: [...chapter.lessons],
    }));

    const sourceChapterIndex = nextChapters.findIndex((chapter) => chapter.id === sourceChapterId);
    const targetChapterIndex = nextChapters.findIndex((chapter) => chapter.id === targetChapterId);
    if (sourceChapterIndex < 0 || targetChapterIndex < 0) return;

    const sourceChapter = nextChapters[sourceChapterIndex];
    const targetChapter = nextChapters[targetChapterIndex];
    const sourceLessonIndex = sourceChapter.lessons.findIndex((lesson) => lesson.id === sourceLessonId);
    if (sourceLessonIndex < 0) return;

    const [movedLesson] = sourceChapter.lessons.splice(sourceLessonIndex, 1);
    const targetLessonIndex = targetLessonId
      ? targetChapter.lessons.findIndex((lesson) => lesson.id === targetLessonId)
      : -1;

    if (targetLessonIndex >= 0) {
      const adjustedTargetIndex =
        sourceChapterId === targetChapterId && sourceLessonIndex < targetLessonIndex
          ? Math.max(0, targetLessonIndex - 1)
          : targetLessonIndex;
      targetChapter.lessons.splice(adjustedTargetIndex, 0, movedLesson);
    } else {
      targetChapter.lessons.push(movedLesson);
    }

    sourceChapter.duration = `${sourceChapter.lessons.length} جلسه`;
    if (sourceChapterId !== targetChapterId) {
      targetChapter.duration = `${targetChapter.lessons.length} جلسه`;
    }

    applyChaptersLocally(nextChapters);
  };

  const commitChapterTitle = (chapterId: string, currentTitle: string) => {
    const nextTitle = chapterTitleDraft.trim();
    setEditingChapterTitleId(null);
    if (!nextTitle || nextTitle === currentTitle || isSavingContent) return;
    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === chapterId ? { ...chapter, title: nextTitle } : chapter
    );
    applyChaptersLocally(nextChapters);
  };

  const commitLessonTitle = (chapterId: string, lessonId: string, currentTitle: string) => {
    const nextTitle = lessonTitleDraft.trim();
    setEditingLessonTitleId(null);
    if (!nextTitle || nextTitle === currentTitle || isSavingContent) return;
    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === chapterId
        ? {
            ...chapter,
            lessons: chapter.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, title: nextTitle } : lesson
            ),
          }
        : chapter
    );
    applyChaptersLocally(nextChapters);
  };

  const toggleLessonFree = (chapterId: string, lessonId: string, isFree: boolean) => {
    if (isSavingContent) return;
    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === chapterId
        ? {
            ...chapter,
            lessons: chapter.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, isFree: !isFree } : lesson
            ),
          }
        : chapter
    );
    applyChaptersLocally(nextChapters);
  };

  const toggleChapterAccess = (chapterId: string) => {
    if (isSavingContent) return;
    const nextChapters = chaptersRef.current.map((chapter) => {
      if (chapter.id !== chapterId) return chapter;
      const allLocked =
        chapter.lessons.length === 0 || chapter.lessons.every((lesson) => !lesson.isFree);
      const nextIsFree = allLocked;
      return {
        ...chapter,
        lessons: chapter.lessons.map((lesson) => ({ ...lesson, isFree: nextIsFree })),
      };
    });
    applyChaptersLocally(nextChapters);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (isSavingContent) return;
    const nextChapters = chaptersRef.current.filter((chapter) => chapter.id !== chapterId);
    applyChaptersLocally(nextChapters);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    if (isSavingContent) return;
    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === chapterId
        ? {
            ...chapter,
            lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId),
            duration: `${Math.max(0, chapter.lessons.length - 1)} جلسه`,
          }
        : chapter
    );
    applyChaptersLocally(nextChapters);
  };

  // Handle Add Lesson File Simulation
  const handleNewLessonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLessonFile(file);
      setLessonProgress(10);
      const interval = setInterval(() => {
        setLessonProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setNewLessonData((p) => ({
              ...p,
              fileName: file.name,
              fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            }));
            return 100;
          }
          return prev + 20;
        });
      }, 100);
    }
  };

  const hasPendingLessonVideo = (lessonId: string) =>
    Boolean(lessonVideoFilesRef.current[lessonId]) ||
    Boolean(lessonVideoMap[lessonId]?.url?.startsWith("blob:"));

  const hasPendingLessonFiles = (lessonId: string) => {
    const pending = lessonAttachmentFilesRef.current[lessonId] || {};
    if (Object.keys(pending).length > 0) return true;
    return (lessonFileMap[lessonId] || []).some((file) => file.url.startsWith("blob:"));
  };

  const hasUnsavedContentChanges = () => isContentDirty || hasAnyPendingMedia();

  /** Select video locally — user must press save to upload to server. */
  const handleLessonVideoSelect = (lessonId: string, file?: File) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const lessonTitle =
      chaptersRef.current.flatMap((chapter) => chapter.lessons).find((lesson) => lesson.id === lessonId)
        ?.title || file.name;

    lessonVideoFilesRef.current[lessonId] = file;
    setLessonVideoMap((prev) => {
      const existing = prev[lessonId];
      if (existing?.url?.startsWith("blob:")) URL.revokeObjectURL(existing.url);
      return { ...prev, [lessonId]: { name: file.name, url: previewUrl } };
    });
    bumpPendingMedia();
    setIsContentDirty(true);
    setLessonVideoPreview({ open: true, title: lessonTitle, url: previewUrl });
    showToast("ویدیو انتخاب شد. برای ارسال روی سرور «ذخیره تغییرات» را بزنید.", "info");

    void (async () => {
      try {
        const seconds = await readVideoDurationFromFile(file);
        const durationLabel = formatVideoDuration(seconds);
        const nextChapters = chaptersRef.current.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, duration: durationLabel } : lesson
          ),
        }));
        applyChaptersLocally(nextChapters);
      } catch {
        // Keep previous duration if metadata cannot be read.
      }
    })();
  };

  const uploadLessonVideoFile = async (lessonId: string) => {
    const pendingFile = lessonVideoFilesRef.current[lessonId];
    const current = lessonVideoMap[lessonId];
    if (!pendingFile) {
      if (current?.url?.startsWith("blob:")) {
        throw new Error("فایل ویدیو پیدا نشد. دوباره انتخاب کنید.");
      }
      return current?.url && !current.url.startsWith("blob:") ? current.url : "";
    }

    setLessonUploadProgress((prev) => ({ ...prev, [lessonId]: 55 }));
    const uploadedUrl = await uploadCourseMediaFile(course.id, pendingFile, "lesson", lessonId);
    if (current?.url?.startsWith("blob:")) URL.revokeObjectURL(current.url);
    delete lessonVideoFilesRef.current[lessonId];
    setLessonVideoMap((prev) => ({
      ...prev,
      [lessonId]: { name: pendingFile.name, url: uploadedUrl },
    }));
    setLessonVideoPreview((prev) =>
      prev.open && (prev.url === current?.url || prev.title) ? { ...prev, url: uploadedUrl } : prev
    );

    const nextChapters = chaptersRef.current.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, videoUrl: uploadedUrl } : lesson
      ),
    }));
    chaptersRef.current = nextChapters;
    setDetailCourse({ ...course, chapters: nextChapters });
    upsertCourseSilent({ ...course, chapters: nextChapters });
    setLessonUploadProgress((prev) => ({ ...prev, [lessonId]: 90 }));
    return uploadedUrl;
  };

  const removeLessonVideo = (lessonId: string) => {
    if (isSavingContent) return;

    const previousUrl = lessonVideoMap[lessonId]?.url;
    delete lessonVideoFilesRef.current[lessonId];
    setLessonVideoMap((prev) => {
      const target = prev[lessonId];
      if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
      const copy = { ...prev };
      delete copy[lessonId];
      return copy;
    });
    setLessonUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[lessonId];
      return copy;
    });
    if (previousUrl) {
      setLessonVideoPreview((prev) =>
        prev.open && prev.url === previousUrl ? { open: false, title: "", url: "" } : prev
      );
    }
    bumpPendingMedia();

    const nextChapters = chaptersRef.current.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const { videoUrl: _removed, ...rest } = lesson;
        void _removed;
        return rest;
      }),
    }));
    applyChaptersLocally(nextChapters);
  };

  const handleLessonFileUpload = (lessonId: string, files?: File[]) => {
    if (!lessonId) {
      setLessonFilesError("جلسه‌ای برای آپلود انتخاب نشده است.");
      return;
    }
    if (!files || files.length === 0) return;
    setLessonFileMap((prev) => {
      const current = prev[lessonId] || [];
      const remaining = Math.max(0, MAX_LESSON_FILES - current.length);
      if (remaining <= 0) {
        setLessonFilesError(`حداکثر ${MAX_LESSON_FILES} فایل برای هر جلسه مجاز است.`);
        return prev;
      }
      const selected = files.slice(0, remaining);
      if (!lessonAttachmentFilesRef.current[lessonId]) {
        lessonAttachmentFilesRef.current[lessonId] = {};
      }
      const newFiles = selected.map((f, idx) => {
        const id = `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
        lessonAttachmentFilesRef.current[lessonId][id] = f;
        return {
          id,
          name: f.name,
          url: URL.createObjectURL(f),
        };
      });
      setLessonFilesError("");
      return { ...prev, [lessonId]: [...current, ...newFiles] };
    });
    bumpPendingMedia();
    setIsContentDirty(true);
    showToast("فایل انتخاب شد. برای ارسال «ذخیره تغییرات» را بزنید.", "info");
  };

  const removeLessonFile = (lessonId: string, fileId: string) => {
    if (lessonAttachmentFilesRef.current[lessonId]?.[fileId]) {
      delete lessonAttachmentFilesRef.current[lessonId][fileId];
    }
    const currentFiles = lessonFileMap[lessonId] || [];
    const target = currentFiles.find((f) => f.id === fileId);
    if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
    const nextFilesForLesson = currentFiles.filter((f) => f.id !== fileId);
    setLessonFileMap((prev) => {
      const copy = { ...prev };
      if (nextFilesForLesson.length) copy[lessonId] = nextFilesForLesson;
      else delete copy[lessonId];
      return copy;
    });
    bumpPendingMedia();
    const nextChapters = chaptersRef.current.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              attachments: nextFilesForLesson
                .filter((file) => !file.url.startsWith("blob:"))
                .map((file) => ({ id: file.id, name: file.name, url: file.url })),
            }
          : lesson
      ),
    }));
    applyChaptersLocally(nextChapters);
  };

  /** Upload pending media then persist the full chapters draft in one explicit save. */
  const saveContentChanges = async () => {
    if (isSavingContent) return;
    if (!hasUnsavedContentChanges()) return;

    const pendingVideoIds = Object.keys(lessonVideoFilesRef.current);
    for (const [lessonId, entry] of Object.entries(lessonVideoMap)) {
      if (entry.url.startsWith("blob:") && !pendingVideoIds.includes(lessonId)) {
        showToast("ویدیوی جلسه را دوباره انتخاب کنید تا ذخیره شود.", "error");
        return;
      }
    }

    const pendingAttachmentLessonIds = [
      ...new Set([
        ...Object.keys(lessonAttachmentFilesRef.current).filter(
          (lessonId) => Object.keys(lessonAttachmentFilesRef.current[lessonId] || {}).length > 0
        ),
        ...Object.entries(lessonFileMap)
          .filter(([, files]) => files.some((file) => file.url.startsWith("blob:")))
          .map(([lessonId]) => lessonId),
      ]),
    ];

    setIsSavingContent(true);
    try {
      let videoMap = { ...lessonVideoMap };
      let fileMap = { ...lessonFileMap };
      let nextChapters = chaptersRef.current;

      for (const lessonId of pendingVideoIds) {
        setLessonUploadProgress((prev) => ({ ...prev, [lessonId]: 25 }));
        const uploadedUrl = await uploadLessonVideoFile(lessonId);
        if (!uploadedUrl) throw new Error("آدرس ویدیو آماده نیست.");
        videoMap = {
          ...videoMap,
          [lessonId]: {
            name: videoMap[lessonId]?.name || "video",
            url: uploadedUrl,
          },
        };
        nextChapters = chaptersRef.current;
        setLessonUploadProgress((prev) => {
          const copy = { ...prev };
          delete copy[lessonId];
          return copy;
        });
      }

      for (const lessonId of pendingAttachmentLessonIds) {
        const currentFiles = fileMap[lessonId] || [];
        const pendingById = lessonAttachmentFilesRef.current[lessonId] || {};
        let nextFiles = [...currentFiles];

        for (const fileEntry of currentFiles) {
          const pendingFile = pendingById[fileEntry.id];
          if (!pendingFile && !fileEntry.url.startsWith("blob:")) continue;
          if (!pendingFile) {
            throw new Error(`فایل «${fileEntry.name}» دوباره انتخاب شود.`);
          }
          const uploadedUrl = await uploadCourseMediaFile(
            course.id,
            pendingFile,
            "attachment",
            lessonId
          );
          if (fileEntry.url.startsWith("blob:")) URL.revokeObjectURL(fileEntry.url);
          delete lessonAttachmentFilesRef.current[lessonId]?.[fileEntry.id];
          nextFiles = nextFiles.map((item) =>
            item.id === fileEntry.id ? { ...item, url: uploadedUrl } : item
          );
        }

        fileMap = { ...fileMap, [lessonId]: nextFiles };
        nextChapters = nextChapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) =>
            lesson.id === lessonId
              ? {
                  ...lesson,
                  attachments: nextFiles.map((file) => ({
                    id: file.id,
                    name: file.name,
                    url: file.url,
                  })),
                }
              : lesson
          ),
        }));
      }

      setLessonVideoMap(videoMap);
      setLessonFileMap(fileMap);
      chaptersRef.current = nextChapters;
      bumpPendingMedia();

      await persistCourseChapters(nextChapters, "تغییرات روی سرور ذخیره شد.", {
        manageSavingState: false,
        videoMap,
        fileMap,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "ذخیره تغییرات انجام نشد.";
      showToast(message, "error");
    } finally {
      setIsSavingContent(false);
      setLessonUploadProgress({});
    }
  };

  const openDeleteConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDelete({ open: true, title, message, action });
  };

  // Handle Save Lesson Submit (local-first; server sync via «ذخیره تغییرات»)
  const handleSaveLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonData.title.trim() || !selectedChapterId || isSavingContent) return;

    const prepared: Lesson = {
      id: createLessonId(),
      title: newLessonData.title.trim(),
      type: newLessonData.type || "video",
      duration: "00:00",
      isFree: !!newLessonData.isFree,
      status: newLessonData.status || "published",
      ...(newLessonData.fileName ? { fileName: newLessonData.fileName } : {}),
      ...(newLessonData.fileSize ? { fileSize: newLessonData.fileSize } : {}),
    };

    const nextChapters = chaptersRef.current.map((chapter) =>
      chapter.id === selectedChapterId
        ? {
            ...chapter,
            lessons: [...chapter.lessons, prepared],
            duration: `${chapter.lessons.length + 1} جلسه`,
          }
        : chapter
    );

    setIsLessonModalOpen(false);
    setNewLessonData({
      title: "",
      type: "video",
      isFree: false,
      status: "published",
      fileName: "",
      fileSize: "",
    });
    setLessonFile(null);
    setLessonProgress(0);
    applyChaptersLocally(nextChapters);
  };

  // Handle Review Reply Submit
  const handleReviewReplySubmit = (reviewId: string) => {
    if (reviewReplyText.trim()) {
      replyToReview(course.id, reviewId, reviewReplyText.trim());
      setReviewReplyText("");
      setActiveReviewReplyId("");
    }
  };

  const settingsSections: {
    id: string;
    label: string;
    description: string;
    icon: typeof GraduationCap;
  }[] = [
    {
      id: "card",
      label: "بخش اول: اطلاعات اولیه کارت دوره",
      description: "نام، قیمت، سطح و کاور",
      icon: GraduationCap,
    },
    {
      id: "hero",
      label: "بخش دوم: معرفی هیرو دوره",
      description: "عنوان، کلمات ویژه و ویدیو",
      icon: Sparkles,
    },
    {
      id: "details",
      label: "بخش سوم: جزئیات محتوای دوره",
      description: "درباره، ویژگی‌ها و FAQ",
      icon: Layers,
    },
  ];

  const normalizeDigitsToEnglish = (value: string) => {
    return value
      .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
  };

  const handleSettingsTitleChange = (value: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug
        ? prev.slug
        : value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9آ-ی\s]/g, "")
            .replace(/\s+/g, "-"),
    }));
  };

  const handleSettingsDurationChange = (value: string) => {
    // Keep "0" (and don't blank out Persian/English zeros). Only strip leading zeros when more digits follow.
    const digitsOnly = normalizeDigitsToEnglish(value)
      .replace(/\D/g, "")
      .replace(/^0+(?=\d)/, "");
    setSettingsForm((prev) => ({ ...prev, duration: digitsOnly }));
  };

  const handleSettingsPriceChange = (value: string) => {
    const digitsOnly = normalizeDigitsToEnglish(value).replace(/\D/g, "").replace(/^0+/, "");
    setSettingsForm((prev) => ({ ...prev, price: digitsOnly ? Number(digitsOnly) : 0 }));
  };

  const addSettingsSpecialWord = (field: "highlighted" | "underlined") => {
    const value = field === "highlighted" ? settingsNewHighlightWord.trim() : settingsNewUnderlineWord.trim();
    if (!value || settingsForm.specialWords[field].includes(value)) return;

    setSettingsForm((prev) => ({
      ...prev,
      specialWords: {
        ...prev.specialWords,
        [field]: [...prev.specialWords[field], value],
      },
    }));

    if (field === "highlighted") setSettingsNewHighlightWord("");
    else setSettingsNewUnderlineWord("");
  };

  const removeSettingsSpecialWord = (field: "highlighted" | "underlined", word: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      specialWords: {
        ...prev.specialWords,
        [field]: prev.specialWords[field].filter((item) => item !== word),
      },
    }));
  };

  const addSettingsHighlight = () => {
    const value = settingsNewHighlight.trim();
    if (!value || settingsForm.aboutHighlights.includes(value)) return;

    setSettingsForm((prev) => ({
      ...prev,
      aboutHighlights: [...prev.aboutHighlights, value],
    }));
    setSettingsNewHighlight("");
  };

  const removeSettingsHighlight = (item: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      aboutHighlights: prev.aboutHighlights.filter((highlight) => highlight !== item),
    }));
  };

  const addOrUpdateSettingsFeature = () => {
    const title = settingsFeatureDraft.title.trim();
    if (!title) return;

    if (settingsEditingFeatureId) {
      setSettingsForm((prev) => ({
        ...prev,
        features: prev.features.map((feature) =>
          feature.id === settingsEditingFeatureId ? { ...feature, ...settingsFeatureDraft, title } : feature
        ),
      }));
      setSettingsEditingFeatureId(null);
    } else {
      setSettingsForm((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          {
            id: `feat-${Math.random().toString(36).slice(2, 9)}`,
            title,
            icon: settingsFeatureDraft.icon,
            color: settingsFeatureDraft.color,
          },
        ],
      }));
    }

    setSettingsFeatureDraft({ title: "", icon: "all_inclusive", color: "primary" });
  };

  const editSettingsFeature = (feature: SettingsFeature) => {
    setSettingsFeatureDraft({
      title: feature.title,
      icon: feature.icon,
      color: feature.color,
    });
    setSettingsEditingFeatureId(feature.id);
  };

  const deleteSettingsFeature = (id: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature.id !== id),
    }));
    if (settingsEditingFeatureId === id) {
      setSettingsEditingFeatureId(null);
      setSettingsFeatureDraft({ title: "", icon: "all_inclusive", color: "primary" });
    }
  };

  const addSettingsFaq = () => {
    const id = `faq-${Math.random().toString(36).slice(2, 9)}`;
    setSettingsForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id, question: "", answer: "" }],
    }));
    setSettingsOpenFaqId(id);
  };

  const updateSettingsFaq = (id: string, updates: Partial<SettingsFaq>) => {
    setSettingsForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) => (faq.id === id ? { ...faq, ...updates } : faq)),
    }));
  };

  const deleteSettingsFaq = (id: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
    if (settingsOpenFaqId === id) setSettingsOpenFaqId(null);
  };

  type TextListField = "tags" | "badges" | "aboutHighlights" | "objectives" | "prerequisites" | "targetAudience" | "benefits";

  const addTextItem = (field: TextListField, fallback: string) => {
    setSettingsForm((prev) => ({ ...prev, [field]: [...prev[field], fallback] }));
  };

  const updateTextItem = (field: TextListField, index: number, value: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, idx) => (idx === index ? value : item)),
    }));
  };

  const removeTextItem = (field: TextListField, index: number) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index),
    }));
  };

  const moveTextItem = (field: TextListField, index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    const list = settingsForm[field];
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setSettingsForm((prev) => ({ ...prev, [field]: next }));
  };

  const updateSpecialWord = (field: "highlighted" | "underlined", index: number, value: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      specialWords: {
        ...prev.specialWords,
        [field]: prev.specialWords[field].map((item, idx) => (idx === index ? value : item)),
      },
    }));
  };

  const addSpecialWord = (field: "highlighted" | "underlined") => {
    setSettingsForm((prev) => ({
      ...prev,
      specialWords: {
        ...prev.specialWords,
        [field]: [...prev.specialWords[field], field === "highlighted" ? "کلمه ویژه" : "کلمه خط‌دار"],
      },
    }));
  };

  const removeSpecialWord = (field: "highlighted" | "underlined", index: number) => {
    setSettingsForm((prev) => ({
      ...prev,
      specialWords: {
        ...prev.specialWords,
        [field]: prev.specialWords[field].filter((_, idx) => idx !== index),
      },
    }));
  };

  const addFeatureItem = () => {
    setSettingsForm((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { id: `FEAT-${Date.now()}`, title: "ویژگی جدید", icon: "star", color: "primary", description: "" },
      ],
    }));
  };

  const updateFeatureItem = (index: number, updates: Partial<SettingsFeature>) => {
    setSettingsForm((prev) => ({
      ...prev,
      features: prev.features.map((item, idx) => (idx === index ? { ...item, ...updates } : item)),
    }));
  };

  const removeFeatureItem = (index: number) => {
    setSettingsForm((prev) => ({ ...prev, features: prev.features.filter((_, idx) => idx !== index) }));
  };

  const moveFeatureItem = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= settingsForm.features.length) return;
    const next = [...settingsForm.features];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setSettingsForm((prev) => ({ ...prev, features: next }));
  };

  const addFaqItem = () => {
    setSettingsForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id: `FAQ-${Date.now()}`, question: "سوال جدید", answer: "پاسخ را اینجا بنویسید." }],
    }));
  };

  const updateFaqItem = (index: number, updates: Partial<SettingsFaq>) => {
    setSettingsForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, idx) => (idx === index ? { ...item, ...updates } : item)),
    }));
  };

  const removeFaqItem = (index: number) => {
    setSettingsForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, idx) => idx !== index) }));
  };

  const moveFaqItem = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= settingsForm.faqs.length) return;
    const next = [...settingsForm.faqs];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setSettingsForm((prev) => ({ ...prev, faqs: next }));
  };

  const handleSettingsMediaUpload = (field: "cover" | "introVideo", file?: File) => {
    if (!file) return;
    if (field === "cover") {
      // Same persistable path as create wizard (data URL stored in draft/cover column).
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm((prev) => ({ ...prev, cover: String(reader.result || prev.cover) }));
      };
      reader.readAsDataURL(file);
      return;
    }

    void (async () => {
      try {
        const uploadedUrl = await uploadCourseMediaFile(course.id, file, "intro");
        setSettingsForm((prev) => ({ ...prev, introVideo: uploadedUrl }));
        showToast("ویدیوی معرفی آپلود شد.", "success");
      } catch {
        showToast("آپلود ویدیوی معرفی انجام نشد.", "error");
      }
    })();
  };

  const buildSettingsDraftChapters = () =>
    serializeChaptersForDraft(course.chapters, lessonVideoMap, lessonDescriptionMap, lessonFileMap);

  // Persist Full Course Settings to the same drafts API the create wizard uses.
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingSettings) return;

    const finalPrice = settingsForm.pricingType === "free" ? 0 : settingsForm.price;
    const durationHours = Math.max(0, Number(settingsForm.duration || 0) || 0);
    const persistableCover =
      settingsForm.cover && !settingsForm.cover.startsWith("blob:") ? settingsForm.cover : course.cover;
    const persistableIntro =
      settingsForm.introVideo && !settingsForm.introVideo.startsWith("blob:")
        ? settingsForm.introVideo
        : course.introVideo || "";

    setIsSavingSettings(true);
    try {
      await apiPostNoMock(
        "/api/instructor-dashboard/courses/drafts",
        {
          courseId: course.id,
          step: course.draftStep ?? 5,
          title: settingsForm.title.trim(),
          category: mapCategoryToApi(settingsForm.category),
          level: settingsForm.level,
          language: course.language || "فارسی",
          duration: String(durationHours),
          price: finalPrice,
          isPaid: settingsForm.pricingType,
          cover: persistableCover,
          introVideo: persistableIntro,
          shortDescription: settingsForm.shortDescription.trim(),
          heroTitle: settingsForm.heroTitle.trim() || settingsForm.title.trim(),
          specialWords: settingsForm.specialWords,
          aboutTitle: settingsForm.aboutTitle.trim() || "درباره این دوره",
          aboutDescription: settingsForm.aboutDescription.trim(),
          aboutHighlights: settingsForm.aboutHighlights,
          features: settingsForm.features.map((feature) => ({
            id: feature.id,
            title: feature.title,
            icon: feature.icon,
            color: feature.color,
          })),
          chapters: buildSettingsDraftChapters(),
          faqs: settingsForm.faqs.map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          })),
        },
        getAuthHeaders()
      );

      // Reload from backend so the form reflects persisted columns + draftData.
      let response: unknown;
      try {
        response = await apiGetNoMock<unknown>(
          `/api/instructor-dashboard/courses/${encodeURIComponent(course.id)}`,
          getAuthHeaders()
        );
      } catch {
        response = await apiGetNoMock<unknown>(
          `/api/instructor-dashboard/courses/${encodeURIComponent(course.id)}/draft`,
          getAuthHeaders()
        );
      }
      const mapped = mapInstructorCourseApiToCourse(response);
      if (mapped) {
        upsertCourseSilent(mapped);
      } else {
        upsertCourseSilent({
          ...course,
          title: settingsForm.title.trim(),
          category: settingsForm.category,
          level: settingsForm.level,
          cover: persistableCover,
          introVideo: persistableIntro || undefined,
          shortDescription: settingsForm.shortDescription.trim(),
          description: settingsForm.aboutDescription.trim(),
          price: finalPrice,
          heroTitle: settingsForm.heroTitle.trim() || settingsForm.title.trim(),
          aboutTitle: settingsForm.aboutTitle.trim() || "درباره این دوره",
          aboutDescription: settingsForm.aboutDescription.trim(),
          aboutHighlights: settingsForm.aboutHighlights,
          features: settingsForm.features,
          faqs: settingsForm.faqs,
          specialWords: settingsForm.specialWords,
          durationHours,
          pricingType: settingsForm.pricingType,
        });
      }
      showToast("تنظیمات دوره در سرور ذخیره شد.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "خطا در ذخیره تنظیمات دوره";
      showToast(message, "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const settingsInputClass =
    "px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right";

  const renderSettingsHeader = (title: string, description: string) => (
    <div className="space-y-1 border-b border-gray-100 dark:border-white/5 pb-4">
      <h3 className="text-base font-black text-gray-900 dark:text-white">{title}</h3>
      <p className="text-[11px] font-bold leading-6 text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );

  const renderTextList = (field: TextListField, label: string, emptyText: string) => {
    const list = settingsForm[field];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-black text-gray-800 dark:text-gray-200">{label}</label>
          <button type="button" onClick={() => addTextItem(field, emptyText)} className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-[10px] font-black text-primary">
            <Plus className="w-3.5 h-3.5" />
            افزودن
          </button>
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.03] px-4 py-6 text-center text-[11px] font-bold text-gray-400">
            هنوز موردی ثبت نشده است.
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((item, index) => (
              <div key={`${field}-${index}`} className="flex items-center gap-2 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-2">
                <input value={item} onChange={(e) => updateTextItem(field, index, e.target.value)} className="flex-1 bg-transparent px-2 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none" />
                <button type="button" onClick={() => moveTextItem(field, index, "up")} disabled={index === 0} className="size-8 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => moveTextItem(field, index, "down")} disabled={index === list.length - 1} className="size-8 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => removeTextItem(field, index)} className="size-8 rounded-xl border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 inline-flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* Back to courses */}
      <button
        onClick={() => router.push("/instructor/courses")}
        className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-bold mb-6 hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به لیست دوره‌ها</span>
      </button>

      {/* 1. Course Header Card */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Cover */}
          <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-200 dark:bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 text-center md:text-right space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black tracking-wider bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                course.status === "published"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  : course.status === "draft"
                  ? "bg-gray-500/10 text-gray-400 border border-gray-500/15"
                  : course.status === "pending"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                  : "bg-red-500/10 text-red-400 border border-red-500/15"
              }`}>
                {course.status === "published" && "منتشر شده"}
                {course.status === "draft" && "پیش‌نویس"}
                {course.status === "pending" && "در انتظار بررسی"}
                {course.status === "inactive" && "غیرفعال"}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-relaxed truncate">
              {course.title}
            </h1>

            <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-2xl line-clamp-2">
              {course.shortDescription}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
              <span>{course.chapters.length} فصل</span>
              <span>•</span>
              <span>{lessonsCount} درس</span>
              <span>•</span>
              <span>آخرین بروزرسانی: {course.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Tabs navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-100 dark:border-white/5 pb-px mb-8 scrollbar-hide">
        {[
          { id: "overview", label: "نمای کلی", icon: GraduationCap },
          { id: "content", label: "فصل‌ها و محتوا", icon: Layers },
          { id: "students", label: "دانشجویان دوره", icon: Users },
          { id: "settings", label: "تنظیمات دوره", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer",
                activeTab === tab.id
                  ? "border-primary text-primary font-black bg-primary/5 rounded-t-xl"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-t-xl"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Tab Component renders */}
      <div className="min-h-[400px]">
        
        {/* --- TAB: OVERVIEW --- */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in duration-300">
            <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl p-6 md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm md:text-base font-black text-gray-900 dark:text-white">شاخص‌های عملکرد دوره</h3>
                <span className="text-[10px] font-bold text-gray-400">به‌روزرسانی زنده از وضعیت دوره</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                <div className="group rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-500 font-bold">کل درآمد دوره</span>
                    <CircleDollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{course.revenue.toLocaleString("fa-IR")} تومان</p>
                </div>

                <div className="group rounded-2xl p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-500 font-bold">دانشجویان ثبت‌نامی</span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{course.studentsCount.toLocaleString("fa-IR")} نفر</p>
                </div>

                <div className="group rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-400/20 hover:border-amber-400/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-500 font-bold">میانگین امتیازات</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{course.rating.toLocaleString("fa-IR")} <span className="text-[10px] text-gray-400 font-normal">/ ۵</span></p>
                </div>

                <div className="group rounded-2xl p-5 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-gray-500 font-bold">میانگین تکمیل دوره</span>
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{course.completionRate.toLocaleString("fa-IR")}٪</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: CONTENT MANAGER (Chapters & Lessons) --- */}
        {activeTab === "content" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">ساختار سرفصل‌ها و درس‌ها</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  تغییرات فقط محلی اعمال می‌شوند؛ با «ذخیره تغییرات» همه را یکجا روی سرور بفرستید.
                </p>
              </div>
              {(hasUnsavedContentChanges() || isSavingContent) && (
                <button
                  type="button"
                  onClick={() => {
                    void saveContentChanges();
                  }}
                  disabled={isSavingContent}
                  className="h-11 shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-black text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  <UploadCloud className="w-4 h-4" />
                  {isSavingContent ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              )}
            </div>

            <div className="p-5 md:p-6 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-3xl border border-gray-200/70 dark:border-white/10 space-y-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
              <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">سرفصل‌ها و جلسات درسی</span>

              <div className="flex justify-end">
                {!isAddingChapter ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingChapter(true)}
                    className="h-11 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن سرفصل جدید
                  </button>
                ) : (
                  <form onSubmit={handleAddChapterSubmit} className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      required
                      placeholder="عنوان سرفصل..."
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      disabled={isSavingContent}
                      className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right w-full sm:w-60"
                    />
                    <button type="submit" disabled={isSavingContent} className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl disabled:opacity-60 cursor-pointer">
                      افزودن
                    </button>
                    <button type="button" onClick={() => setIsAddingChapter(false)} className="px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 rounded-xl">لغو</button>
                  </form>
                )}
              </div>

              <div className="rounded-2xl bg-white/80 dark:bg-[#171a22] border border-gray-200/70 dark:border-white/10 p-3 md:p-4">
                <div className="flex items-center justify-between border-b border-gray-200/70 dark:border-white/10 pb-2.5 mb-3">
                  <span className="text-xs font-black text-gray-900 dark:text-white">لیست فصل‌ها و جلسات</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{course.chapters.length} فصل</span>
                </div>
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {course.chapters.map((ch, chIdx) => {
                    const isExpanded = !!expandedChapters[ch.id];
                    const isDragging = draggedChapterId === ch.id;
                    const isDropTarget =
                      !draggedLesson &&
                      dragOverChapterId === ch.id &&
                      draggedChapterId !== ch.id;
                    const isLessonDropChapter =
                      !!draggedLesson &&
                      dragOverChapterId === ch.id &&
                      draggedLesson.chapterId !== ch.id;
                    return (
                      <div
                        key={ch.id}
                        className={cn(
                          "p-3.5 bg-white dark:bg-[#1a1c23] rounded-2xl border space-y-3 transition-all",
                          isDragging
                            ? "opacity-50 border-primary/50 ring-2 ring-primary/20"
                            : isDropTarget || isLessonDropChapter
                              ? "border-primary/60 ring-2 ring-primary/20 border-dashed"
                              : "border-gray-200/70 dark:border-white/10"
                        )}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (isSavingContent) return;
                          if (draggedLesson || draggedChapterId) {
                            if (dragOverChapterId !== ch.id) setDragOverChapterId(ch.id);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedLesson) {
                            if (draggedLesson.chapterId !== ch.id || !dragOverLesson) {
                              reorderLessons(
                                draggedLesson.chapterId,
                                draggedLesson.lessonId,
                                ch.id
                              );
                            }
                          } else if (draggedChapterId) {
                            reorderChapters(draggedChapterId, ch.id);
                          }
                          setDraggedChapterId(null);
                          setDragOverChapterId(null);
                          setDraggedLesson(null);
                          setDragOverLesson(null);
                        }}
                        onDragLeave={(e) => {
                          const next = e.relatedTarget as Node | null;
                          if (!next || !e.currentTarget.contains(next)) {
                            setDragOverChapterId((prev) => (prev === ch.id ? null : prev));
                          }
                        }}
                      >
                        <div className="flex items-center justify-between border-b dark:border-white/5 pb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black mr-1 shrink-0">{chIdx + 1}</span>
                            {editingChapterTitleId === ch.id ? (
                              <input
                                autoFocus
                                value={chapterTitleDraft}
                                onChange={(e) => setChapterTitleDraft(e.target.value)}
                                onBlur={() => commitChapterTitle(ch.id, ch.title)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitChapterTitle(ch.id, ch.title);
                                }}
                                className="h-8 px-2 rounded-lg border border-blue-500/40 bg-white dark:bg-white/5 text-[10px] font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingChapterTitleId(ch.id);
                                  setChapterTitleDraft(ch.title);
                                }}
                                className="text-[10px] font-black text-gray-900 dark:text-white hover:text-primary transition-colors cursor-text truncate"
                              >
                                {ch.title}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button type="button" onClick={() => toggleChapter(ch.id)} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all" title={isExpanded ? "بستن فصل" : "باز کردن فصل"}>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${!isExpanded ? "-rotate-90" : ""}`} />
                            </button>
                            <button
                              type="button"
                              draggable={!isSavingContent}
                              aria-label="جابجایی فصل"
                              title="برای جابجایی بکشید"
                              onDragStart={(e) => {
                                if (isSavingContent) {
                                  e.preventDefault();
                                  return;
                                }
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", ch.id);
                                setDraggedChapterId(ch.id);
                                setDragOverChapterId(ch.id);
                                setDraggedLesson(null);
                                setDragOverLesson(null);
                              }}
                              onDragEnd={() => {
                                setDraggedChapterId(null);
                                setDragOverChapterId(null);
                                setDraggedLesson(null);
                                setDragOverLesson(null);
                              }}
                              disabled={isSavingContent}
                              className={cn(
                                "size-7 inline-flex items-center justify-center rounded-lg border transition-all disabled:opacity-40",
                                isDragging
                                  ? "cursor-grabbing border-primary/40 bg-primary/10 text-primary"
                                  : "cursor-grab active:cursor-grabbing border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-primary/30"
                              )}
                              style={{ touchAction: "none" }}
                            >
                              <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleChapterAccess(ch.id)}
                              disabled={isSavingContent || ch.lessons.length === 0}
                              title={
                                ch.lessons.length === 0 || ch.lessons.every((lesson) => !lesson.isFree)
                                  ? "باز کردن همه ویدیوهای این فصل"
                                  : "قفل کردن همه ویدیوهای این فصل"
                              }
                              className={cn(
                                "h-7 px-2.5 inline-flex items-center gap-1 rounded-lg border text-[9px] font-black disabled:opacity-40",
                                ch.lessons.length === 0 || ch.lessons.every((lesson) => !lesson.isFree)
                                  ? "border-amber-200/80 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-400"
                                  : "border-emerald-200/80 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                              )}
                            >
                              {ch.lessons.length === 0 || ch.lessons.every((lesson) => !lesson.isFree) ? (
                                <>
                                  <Lock className="w-3 h-3" />
                                  فصل قفل
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3" />
                                  فصل باز
                                </>
                              )}
                            </button>
                            <button type="button" onClick={() => moveChapter(chIdx, "up")} disabled={chIdx === 0 || isSavingContent} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => moveChapter(chIdx, "down")} disabled={chIdx === course.chapters.length - 1 || isSavingContent} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => openDeleteConfirm("حذف فصل", "با حذف فصل، تمام جلسات داخل آن حذف می‌شوند. ادامه می‌دهید؟", () => { void handleDeleteChapter(ch.id); })} disabled={isSavingContent} className="size-7 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 disabled:opacity-40">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => { void addLessonInline(ch.id); }} disabled={isSavingContent} className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-black disabled:opacity-40">
                              <Plus className="w-3 h-3 ml-0.5" />
                              ویدیو
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="space-y-1.5 pr-4 border-r border-gray-200/80 dark:border-white/10">
                            {ch.lessons.length === 0 ? (
                              <span className="text-[8px] text-gray-400 block font-bold">هیچ درسی به این فصل اضافه نشده است.</span>
                            ) : (
                              ch.lessons.map((les) => {
                                const lessonVideo = resolveLessonVideo(les);
                                const lessonDescription = resolveLessonDescription(les);
                                const lessonFiles = resolveLessonFiles(les);
                                const isLessonDragging =
                                  draggedLesson?.lessonId === les.id &&
                                  draggedLesson.chapterId === ch.id;
                                const isLessonDropTarget =
                                  !!draggedLesson &&
                                  dragOverLesson?.lessonId === les.id &&
                                  dragOverLesson.chapterId === ch.id &&
                                  !(
                                    draggedLesson.lessonId === les.id &&
                                    draggedLesson.chapterId === ch.id
                                  );
                                return (
                                <div
                                  key={les.id}
                                  className={cn(
                                    "flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-bold transition-all",
                                    isLessonDragging && "opacity-40 ring-2 ring-primary/25",
                                    isLessonDropTarget && "border border-dashed border-primary/50 ring-2 ring-primary/15"
                                  )}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!draggedLesson || isSavingContent) return;
                                    if (
                                      dragOverLesson?.lessonId !== les.id ||
                                      dragOverLesson.chapterId !== ch.id
                                    ) {
                                      setDragOverLesson({ chapterId: ch.id, lessonId: les.id });
                                    }
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!draggedLesson || isSavingContent) return;
                                    reorderLessons(
                                      draggedLesson.chapterId,
                                      draggedLesson.lessonId,
                                      ch.id,
                                      les.id
                                    );
                                    setDraggedLesson(null);
                                    setDragOverLesson(null);
                                    setDragOverChapterId(null);
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <button
                                      type="button"
                                      draggable={!isSavingContent}
                                      aria-label="جابجایی ویدیو"
                                      title="برای جابجایی بکشید"
                                      onDragStart={(e) => {
                                        if (isSavingContent) {
                                          e.preventDefault();
                                          return;
                                        }
                                        e.stopPropagation();
                                        e.dataTransfer.effectAllowed = "move";
                                        e.dataTransfer.setData("text/plain", les.id);
                                        setDraggedLesson({ chapterId: ch.id, lessonId: les.id });
                                        setDragOverLesson({ chapterId: ch.id, lessonId: les.id });
                                        setDraggedChapterId(null);
                                      }}
                                      onDragEnd={() => {
                                        setDraggedLesson(null);
                                        setDragOverLesson(null);
                                        setDragOverChapterId(null);
                                      }}
                                      disabled={isSavingContent}
                                      className={cn(
                                        "size-6 inline-flex items-center justify-center rounded-md border transition-all shrink-0 disabled:opacity-40",
                                        isLessonDragging
                                          ? "cursor-grabbing border-primary/40 bg-primary/10 text-primary"
                                          : "cursor-grab active:cursor-grabbing border-gray-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-primary/30"
                                      )}
                                      style={{ touchAction: "none" }}
                                    >
                                      <span className="material-symbols-outlined text-[13px]">drag_indicator</span>
                                    </button>
                                    <span className="material-symbols-outlined text-xs text-primary">{les.isFree ? "play_circle" : "lock"}</span>
                                    {editingLessonTitleId === les.id ? (
                                      <input
                                        autoFocus
                                        value={lessonTitleDraft}
                                        onChange={(e) => setLessonTitleDraft(e.target.value)}
                                        onBlur={() => commitLessonTitle(ch.id, les.id, les.title)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") commitLessonTitle(ch.id, les.id, les.title);
                                        }}
                                        className="h-7 px-2 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[9px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingLessonTitleId(les.id);
                                          setLessonTitleDraft(les.title);
                                        }}
                                        className="text-[9px] font-bold hover:text-primary transition-colors cursor-text truncate"
                                      >
                                        {les.title}
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => { void toggleLessonFree(ch.id, les.id, les.isFree); }}
                                      disabled={isSavingContent}
                                      title={les.isFree ? "ویدیو باز است — کلیک برای قفل" : "ویدیو قفل است — کلیک برای باز کردن"}
                                      className={`h-6 px-2 inline-flex items-center gap-1 justify-center rounded-md border text-[8px] font-black disabled:opacity-40 ${
                                        les.isFree
                                          ? "border-emerald-200/80 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                                          : "border-amber-200/80 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-400"
                                      }`}
                                    >
                                      {les.isFree ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                      {les.isFree ? "باز" : "قفل"}
                                    </button>
                                    <span
                                      dir="ltr"
                                      title="مدت زمان از روی ویدیو محاسبه می‌شود"
                                      className="text-[8px] opacity-75 font-mono tabular-nums select-none"
                                    >
                                      {les.duration}
                                    </span>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-emerald-200/70 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-500/10">
                                      {!lessonVideo && (
                                        <label className="size-6 inline-flex items-center justify-center rounded-md border border-blue-200/80 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all cursor-pointer overflow-hidden" title="انتخاب ویدیو">
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            disabled={isSavingContent || typeof lessonUploadProgress[les.id] === "number"}
                                            onChange={(e) => {
                                              handleLessonVideoSelect(les.id, e.target.files?.[0]);
                                              e.currentTarget.value = "";
                                            }}
                                          />
                                          {typeof lessonUploadProgress[les.id] === "number" ? (
                                            <span className="text-[8px] font-black leading-none">{lessonUploadProgress[les.id]}%</span>
                                          ) : (
                                            <Video className="w-3.5 h-3.5" />
                                          )}
                                        </label>
                                      )}
                                      {lessonVideo && typeof lessonUploadProgress[les.id] !== "number" && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setLessonVideoPreview({
                                                open: true,
                                                title: les.title,
                                                url: lessonVideo.url,
                                              })
                                            }
                                            className="h-6 px-2 inline-flex items-center justify-center gap-1 rounded-md border border-emerald-200/80 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-[8px] font-black cursor-pointer"
                                            title="مشاهده ویدیو"
                                          >
                                            <Play className="w-3 h-3 fill-current" />
                                            مشاهده
                                          </button>
                                          {hasPendingLessonVideo(les.id) && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                void saveContentChanges();
                                              }}
                                              disabled={isSavingContent}
                                              className="h-6 px-2 inline-flex items-center justify-center gap-1 rounded-md border border-primary/40 bg-primary text-white hover:bg-primary/90 transition-all text-[8px] font-black cursor-pointer disabled:opacity-50"
                                              title="ذخیره تغییرات روی سرور"
                                            >
                                              <UploadCloud className="w-3 h-3" />
                                              ذخیره
                                            </button>
                                          )}
                                          <label className="size-6 inline-flex items-center justify-center rounded-md border border-blue-200/80 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all cursor-pointer" title="انتخاب / تعویض ویدیو">
                                            <input
                                              type="file"
                                              accept="video/*"
                                              className="hidden"
                                              disabled={isSavingContent}
                                              onChange={(e) => {
                                                handleLessonVideoSelect(les.id, e.target.files?.[0]);
                                                e.currentTarget.value = "";
                                              }}
                                            />
                                            <Video className="w-3.5 h-3.5" />
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openDeleteConfirm("حذف ویدیو", "آیا از حذف ویدیوی این جلسه مطمئن هستید؟", () => {
                                                void removeLessonVideo(les.id);
                                              })
                                            }
                                            disabled={isSavingContent}
                                            className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-40"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-amber-200/70 dark:border-amber-400/20 bg-amber-50/40 dark:bg-amber-500/10">
                                      <button
                                        type="button"
                                        onClick={() => setLessonFilesModal({ open: true, lessonId: les.id })}
                                        className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-amber-200/80 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all text-[8px] font-black cursor-pointer"
                                      >
                                        فایل ({lessonFiles.length})
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setLessonDescriptionEditor({
                                            open: true,
                                            lessonId: les.id,
                                            value: lessonDescription,
                                          })
                                        }
                                        className={`h-6 px-2 inline-flex items-center justify-center rounded-md border transition-all text-[8px] font-black cursor-pointer ${
                                          lessonDescription
                                            ? "border-indigo-200/80 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                                            : "border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                        }`}
                                      >
                                        توضیح
                                      </button>
                                    </div>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-red-200/70 dark:border-red-400/20 bg-red-50/40 dark:bg-red-500/10">
                                      <button type="button" onClick={() => openDeleteConfirm("حذف جلسه", "آیا از حذف این جلسه مطمئن هستید؟", () => { void handleDeleteLesson(ch.id, les.id); })} disabled={isSavingContent} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-40">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: STUDENTS --- */}
        {activeTab === "students" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {(() => {
              const filteredStudents = courseStudents
                .filter((st) => {
                  if (studentProgressFilter === "high") return st.progress >= 70;
                  if (studentProgressFilter === "mid") return st.progress >= 40 && st.progress < 70;
                  if (studentProgressFilter === "low") return st.progress < 40;
                  return true;
                })
                .sort((a, b) => {
                  const aTime = Date.parse(a.enrolledAt || "");
                  const bTime = Date.parse(b.enrolledAt || "");
                  if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
                  return studentDateSort === "newest" ? bTime - aTime : aTime - bTime;
                });

              return (
                <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">دانشجویان ثبت‌نامی</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  لیست شرکت‌کنندگان در دوره و پیشرفت تماشای ویدیوها توسط آن‌ها
                </p>
              </div>
              <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[46px]">
                <CustomSelect
                  options={studentProgressFilterOptions}
                  value={studentProgressFilter}
                  onChange={setStudentProgressFilter}
                  placeholder="پیشرفت"
                  size="md"
                  className={filterSelectClassName}
                  icon={<Filter className="h-4 w-4" />}
                />
                <CustomSelect
                  options={studentDateSortOptions}
                  value={studentDateSort}
                  onChange={setStudentDateSort}
                  placeholder="مرتب‌سازی"
                  size="md"
                  className={filterSelectClassName}
                  icon={<ArrowUpDown className="h-4 w-4" />}
                />
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.03] px-6 py-12 text-center">
                <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-700 dark:text-gray-300">هنوز دانشجویی در این دوره ثبت‌نام نکرده است.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-5 flex items-center gap-4 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                    {st.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={st.avatar} alt={st.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-primary w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2 text-right">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{st.name}</h4>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                        st.status === "فعال" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {st.status}
                      </span>
                    </div>

                    <p className="text-[8px] text-gray-400 font-bold">ثبت‌نام: {st.date}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-gray-400">
                        <span>میزان پیشرفت:</span>
                        <span>{st.progress.toLocaleString("fa-IR")}٪</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${st.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
                </>
              );
            })()}
          </div>
        )}

        {/* --- TAB: REVIEWS & REPLIES --- */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">نظرات و بازخوردهای دانشجویان</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                نظرات دانشجویان درباره دوره را بخوانید و به آن‌ها پاسخ دهید.
              </p>
            </div>

            {course.reviews.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400">هنوز هیچ دیدگاهی برای این دوره ثبت نشده است.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {course.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 space-y-4"
                  >
                    {/* User and rating header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          {rev.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rev.avatar} alt={rev.studentName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-primary w-5 h-5" />
                          )}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-black text-gray-900 dark:text-white">{rev.studentName}</h4>
                          <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">{rev.createdAt}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4 shrink-0",
                              i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 dark:text-white/10"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 leading-relaxed text-right p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5">
                      {rev.comment}
                    </p>

                    {/* Instructor Reply Display if exists */}
                    {rev.reply ? (
                      <div className="pr-6 border-r-2 border-primary bg-primary/5 p-4 rounded-l-2xl space-y-2 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary text-white">پاسخ مدرس</span>
                          <span className="text-[9px] font-black text-gray-900 dark:text-white">{rev.reply.instructorName}</span>
                          <span className="text-[8px] text-gray-400 font-bold">{rev.reply.createdAt}</span>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                          {rev.reply.text}
                        </p>
                      </div>
                    ) : (
                      // Reply form button
                      <div className="flex justify-end pt-2">
                        {activeReviewReplyId !== rev.id ? (
                          <button
                            onClick={() => {
                              setActiveReviewReplyId(rev.id);
                              setReviewReplyText("");
                            }}
                            className="px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary text-[10px] font-black rounded-xl transition-all cursor-pointer"
                          >
                            پاسخ دادن به دیدگاه
                          </button>
                        ) : (
                          <div className="w-full flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                            <textarea
                              rows={3}
                              placeholder="پاسخ خود را به عنوان مدرس بنویسید..."
                              value={reviewReplyText}
                              onChange={(e) => setReviewReplyText(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleReviewReplySubmit(rev.id)}
                                className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                              >
                                ارسال پاسخ
                              </button>
                              <button
                                onClick={() => setActiveReviewReplyId("")}
                                className="px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 text-[10px] rounded-xl"
                              >
                                لغو
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

                {/* --- TAB: TECHNICAL QUESTIONS --- */}
        {activeTab === "questions" && (
          <InstructorQuestionsBoard
            showHero={false}
            filterCourseId={course.id}
            className="max-w-none pb-2"
          />
        )}

        {/* --- TAB: SECTIONED COURSE SETTINGS EDITOR --- */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-5 md:p-8 animate-in fade-in duration-300">
            <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 dark:border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">تنظیمات کامل دوره</h2>
                <p className="mt-1 text-[11px] font-bold leading-6 text-gray-500 dark:text-gray-400">
                  تمام بخش‌های دوره بعد از انتشار از همین صفحه مدیریت می‌شوند.
                </p>
              </div>
              <button
                type="submit"
                disabled={isSavingSettings}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-black text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {isSavingSettings ? "در حال ذخیره..." : "ذخیره همه تغییرات"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="h-fit rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.03] p-2 xl:sticky xl:top-24">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSettingsSection === section.id;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSettingsSection(section.id)}
                        className={cn(
                          "flex items-center justify-start gap-2 rounded-xl px-3 py-2.5 text-[10px] font-black transition-all",
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/15"
                            : "text-gray-500 hover:bg-white dark:hover:bg-white/5 dark:text-gray-400"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="min-w-0 space-y-6">
                {activeSettingsSection === "card" && (
                  <section className="space-y-5">
                    {renderSettingsHeader("اطلاعات اولیه کارت دوره", "این اطلاعات در لیست دوره‌ها و کارت کوچک دوره نمایش داده می‌شود.")}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام دوره <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="مثال: استایل‌دهی با CSS"
                          value={settingsForm.title}
                          onChange={(e) => handleSettingsTitleChange(e.target.value)}
                          className={settingsInputClass}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">شناسه (Slug) دوره</label>
                        <input
                          type="text"
                          placeholder="css-styling"
                          value={settingsForm.slug}
                          onChange={(e) => setSettingsForm((prev) => ({ ...prev, slug: e.target.value }))}
                          className={`${settingsInputClass} text-left`}
                          dir="ltr"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">دسته‌بندی اصلی</label>
                        <CustomSelect
                          value={settingsForm.category}
                          onChange={(value) => setSettingsForm((prev) => ({ ...prev, category: value as CourseCategory }))}
                          options={[
                            { value: "Frontend", label: "Frontend (فرانت‌اند)" },
                            { value: "Backend", label: "Backend (بک‌اند)" },
                            { value: "DevOps", label: "DevOps (دواپس)" },
                            { value: "Mobile", label: "Mobile (موبایل)" },
                            { value: "UI/UX", label: "UI/UX (رابط کاربری)" },
                          ]}
                          size="sm"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">سطح آموزشی دوره</label>
                        <CustomSelect
                          value={settingsForm.level}
                          onChange={(value) => setSettingsForm((prev) => ({ ...prev, level: value as CourseLevel }))}
                          options={[
                            { value: "elementary", label: "مقدماتی" },
                            { value: "intermediate", label: "متوسط" },
                            { value: "advanced", label: "پیشرفته" },
                          ]}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت قیمت دوره</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "free", label: "رایگان" },
                          { id: "paid", label: "نقدی (پولی)" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSettingsForm((prev) => ({ ...prev, pricingType: item.id as "free" | "paid" }))}
                            className={cn(
                              "rounded-xl border p-3 text-xs font-black transition-all",
                              settingsForm.pricingType === item.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-gray-200/60 bg-gray-50 text-gray-600 hover:border-primary/20 dark:border-white/5 dark:bg-white/5 dark:text-gray-400"
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex flex-1 flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مدت زمان دوره <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="18"
                            value={settingsForm.duration}
                            onChange={(e) => handleSettingsDurationChange(e.target.value)}
                            className={`${settingsInputClass} w-full pl-14 text-left`}
                            dir="ltr"
                          />
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">ساعت</span>
                        </div>
                      </div>

                      {settingsForm.pricingType === "paid" && (
                        <div className="flex flex-1 flex-col gap-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت دوره (به تومان) <span className="text-red-500">*</span></label>
                          <div className="relative flex items-center" dir="ltr">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="1450000"
                              value={settingsForm.price === 0 ? "" : String(settingsForm.price)}
                              onChange={(e) => handleSettingsPriceChange(e.target.value)}
                              className={`${settingsInputClass} w-full !pr-24 !text-left`}
                              dir="ltr"
                            />
                            <span className="absolute right-4 text-xs font-bold text-gray-400">تومان</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تصویر کاور دوره</label>
                      <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-dashed border-gray-200/60 bg-gray-50/50 p-2 text-center transition-colors hover:border-primary/50 dark:border-white/5 dark:bg-white/5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSettingsMediaUpload("cover", e.target.files?.[0])}
                          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                        />
                        <div className="relative aspect-video max-h-36 w-full overflow-hidden rounded-xl">
                          {settingsForm.cover ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={settingsForm.cover} alt="کاور دوره" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
                              <div className="absolute inset-0 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100" />
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                                  <UploadCloud className="h-4 w-4" />
                                  تغییر کاور
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex h-full min-h-[9rem] flex-col items-center justify-center px-4 text-center">
                              <UploadCloud className="mb-1.5 h-7 w-7 text-gray-400" />
                              <p className="mb-1 text-[10px] font-black text-gray-700 dark:text-gray-300">انتخاب یا رها کردن تصویر کاور</p>
                              <p className="text-[9px] font-bold text-gray-400">PNG, JPG حداکثر ۵ مگابایت (اندازه 16:9)</p>
                            </div>
                          )}
                        </div>
                        {settingsForm.cover && (
                          <p className="mt-2 text-[10px] font-bold text-emerald-500">
                            تصویر فعلی ذخیره شده است و با hover قابل تعویض است.
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {activeSettingsSection === "hero" && (
                  <section className="space-y-5">
                    {renderSettingsHeader("هیرو و معرفی دوره", "این جزئیات در ابتدای صفحه اختصاصی دوره قرار دارند و نرخ تبدیل دانشجو را می‌سازند.")}

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان اصلی هیرو <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="مثال: متخصص React و Next.js"
                        value={settingsForm.heroTitle}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, heroTitle: e.target.value }))}
                        className={settingsInputClass}
                      />
                    </div>

                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/5">
                      <span className="block text-xs font-black text-gray-900 dark:text-white">کلمات ویژه عنوان (Special Words)</span>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات سبز (Highlight)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="کلمه"
                              value={settingsNewHighlightWord}
                              onChange={(e) => setSettingsNewHighlightWord(e.target.value)}
                              className="w-full rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-right text-[10px] font-bold transition-all focus:border-primary focus:outline-none dark:border-white/5 dark:bg-white/5"
                            />
                            <button type="button" onClick={() => addSettingsSpecialWord("highlighted")} className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary transition-all hover:bg-primary/20">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {settingsForm.specialWords.highlighted.map((word) => (
                              <span key={word} className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black text-emerald-500">
                                {word}
                                <button type="button" onClick={() => removeSettingsSpecialWord("highlighted", word)}>
                                  <X className="h-3 w-3 text-red-500" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات دارای خط زیرین (Underline)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="کلمه"
                              value={settingsNewUnderlineWord}
                              onChange={(e) => setSettingsNewUnderlineWord(e.target.value)}
                              className="w-full rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-right text-[10px] font-bold transition-all focus:border-primary focus:outline-none dark:border-white/5 dark:bg-white/5"
                            />
                            <button type="button" onClick={() => addSettingsSpecialWord("underlined")} className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary transition-all hover:bg-primary/20">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {settingsForm.specialWords.underlined.map((word) => (
                              <span key={word} className="inline-flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[9px] font-black text-blue-500">
                                {word}
                                <button type="button" onClick={() => removeSettingsSpecialWord("underlined", word)}>
                                  <X className="h-3 w-3 text-red-500" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">انتخاب رنگ هایلایت کلمات</label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { name: "سبز برند", val: "green", className: "bg-primary" },
                            { name: "سفید", val: "white", className: "bg-white border border-gray-200" },
                            { name: "زرد طلایی", val: "yellow", className: "bg-amber-500" },
                            { name: "آبی ملایم", val: "blue", className: "bg-blue-500" },
                          ].map((color) => (
                            <button
                              type="button"
                              key={color.val}
                              onClick={() => setSettingsForm((prev) => ({ ...prev, specialWords: { ...prev.specialWords, color: color.val } }))}
                              className={cn(
                                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-bold transition-all",
                                settingsForm.specialWords.color === color.val
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-transparent bg-white text-gray-500 hover:border-gray-200 dark:bg-white/5"
                              )}
                            >
                              <span className={`h-3.5 w-3.5 rounded-full ${color.className}`} />
                              {color.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه هیرو <span className="text-red-500">*</span></label>
                      <textarea
                        rows={3}
                        placeholder="توضیح کوتاهی که در هیرو بالای صفحه قرار می‌گیرد..."
                        value={settingsForm.shortDescription}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        className={`${settingsInputClass} leading-relaxed`}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                      <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200/60 bg-gray-50/50 p-3 text-center transition-colors hover:border-primary/50 dark:border-white/5 dark:bg-white/5">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleSettingsMediaUpload("introVideo", e.target.files?.[0])}
                          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                        />
                        {settingsForm.introVideo ? (
                          <video controls src={settingsForm.introVideo} className="h-44 w-full rounded-[1.15rem] bg-black object-cover" />
                        ) : (
                          <div className="flex min-h-[110px] flex-col items-center justify-center gap-1.5">
                            <UploadCloud className="h-8 w-8 text-gray-400" />
                            <p className="text-[11px] font-black text-gray-700 dark:text-gray-300">انتخاب یا رها کردن ویدیوی پیش‌نمایش</p>
                            <p className="text-[9px] font-bold text-gray-400">MP4, MKV حداکثر ۵۰ مگابایت</p>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                            <UploadCloud className="h-4 w-4" />
                            تغییر ویدیو
                          </div>
                        </div>
                      </div>
                      {settingsForm.introVideo && (
                        <p className="text-[10px] font-bold text-emerald-500">ویدیوی معرفی ثبت شده است و با hover قابل تعویض است.</p>
                      )}
                    </div>
                  </section>
                )}

                {activeSettingsSection === "details" && (
                  <section className="space-y-5">
                    {renderSettingsHeader("محتوای عمیق صفحه دوره", "در این مرحله ویژگی‌های متمایز، توضیحات درباره دوره و سوالات متداول را تعریف کنید.")}

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <div className="space-y-4 rounded-2xl border border-gray-200/70 bg-gradient-to-b from-gray-50/50 to-gray-50/20 p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] dark:border-white/10 dark:from-white/[0.07] dark:to-white/[0.03] md:p-5 xl:col-span-7">
                        <span className="block border-b border-gray-200/70 pb-3 text-sm font-black text-gray-900 dark:border-white/10 dark:text-white">۱. بخش درباره این دوره</span>
                        <div className="flex flex-col gap-2.5">
                          <label className="text-xs font-bold text-gray-600 dark:text-gray-300">توضیحات درباره دوره (پاراگراف‌ها) <span className="text-red-500">*</span></label>
                          <HighlightableTextareaWithBadges
                            rows={5}
                            placeholder="متن کامل درباره دوره، اهداف و شبیه‌سازی بازار کار..."
                            value={settingsForm.aboutDescription}
                            onChange={(value) => setSettingsForm((prev) => ({ ...prev, aboutDescription: value }))}
                            highlights={settingsForm.aboutHighlights}
                            onAddHighlight={(value) => {
                              const normalizedValue = value.trim();
                              if (!normalizedValue || settingsForm.aboutHighlights.includes(normalizedValue)) return;
                              setSettingsForm((prev) => ({
                                ...prev,
                                aboutHighlights: [...prev.aboutHighlights, normalizedValue],
                              }));
                            }}
                            onRemoveHighlight={removeSettingsHighlight}
                            manualValue={settingsNewHighlight}
                            onManualValueChange={setSettingsNewHighlight}
                            onManualAdd={addSettingsHighlight}
                            textareaClassName="rounded-2xl border border-gray-200/70 bg-white px-4 py-3.5 text-right text-xs font-medium leading-7 transition-all focus:border-primary focus:outline-none dark:border-white/10 dark:bg-[#1a1c23]"
                            inputClassName="w-full rounded-xl border border-gray-200/70 bg-white px-4 py-2.5 text-right text-[11px] font-bold transition-all focus:border-primary focus:outline-none dark:border-white/5 dark:bg-[#1a1c23]"
                            addButtonClassName="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/10 px-4 text-primary transition-all hover:bg-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 rounded-2xl border border-gray-200/70 bg-gradient-to-b from-gray-50/50 to-gray-50/20 p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] dark:border-white/10 dark:from-white/[0.07] dark:to-white/[0.03] md:p-5 xl:col-span-5">
                        <span className="block border-b border-gray-200/70 pb-3 text-sm font-black text-gray-900 dark:border-white/10 dark:text-white">۲. ویژگی‌های متمایز دوره</span>
                        <div className="flex flex-col gap-3.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="block text-[11px] font-black text-gray-700 dark:text-gray-200 mr-1">
                              عنوان ویژگی
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: پشتیبانی اختصاصی تلگرام"
                              value={settingsFeatureDraft.title}
                              onChange={(e) => setSettingsFeatureDraft((prev) => ({ ...prev, title: e.target.value }))}
                              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-right text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 transition-all h-[42px]"
                            />
                          </div>
                          <CustomSelect
                            label="انتخاب آیکون"
                            value={settingsFeatureDraft.icon}
                            onChange={(value) => setSettingsFeatureDraft((prev) => ({ ...prev, icon: value }))}
                            options={FEATURE_ICON_OPTIONS.map(({ value, label }) => ({ value, label }))}
                            size="sm"
                            renderValue={(option) => (
                              <span className="inline-flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-emerald-500 dark:text-emerald-400">{FEATURE_ICON_OPTIONS.find((item) => item.value === option?.value)?.icon || "help"}</span>
                                <span className="truncate font-bold">{option?.label || "انتخاب کنید..."}</span>
                              </span>
                            )}
                            renderOption={(option, selected) => {
                              const icon = FEATURE_ICON_OPTIONS.find((item) => item.value === option.value)?.icon || "help";
                              return (
                                <span className="flex w-full items-center justify-between gap-3">
                                  <span className="inline-flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-[18px] ${selected ? "text-primary dark:text-emerald-400" : "text-emerald-500 dark:text-emerald-400"}`}>{icon}</span>
                                    <span className="font-bold text-xs">{option.label}</span>
                                  </span>
                                  {selected ? <span className="material-symbols-outlined text-[16px] text-primary dark:text-emerald-400">check</span> : null}
                                </span>
                              );
                            }}
                          />
                        </div>
                        <button type="button" onClick={addOrUpdateSettingsFeature} className="flex w-full items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/10 py-2 text-[10px] font-black text-primary transition-all hover:bg-primary/20 cursor-pointer">
                          <Plus className="h-4 w-4" />
                          {settingsEditingFeatureId ? "ویرایش و ذخیره ویژگی" : "افزودن ویژگی جدید"}
                        </button>

                        <div className="mt-2 max-h-[240px] space-y-2.5 overflow-y-auto pr-1">
                          {settingsForm.features.map((feature) => (
                            <div key={feature.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-2.5 text-[10px] font-bold dark:border-white/5 dark:bg-[#1a1c23] hover:border-primary/30 transition-all hover:shadow-sm">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined flex-shrink-0 text-base text-primary">{feature.icon}</span>
                                <span>{feature.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button type="button" onClick={() => editSettingsFeature(feature)} className="inline-flex size-8 items-center justify-center rounded-lg text-blue-500 hover:bg-gray-100 dark:hover:bg-white/5">
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                                <button type="button" onClick={() => deleteSettingsFeature(feature.id)} className="inline-flex size-8 items-center justify-center rounded-lg text-red-500 hover:bg-gray-100 dark:hover:bg-white/5">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white dark:border-white/10 dark:bg-[#1c1e26]/80">
                      <div className="flex items-center justify-between border-b border-gray-200/70 px-5 py-4 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <HelpCircle className="h-4 w-4" />
                          </span>
                          <span className="text-base font-black text-gray-900 dark:text-white">۳. سوالات متداول</span>
                        </div>
                      </div>
                      <div className="space-y-4 p-5">
                        <button type="button" onClick={addSettingsFaq} className="flex w-full items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/15 py-3 text-xs font-black text-primary transition-all hover:bg-primary/20 cursor-pointer">
                          <Plus className="h-4 w-4" />
                          افزودن سوال جدید
                        </button>
                        <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                        {settingsForm.faqs.map((faq) => {
                          const isOpen = settingsOpenFaqId === faq.id;
                          return (
                            <div key={faq.id} className="rounded-[2rem] border border-gray-200/90 bg-gray-50/70 transition-all dark:border-white/10 dark:bg-white/[0.03]">
                              <div className="flex w-full items-center justify-between gap-3 px-6 py-5 text-right">
                                {isOpen ? (
                                  <input
                                    autoFocus={faq.question.length === 0}
                                    value={faq.question}
                                    onChange={(e) => updateSettingsFaq(faq.id, { question: e.target.value })}
                                    placeholder="سوال را همینجا بنویسید"
                                    className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none"
                                  />
                                ) : (
                                  <button type="button" onClick={() => setSettingsOpenFaqId(faq.id)} className="truncate text-right text-sm font-bold text-gray-900 dark:text-white">
                                    {faq.question || "سوال بدون عنوان"}
                                  </button>
                                )}
                                <div className="flex shrink-0 items-center gap-1.5">
                                  <button type="button" onClick={() => deleteSettingsFaq(faq.id)} className="inline-flex size-9 items-center justify-center rounded-full bg-gray-100 text-red-500 transition-colors hover:bg-red-50 dark:bg-white/10 dark:hover:bg-red-500/10">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button type="button" onClick={() => setSettingsOpenFaqId(isOpen ? null : faq.id)} className="inline-flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-white/10">
                                    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  </button>
                                </div>
                              </div>
                              {isOpen && (
                                <div className="space-y-3 border-t border-gray-200/70 px-6 pb-5 pt-4 dark:border-white/10">
                                  <textarea
                                    value={faq.answer}
                                    onChange={(e) => updateSettingsFaq(faq.id, { answer: e.target.value })}
                                    placeholder="پاسخ را پایین بنویسید"
                                    rows={4}
                                    className={`${settingsInputClass} leading-7`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSettingsSection === "basic" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("اطلاعات اصلی دوره", "نام، شناسه، دسته‌بندی، قیمت، کاور و توضیحات پایه دوره را ویرایش کنید.")}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام دوره</label>
                        <input value={settingsForm.title} onChange={(e) => setSettingsForm((p) => ({ ...p, title: e.target.value }))} className={settingsInputClass} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">شناسه دوره / اسلاگ</label>
                        <input value={settingsForm.slug} dir="ltr" onChange={(e) => setSettingsForm((p) => ({ ...p, slug: e.target.value }))} className={`${settingsInputClass} text-left`} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">دسته‌بندی اصلی</label>
                        <select value={settingsForm.category} onChange={(e) => setSettingsForm((p) => ({ ...p, category: e.target.value as CourseCategory }))} className={settingsInputClass}>
                          <option value="Frontend">فرانت‌اند</option>
                          <option value="Backend">بک‌اند</option>
                          <option value="DevOps">دواپس</option>
                          <option value="Mobile">موبایل</option>
                          <option value="UI/UX">رابط کاربری</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">سطح آموزشی دوره</label>
                        <select value={settingsForm.level} onChange={(e) => setSettingsForm((p) => ({ ...p, level: e.target.value as CourseLevel }))} className={settingsInputClass}>
                          <option value="elementary">مقدماتی</option>
                          <option value="intermediate">متوسط</option>
                          <option value="advanced">پیشرفته</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نوع قیمت‌گذاری</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "free", label: "رایگان" },
                            { id: "paid", label: "نقدی" },
                          ].map((item) => (
                            <button key={item.id} type="button" onClick={() => setSettingsForm((p) => ({ ...p, pricingType: item.id as "free" | "paid" }))} className={cn("rounded-2xl border px-4 py-3 text-xs font-black transition-all", settingsForm.pricingType === item.id ? "border-primary bg-primary/10 text-primary" : "border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-500")}>
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مدت زمان دوره</label>
                        <input value={settingsForm.duration} onChange={(e) => setSettingsForm((p) => ({ ...p, duration: e.target.value }))} className={settingsInputClass} />
                      </div>
                      {settingsForm.pricingType === "paid" && (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت اصلی</label>
                            <input type="number" value={settingsForm.price} dir="ltr" onChange={(e) => setSettingsForm((p) => ({ ...p, price: Number(e.target.value) }))} className={`${settingsInputClass} text-left`} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت با تخفیف</label>
                            <input type="number" value={settingsForm.discountPrice || ""} dir="ltr" onChange={(e) => setSettingsForm((p) => ({ ...p, discountPrice: Number(e.target.value) || 0 }))} className={`${settingsInputClass} text-left`} />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه</label>
                          <textarea rows={3} value={settingsForm.shortDescription} onChange={(e) => setSettingsForm((p) => ({ ...p, shortDescription: e.target.value }))} className={settingsInputClass} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیحات کامل</label>
                          <textarea rows={6} value={settingsForm.description} onChange={(e) => setSettingsForm((p) => ({ ...p, description: e.target.value }))} className={`${settingsInputClass} leading-7`} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">تصویر کاور دوره</label>
                        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSettingsMediaUpload("cover", e.target.files?.[0])}
                            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={settingsForm.cover || course.cover} alt={settingsForm.title} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                              <UploadCloud className="w-4 h-4" />
                              تغییر کاور
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSettingsSection === "intro" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("معرفی و هویت دوره", "عنوان معرفی، کلمات ویژه، متن بازاریابی و ویدیوی معرفی را مدیریت کنید.")}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان اصلی معرفی دوره</label>
                        <input value={settingsForm.heroTitle} onChange={(e) => setSettingsForm((p) => ({ ...p, heroTitle: e.target.value }))} className={settingsInputClass} />
                      </div>
                      <div className="space-y-3">
                        {renderTextList("tags", "تگ‌ها و Badge های معرفی", "تگ جدید")}
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-800 dark:text-gray-200">رنگ کلمات ویژه</label>
                        <select value={settingsForm.specialWords.color} onChange={(e) => setSettingsForm((p) => ({ ...p, specialWords: { ...p.specialWords, color: e.target.value } }))} className={settingsInputClass}>
                          <option value="green">سبز</option>
                          <option value="blue">آبی</option>
                          <option value="yellow">زرد</option>
                          <option value="pink">صورتی</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {(["highlighted", "underlined"] as const).map((field) => (
                        <div key={field} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-gray-800 dark:text-gray-200">{field === "highlighted" ? "کلمات ویژه عنوان" : "کلمات خط‌دار عنوان"}</label>
                            <button type="button" onClick={() => addSpecialWord(field)} className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-[10px] font-black text-primary">افزودن</button>
                          </div>
                          {settingsForm.specialWords[field].map((word, index) => (
                            <div key={`${field}-${index}`} className="flex items-center gap-2 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-2">
                              <input value={word} onChange={(e) => updateSpecialWord(field, index, e.target.value)} className="flex-1 bg-transparent px-2 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none" />
                              <button type="button" onClick={() => removeSpecialWord(field, index)} className="size-8 rounded-xl border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 inline-flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه معرفی دوره</label>
                      <textarea rows={4} value={settingsForm.introText} onChange={(e) => setSettingsForm((p) => ({ ...p, introText: e.target.value }))} className={`${settingsInputClass} leading-7`} />
                    </div>
                    <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-4">
                      <label className="mb-3 block text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                      <div className="group relative overflow-hidden rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <input
                          type="file"
                          accept="video/*"
                          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                          onChange={(e) => handleSettingsMediaUpload("introVideo", e.target.files?.[0])}
                        />
                        {settingsForm.introVideo ? (
                          <video controls src={settingsForm.introVideo} className="h-72 w-full bg-black object-cover" />
                        ) : (
                          <div className="flex min-h-[180px] items-center justify-center px-4 py-8 text-xs font-black text-primary">
                            <div className="flex flex-col items-center gap-2 text-center">
                              <Video className="h-6 w-6" />
                              <span>آپلود یا جایگزینی ویدیوی معرفی</span>
                            </div>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                            <UploadCloud className="h-4 w-4" />
                            تغییر ویدیو
                          </div>
                        </div>
                      </div>
                      {settingsForm.introVideo && (
                        <p className="mt-3 text-[10px] font-bold text-emerald-500">ویدیوی معرفی ثبت شده است و با hover قابل تعویض است.</p>
                      )}
                    </div>
                  </section>
                )}

                {activeSettingsSection === "page" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("محتوای صفحه دوره", "متن‌های قابل نمایش در صفحه عمومی دوره و مزیت‌های اصلی را تنظیم کنید.")}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان درباره این دوره</label>
                        <input value={settingsForm.aboutTitle} onChange={(e) => setSettingsForm((p) => ({ ...p, aboutTitle: e.target.value }))} className={settingsInputClass} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیحات قابل نمایش عمومی</label>
                        <input value={settingsForm.publicDescription} onChange={(e) => setSettingsForm((p) => ({ ...p, publicDescription: e.target.value }))} className={settingsInputClass} />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">درباره این دوره</label>
                        <textarea rows={6} value={settingsForm.aboutDescription} onChange={(e) => setSettingsForm((p) => ({ ...p, aboutDescription: e.target.value }))} className={`${settingsInputClass} leading-7`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {renderTextList("aboutHighlights", "نکات ویژه صفحه دوره", "نکته جدید")}
                      {renderTextList("benefits", "مزیت‌های دوره", "مزیت جدید")}
                      {renderTextList("badges", "Badge های دوره", "Badge جدید")}
                    </div>
                  </section>
                )}

                {activeSettingsSection === "features" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("ویژگی‌ها و مزیت‌ها", "ویژگی‌های قابل نمایش دوره را اضافه، ویرایش، حذف یا مرتب کنید.")}
                    <div className="flex justify-end">
                      <button type="button" onClick={addFeatureItem} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-black text-white cursor-pointer"><Plus className="w-4 h-4" />افزودن ویژگی جدید</button>
                    </div>
                    {settingsForm.features.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.03] px-4 py-10 text-center text-xs font-bold text-gray-400">هنوز ویژگی‌ای ثبت نشده است.</div>
                    ) : (
                      <div className="space-y-3">
                        {settingsForm.features.map((feature, index) => (
                          <div key={feature.id} className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-4">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                              <input value={feature.title} onChange={(e) => updateFeatureItem(index, { title: e.target.value })} placeholder="عنوان ویژگی" className={settingsInputClass} />
                              <input value={feature.icon} onChange={(e) => updateFeatureItem(index, { icon: e.target.value })} placeholder="آیکون" className={settingsInputClass} />
                              <input value={feature.color} onChange={(e) => updateFeatureItem(index, { color: e.target.value })} placeholder="رنگ" className={settingsInputClass} />
                              <div className="flex gap-2">
                                <button type="button" onClick={() => moveFeatureItem(index, "up")} disabled={index === 0} className="size-11 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowUp className="w-4 h-4" /></button>
                                <button type="button" onClick={() => moveFeatureItem(index, "down")} disabled={index === settingsForm.features.length - 1} className="size-11 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowDown className="w-4 h-4" /></button>
                                <button type="button" onClick={() => removeFeatureItem(index)} className="size-11 rounded-xl border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 inline-flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                              </div>
                              <textarea value={feature.description || ""} onChange={(e) => updateFeatureItem(index, { description: e.target.value })} placeholder="توضیح ویژگی" rows={2} className={`${settingsInputClass} md:col-span-4`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {activeSettingsSection === "faq" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("سوالات متداول", "سوال و پاسخ‌های صفحه دوره را به شکل آکاردئونی مدیریت کنید.")}
                    <div className="flex justify-end">
                      <button type="button" onClick={addFaqItem} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-black text-white cursor-pointer"><Plus className="w-4 h-4" />افزودن سوال جدید</button>
                    </div>
                    {settingsForm.faqs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.03] px-4 py-10 text-center text-xs font-bold text-gray-400">هنوز سوالی ثبت نشده است.</div>
                    ) : (
                      <div className="space-y-3">
                        {settingsForm.faqs.map((faq, index) => (
                          <details key={faq.id} className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-4" open={index === 0}>
                            <summary className="cursor-pointer text-xs font-black text-gray-900 dark:text-white">{faq.question || "سوال بدون عنوان"}</summary>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                              <input value={faq.question} onChange={(e) => updateFaqItem(index, { question: e.target.value })} placeholder="سوال" className={settingsInputClass} />
                              <textarea value={faq.answer} onChange={(e) => updateFaqItem(index, { answer: e.target.value })} placeholder="پاسخ" rows={4} className={`${settingsInputClass} leading-7`} />
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => moveFaqItem(index, "up")} disabled={index === 0} className="size-9 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowUp className="w-4 h-4" /></button>
                                <button type="button" onClick={() => moveFaqItem(index, "down")} disabled={index === settingsForm.faqs.length - 1} className="size-9 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 disabled:opacity-30 inline-flex items-center justify-center"><ArrowDown className="w-4 h-4" /></button>
                                <button type="button" onClick={() => removeFaqItem(index)} className="size-9 rounded-xl border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 inline-flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {activeSettingsSection === "content" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("فصل‌ها، جلسات و ویدیوها", "محتوای آموزشی با ابزار کامل مدیریت فصل و جلسه در تب محتوای دوره ویرایش می‌شود.")}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-5">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{course.chapters.length.toLocaleString("fa-IR")}</p>
                        <p className="mt-1 text-[11px] font-bold text-gray-400">فصل ثبت‌شده</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-5">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{lessonsCount.toLocaleString("fa-IR")}</p>
                        <p className="mt-1 text-[11px] font-bold text-gray-400">جلسه آموزشی</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-5">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{course.chapters.flatMap((ch) => ch.lessons).filter((les) => les.isFree).length.toLocaleString("fa-IR")}</p>
                        <p className="mt-1 text-[11px] font-bold text-gray-400">جلسه پیش‌نمایش رایگان</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
                      <p className="text-xs font-bold leading-7 text-gray-700 dark:text-gray-300">
                        برای افزودن، حذف، آپلود ویدیو، ضمیمه، توضیح جلسه و مرتب‌سازی فصل‌ها از مدیریت محتوای دوره استفاده کنید. همان ابزار داخل این صفحه فعال است و داده‌ها جداگانه حفظ می‌شوند.
                      </p>
                      <button type="button" onClick={() => setActiveTab("content")} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-black text-white">
                        رفتن به مدیریت فصل‌ها و جلسات
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </section>
                )}

                {activeSettingsSection === "lists" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("پیش‌نیازها، مخاطبین و خروجی‌ها", "لیست‌های آموزشی اصلی دوره را مدیریت کنید.")}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {renderTextList("prerequisites", "پیش‌نیازهای دوره", "پیش‌نیاز جدید")}
                      {renderTextList("targetAudience", "مخاطبین هدف دوره", "مخاطب جدید")}
                      {renderTextList("objectives", "خروجی‌های یادگیری", "خروجی جدید")}
                    </div>
                  </section>
                )}

                {activeSettingsSection === "publish" && (
                  <section className="space-y-6">
                    {renderSettingsHeader("تنظیمات انتشار و نمایش", "وضعیت انتشار، نمایش عمومی و نیاز به بررسی ادمین را کنترل کنید.")}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت دوره</label>
                        <select value={settingsForm.status} onChange={(e) => setSettingsForm((p) => ({ ...p, status: e.target.value as CourseStatus }))} className={settingsInputClass}>
                          <option value="published">منتشر شده</option>
                          <option value="draft">پیش‌نویس</option>
                          <option value="pending">در انتظار بررسی</option>
                          <option value="inactive">غیرفعال</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت نمایش عمومی</label>
                        <select value={settingsForm.visibility} onChange={(e) => setSettingsForm((p) => ({ ...p, visibility: e.target.value as SettingsForm["visibility"] }))} className={settingsInputClass}>
                          <option value="public">عمومی</option>
                          <option value="unlisted">فقط با لینک</option>
                          <option value="private">خصوصی</option>
                        </select>
                      </div>
                      <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] p-4 md:col-span-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">بعد از تغییرات مهم، دوره نیازمند بررسی ادمین باشد</span>
                        <input type="checkbox" checked={settingsForm.needsReviewAfterChanges} onChange={(e) => setSettingsForm((p) => ({ ...p, needsReviewAfterChanges: e.target.checked }))} className="h-5 w-5 accent-primary" />
                      </label>
                    </div>
                    <div className="max-w-[360px]">
                      <CourseCard
                        title={settingsForm.title}
                        instructor="مدرس اسپاتی‌کد"
                        image={settingsForm.cover || course.cover}
                        hours={settingsForm.duration || "۰"}
                        price={settingsForm.pricingType === "free" ? "رایگان" : settingsForm.discountPrice || settingsForm.price}
                        disableViewNavigation
                      />
                    </div>
                  </section>
                )}
              </div>
            </div>
          </form>
        )}

      </div>

      {/* --- STEP 5: ADD LESSON DRAWER/MODAL SYSTEM --- */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 text-right animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">افزودن درس جدید به فصل</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLessonSubmit} className="space-y-4">
              
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان درس</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رندرینگ سمت سرور (SSR) چیست؟"
                  value={newLessonData.title}
                  onChange={(e) => setNewLessonData((p) => ({ ...p, title: e.target.value }))}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نوع محتوا</label>
                  <select
                    value={newLessonData.type}
                    onChange={(e) => setNewLessonData((p) => ({ ...p, type: e.target.value as Lesson["type"] }))}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right cursor-pointer"
                  >
                    <option value="video">ویدیو آموزشی</option>
                    <option value="pdf">سند PDF</option>
                    <option value="exercise">تمرین عملی</option>
                    <option value="text">متن ساده</option>
                    <option value="quiz">کوییز تستی</option>
                  </select>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                    مدت زمان بعد از آپلود ویدیو به‌صورت خودکار محاسبه می‌شود.
                  </p>
                </div>

              {/* Free preview check */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLessonData.isFree}
                    onChange={(e) => setNewLessonData((p) => ({ ...p, isFree: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">این جلسه رایگان (پیش‌نمایش) است</span>
                </label>
              </div>

              {/* Premium Drag and drop simulated file upload box */}
              {(newLessonData.type === "video" || newLessonData.type === "pdf") && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">آپلود فایل ضمیمه درس</label>
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[140px] text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept={newLessonData.type === "video" ? "video/*" : "application/pdf"}
                      onChange={handleNewLessonFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {lessonProgress === 0 ? (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-[9px] font-black text-gray-700 dark:text-gray-300">
                          فایل خود را به اینجا بکشید یا انتخاب کنید
                        </p>
                        <p className="text-[8px] text-gray-400">حداکثر حجم ۳۰۰ مگابایت</p>
                      </>
                    ) : lessonProgress < 100 ? (
                      <div className="w-full space-y-2 px-4 z-20">
                        <div className="flex justify-between text-[8px] text-gray-400">
                          <span>در حال آپلود...</span>
                          <span>{lessonProgress}٪</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${lessonProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl z-20 text-[9px] font-bold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>فایل آپلود شد: {lessonFile?.name} ({newLessonData.fileSize})</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLessonProgress(0);
                            setLessonFile(null);
                            setNewLessonData((p) => ({ ...p, fileName: "", fileSize: "" }));
                          }}
                          className="p-1 hover:bg-emerald-500/20 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-white/5 pt-4 mt-6">
                <button type="submit" className="px-5 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer">
                  افزودن درس
                </button>
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-500 text-[10px] rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <VideoPreviewModal
        open={lessonVideoPreview.open}
        title={lessonVideoPreview.title || "پیش‌نمایش ویدیو"}
        videoUrl={lessonVideoPreview.url}
        onClose={() => setLessonVideoPreview({ open: false, title: "", url: "" })}
      />

      {lessonVideoPreview.open &&
        lessonVideoPreview.url.startsWith("blob:") &&
        (() => {
          const pendingLessonId =
            Object.entries(lessonVideoMap).find(([, entry]) => entry.url === lessonVideoPreview.url)?.[0] ||
            Object.keys(lessonVideoFilesRef.current)[0];
          if (!pendingLessonId) return null;
          return (
            <div className="fixed bottom-6 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-primary/30 bg-white px-4 py-3 shadow-2xl dark:bg-[#1c1e26]">
              <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                ویدیو هنوز روی سرور ذخیره نشده است.
              </p>
              <button
                type="button"
                disabled={isSavingContent}
                onClick={() => {
                  void saveContentChanges();
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-[10px] font-black text-white disabled:opacity-60"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                {isSavingContent ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          );
        })()}

      {lessonDescriptionEditor.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1c1e26] border border-gray-200/70 dark:border-white/10 p-4 space-y-3">
            <h4 className="text-xs font-black text-gray-900 dark:text-white">توضیحات جلسه</h4>
            <textarea
              rows={6}
              value={lessonDescriptionEditor.value}
              onChange={(e) => setLessonDescriptionEditor((p) => ({ ...p, value: e.target.value }))}
              className="w-full rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold text-gray-800 dark:text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setLessonDescriptionMap((prev) => ({
                    ...prev,
                    [lessonDescriptionEditor.lessonId]: lessonDescriptionEditor.value.trim(),
                  }));
                  setIsContentDirty(true);
                  setLessonDescriptionEditor({ open: false, lessonId: "", value: "" });
                }}
                className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-lg"
              >
                اعمال توضیح
              </button>
              <button type="button" onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })} className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 text-[10px] rounded-lg">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {lessonFilesModal.open && (() => {
        const modalLesson = course?.chapters
          .flatMap((chapter) => chapter.lessons)
          .find((lesson) => lesson.id === lessonFilesModal.lessonId);
        const modalFiles = modalLesson ? resolveLessonFiles(modalLesson) : lessonFileMap[lessonFilesModal.lessonId] || [];

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#1c1e26] border border-gray-200/70 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-900 dark:text-white">فایل‌های ضمیمه جلسه</h4>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300">تعداد فایل‌ها: {modalFiles.length}</span>
            </div>
            <div className="rounded-xl border border-dashed border-amber-300/50 p-3 bg-amber-50/40 dark:bg-amber-500/10">
              <input
                id="lesson-files-input"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  handleLessonFileUpload(lessonFilesModal.lessonId, selected);
                  e.currentTarget.value = "";
                }}
              />
              <label
                htmlFor={modalFiles.length >= MAX_LESSON_FILES ? undefined : "lesson-files-input"}
                className={`h-10 px-3 inline-flex items-center justify-center rounded-lg border text-[10px] font-black ${
                  modalFiles.length >= MAX_LESSON_FILES
                    ? "border-gray-200/80 text-gray-400 cursor-not-allowed bg-gray-50 dark:bg-white/5"
                    : "border-amber-200/80 text-amber-700 dark:text-amber-300 cursor-pointer bg-white dark:bg-white/5"
                }`}
              >
                افزودن فایل جدید
              </label>
              <p className="text-[9px] text-gray-500 mt-2">حداکثر {MAX_LESSON_FILES} فایل</p>
              {lessonFilesError && <p className="text-[9px] text-red-500 mt-1">{lessonFilesError}</p>}
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {modalFiles.length === 0 ? (
                <p className="text-[10px] text-gray-400 font-bold">هنوز فایلی اضافه نشده است.</p>
              ) : (
                modalFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200/70 dark:border-white/10 p-2 bg-gray-50 dark:bg-white/5">
                    <div className="min-w-0 flex items-center gap-2">
                      <button type="button" onClick={() => window.open(f.url, "_blank", "noopener,noreferrer")} className="text-[10px] text-primary font-black truncate">{f.name}</button>
                      {f.url.startsWith("blob:") && (
                        <span className="shrink-0 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-black text-amber-700 dark:text-amber-300">
                          ذخیره‌نشده
                        </span>
                      )}
                    </div>
                    <button type="button" onClick={() => openDeleteConfirm("حذف فایل ضمیمه", "آیا می‌خواهید این فایل حذف شود؟", () => removeLessonFile(lessonFilesModal.lessonId, f.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end gap-2">
              {hasPendingLessonFiles(lessonFilesModal.lessonId) && (
                <button
                  type="button"
                  onClick={() => {
                    void saveContentChanges();
                  }}
                  disabled={isSavingContent}
                  className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-lg disabled:opacity-60 inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {isSavingContent ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              )}
              <button type="button" onClick={() => setLessonFilesModal({ open: false, lessonId: "" })} className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] rounded-lg">بستن</button>
            </div>
          </div>
        </div>
        );
      })()}

      {confirmDelete.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1c1e26] border border-gray-200/70 dark:border-white/10 p-5 space-y-4 text-right">
            <h4 className="text-sm font-black text-gray-900 dark:text-white">{confirmDelete.title}</h4>
            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300 leading-relaxed">{confirmDelete.message}</p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const action = confirmDelete.action;
                  setConfirmDelete({ open: false, title: "", message: "", action: null });
                  action?.();
                }}
                className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg"
              >
                بله، حذف شود
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete({ open: false, title: "", message: "", action: null })}
                className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-black rounded-lg"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
