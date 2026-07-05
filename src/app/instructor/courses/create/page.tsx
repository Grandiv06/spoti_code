"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  UploadCloud,
  FileImage,
  Video,
  Plus,
  Trash2,
  Pencil,
  X,
  AlertCircle,
  HelpCircle,
  FileText,
  DollarSign,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  ChevronDown,
  ChevronUp,
  GripVertical
} from "lucide-react";
import { useInstructorData, type Course } from "@/context/InstructorDataContext";
import CourseCard from "@/app/components/CourseCard";
import CourseHero from "@/app/components/CourseHero";
import CourseFAQ from "@/app/components/CourseFAQ";
import CustomSelect from "@/components/ui/CustomSelect";
import HighlightableTextareaWithBadges from "@/components/ui/HighlightableTextareaWithBadges";
import { apiGetNoMock, apiPatchNoMock, apiPostNoMock } from "@/lib/api";
import { uploadCourseMediaFile } from "@/lib/course-media-upload";
import VideoPreviewModal from "@/app/instructor/courses/create/_components/VideoPreviewModal";
import {
  CreateCourseCategory,
  CreateCourseDifficulty,
  CreateCoursePriceType,
  type CreateCourseDto,
} from "@/types/api-dtos";

const FEATURE_ICON_OPTIONS = [
  { value: "all_inclusive", label: "بینهایت / مادام‌العمر", icon: "all_inclusive" },
  { value: "workspace_premium", label: "مدرک تحصیلی", icon: "workspace_premium" },
  { value: "forum", label: "پشتیبانی / تالار", icon: "forum" },
  { value: "video_library", label: "ویدیوی کلاسی", icon: "video_library" },
  { value: "architecture", label: "پروژه‌محور", icon: "architecture" },
] as const;

type LessonModel = {
  id: string;
  title: string;
  duration: string;
  type: string;
  access: "free" | "locked";
  videoUrl?: string;
};

type ChapterModel = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: LessonModel[];
};

type FeatureModel = {
  id: string;
  title: string;
  icon: string;
  color: string;
};

type FAQModel = {
  id: string;
  question: string;
  answer: string;
};

type WizardFormData = {
  title: string;
  category: string;
  level: string;
  language: string;
  duration: string;
  price: number;
  isPaid: "free" | "paid";
  cover: string;
  introVideo: string;
  shortDescription: string;
  heroTitle: string;
  specialWords: {
    highlighted: string[];
    underlined: string[];
    color: string;
  };
  aboutTitle: string;
  aboutDescription: string;
  aboutHighlights: string[];
  features: FeatureModel[];
  chapters: ChapterModel[];
  faqs: FAQModel[];
};

type LessonRowActions = {
  onStartEditTitle: (lessonId: string) => void;
  onChangeTitle: (chapterId: string, lessonId: string, value: string) => void;
  onEndEditTitle: () => void;
  onStartEditDuration: (lessonId: string) => void;
  onChangeDuration: (chapterId: string, lessonId: string, value: string) => void;
  onEndEditDuration: () => void;
  onToggleAccess: (chapterId: string, lessonId: string) => void;
  onOpenFilesModal: (lessonId: string) => void;
  onOpenDescriptionEditor: (lessonId: string) => void;
  onUploadVideo: (lessonId: string, file?: File) => void;
  onOpenVideo: (url: string, title?: string) => void;
  onRequestDeleteVideo: (lessonId: string) => void;
  onRequestDeleteLesson: (chapterId: string, lessonId: string) => void;
};

type SortableLessonRowProps = {
  chapterId: string;
  lesson: LessonModel;
  isPaid: "free" | "paid";
  isEditingTitle: boolean;
  isEditingDuration: boolean;
  isActiveTarget: boolean;
  lessonVideo?: { name: string; url: string };
  lessonUploadProgress?: number;
  lessonFileCount: number;
  hasDescription: boolean;
  actions: LessonRowActions;
};

function SortableLessonRow({
  chapterId,
  lesson,
  isPaid,
  isEditingTitle,
  isEditingDuration,
  isActiveTarget,
  lessonVideo,
  lessonUploadProgress,
  lessonFileCount,
  hasDescription,
  actions,
}: SortableLessonRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    zIndex: isDragging ? 30 : undefined,
    position: "relative" as const,
    willChange: "transform",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 p-1.5 rounded-lg text-[9px] font-bold border select-none ${
        isDragging
          ? "opacity-0 border-primary/50 ring-2 ring-primary/25 bg-primary/5 shadow-lg"
          : isActiveTarget
            ? "border-dashed border-primary/40 ring-2 ring-primary/10 bg-primary/5"
            : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-200/80 dark:hover:border-white/10"
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <button
          type="button"
          aria-label="جابجایی ویدیو"
          title="جابجایی ویدیو"
          className={`size-6 inline-flex items-center justify-center rounded-md border transition-all shrink-0 ${
            isDragging
              ? "cursor-grabbing border-primary/40 bg-primary/10 text-primary"
              : "cursor-grab active:cursor-grabbing border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-primary/30"
          }`}
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <span className="material-symbols-outlined text-xs text-primary shrink-0">
          {isPaid === "free" || lesson.access === "free" ? "play_circle" : "lock"}
        </span>

        {isEditingTitle ? (
          <input
            autoFocus
            value={lesson.title}
            onChange={(e) => actions.onChangeTitle(chapterId, lesson.id, e.target.value)}
            onBlur={actions.onEndEditTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.onEndEditTitle();
            }}
            className="h-7 px-2 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[9px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => actions.onStartEditTitle(lesson.id)}
            className="text-[9px] font-bold hover:text-primary transition-colors cursor-text truncate max-w-[13rem] text-right"
            title={lesson.title}
          >
            {lesson.title}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isPaid === "paid" && (
          <button
            type="button"
            onClick={() => actions.onToggleAccess(chapterId, lesson.id)}
            className={`h-6 px-2 inline-flex items-center justify-center rounded-md border text-[8px] font-black ${
              lesson.access === "free"
                ? "border-emerald-200/80 bg-emerald-50 text-emerald-600"
                : "border-gray-200/80 bg-gray-50 text-gray-600"
            }`}
          >
            {lesson.access === "free" ? "باز" : "قفل"}
          </button>
        )}

        {isEditingDuration ? (
          <input
            autoFocus
            dir="ltr"
            value={lesson.duration}
            onChange={(e) => actions.onChangeDuration(chapterId, lesson.id, e.target.value)}
            onBlur={actions.onEndEditDuration}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.onEndEditDuration();
            }}
            className="h-6 w-16 px-1.5 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[8px] font-semibold tabular-nums tracking-[0.08em] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => actions.onStartEditDuration(lesson.id)}
            className="text-[8px] opacity-80 font-semibold tabular-nums tracking-[0.08em] text-gray-600 dark:text-gray-300 hover:text-primary transition-colors cursor-text"
            title={lesson.duration}
          >
            {lesson.duration}
          </button>
        )}

        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-emerald-200/70 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-500/10">
          {!lessonVideo && (
            <label className="size-6 inline-flex items-center justify-center rounded-md border border-blue-200/80 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  actions.onUploadVideo(lesson.id, e.target.files?.[0]);
                  e.currentTarget.value = "";
                }}
              />
              {typeof lessonUploadProgress === "number" ? (
                <span className="text-[8px] font-black leading-none">{lessonUploadProgress}%</span>
              ) : (
                <Video className="w-3.5 h-3.5" />
              )}
            </label>
          )}
          {lessonVideo && typeof lessonUploadProgress !== "number" && (
            <>
              <button
                type="button"
                onClick={() => actions.onOpenVideo(lessonVideo.url, lessonVideo.name || lesson.title)}
                className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-emerald-200/80 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-[8px] font-black cursor-pointer"
              >
                پیش‌نمایش
              </button>
              <button
                type="button"
                onClick={() => actions.onRequestDeleteVideo(lesson.id)}
                className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-amber-200/70 dark:border-amber-400/20 bg-amber-50/40 dark:bg-amber-500/10">
          <button
            type="button"
            onClick={() => actions.onOpenFilesModal(lesson.id)}
            className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-amber-200/80 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all text-[8px] font-black cursor-pointer"
          >
            فایل ({lessonFileCount})
          </button>
          <button
            type="button"
            onClick={() => actions.onOpenDescriptionEditor(lesson.id)}
            className={`h-6 px-2 inline-flex items-center justify-center rounded-md border transition-all text-[8px] font-black cursor-pointer ${
              hasDescription
                ? "border-indigo-200/80 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                : "border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            توضیح
          </button>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-red-200/70 dark:border-red-400/20 bg-red-50/40 dark:bg-red-500/10">
          <button
            type="button"
            onClick={() => actions.onRequestDeleteLesson(chapterId, lesson.id)}
            className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

type ChapterLessonDropZoneProps = {
  chapter: ChapterModel;
  isPaid: "free" | "paid";
  activeLessonId: string | null;
  lessonDropTargetId: string | null;
  editingLessonTitleId: string | null;
  editingLessonDurationId: string | null;
  lessonUploadProgress: Record<string, number>;
  lessonVideoMap: Record<string, { name: string; url: string }>;
  lessonFileMap: Record<string, { id: string; name: string; url: string }[]>;
  lessonDescriptionMap: Record<string, string>;
  actions: LessonRowActions;
};

function ChapterLessonDropZone({
  chapter,
  isPaid,
  activeLessonId,
  lessonDropTargetId,
  editingLessonTitleId,
  editingLessonDurationId,
  lessonUploadProgress,
  lessonVideoMap,
  lessonFileMap,
  lessonDescriptionMap,
  actions,
}: ChapterLessonDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: chapter.id });

  return (
    <SortableContext items={chapter.lessons.map((lesson) => lesson.id)} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`space-y-1.5 pr-4 border-r border-gray-200/80 dark:border-white/10 min-h-10 rounded-xl transition-all ${
          activeLessonId && isOver ? "bg-primary/5 border-primary/30" : ""
        }`}
      >
        {chapter.lessons.length === 0 ? (
          <div
            className={`rounded-md border border-dashed px-3 py-2 text-[8px] font-bold transition-all ${
              activeLessonId && isOver
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-gray-200/80 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-400"
            }`}
          >
            {activeLessonId ? "جلسه را برای قرارگیری در این فصل رها کنید." : "هنوز درسی به این فصل اضافه نشده است."}
          </div>
        ) : (
          chapter.lessons.map((lesson) => (
            <div key={lesson.id} className="space-y-1">
              {activeLessonId && lessonDropTargetId === lesson.id && (
                <div className="h-0.5 mx-3 rounded-full bg-primary/70 shadow-[0_0_0_1px_rgba(34,197,94,0.15)]" />
              )}
              <SortableLessonRow
                chapterId={chapter.id}
                lesson={lesson}
                isPaid={isPaid}
                isEditingTitle={editingLessonTitleId === lesson.id}
                isEditingDuration={editingLessonDurationId === lesson.id}
                isActiveTarget={lessonDropTargetId === lesson.id}
                lessonVideo={lessonVideoMap[lesson.id]}
                lessonUploadProgress={lessonUploadProgress[lesson.id]}
                lessonFileCount={lessonFileMap[lesson.id]?.length || 0}
                hasDescription={Boolean(lessonDescriptionMap[lesson.id])}
                actions={actions}
              />
            </div>
          ))
        )}

        {activeLessonId && isOver && chapter.lessons.length > 0 && (
          <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-[8px] font-black text-primary/80">
            رها کردن برای قرارگیری در انتهای این فصل
          </div>
        )}
      </div>
    </SortableContext>
  );
}

type LessonDragOverlayProps = {
  lesson?: LessonModel;
  isPaid: "free" | "paid";
};

function LessonDragOverlay({ lesson, isPaid }: LessonDragOverlayProps) {
  if (!lesson) return null;

  return (
    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-primary/40 bg-[#1a1c23] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.85)] text-[9px] font-bold w-[min(720px,calc(100vw-2rem))]">
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="size-6 inline-flex items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </span>
        <span className="material-symbols-outlined text-xs text-primary shrink-0">
          {isPaid === "free" || lesson.access === "free" ? "play_circle" : "lock"}
        </span>
        <span className="truncate text-white">{lesson.title}</span>
      </div>
      <span className="text-[8px] font-semibold tabular-nums tracking-[0.08em] text-gray-300 shrink-0">{lesson.duration}</span>
    </div>
  );
}

function clampWizardStep(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(5, Math.round(value)));
}

function readWizardStepFromParams(searchParams: Pick<URLSearchParams, "get">, fallback = 1) {
  return clampWizardStep(Number(searchParams.get("step") ?? String(fallback)));
}

function normalizeCategoryForUi(category: unknown) {
  const raw = typeof category === "string" ? category.trim() : "";
  switch (raw.toLowerCase()) {
    case "backend":
      return "Backend";
    case "devops":
      return "DevOps";
    case "mobile":
      return "Mobile";
    case "base":
    case "ui/ux":
      return "UI/UX";
    case "frontend":
    case "ai":
    default:
      return "Frontend";
  }
}

function normalizeLevelForUi(level: unknown) {
  const raw = typeof level === "string" ? level.trim().toLowerCase() : "";
  if (raw === "elementary" || raw === "beginner") return "elementary";
  if (raw === "advanced") return "advanced";
  return "intermediate";
}

function normalizeCoverForUi(cover: unknown, fallback = "") {
  const raw = typeof cover === "string" ? cover.trim() : "";
  if (!raw || raw.startsWith("blob:")) return fallback;
  return raw;
}

function normalizeIntroVideoForUi(introVideo: unknown, fallback = "") {
  const raw = typeof introVideo === "string" ? introVideo.trim() : "";
  if (!raw || raw.startsWith("blob:")) return fallback;
  return raw;
}

function mergeDraftIntoWizardForm(
  prev: WizardFormData,
  draftData: Partial<WizardFormData> | null,
  courseRow?: { category?: unknown; level?: unknown; cover?: unknown; thumbnail?: unknown; introVideo?: unknown }
): WizardFormData {
  if (!draftData) return prev;

  return {
    ...prev,
    ...draftData,
    category: normalizeCategoryForUi(draftData.category ?? courseRow?.category ?? prev.category),
    level: normalizeLevelForUi(draftData.level ?? courseRow?.level ?? prev.level),
    cover: normalizeCoverForUi(
      draftData.cover ?? courseRow?.cover ?? courseRow?.thumbnail ?? prev.cover,
      prev.cover
    ),
    introVideo: normalizeIntroVideoForUi(
      draftData.introVideo ?? courseRow?.introVideo ?? prev.introVideo,
      prev.introVideo
    ),
  };
}

const WIZARD_FIELD_CLASS =
  "bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all";

const WIZARD_FIELD_SM_CLASS =
  "bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all";

const WIZARD_PANEL_CLASS =
  "rounded-2xl border border-gray-100/80 dark:border-white/[0.08] bg-gradient-to-b from-gray-50/90 via-gray-50/40 to-transparent dark:from-white/[0.05] dark:via-white/[0.02] dark:to-transparent";

const WIZARD_DROPZONE_CLASS =
  "border border-dashed border-gray-200/80 dark:border-white/10 rounded-2xl bg-gray-50/60 dark:bg-white/[0.03] hover:border-primary/35 hover:bg-primary/[0.04] dark:hover:bg-primary/[0.06] transition-all";

export default function CreateCourseWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftCourseId = searchParams.get("draftCourseId");
  const { addCourse, profile, updateCourse, showToast } = useInstructorData();
  const loadedDraftIdRef = useRef<string | null>(null);
  const userChangedStepRef = useRef(false);
  const userEditedFormRef = useRef(false);
  const heroTitleTouchedRef = useRef(false);
  const markFormEdited = () => {
    userEditedFormRef.current = true;
  };
  const [step, setStep] = useState(() => readWizardStepFromParams(searchParams));
  const [maxReachedStep, setMaxReachedStep] = useState(() => readWizardStepFromParams(searchParams));
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [isSavingStep1, setIsSavingStep1] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (() => void) | null;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  // Unified Wizard State
  const [formData, setFormData] = useState<WizardFormData>({
    title: "",
    category: "Frontend",
    level: "intermediate",
    language: "فارسی",
    duration: "18",
    price: 1450000,
    isPaid: "paid", // free or paid
    cover: "",
    introVideo: "",
    shortDescription: "",
    
    // Step 2: Hero Titles & Highlights
    heroTitle: "",
    specialWords: {
      highlighted: [] as string[],
      underlined: [] as string[],
      color: "green"
    },

    // Step 3: Details & Accordions
    aboutTitle: "درباره این دوره",
    aboutDescription: "این دوره حاصل تجربه‌ی سال‌ها کار بر روی پروژه‌های بزرگ مقیاس است. هدف ما صرفاً آموزش سینتکس نیست، بلکه انتقال طرز تفکر مهندسی است. در طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید. از بهینه‌سازی پرفورمنس گرفته تا مدیریت وضعیت‌های پیچیده و پیاده‌سازی سکیوریتی.",
    aboutHighlights: ["طرز تفکر مهندسی", "پروژه‌های بزرگ مقیاس"] as string[],
    
    features: [
      { id: "feat-1", title: "دسترسی همیشگی به دوره و آپدیت‌ها", icon: "all_inclusive", color: "primary" },
      { id: "feat-2", title: "مدرک معتبر و قابل ترجمه", icon: "workspace_premium", color: "blue-500" },
      { id: "feat-3", title: "پشتیبانی اختصاصی در تلگرام", icon: "forum", color: "purple-500" }
    ],
    
    chapters: [
      {
        id: "chap-1",
        title: "مبانی و مفاهیم پایه‌ای",
        subtitle: "شروع قدرتمند با جاوااسکریپت مدرن",
        number: "۰۱",
        lessons: [
          { id: "les-1-1", title: "آشنایی با اکوسیستم React", duration: "۱۲:۲۰", type: "video", access: "free" },
          { id: "les-1-2", title: "نصب و راه‌اندازی پروژه", duration: "۱۸:۴۵", type: "video", access: "locked" }
        ]
      }
    ],
    
    faqs: [
      { id: "faq-1", question: "آیا پیش‌نیازی برای این دوره لازم است؟", answer: "بله، آشنایی با HTML، CSS و جاوااسکریپت پایه ضروری است." }
    ]
  });

  const syncStepToUrl = (nextStep: number, courseIdOverride?: string | null) => {
    const courseId = courseIdOverride ?? draftCourseId ?? createdCourseId;
    if (!courseId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("draftCourseId", courseId);
    params.set("step", String(clampWizardStep(nextStep)));
    const nextQuery = params.toString();
    if (nextQuery === searchParams.toString()) return;

    router.replace(`/instructor/courses/create?${nextQuery}`, { scroll: false });
  };

  const goToStep = (nextStep: number, fromUser = false, courseIdOverride?: string | null) => {
    const clamped = clampWizardStep(nextStep);
    if (fromUser) {
      userChangedStepRef.current = true;
    }
    setStep(clamped);
    syncStepToUrl(clamped, courseIdOverride);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!draftCourseId) {
      loadedDraftIdRef.current = null;
      userChangedStepRef.current = false;
      userEditedFormRef.current = false;
      setMaxReachedStep(1);
      return;
    }
    if (loadedDraftIdRef.current === draftCourseId) return;

    userEditedFormRef.current = false;
    heroTitleTouchedRef.current = false;

    const requestedStep = readWizardStepFromParams(searchParams);
    let cancelled = false;

    apiGetNoMock<unknown>(`/api/instructor-dashboard/courses/${encodeURIComponent(draftCourseId)}/draft`)
      .then((response) => {
        if (cancelled || !response || typeof response !== "object") return;
        const root = response as { data?: unknown };
        const data = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : {};
        const draftData = data.draftData && typeof data.draftData === "object" ? (data.draftData as Partial<WizardFormData>) : null;
        loadedDraftIdRef.current = draftCourseId;
        setCreatedCourseId(String(data.id ?? data.courseId ?? draftCourseId));
        const draftStep = clampWizardStep(Number(data.draftStep ?? requestedStep));
        setMaxReachedStep((prev) => Math.max(prev, draftStep, requestedStep));
        if (!userChangedStepRef.current) {
          setStep(requestedStep);
        }
        if (!userEditedFormRef.current && draftData) {
          const mergedCover = normalizeCoverForUi(
            draftData.cover ?? data.cover ?? data.thumbnail
          );
          const mergedIntroVideo = normalizeIntroVideoForUi(
            draftData.introVideo ?? data.introVideo
          );
          if (mergedCover) {
            setCoverProgress(100);
          }
          if (mergedIntroVideo) {
            setVideoFile(null);
          }
          setFormData((prev) =>
            mergeDraftIntoWizardForm(prev, draftData, {
              category: data.category,
              level: data.level,
              cover: data.cover,
              thumbnail: data.thumbnail,
              introVideo: data.introVideo,
            })
          );
          const restoredLessonVideos: Record<string, { name: string; url: string }> = {};
          const chapterSource = Array.isArray(draftData.chapters) ? draftData.chapters : [];
          for (const chapter of chapterSource) {
            if (!chapter || typeof chapter !== "object" || !Array.isArray((chapter as ChapterModel).lessons)) continue;
            for (const lesson of (chapter as ChapterModel).lessons) {
              const url = typeof lesson.videoUrl === "string" ? lesson.videoUrl.trim() : "";
              if (url && !url.startsWith("blob:")) {
                restoredLessonVideos[lesson.id] = { name: lesson.title, url };
              }
            }
          }
          if (Object.keys(restoredLessonVideos).length > 0) {
            setLessonVideoMap(restoredLessonVideos);
          }
        }
      })
      .catch(() => {
        showToast("دریافت پیش‌نویس دوره انجام نشد.", "error");
      });

    return () => {
      cancelled = true;
    };
    // Only reload draft when switching courses, not when step query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftCourseId]);

  // Upload Progress Simulators
  const [coverProgress, setCoverProgress] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoObjectUrlRef = useRef<string | null>(null);

  // Dynamic Item Inputs
  const [newObj, setNewObj] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  
  // Custom Feature Editor Input
  const [featTitle, setFeatTitle] = useState("");
  const [featIcon, setFeatIcon] = useState("all_inclusive");
  const [editingFeatId, setEditingFeatId] = useState<string | null>(null);

  // Custom Chapter Editor Input
  const [chapTitle, setChapTitle] = useState("");
  const [chapSubtitle, setChapSubtitle] = useState("");
  const [editingChapId, setEditingChapId] = useState<string | null>(null);

  // Custom Lesson Editor Input
  const [selectedChapIdForLesson, setSelectedChapIdForLesson] = useState("");
  const [lesTitle, setLesTitle] = useState("");
  const [lesDuration, setLesDuration] = useState("15:00");
  const [lesType, setLesType] = useState("video");
  const [lesAccess, setLesAccess] = useState("locked");
  const [editingLesId, setEditingLesId] = useState<string | null>(null);

  // Custom FAQ Editor Input
  const [isFaqEditorOpen, setIsFaqEditorOpen] = useState(true);
  const [openFaqItemId, setOpenFaqItemId] = useState<string | null>(null);
  const [editingFaqQuestionId, setEditingFaqQuestionId] = useState<string | null>(null);
  const [editingFaqAnswerId, setEditingFaqAnswerId] = useState<string | null>(null);
  const [editingLessonTitleId, setEditingLessonTitleId] = useState<string | null>(null);
  const [editingLessonDurationId, setEditingLessonDurationId] = useState<string | null>(null);
  const [editingChapterTitleId, setEditingChapterTitleId] = useState<string | null>(null);
  const [lessonUploadProgress, setLessonUploadProgress] = useState<Record<string, number>>({});
  const [lessonVideoMap, setLessonVideoMap] = useState<Record<string, { name: string; url: string }>>({});
  const lessonVideoFilesRef = useRef<Record<string, File>>({});
  const [videoPreview, setVideoPreview] = useState<{ url: string; title: string } | null>(null);
  const [lessonFileMap, setLessonFileMap] = useState<Record<string, { id: string; name: string; url: string }[]>>({});
  const [lessonDescriptionMap, setLessonDescriptionMap] = useState<Record<string, string>>({});
  const [lessonDescriptionEditor, setLessonDescriptionEditor] = useState<{
    open: boolean;
    lessonId: string;
    value: string;
  }>({ open: false, lessonId: "", value: "" });
  const [lessonFilesModal, setLessonFilesModal] = useState<{ open: boolean; lessonId: string }>({
    open: false,
    lessonId: "",
  });
  const MAX_LESSON_FILES = 3;
  const [draggedChapterId, setDraggedChapterId] = useState<string | null>(null);
  const [dragOverChapterId, setDragOverChapterId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonDropTargetId, setLessonDropTargetId] = useState<string | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});
  const [draggedFaqId, setDraggedFaqId] = useState<string | null>(null);
  const [dragOverFaqId, setDragOverFaqId] = useState<string | null>(null);
  const [lessonFilesError, setLessonFilesError] = useState("");
  const lastLessonHoverRef = useRef<{ activeId: string; overId: string } | null>(null);

  const renderHighlightedText = (text: string, highlights: string[]) => {
    if (!text) return null;
    if (!highlights.length) return text;

    const sortedHighlights = [...highlights].filter(Boolean).sort((a, b) => b.length - a.length);
    const pattern = sortedHighlights.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    if (!pattern) return text;

    const parts = text.split(new RegExp(`(${pattern})`, "g"));
    return parts.map((part, index) => {
      const matched = sortedHighlights.includes(part);
      return matched ? (
        <span
          key={`${part}-${index}`}
          className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-extrabold text-emerald-400"
        >
          {part}
        </span>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      );
    });
  };

  // Custom Highlight words lists (Step 2)
  const [newHighlightWord, setNewHighlightWord] = useState("");
  const [newUnderlineWord, setNewUnderlineWord] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
    }));
  };

  const normalizeDigitsToEnglish = (value: string) => {
    return value
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishDigits = normalizeDigitsToEnglish(e.target.value);
    const digitsOnly = englishDigits.replace(/\D/g, "");
    const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
    setFormData((p) => ({ ...p, duration: withoutLeadingZeros }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishDigits = normalizeDigitsToEnglish(e.target.value);
    const digitsOnly = englishDigits.replace(/\D/g, "");
    const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
    setFormData((p) => ({
      ...p,
      price: withoutLeadingZeros ? Number(withoutLeadingZeros) : 0,
    }));
  };

  const normalizeLessonsForPricing = (isPaid: string) => {
    if (isPaid !== "free") return;
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => ({ ...lesson, access: "free" })),
      })),
    }));
  };

  const mapCategoryToApi = (category: string): CreateCourseCategory => {
    switch (category.trim().toLowerCase()) {
      case "backend":
        return CreateCourseCategory.BACKEND;
      case "devops":
        return CreateCourseCategory.DEVOPS;
      case "mobile":
        return CreateCourseCategory.MOBILE;
      case "base":
      case "ui/ux":
        return CreateCourseCategory.BASE;
      case "frontend":
      default:
        return CreateCourseCategory.FRONTEND;
    }
  };

  const mapLevelToApi = (level: string): CreateCourseDifficulty => {
    switch (level.trim().toLowerCase()) {
      case "elementary":
      case "beginner":
        return CreateCourseDifficulty.BEGINNER;
      case "advanced":
        return CreateCourseDifficulty.ADVANCED;
      case "intermediate":
      default:
        return CreateCourseDifficulty.INTERMEDIATE;
    }
  };

  const mapCategoryToLocal = (category?: CreateCourseCategory) => {
    switch (category) {
      case CreateCourseCategory.BACKEND:
        return "Backend";
      case CreateCourseCategory.DEVOPS:
        return "DevOps";
      case CreateCourseCategory.MOBILE:
        return "Mobile";
      case CreateCourseCategory.BASE:
        return "UI/UX";
      case CreateCourseCategory.AI:
        return "Frontend";
      case CreateCourseCategory.FRONTEND:
      default:
        return "Frontend";
    }
  };

  const mapLevelToLocal = (difficulty?: CreateCourseDifficulty) => {
    switch (difficulty) {
      case CreateCourseDifficulty.BEGINNER:
        return "elementary";
      case CreateCourseDifficulty.ADVANCED:
        return "advanced";
      case CreateCourseDifficulty.INTERMEDIATE:
      default:
        return "intermediate";
    }
  };

  const buildStep1CoursePayload = (): CreateCourseDto => {
    const trimmedTitle = formData.title.trim();
    const slugBase = trimmedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      title: trimmedTitle,
      price: formData.isPaid === "free" ? 0 : formData.price,
      slug: slugBase || `course-${Date.now()}`,
      category: mapCategoryToApi(formData.category),
      difficulty: mapLevelToApi(formData.level),
      time: formData.duration.trim(),
      mockStudentsCount: 0,
      priceType: formData.isPaid === "free" ? CreateCoursePriceType.FREE : CreateCoursePriceType.CASH,
      thumbnailFileId: undefined,
    };
  };

  const extractCourseId = (value: unknown) => {
    if (!value || typeof value !== "object") return "";
    const record = value as Record<string, unknown>;
    const nested = record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>) : record;
    const candidate = nested.id ?? nested.courseId ?? nested.slug ?? nested._id;
    return typeof candidate === "string" ? candidate : "";
  };

  const buildCourseDraftPayload = (currentStep = step, overrides?: Partial<WizardFormData>) => {
    const source = { ...formData, ...overrides };
    return {
    courseId: createdCourseId ?? undefined,
    step: currentStep,
    title: source.title,
    category: mapCategoryToApi(source.category),
    level: mapLevelToLocal(mapLevelToApi(source.level)),
    language: source.language,
    duration: source.duration,
    price: source.isPaid === "free" ? 0 : source.price,
    isPaid: source.isPaid,
    cover: source.cover,
    introVideo: source.introVideo,
    shortDescription: source.shortDescription,
    heroTitle: source.heroTitle,
    specialWords: source.specialWords,
    aboutTitle: source.aboutTitle,
    aboutDescription: source.aboutDescription,
    aboutHighlights: source.aboutHighlights,
    features: source.features,
    chapters: source.chapters,
    faqs: source.faqs,
  };
  };

  const applyLessonVideoUrl = (lessonId: string, url: string, fileName: string) => {
    setLessonVideoMap((prev) => ({ ...prev, [lessonId]: { name: fileName, url } }));
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoUrl: url } : lesson
        ),
      })),
    }));
  };

  const uploadPendingCourseMedia = async (courseId: string): Promise<Partial<WizardFormData>> => {
    let nextIntroVideo = formData.introVideo;
    let nextChapters = formData.chapters;
    let uploaded = false;

    if (videoFile && (!nextIntroVideo || nextIntroVideo.startsWith("blob:"))) {
      nextIntroVideo = await uploadCourseMediaFile(courseId, videoFile, "intro");
      if (videoObjectUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
      }
      videoObjectUrlRef.current = nextIntroVideo;
      uploaded = true;
    }

    const pendingLessonFiles = { ...lessonVideoFilesRef.current };
    for (const [lessonId, file] of Object.entries(pendingLessonFiles)) {
      const currentLesson = nextChapters
        .flatMap((chapter) => chapter.lessons)
        .find((lesson) => lesson.id === lessonId);
      const currentUrl = currentLesson?.videoUrl ?? lessonVideoMap[lessonId]?.url ?? "";
      if (currentUrl && !currentUrl.startsWith("blob:")) {
        delete lessonVideoFilesRef.current[lessonId];
        continue;
      }

      const uploadedUrl = await uploadCourseMediaFile(courseId, file, "lesson", lessonId);
      if (lessonVideoMap[lessonId]?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(lessonVideoMap[lessonId].url);
      }
      nextChapters = nextChapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoUrl: uploadedUrl } : lesson
        ),
      }));
      setLessonVideoMap((prev) => ({ ...prev, [lessonId]: { name: file.name, url: uploadedUrl } }));
      delete lessonVideoFilesRef.current[lessonId];
      uploaded = true;
    }

    if (uploaded) {
      setFormData((prev) => ({
        ...prev,
        introVideo: nextIntroVideo,
        chapters: nextChapters,
      }));
    }

    return uploaded ? { introVideo: nextIntroVideo, chapters: nextChapters } : {};
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    markFormEdited();
    setCoverFile(file);
    setCoverProgress(10);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setFormData((prev) => ({
          ...prev,
          cover: result,
        }));
      }
      setCoverProgress(100);
    };
    reader.onerror = () => {
      showToast("بارگذاری تصویر کاور انجام نشد.", "error");
      setCoverProgress(0);
      setCoverFile(null);
    };
    reader.readAsDataURL(file);

    const interval = window.setInterval(() => {
      setCoverProgress((prev) => {
        if (prev >= 90) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 15;
      });
    }, 80);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    markFormEdited();
    if (videoObjectUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
      videoObjectUrlRef.current = null;
    }

    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    videoObjectUrlRef.current = previewUrl;
    setFormData((prev) => ({ ...prev, introVideo: previewUrl }));

    if (createdCourseId) {
      try {
        const uploadedUrl = await uploadCourseMediaFile(createdCourseId, file, "intro");
        URL.revokeObjectURL(previewUrl);
        videoObjectUrlRef.current = uploadedUrl;
        setFormData((prev) => ({ ...prev, introVideo: uploadedUrl }));
      } catch (error) {
        showToast(error instanceof Error ? error.message : "آپلود ویدیوی معرفی انجام نشد.", "error");
      }
    }
  };

  const clearIntroVideo = () => {
    markFormEdited();
    setVideoFile(null);
    if (videoObjectUrlRef.current) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
      videoObjectUrlRef.current = null;
    }
    setFormData((prev) => ({ ...prev, introVideo: "" }));
  };

  useEffect(() => {
    return () => {
      if (videoObjectUrlRef.current) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
        videoObjectUrlRef.current = null;
      }
    };
  }, []);

  // Feature actions
  const addOrUpdateFeature = () => {
    if (!featTitle.trim()) return;

    if (editingFeatId) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.map(f => f.id === editingFeatId ? { ...f, title: featTitle, icon: featIcon } : f)
      }));
      setEditingFeatId(null);
    } else {
      const newFeat = {
        id: `feat-${Math.random().toString(36).substr(2, 9)}`,
        title: featTitle,
        icon: featIcon,
        color: "primary"
      };
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeat] }));
    }
    setFeatTitle("");
  };

  const deleteFeature = (id: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
  };

  const editFeature = (feat: { id: string; title: string; icon: string }) => {
    setFeatTitle(feat.title);
    setFeatIcon(feat.icon);
    setEditingFeatId(feat.id);
  };

  // Chapter actions
  const addOrUpdateChapter = () => {
    if (!chapTitle.trim()) return;

    if (editingChapId) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => c.id === editingChapId ? { ...c, title: chapTitle, subtitle: chapSubtitle } : c)
      }));
      setEditingChapId(null);
    } else {
      const chapNumber = String(formData.chapters.length + 1).padStart(2, '0');
      const newChap: ChapterModel = {
        id: `chap-${Math.random().toString(36).substr(2, 9)}`,
        title: chapTitle,
        subtitle: chapSubtitle,
        number: chapNumber,
        lessons: []
      };
      setFormData(prev => ({ ...prev, chapters: [...prev.chapters, newChap] }));
    }
    setChapTitle("");
    setChapSubtitle("");
  };

  const deleteChapter = (id: string) => {
    setFormData(prev => ({ ...prev, chapters: prev.chapters.filter(c => c.id !== id) }));
  };

  const editChapter = (chap: { id: string; title: string; subtitle: string }) => {
    setChapTitle(chap.title);
    setChapSubtitle(chap.subtitle);
    setEditingChapId(chap.id);
  };

  const addChapterInline = () => {
    const chapNumber = String(formData.chapters.length + 1).padStart(2, "0");
    const newChap: ChapterModel = {
      id: `chap-${Math.random().toString(36).substr(2, 9)}`,
      title: "سرفصل جدید",
      subtitle: "",
      number: chapNumber,
      lessons: [],
    };
    setFormData((prev) => ({ ...prev, chapters: [...prev.chapters, newChap] }));
    setEditingChapterTitleId(newChap.id);
  };

  const addLessonInline = (chapId: string) => {
    const newLes: LessonModel = {
      id: `les-${Math.random().toString(36).substr(2, 9)}`,
      title: "جلسه جدید",
      duration: "15:00",
      type: "video",
      access: formData.isPaid === "free" ? "free" : "locked",
    };
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, lessons: [...c.lessons, newLes] } : c
      ),
    }));
    setEditingLessonTitleId(newLes.id);
  };

  const updateChapterTitleInline = (chapId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, title: value } : c
      ),
    }));
  };

  const moveChapter = (index: number, direction: "up" | "down") => {
    const updated = [...formData.chapters];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Recalculate Persian numbers
    const finalChaps = updated.map((ch, idx) => ({
      ...ch,
      number: String(idx + 1).padStart(2, '0')
    }));

    setFormData(prev => ({ ...prev, chapters: finalChaps }));
  };

  const reorderChapters = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setFormData((prev) => {
      const sourceIndex = prev.chapters.findIndex((c) => c.id === sourceId);
      const targetIndex = prev.chapters.findIndex((c) => c.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const updated = [...prev.chapters];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);

      const finalChaps = updated.map((ch, idx) => ({
        ...ch,
        number: String(idx + 1).padStart(2, "0"),
      }));

      return { ...prev, chapters: finalChaps };
    });
  };

  const reorderFaqs = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setFormData((prev) => {
      const sourceIndex = prev.faqs.findIndex((f) => f.id === sourceId);
      const targetIndex = prev.faqs.findIndex((f) => f.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const updated = [...prev.faqs];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return { ...prev, faqs: updated };
    });
  };

  const getLessonLocation = (lessonId: string) => {
    for (const chapter of formData.chapters) {
      const lessonIndex = chapter.lessons.findIndex((lesson) => lesson.id === lessonId);
      if (lessonIndex !== -1) {
        return { chapterId: chapter.id, lessonIndex };
      }
    }

    return null;
  };

  const isChapterDropZone = (id: string) => formData.chapters.some((chapter) => chapter.id === id);

  const lessonDragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    })
  );

  const handleLessonDragStart = ({ active }: DragStartEvent) => {
    setActiveLessonId(String(active.id));
    setLessonDropTargetId(null);
    lastLessonHoverRef.current = null;
  };

  const handleLessonDragOver = ({ over }: DragOverEvent) => {
    if (!over || !activeLessonId) return;
    const overId = String(over.id);
    const activeId = String(activeLessonId);
    setLessonDropTargetId(overId);

    if (overId === activeId) return;
    const signature = `${activeId}:${overId}`;
    if (lastLessonHoverRef.current && `${lastLessonHoverRef.current.activeId}:${lastLessonHoverRef.current.overId}` === signature) {
      return;
    }
    lastLessonHoverRef.current = { activeId, overId };

    const activeLocation = getLessonLocation(activeId);
    if (!activeLocation) return;

    if (isChapterDropZone(overId)) {
      reorderLessons(activeLocation.chapterId, activeId, overId);
      return;
    }

    const overLocation = getLessonLocation(overId);
    if (!overLocation) return;
    reorderLessons(activeLocation.chapterId, activeId, overLocation.chapterId, overId);
  };

  const handleLessonDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveLessonId(null);
    setLessonDropTargetId(null);
    lastLessonHoverRef.current = null;
  };

  const handleLessonDragCancel = () => {
    setActiveLessonId(null);
    setLessonDropTargetId(null);
    lastLessonHoverRef.current = null;
  };

  // Lesson actions
  const addOrUpdateLesson = () => {
    if (!lesTitle.trim() || !selectedChapIdForLesson) return;

    if (editingLesId) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map((c): ChapterModel => ({
          ...c,
          lessons: c.lessons.map((l): LessonModel =>
            l.id === editingLesId
              ? {
                  ...l,
                  title: lesTitle,
                  duration: lesDuration,
                  type: lesType,
                  access: (formData.isPaid === "free" ? "free" : lesAccess) as "free" | "locked",
                }
              : l
          )
        }))
      }));
      setEditingLesId(null);
    } else {
      const newLes: LessonModel = {
        id: `les-${Math.random().toString(36).substr(2, 9)}`,
        title: lesTitle,
        duration: lesDuration,
        type: lesType,
        access: (formData.isPaid === "free" ? "free" : lesAccess) as "free" | "locked"
      };
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map((c): ChapterModel =>
          c.id === selectedChapIdForLesson ? { ...c, lessons: [...c.lessons, newLes as LessonModel] } : c
        )
      }));
    }
    setLesTitle("");
    setLesDuration("15:00");
  };

  const deleteLesson = (chapId: string, lesId: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => c.id === chapId ? { ...c, lessons: c.lessons.filter(l => l.id !== lesId) } : c)
    }));
  };

  const reorderLessons = (sourceChapterId: string, sourceLessonId: string, targetChapterId: string, targetLessonId?: string) => {
    if (!sourceChapterId || !sourceLessonId || !targetChapterId) return;

    setFormData((prev) => {
      const nextChapters = prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: [...chapter.lessons],
      }));

      const sourceChapterIndex = nextChapters.findIndex((chapter) => chapter.id === sourceChapterId);
      const targetChapterIndex = nextChapters.findIndex((chapter) => chapter.id === targetChapterId);
      if (sourceChapterIndex < 0 || targetChapterIndex < 0) return prev;

      const sourceChapter = nextChapters[sourceChapterIndex];
      const targetChapter = nextChapters[targetChapterIndex];
      const sourceLessonIndex = sourceChapter.lessons.findIndex((lesson) => lesson.id === sourceLessonId);
      if (sourceLessonIndex < 0) return prev;

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

      return {
        ...prev,
        chapters: nextChapters,
      };
    });
  };

  const editLesson = (chapId: string, les: LessonModel) => {
    setSelectedChapIdForLesson(chapId);
    setLesTitle(les.title);
    setLesDuration(les.duration);
    setLesType(les.type);
    setLesAccess(les.access);
    setEditingLesId(les.id);
  };

  const updateLessonTitleInline = (chapId: string, lesId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? { ...c, lessons: c.lessons.map((l) => (l.id === lesId ? { ...l, title: value } : l)) }
          : c
      ),
    }));
  };

  const updateLessonDurationInline = (chapId: string, lesId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? { ...c, lessons: c.lessons.map((l) => (l.id === lesId ? { ...l, duration: value } : l)) }
          : c
      ),
    }));
  };

  const toggleLessonAccess = (chapId: string, lesId: string) => {
    if (formData.isPaid === "free") return;
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) =>
        chapter.id === chapId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson) =>
                lesson.id === lesId
                  ? { ...lesson, access: lesson.access === "free" ? "locked" : "free" }
                  : lesson
              ),
            }
          : chapter
      ),
    }));
  };

  const handleLessonVideoUpload = async (lessonId: string, file?: File) => {
    if (!file) return;

    markFormEdited();
    lessonVideoFilesRef.current[lessonId] = file;
    const previewUrl = URL.createObjectURL(file);
    setLessonVideoMap((prev) => {
      const existing = prev[lessonId];
      if (existing?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(existing.url);
      }
      return { ...prev, [lessonId]: { name: file.name, url: previewUrl } };
    });
    applyLessonVideoUrl(lessonId, previewUrl, file.name);

    if (createdCourseId) {
      try {
        const uploadedUrl = await uploadCourseMediaFile(createdCourseId, file, "lesson", lessonId);
        URL.revokeObjectURL(previewUrl);
        delete lessonVideoFilesRef.current[lessonId];
        applyLessonVideoUrl(lessonId, uploadedUrl, file.name);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "آپلود ویدیوی جلسه انجام نشد.", "error");
      }
    }
  };

  const removeLessonVideo = (lessonId: string) => {
    setLessonVideoMap((prev) => {
      const target = prev[lessonId];
      if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
      const copy = { ...prev };
      delete copy[lessonId];
      return copy;
    });
    delete lessonVideoFilesRef.current[lessonId];
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoUrl: undefined } : lesson
        ),
      })),
    }));
  };

  const lessonRowActions: LessonRowActions = {
    onStartEditTitle: (lessonId) => setEditingLessonTitleId(lessonId),
    onChangeTitle: updateLessonTitleInline,
    onEndEditTitle: () => setEditingLessonTitleId(null),
    onStartEditDuration: (lessonId) => setEditingLessonDurationId(lessonId),
    onChangeDuration: updateLessonDurationInline,
    onEndEditDuration: () => setEditingLessonDurationId(null),
    onToggleAccess: toggleLessonAccess,
    onOpenFilesModal: (lessonId) => setLessonFilesModal({ open: true, lessonId }),
    onOpenDescriptionEditor: (lessonId) =>
      setLessonDescriptionEditor({
        open: true,
        lessonId,
        value: lessonDescriptionMap[lessonId] || "",
      }),
    onUploadVideo: handleLessonVideoUpload,
    onOpenVideo: (url, title) => setVideoPreview({ url, title: title || "پیش‌نمایش ویدیو" }),
    onRequestDeleteVideo: (lessonId) =>
      openDeleteConfirm("حذف ویدیوی آپلود شده", "آیا از حذف این فایل ویدیو مطمئن هستید؟", () => removeLessonVideo(lessonId)),
    onRequestDeleteLesson: (chapterId, lessonId) =>
      openDeleteConfirm("حذف جلسه", "آیا مطمئن هستید که می‌خواهید این جلسه حذف شود؟", () => deleteLesson(chapterId, lessonId)),
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
      if (remaining === 0) {
        setLessonFilesError(`حداکثر ${MAX_LESSON_FILES} فایل برای هر جلسه مجاز است.`);
        return prev;
      }

      const selected = files.slice(0, remaining);
      const newFiles = selected.map((file) => ({
        id: `file-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setLessonFilesError("");
      return { ...prev, [lessonId]: [...current, ...newFiles] };
    });
  };

  const removeLessonFile = (lessonId: string, fileId: string) => {
    setLessonFileMap((prev) => {
      const list = prev[lessonId] || [];
      const target = list.find((f) => f.id === fileId);
      if (target?.url) URL.revokeObjectURL(target.url);
      const nextList = list.filter((f) => f.id !== fileId);
      const copy = { ...prev };
      if (nextList.length) copy[lessonId] = nextList;
      else delete copy[lessonId];
      return copy;
    });
  };

  // FAQ actions
  const addFAQBox = () => {
    const newFaq = {
      id: `faq-${Math.random().toString(36).substr(2, 9)}`,
      question: "سوال جدید",
      answer: "پاسخ این سوال را وارد کنید.",
    };
    setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    setOpenFaqItemId(newFaq.id);
  };

  const deleteFAQ = (id: string) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }));
  };

  const updateFAQQuestionInline = (faqId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === faqId ? { ...f, question: value } : f)),
    }));
  };

  const updateFAQAnswerInline = (faqId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === faqId ? { ...f, answer: value } : f)),
    }));
  };

  // List updates
  const addHighlightItem = () => {
    if (newHighlight.trim() && !formData.aboutHighlights.includes(newHighlight.trim())) {
      setFormData(p => ({ ...p, aboutHighlights: [...p.aboutHighlights, newHighlight.trim()] }));
      setNewHighlight("");
    }
  };

  const removeHighlightItem = (item: string) => {
    setFormData(p => ({ ...p, aboutHighlights: p.aboutHighlights.filter(h => h !== item) }));
  };

  // Step 2 word helper additions
  const addHighlightWord = () => {
    if (newHighlightWord.trim() && !formData.specialWords.highlighted.includes(newHighlightWord.trim())) {
      setFormData(p => ({
        ...p,
        specialWords: {
          ...p.specialWords,
          highlighted: [...p.specialWords.highlighted, newHighlightWord.trim()]
        }
      }));
      setNewHighlightWord("");
    }
  };

  const addUnderlineWord = () => {
    if (newUnderlineWord.trim() && !formData.specialWords.underlined.includes(newUnderlineWord.trim())) {
      setFormData(p => ({
        ...p,
        specialWords: {
          ...p.specialWords,
          underlined: [...p.specialWords.underlined, newUnderlineWord.trim()]
        }
      }));
      setNewUnderlineWord("");
    }
  };

  const openDeleteConfirm = (title: string, description: string, onConfirm: () => void) => {
    setDeleteConfirm({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      open: false,
      title: "",
      description: "",
      onConfirm: null,
    });
  };

  // Form validations
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    const newWarnings: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "نام دوره الزامی است.";
      if (formData.isPaid === "paid" && (!formData.price || formData.price <= 0)) {
        newErrors.price = "قیمت دوره نقدی باید بیشتر از صفر باشد.";
      }
      if (!formData.duration.trim()) newErrors.duration = "مدت زمان دوره الزامی است.";
      if (!formData.level) newErrors.level = "سطح آموزشی دوره الزامی است.";
    }

    if (currentStep === 2) {
      if (!formData.heroTitle.trim()) newErrors.heroTitle = "عنوان معرفی هیرو الزامی است.";
      if (!formData.shortDescription.trim()) newErrors.shortDescription = "توضیح کوتاه هیرو الزامی است.";
    }

    if (currentStep === 3) {
      if (!formData.aboutDescription.trim()) newErrors.aboutDescription = "توضیحات درباره این دوره الزامی است.";
      if (formData.features.length === 0) newErrors.features = "حداقل وارد کردن یک ویژگی متمایز الزامی است.";
      if (formData.faqs.length === 0) {
        newWarnings.faqs = "توصیه می‌شود حداقل یک سوال متداول جهت راهنمایی دانشجویان اضافه کنید.";
      }
    }

    if (currentStep === 4) {
      if (formData.chapters.length === 0) newErrors.chapters = "حداقل وارد کردن یک فصل آموزشی الزامی است.";
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const persistCourseDraft = async (currentStep = step): Promise<string | null> => {
    let mediaOverrides: Partial<WizardFormData> = {};
    const initialResponse = await apiPostNoMock<unknown>(
      "/api/instructor-dashboard/courses/drafts",
      buildCourseDraftPayload(currentStep, mediaOverrides)
    );
    const courseId = extractCourseId(initialResponse) || createdCourseId;

    if (!courseId) {
      return null;
    }

    mediaOverrides = await uploadPendingCourseMedia(courseId);
    if (Object.keys(mediaOverrides).length > 0) {
      await apiPostNoMock<unknown>(
        "/api/instructor-dashboard/courses/drafts",
        buildCourseDraftPayload(currentStep, mediaOverrides)
      );
    }

    const payload = buildStep1CoursePayload();

    if (courseId) {
      setCreatedCourseId(courseId);
      updateCourse(courseId, {
        id: courseId,
        title: formData.title,
        slug: payload.slug,
        status: "draft",
        category: mapCategoryToLocal(payload.category),
        level: mapLevelToLocal(payload.difficulty),
        language: formData.language,
        shortDescription: formData.shortDescription,
        description: formData.aboutDescription,
        price: payload.price,
        introText: formData.shortDescription,
        objectives: formData.aboutHighlights,
        heroTitle: formData.heroTitle || formData.title,
        aboutTitle: formData.aboutTitle,
        aboutDescription: formData.aboutDescription,
        aboutHighlights: formData.aboutHighlights,
        features: formData.features,
        faqs: formData.faqs,
        specialWords: formData.specialWords,
        cover: formData.cover,
      });
    } else {
      const localCourseId = addCourse({
        title: formData.title,
        slug: payload.slug,
        status: "draft",
        category: mapCategoryToLocal(payload.category),
        level: mapLevelToLocal(payload.difficulty),
        language: formData.language,
        shortDescription: formData.shortDescription,
        description: formData.aboutDescription,
        price: payload.price,
        cover: formData.cover,
      });
      setCreatedCourseId(localCourseId);
      showToast("پیش‌نویس دوره ذخیره شد.", "success");
      return localCourseId;
    }

    showToast("پیش‌نویس دوره ذخیره شد.", "success");
    return courseId;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    try {
      setIsSavingStep1(true);
      const savedCourseId = await persistCourseDraft(step);
      if (!savedCourseId) return;
      if (step === 1 && !heroTitleTouchedRef.current && !formData.heroTitle.trim()) {
        setFormData((prev) => ({ ...prev, heroTitle: prev.title }));
      }
      const nextStep = step + 1;
      setMaxReachedStep((prev) => Math.max(prev, nextStep));
      goToStep(nextStep, true, savedCourseId);
    } catch (error) {
      console.error("Failed to persist course draft", error);
      showToast("ذخیره پیش‌نویس دوره انجام نشد. دوباره تلاش کنید.", "error");
      return;
    } finally {
      setIsSavingStep1(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      goToStep(step - 1, true);
    }
  };

  const handleSubmitWizard = async (status: "published" | "draft" | "pending") => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      goToStep(1, true);
      return;
    }

    // Map wizard chapters to DB schema chapter/lessons
    const formattedChapters: Course["chapters"] = formData.chapters.map((chap) => ({
      id: chap.id,
      title: chap.title,
      duration: `${chap.lessons.length} جلسه`,
      lessons: chap.lessons.map((les) => ({
        id: les.id,
        title: les.title,
        type: les.type as Course["chapters"][number]["lessons"][number]["type"],
        duration: les.duration,
        isFree: les.access === "free",
        status: "published" as const,
      })),
    }));

    // Construct partial course object
    const finalCoursePayload: Partial<Course> = {
      title: formData.title,
      cover: formData.cover || "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
      introVideo: formData.introVideo || undefined,
      status: status,
      category: mapCategoryToLocal(mapCategoryToApi(formData.category)),
      level: mapLevelToLocal(mapLevelToApi(formData.level)),
      language: formData.language,
      shortDescription: formData.shortDescription,
      description: formData.aboutDescription,
      price: formData.isPaid === "free" ? 0 : formData.price,
      introText: formData.shortDescription,
      objectives: formData.aboutHighlights,
      prerequisites: ["تسلط بر مبانی مرتبط با دوره"],
      targetAudience: ["علاقه‌مندان به یادگیری عمیق توسعه وب"],
      chapters: formattedChapters,
      // Custom additions that will serialize in localStorage JSON
      features: formData.features,
      faqs: formData.faqs,
      specialWords: formData.specialWords
    };

    try {
      setIsSavingStep1(true);
      const initialResponse = await apiPostNoMock<unknown>(
        "/api/instructor-dashboard/courses/drafts",
        buildCourseDraftPayload(5)
      );
      const courseId = extractCourseId(initialResponse) || createdCourseId;
      if (!courseId) {
        throw new Error("شناسه دوره از سرور دریافت نشد.");
      }

      const mediaOverrides = await uploadPendingCourseMedia(courseId);
      if (Object.keys(mediaOverrides).length > 0) {
        await apiPostNoMock<unknown>(
          "/api/instructor-dashboard/courses/drafts",
          buildCourseDraftPayload(5, mediaOverrides)
        );
      }

      if (status === "pending" || status === "published") {
        const publishResponse = await apiPatchNoMock<unknown>(
          `/api/instructor-dashboard/courses/${encodeURIComponent(courseId)}/publish`,
          {}
        );
        const publishedRecord =
          publishResponse && typeof publishResponse === "object" && "data" in publishResponse
            ? ((publishResponse as { data?: Record<string, unknown> }).data ?? {})
            : {};
        const nextStatus = publishedRecord.status === "published" ? "published" : "pending";
        updateCourse(courseId, { ...finalCoursePayload, status: nextStatus });
        showToast(
          nextStatus === "published"
            ? "دوره با موفقیت منتشر شد."
            : "دوره برای بررسی و تایید ادمین ارسال شد.",
          "success"
        );
      } else {
        updateCourse(courseId, { ...finalCoursePayload, status: "draft" });
        showToast("دوره به عنوان پیش‌نویس ذخیره شد.", "success");
      }

      setCreatedCourseId(courseId);
      router.push("/instructor/courses");
    } catch (error) {
      console.error("Failed to submit course wizard", error);
      showToast(error instanceof Error ? error.message : "ثبت نهایی دوره انجام نشد.", "error");
    } finally {
      setIsSavingStep1(false);
    }
  };

  // Total lessons count
  const totalLessonsCount = formData.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 text-right min-h-screen" dir="rtl">
      
      {/* 1. Page Header */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-10 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">استودیوی پیشرفته ایجاد دوره جدید</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
              ساده، گام‌به‌گام و مجهز به پیش‌نمایش زنده و کاملاً هماهنگ با صفحه نهایی و واقعی دوره.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stepper Area */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-lg rounded-[2rem] p-6 mb-10">
        <div className="relative flex items-start justify-between overflow-x-auto sm:overflow-visible pt-2 pb-4 sm:pb-0 scrollbar-none gap-6">
          {/* Connector Line behind steps */}
          <div className="absolute left-6 right-6 top-8 -translate-y-1/2 h-[3px] bg-gray-100 dark:bg-white/10 z-0">
            {/* Active Connector Progress */}
            <div 
              className="absolute right-0 top-0 h-full bg-primary transition-all duration-500"
              style={{ 
                width: step === 1 ? "0%" : step === 2 ? "25%" : step === 3 ? "50%" : step === 4 ? "75%" : "100%"
              }} 
            />
          </div>

          {[
            { stepNum: 1, label: "اطلاعات کارت دوره", desc: "تصویر، قیمت و مشخصات" },
            { stepNum: 2, label: "معرفی و هیرو دوره", desc: "ویدیو، شعار و کلمات ویژه" },
            { stepNum: 3, label: "جزئیات و محتوای دوره", desc: "ویژگی‌ها، توضیحات و سوالات" },
            { stepNum: 4, label: "ویدیوها و جلسات", desc: "مدیریت سرفصل و فایل‌ها" },
            { stepNum: 5, label: "بررسی نهایی", desc: "پیش‌نمایش کلی و انتشار" },
          ].map((item) => {
            const isActive = step === item.stepNum;
            const isReachable = item.stepNum <= maxReachedStep;
            const isVisited = isReachable && !isActive;

            return (
            <button
              key={item.stepNum}
              onClick={() => {
                if (!isReachable || isActive) return;
                goToStep(item.stepNum, true);
              }}
              disabled={!isReachable}
              className="relative z-10 flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed group shrink-0"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-background-dark shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-110 z-20"
                    : isVisited
                    ? "bg-[#e6fbf0] dark:bg-[#132d21] text-primary border border-primary/20 z-10"
                    : "bg-gray-100 dark:bg-[#252833] text-gray-400 dark:text-gray-600 border border-transparent z-10"
                }`}
              >
                {isVisited ? <Check className="w-5 h-5" /> : item.stepNum}
              </div>
              <div className="text-center max-w-[120px]">
                <span
                  className={`text-xs block transition-all duration-300 ${
                    isActive
                      ? "text-primary font-black scale-105 origin-top"
                      : isVisited
                      ? "text-gray-800 dark:text-gray-200 font-bold"
                      : "text-gray-400 dark:text-gray-600 font-medium"
                  }`}
                >
                  {item.label}
                </span>
                <span 
                  className={`text-[9px] font-bold block mt-1 transition-all duration-300 ${
                    isActive
                      ? "text-primary/70 dark:text-primary/60 font-black"
                      : isVisited
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-400/60 dark:text-gray-600"
                  }`}
                >
                  {item.desc}
                </span>
              </div>
            </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main layout: Step 1 = two columns, other steps = stacked */}
      <div
        className={
          step === 1
            ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10"
            : "flex flex-col gap-8 items-stretch mb-10"
        }
      >
        
        {/* --- RIGHT SIDE: FORM COMPONENT (7 cols on large screens) --- */}
        <div
          className={`w-full bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl rounded-[2.5rem] p-5 md:p-6 lg:p-7 min-h-[520px] flex flex-col justify-between ${
            step === 1 ? "lg:col-span-6 lg:order-1" : ""
          }`}
        >
          
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* STEP 1: INITIAL CARD DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله اول: اطلاعات اولیه کارت دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    این اطلاعات در لیست دوره‌ها و کارت کوچک دوره نمایش داده می‌شود.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Title */}
                  <div className="flex flex-col gap-2.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام دوره <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="مثال: استایل‌دهی با CSS"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className={`px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.title ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
                    />
                    {errors.title && <span className="text-[10px] text-red-500 font-bold">{errors.title}</span>}
                  </div>

                  {/* Level */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">سطح آموزشی دوره</label>
                    <CustomSelect
                      value={formData.level}
                      onChange={(value) => {
                        markFormEdited();
                        setFormData((p) => ({ ...p, level: value }));
                      }}
                      options={[
                        { value: "elementary", label: "مقدماتی" },
                        { value: "intermediate", label: "متوسط" },
                        { value: "advanced", label: "پیشرفته" },
                      ]}
                      size="sm"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">دسته‌بندی اصلی</label>
                    <CustomSelect
                      value={formData.category}
                      onChange={(value) => {
                        markFormEdited();
                        setFormData((p) => ({ ...p, category: value }));
                      }}
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

                </div>

                {/* Free / Paid Toggle */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت قیمت دوره</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, isPaid: "free" }));
                        normalizeLessonsForPricing("free");
                      }}
                      className={`p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        formData.isPaid === "free"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-primary/20"
                      }`}
                    >
                      رایگان
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, isPaid: "paid" }))}
                      className={`p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        formData.isPaid === "paid"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-primary/20"
                      }`}
                    >
                      نقدی (پولی)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مدت زمان دوره <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="18"
                        value={formData.duration}
                        onChange={handleDurationChange}
                        className="w-full px-4 py-2.5 pl-14 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                        dir="ltr"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                        ساعت
                      </span>
                    </div>
                  </div>

                  {formData.isPaid === "paid" && (
                    <div className="flex flex-col gap-2.5 animate-in slide-in-from-top-4 duration-300">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت دوره (به تومان) <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="1450000"
                          value={formData.price === 0 ? "" : String(formData.price)}
                          onChange={handlePriceChange}
                          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.price ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-black focus:border-primary focus:outline-none transition-all text-left`}
                          dir="ltr"
                        />
                        <span className="absolute right-4 text-xs font-bold text-gray-400">تومان</span>
                      </div>
                      {errors.price && <span className="text-[10px] text-red-500 font-bold">{errors.price}</span>}
                    </div>
                  )}
                </div>

                {/* Cover Image Upload (Mock) */}
                <div className="flex flex-col gap-3.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تصویر کاور دوره</label>
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[170px] text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {coverProgress === 0 ? (
                      <>
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-[11px] font-black text-gray-700 dark:text-gray-300 mb-1">
                          انتخاب یا رها کردن تصویر کاور
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold">PNG, JPG حداکثر ۵ مگابایت (اندازه 16:9)</p>
                      </>
                    ) : coverProgress < 100 ? (
                      <div className="w-full space-y-2 px-4 z-20">
                        <FileImage className="w-8 h-8 text-primary mx-auto" />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>درحال آپلود...</span>
                          <span>{coverProgress}٪</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${coverProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-2 z-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.cover}
                          alt="کاور دوره"
                          className="w-full max-h-[100px] object-cover rounded-xl mb-2"
                        />
                        <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{coverFile?.name} ({Math.round((coverFile?.size || 0)/1024)} KB)</span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markFormEdited();
                            setCoverProgress(0);
                            setCoverFile(null);
                            setFormData((p) => ({ ...p, cover: "" }));
                          }}
                          className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: HERO & INTRODUCTION BANNER */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله دوم: هیرو و معرفی دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    این جزئیات در ابتدای صفحه اختصاصی دوره قرار دارند و نرخ تبدیل دانشجو را می‌سازند.
                  </p>
                </div>

                {/* Hero title */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان اصلی هیرو <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="مثال: متخصص React و Next.js"
                    value={formData.heroTitle}
                    onChange={(e) => {
                      heroTitleTouchedRef.current = true;
                      markFormEdited();
                      setFormData((p) => ({ ...p, heroTitle: e.target.value }));
                    }}
                    className={`px-4 py-2.5 ${WIZARD_FIELD_CLASS} text-xs font-bold text-right ${errors.heroTitle ? "border-red-500 ring-2 ring-red-500/15" : ""}`}
                  />
                  {errors.heroTitle && <span className="text-[10px] text-red-500 font-bold">{errors.heroTitle}</span>}
                </div>

                {/* Title highlights (Special Words) */}
                <div className={`p-4 ${WIZARD_PANEL_CLASS} space-y-3`}>
                  <span className="text-xs font-black text-gray-900 dark:text-white block">کلمات ویژه عنوان (Special Words)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Highlighted text list */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات سبز (Highlight)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="کلمه"
                          value={newHighlightWord}
                          onChange={(e) => setNewHighlightWord(e.target.value)}
                          className={`w-full px-3 py-2 ${WIZARD_FIELD_SM_CLASS} text-[10px] font-bold text-right`}
                        />
                        <button
                          type="button"
                          onClick={addHighlightWord}
                          className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.specialWords.highlighted.map((word, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg border border-emerald-500/20">
                            {word}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, highlighted: p.specialWords.highlighted.filter(w => w !== word) } }))}>
                              <X className="w-3 h-3 text-red-500 hover:scale-110 transition-transform" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Underlined text list */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات دارای خط زیرین (Underline)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="کلمه"
                          value={newUnderlineWord}
                          onChange={(e) => setNewUnderlineWord(e.target.value)}
                          className={`w-full px-3 py-2 ${WIZARD_FIELD_SM_CLASS} text-[10px] font-bold text-right`}
                        />
                        <button
                          type="button"
                          onClick={addUnderlineWord}
                          className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.specialWords.underlined.map((word, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-lg border border-blue-500/20">
                            {word}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, underlined: p.specialWords.underlined.filter(w => w !== word) } }))}>
                              <X className="w-3 h-3 text-red-500 hover:scale-110 transition-transform" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Highlight Color Pick */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">انتخاب رنگ هایلایت کلمات</label>
                    <div className="flex gap-3">
                      {[
                        { name: "سبز برند", val: "green", class: "bg-primary" },
                        { name: "سفید", val: "white", class: "bg-white border border-gray-200" },
                        { name: "زرد طلایی", val: "yellow", class: "bg-amber-500" },
                        { name: "آبی ملایم", val: "blue", class: "bg-blue-500" }
                      ].map((col) => (
                        <button
                          type="button"
                          key={col.val}
                          onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, color: col.val } }))}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            formData.specialWords.color === col.val
                              ? "border-primary bg-primary/10 text-primary"
                              : `border-transparent ${WIZARD_FIELD_SM_CLASS} px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:border-gray-200/80 dark:hover:border-white/10`
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${col.class}`} />
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه هیرو <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    placeholder="توضیح کوتاهی که در هیرو بالای صفحه قرار می‌گیرد..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                    className={`px-4 py-2.5 ${WIZARD_FIELD_CLASS} text-xs font-bold text-right leading-relaxed ${errors.shortDescription ? "border-red-500 ring-2 ring-red-500/15" : ""}`}
                  />
                  {errors.shortDescription && <span className="text-[10px] text-red-500 font-bold">{errors.shortDescription}</span>}
                </div>

                {/* Intro Video Upload */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                  {formData.introVideo ? (
                    <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-black shadow-sm">
                      <video
                        key={formData.introVideo}
                        src={formData.introVideo}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-h-56 w-full object-contain bg-black"
                      />
                      <div className="flex items-center justify-between gap-3 border-t border-emerald-500/10 bg-gray-50 px-4 py-3 dark:bg-white/5">
                        <p className="truncate text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {videoFile?.name || "ویدیوی معرفی بارگذاری شد"}
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          <label className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                            تغییر
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={clearIntroVideo}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-500 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`relative ${WIZARD_DROPZONE_CLASS} flex min-h-[130px] flex-col items-center justify-center p-5 text-center`}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      />
                      <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
                      <p className="mb-1 text-[11px] font-black text-gray-700 dark:text-gray-300">
                        انتخاب یا رها کردن ویدیوی پیش‌نمایش
                      </p>
                      <p className="text-[9px] font-bold text-gray-400">MP4, MKV حداکثر ۵۰ مگابایت</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STEP 3: COURSE DETAILS, FAQ & FEATURES */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله سوم: محتوای عمیق صفحه دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    در این مرحله ویژگی‌های متمایز، توضیحات درباره دوره و سوالات متداول را تعریف کنید.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* --- 3A. ABOUT SECTION --- */}
                <div className="xl:col-span-7 p-4 md:p-5 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/10 space-y-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">۱. بخش درباره این دوره</span>
                  
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300">توضیحات درباره دوره (پاراگراف‌ها) <span className="text-red-500">*</span></label>
                    <HighlightableTextareaWithBadges
                      rows={5}
                      placeholder="متن کامل درباره دوره، اهداف و شبیه‌سازی بازار کار..."
                      value={formData.aboutDescription}
                      onChange={(value) => setFormData(p => ({ ...p, aboutDescription: value }))}
                      highlights={formData.aboutHighlights}
                      onAddHighlight={(value) => {
                        const normalizedValue = value.trim();
                        if (!normalizedValue || formData.aboutHighlights.includes(normalizedValue)) return;
                        setFormData((prev) => ({
                          ...prev,
                          aboutHighlights: [...prev.aboutHighlights, normalizedValue],
                        }));
                      }}
                      onRemoveHighlight={(item) => openDeleteConfirm("حذف عبارت هایلایت", "آیا مطمئن هستید که می‌خواهید این عبارت حذف شود؟", () => removeHighlightItem(item))}
                      manualValue={newHighlight}
                      onManualValueChange={setNewHighlight}
                      onManualAdd={addHighlightItem}
                      error={errors.aboutDescription}
                      textareaClassName={`px-4 py-3.5 bg-white dark:bg-[#1a1c23] border ${errors.aboutDescription ? "border-red-500" : "border-gray-200/70 dark:border-white/10"} rounded-2xl text-xs font-medium focus:border-primary focus:outline-none transition-all text-right leading-7`}
                      inputClassName="w-full px-4 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/5 rounded-xl text-[11px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                      addButtonClassName="h-10 px-4 sm:px-3 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                      removeButtonClassName="cursor-pointer"
                    />
                  </div>
                </div>

                {/* --- 3B. DISTINCTIVE FEATURES SECTION --- */}
                <div className="xl:col-span-5 p-4 md:p-5 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/10 space-y-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">۲. ویژگی‌های متمایز دوره</span>
                  
                  {errors.features && <span className="text-[10px] text-red-500 font-bold block">{errors.features}</span>}
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="عنوان ویژگی (مثال: پشتیبانی اختصاصی تلگرام)"
                        value={featTitle}
                        onChange={(e) => setFeatTitle(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <CustomSelect
                        label="انتخاب آیکون"
                        value={featIcon}
                        onChange={setFeatIcon}
                        options={FEATURE_ICON_OPTIONS.map(({ value, label }) => ({ value, label }))}
                        size="sm"
                        className="space-y-1.5"
                        renderValue={(option) => (
                          <span className="inline-flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-emerald-400">{FEATURE_ICON_OPTIONS.find((item) => item.value === option?.value)?.icon || "help"}</span>
                            <span className="truncate font-bold">{option?.label || "انتخاب کنید..."}</span>
                          </span>
                        )}
                        renderOption={(option, selected) => {
                          const icon = FEATURE_ICON_OPTIONS.find((item) => item.value === option.value)?.icon || "help";
                          return (
                            <span className="flex w-full items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-emerald-400">{icon}</span>
                                <span className="font-bold text-sm">{option.label}</span>
                              </span>
                              {selected ? <span className="material-symbols-outlined text-[16px]">check</span> : null}
                            </span>
                          );
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addOrUpdateFeature}
                      className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingFeatId ? "ویرایش و ذخیره ویژگی" : "افزودن ویژگی جدید"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto mt-2 pr-1">
                    {formData.features.map((feat) => (
                      <div key={feat.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-white/5 text-[10px] font-bold">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base flex-shrink-0 text-${feat.color === 'primary' ? 'primary' : feat.color}`}>
                            {feat.icon}
                          </span>
                          <span>{feat.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button type="button" onClick={() => editFeature(feat)} className="inline-flex size-8 items-center justify-center rounded-lg text-blue-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => openDeleteConfirm("حذف ویژگی", "آیا مطمئن هستید که می‌خواهید این ویژگی حذف شود؟", () => deleteFeature(feat.id))} className="inline-flex size-8 items-center justify-center rounded-lg text-red-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                {/* --- 3D. FAQ SECTION --- */}
                {!isFaqEditorOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsFaqEditorOpen(true)}
                    className="w-full rounded-2xl p-5 border border-gray-200/70 dark:border-white/10 bg-white dark:bg-[#1c1e26]/80 flex items-center justify-between text-right"
                  >
                    <span className="text-base font-black text-gray-900 dark:text-white">۳. سوالات متداول</span>
                    <span className="material-symbols-outlined text-primary">expand_more</span>
                  </button>
                ) : (
                  <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1c1e26]/80 border border-gray-200/70 dark:border-white/10">
                    <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200/70 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="size-8 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white">۳. سوالات متداول</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFaqEditorOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold"
                      >
                        بستن
                      </button>
                    </div>

                    {warnings.faqs && (
                      <div className="mx-5 mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 rounded-xl text-[9px] font-bold flex items-center gap-1.5 leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{warnings.faqs}</span>
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      <button
                        type="button"
                        onClick={addFAQBox}
                        className="w-full py-3 bg-primary/15 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن سوال جدید</span>
                      </button>

                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {formData.faqs.map((faq) => {
                          const isOpen = openFaqItemId === faq.id;
                          return (
                            <div
                              key={faq.id}
                              className={`rounded-[2.25rem] border transition-all ${
                                isOpen
                                  ? "bg-gray-50/90 dark:bg-white/[0.06] border-gray-200 dark:border-white/15"
                                  : "bg-gray-50/70 dark:bg-white/[0.03] border-gray-200/90 dark:border-white/12"
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (dragOverFaqId !== faq.id) setDragOverFaqId(faq.id);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedFaqId) reorderFaqs(draggedFaqId, faq.id);
                                setDraggedFaqId(null);
                                setDragOverFaqId(null);
                              }}
                              onDragLeave={(e) => {
                                const next = e.relatedTarget as Node | null;
                                if (!next || !e.currentTarget.contains(next)) setDragOverFaqId(null);
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenFaqItemId((prev) => (prev === faq.id ? null : faq.id))}
                                className={`w-full px-6 py-5 flex items-center justify-between gap-3 text-right cursor-pointer ${
                                  dragOverFaqId === faq.id ? "ring-2 ring-primary/20 rounded-[2.25rem]" : ""
                                }`}
                                draggable
                                onDragStart={() => {
                                  setDraggedFaqId(faq.id);
                                  setDragOverFaqId(faq.id);
                                }}
                                onDragEnd={() => {
                                  setDraggedFaqId(null);
                                  setDragOverFaqId(null);
                                }}
                              >
                                {editingFaqQuestionId === faq.id ? (
                                  <input
                                    autoFocus
                                    value={faq.question}
                                    onChange={(e) => updateFAQQuestionInline(faq.id, e.target.value)}
                                    onBlur={() => setEditingFaqQuestionId(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") setEditingFaqQuestionId(null);
                                    }}
                                    className="h-9 w-full max-w-[78%] px-3 rounded-lg border border-blue-500/40 bg-white dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingFaqQuestionId(faq.id);
                                    }}
                                    className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[78%] cursor-text text-right"
                                  >
                                    {faq.question}
                                  </button>
                                )}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteConfirm("حذف سوال متداول", "آیا مطمئن هستید که می‌خواهید این سوال حذف شود؟", () => deleteFAQ(faq.id));
                                    }}
                                    className="size-9 inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="size-9 inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  </span>
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-5 pt-0 border-t border-gray-200/70 dark:border-white/10">
                                  {editingFaqAnswerId === faq.id ? (
                                    <textarea
                                      autoFocus
                                      rows={3}
                                      value={faq.answer}
                                      onChange={(e) => updateFAQAnswerInline(faq.id, e.target.value)}
                                      onBlur={() => setEditingFaqAnswerId(null)}
                                      className="mt-4 w-full px-3 py-2 rounded-lg border border-blue-500/40 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right"
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setEditingFaqAnswerId(faq.id)}
                                      className="pt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-right w-full cursor-text"
                                    >
                                      {faq.answer}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* STEP 4: LESSONS & CHAPTER CURRICULUM EDITOR */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله چهارم: مدیریت ویدیوها و جلسات
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    در این مرحله سرفصل‌ها، ویدیوهای هر جلسه، فایل‌های ضمیمه و دسترسی باز/قفل را مدیریت کنید.
                  </p>
                </div>

                <div className="p-5 md:p-6 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-3xl border border-gray-200/70 dark:border-white/10 space-y-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">سرفصل‌ها و جلسات درسی</span>
                  {errors.chapters && <span className="text-[10px] text-red-500 font-bold block">{errors.chapters}</span>}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addChapterInline}
                      className="h-11 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن سرفصل جدید
                    </button>
                  </div>

                  <div className="rounded-2xl bg-white/80 dark:bg-[#171a22] border border-gray-200/70 dark:border-white/10 p-3 md:p-4">
                    <div className="flex items-center justify-between border-b border-gray-200/70 dark:border-white/10 pb-2.5 mb-3">
                      <span className="text-xs font-black text-gray-900 dark:text-white">لیست فصل‌ها و جلسات</span>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{formData.chapters.length} فصل</span>
                    </div>
                    <DndContext
                      sensors={lessonDragSensors}
                      collisionDetection={closestCorners}
                      onDragStart={handleLessonDragStart}
                      onDragOver={handleLessonDragOver}
                      onDragEnd={handleLessonDragEnd}
                      onDragCancel={handleLessonDragCancel}
                    >
                      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                      {formData.chapters.map((chap, chapIdx) => (
                        <div
                          key={chap.id}
                          className={`p-3.5 bg-white dark:bg-[#1a1c23] rounded-2xl border space-y-3 transition-all ${
                            dragOverChapterId === chap.id
                              ? "border-primary/60 ring-2 ring-primary/20"
                              : "border-gray-200/70 dark:border-white/10"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragOverChapterId !== chap.id) setDragOverChapterId(chap.id);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedChapterId) reorderChapters(draggedChapterId, chap.id);
                            setDraggedChapterId(null);
                            setDragOverChapterId(null);
                          }}
                          onDragLeave={(e) => {
                            const next = e.relatedTarget as Node | null;
                            if (!next || !e.currentTarget.contains(next)) setDragOverChapterId(null);
                          }}
                        >
                          <div
                            className="flex items-center justify-between border-b dark:border-white/5 pb-2 cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={() => {
                              setDraggedChapterId(chap.id);
                              setDragOverChapterId(chap.id);
                            }}
                            onDragEnd={() => {
                              setDraggedChapterId(null);
                              setDragOverChapterId(null);
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black mr-1">{chap.number}</span>
                              {editingChapterTitleId === chap.id ? (
                                <input
                                  autoFocus
                                  value={chap.title}
                                  onChange={(e) => updateChapterTitleInline(chap.id, e.target.value)}
                                  onBlur={() => setEditingChapterTitleId(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingChapterTitleId(null);
                                  }}
                                  className="h-8 px-2 rounded-lg border border-blue-500/40 bg-white dark:bg-white/5 text-[10px] font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setEditingChapterTitleId(chap.id)}
                                  className="text-[10px] font-black text-gray-900 dark:text-white hover:text-primary transition-colors cursor-text"
                                >
                                  {chap.title}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setCollapsedChapters((prev) => ({
                                    ...prev,
                                    [chap.id]: !prev[chap.id],
                                  }))
                                }
                                className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                                title={collapsedChapters[chap.id] ? "باز کردن فصل" : "بستن فصل"}
                              >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsedChapters[chap.id] ? "-rotate-90" : ""}`} />
                              </button>
                              <span className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-500">drag_indicator</span>
                              <button type="button" onClick={() => moveChapter(chapIdx, "up")} disabled={chapIdx === 0} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => moveChapter(chapIdx, "down")} disabled={chapIdx === formData.chapters.length - 1} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => openDeleteConfirm("حذف فصل", "با حذف فصل، تمام جلسات داخل آن هم حذف می‌شوند. ادامه می‌دهید؟", () => deleteChapter(chap.id))} className="size-7 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => addLessonInline(chap.id)} className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-black">
                                <Plus className="w-3 h-3 ml-0.5" />
                                ویدیو
                              </button>
                            </div>
                          </div>

                          {!collapsedChapters[chap.id] && (
                          <ChapterLessonDropZone
                            chapter={chap}
                            isPaid={formData.isPaid as "free" | "paid"}
                            activeLessonId={activeLessonId}
                            lessonDropTargetId={lessonDropTargetId}
                            editingLessonTitleId={editingLessonTitleId}
                            editingLessonDurationId={editingLessonDurationId}
                            lessonUploadProgress={lessonUploadProgress}
                            lessonVideoMap={lessonVideoMap}
                            lessonFileMap={lessonFileMap}
                            lessonDescriptionMap={lessonDescriptionMap}
                            actions={lessonRowActions}
                          />
                          )}
                        </div>
                      ))}
                      </div>
                      <DragOverlay>
                        <LessonDragOverlay
                          lesson={
                            activeLessonId
                              ? (() => {
                                  const location = getLessonLocation(activeLessonId);
                                  return location ? formData.chapters[formData.chapters.findIndex((chapter) => chapter.id === location.chapterId)]?.lessons[location.lessonIndex] : undefined;
                                })()
                              : undefined
                          }
                          isPaid={formData.isPaid as "free" | "paid"}
                        />
                      </DragOverlay>
                    </DndContext>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL SUBMISSION REVIEW */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full animate-pulse" />
                    مرحله آخر: بازبینی و نهایی‌سازی دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    داده‌های وارد شده را از کادر سمت چپ به صورت کاملاً زنده در قالب صفحه واقعی وب بررسی کرده و وضعیت انتشار را تعیین کنید.
                  </p>
                </div>

                {/* Final Checklist Card */}
                <div className="p-5 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">لیست نهایی بررسی کیفیت دوره:</span>
                  
                  <div className="space-y-2.5 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>نام دوره: <strong className="text-gray-900 dark:text-white">{formData.title}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>قیمت دوره: <strong className="text-primary font-black">{formData.isPaid === 'free' ? 'رایگان' : `${formData.price.toLocaleString("fa-IR")} تومان`}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>مشخصات پایه: <strong>سطح {formData.level === 'elementary' ? 'مقدماتی' : formData.level === 'intermediate' ? 'متوسط' : 'پیشرفته'} • {formData.duration} تدریس</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>محتوای تدریس: <strong>{formData.chapters.length} فصل درسی • {totalLessonsCount} جلسه فعال</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black">قوانین و حریم خصوصی انتشار دوره</p>
                    <p className="text-[10px] font-semibold leading-relaxed">
                      با کلیک بر روی «ارسال برای بررسی»، دوره جهت بازبینی تایید کیفیت توسط تیم محتوای اسپاتی‌کد لود شده و طی ۲۴ ساعت تایید می‌گردد. همچنین برای تکمیل سرفصل‌ها بعداً می‌توانید آن را به صورت «پیش‌نویس» در پنل خود ذخیره کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 3. Bottom controls */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100/50 dark:border-white/5 mt-8">
            {/* Back Button */}
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبلی</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/instructor/courses")}
                className="flex items-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>انصراف و بازگشت</span>
              </button>
            )}

            {/* Next / Submit buttons */}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSavingStep1}
                className="flex items-center gap-1.5 px-6 py-3.5 bg-primary hover:bg-primary-hover disabled:bg-primary/60 disabled:hover:scale-100 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer select-none"
              >
                <span>{isSavingStep1 ? "در حال ذخیره..." : "مرحله بعدی"}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isSavingStep1}
                  onClick={() => void handleSubmitWizard("draft")}
                  className="px-5 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingStep1 ? "در حال ذخیره..." : "ذخیره به عنوان پیش‌نویس"}
                </button>
                <button
                  type="button"
                  disabled={isSavingStep1}
                  onClick={() => void handleSubmitWizard("pending")}
                  className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer disabled:bg-primary/60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSavingStep1 ? "در حال ارسال..." : "ارسال برای بررسی و انتشار"}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* --- LEFT SIDE: LIVE PREVIEW PANEL (6 cols on large screens, sticky scroll) --- */}
        <div
          className={`w-full rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-4 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-md shadow-inner scrollbar-thin space-y-6 ${
            step === 1 ? "lg:col-span-6 lg:order-2 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b dark:border-white/5 pb-3">
            <span className="text-xs font-black text-gray-500 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              پیش‌نمایش زنده و واقعی (Live Preview)
            </span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-1 rounded-full font-black">
              مطابق با فرانت اند اصلی
            </span>
          </div>

          <div className="w-full relative transition-all duration-500">
            
            {/* PREVIEW: STEP 1 (Focus on course card only) */}
            {step === 1 && (
              <div className="py-12 animate-in fade-in duration-500 flex flex-col items-center w-full">
                <div className="text-center mb-6">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: نمایش در صفحه اصلی یا آرشیو دوره‌ها</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">کارت دوره شما (CourseCard)</span>
                </div>
                <div className="w-full max-w-[390px]">
                  <CourseCard
                    title={formData.title}
                    instructor={profile?.name || "اصغر رضایی"}
                    instructorImg={profile?.avatar || "/images/inst1.jpg"}
                    image={formData.cover}
                    hours={formData.duration}
                    price={formData.isPaid === "free" ? "رایگان" : formData.price}
                    disableViewNavigation
                  />
                </div>
              </div>
            )}

            {/* PREVIEW: STEP 2 (Focus on hero only) */}
            {step === 2 && (
              <div className="py-6 animate-in fade-in duration-500">
                <div className="text-center mb-4">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: هیرو بالای صفحه جزئیات دوره</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">هیرو سکشن اصلی (CourseHero)</span>
                </div>
                <CourseHero
                  title={formData.heroTitle}
                  category={formData.category}
                  level={formData.level}
                  duration={formData.duration}
                  rating={4.9}
                  shortDescription={formData.shortDescription}
                  coverImage={formData.cover}
                  introVideo={formData.introVideo}
                  specialWords={formData.specialWords}
                  disableFallbackVideo
                  missingVideoMessage="ویدیوی معرفی را بارگذاری کنید تا پیش‌نمایش پخش شود."
                />
              </div>
            )}

            {/* PREVIEW: STEP 3 (Focus on details page layout) */}
            {step === 3 && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: بدنه اصلی صفحه جزئیات دوره (سازگار با موبایل/دسکتاپ)</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">سکشن‌های درونی و جزئیات</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Col (Sidebar equivalent) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    
                    {/* Price Card Sidebar */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md relative overflow-hidden text-center">
                      <div className="absolute -top-10 -right-10 size-24 bg-primary/10 rounded-full blur-2xl" />
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">مبلغ نهایی ثبت نام</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free" ? "رایگان" : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">تومان</span>
                          )}
                        </div>
                        <button className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none" onClick={e => e.preventDefault()}>
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified_user</span>
                          ضمانت طلایی بازگشت وجه تا ۳۰ روز
                        </p>
                      </div>
                    </div>

                    {/* Features Sidebar */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/60 dark:border-gray-700">
                      <h4 className="font-black text-gray-900 dark:text-white text-xs mb-4 px-2 border-r-4 border-primary rounded-r">
                        ویژگی‌های متمایز
                      </h4>
                      <ul className="space-y-3">
                        {formData.features.map((feat) => (
                          <li key={feat.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]">
                            <span className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === 'primary' ? 'primary' : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}>
                              <span className="material-symbols-outlined text-sm">{feat.icon}</span>
                            </span>
                            {feat.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Col (Main Content equivalent) */}
                  <div className="lg:col-span-7 space-y-6 lg:order-1">
                    
                    {/* About Section */}
                    <section className="glass-panel rounded-[2rem] p-6 glass-card-hover">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 shrink-0">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">{formData.aboutTitle}</h2>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify leading-8">
                          {renderHighlightedText(formData.aboutDescription, formData.aboutHighlights)}
                        </p>
                      </div>
                    </section>

                    {/* FAQ Section */}
                    <CourseFAQ
                      items={formData.faqs}
                    />

                  </div>

                </div>
              </div>
            )}

            {/* PREVIEW: STEP 4 (Complete page layout) */}
            {step === 4 && (
              <div className="py-6 animate-in fade-in duration-500 space-y-4">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: مدیریت جلسات و فایل‌های هر ویدیو</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">پنل سرفصل‌ها و ویدیوها</span>
                </div>

                <div className="rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-3 md:p-4">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-200/70 dark:border-white/10 pb-3 px-1 md:px-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-gray-200/80 dark:bg-white/10 px-3 py-1.5">۱۲:۲۰</span>
                      <span className="rounded-full bg-gray-200/80 dark:bg-white/10 px-3 py-1.5">۴ فصل</span>
                      <span className="rounded-full bg-gray-200/80 dark:bg-white/10 px-3 py-1.5">بستن</span>
                    </div>
                    <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white">سرفصل‌های آموزشی</h3>
                  </div>

                  <div className="mt-5 space-y-5">
                    {formData.chapters.length === 0 ? (
                      <div className="rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] py-10 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
                        هنوز فصلی ثبت نشده است.
                      </div>
                    ) : (
                      formData.chapters.map((chapter, chapterIndex) => {
                        const chapterLessons = chapter.lessons;
                        const chapterDuration = chapterLessons.reduce((sum, lesson) => sum + (lesson.duration ? 1 : 0), 0);
                        return (
                          <div key={chapter.id} className="rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-[#1c1e26] p-4 md:p-5 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#24304a] text-emerald-400 text-sm font-black shadow-lg shadow-black/10">
                                  {String(chapterIndex + 1).padStart(2, "0")}
                                </span>
                                <div className="text-right">
                                  <p className="text-sm md:text-base font-black text-white">{chapter.title}</p>
                                  <p className="text-[10px] md:text-xs font-bold text-gray-400">
                                    {chapter.subtitle || "مدیریت حرفه‌ای وضعیت"}
                                  </p>
                                </div>
                              </div>
                              <button type="button" className="size-10 rounded-full bg-[#3a3d46] text-white/90 inline-flex items-center justify-center">
                                <ChevronDown className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-2 pt-2">
                              {chapterLessons.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] py-8 text-center text-[10px] font-bold text-gray-500">
                                  هنوز جلسه‌ای به این فصل اضافه نشده است.
                                </div>
                              ) : (
                                chapterLessons.map((lesson, lessonIndex) => {
                                  const lessonDurationPreview = lesson.duration || "12:20";
                                  return (
                                    <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#262833] px-3 py-3 md:px-4">
                                      <div className="flex items-center gap-2 md:gap-3">
                                        <span className={`inline-flex size-8 items-center justify-center rounded-xl ${lesson.access === "free" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                                          <span className="material-symbols-outlined text-[18px]">
                                            {lesson.type === "video" ? "videocam" : lesson.type === "pdf" ? "description" : lesson.type === "quiz" ? "quiz" : "text_snippet"}
                                          </span>
                                        </span>
                                        <div className="text-right">
                                          <p className="text-[11px] md:text-sm font-bold text-white">{lesson.title || `جلسه ${lessonIndex + 1}`}</p>
                                          <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-gray-300">
                                              {lesson.access === "free" ? "باز" : "قفل"}
                                            </span>
                                            <span className="font-semibold tabular-nums tracking-[0.08em]">{lessonDurationPreview}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {lessonVideoMap[lesson.id] ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setVideoPreview({
                                                url: lessonVideoMap[lesson.id].url,
                                                title: lesson.title || lessonVideoMap[lesson.id].name,
                                              })
                                            }
                                            className="size-8 rounded-xl inline-flex items-center justify-center bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20"
                                            title="پیش‌نمایش ویدیو"
                                          >
                                            <Video className="w-4 h-4" />
                                          </button>
                                        ) : null}
                                        {(lessonFileMap[lesson.id]?.length || 0) > 0 ? (
                                          <span className="size-8 rounded-xl inline-flex items-center justify-center bg-amber-500/10 text-amber-400 text-[9px] font-black">
                                            {lessonFileMap[lesson.id].length}
                                          </span>
                                        ) : null}
                                        {lessonDescriptionMap[lesson.id] ? (
                                          <span className="size-8 rounded-xl inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                                            <span className="material-symbols-outlined text-[16px]">notes</span>
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: STEP 5 (Complete page layout) */}
            {step === 5 && (
              <div className="animate-in fade-in duration-500 space-y-8 pb-10">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">بازبینی نهایی: نمایش صفحه کامل جزئیات دوره</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">کل صفحه واقعی دوره (Full Detail Page Preview)</span>
                </div>

                {/* 1. Hero */}
                <CourseHero
                  title={formData.heroTitle}
                  category={formData.category}
                  level={formData.level}
                  duration={formData.duration}
                  rating={4.9}
                  shortDescription={formData.shortDescription}
                  coverImage={formData.cover}
                  introVideo={formData.introVideo}
                  specialWords={formData.specialWords}
                  disableFallbackVideo
                  missingVideoMessage="ویدیوی معرفی را بارگذاری کنید تا پیش‌نمایش پخش شود."
                />

                {/* 2. Grid body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (Sidebar) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    
                    {/* Sidebar price */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md text-center">
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">مبلغ نهایی ثبت نام</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free" ? "رایگان" : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">تومان</span>
                          )}
                        </div>
                        <button className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none" onClick={e => e.preventDefault()}>
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified_user</span>
                          ضمانت طلایی بازگشت وجه تا ۳۰ روز
                        </p>
                      </div>
                    </div>

                    {/* Sidebar Features */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/60 dark:border-gray-700">
                      <h4 className="font-black text-gray-900 dark:text-white text-xs mb-4 px-2 border-r-4 border-primary rounded-r">
                        ویژگی‌های متمایز
                      </h4>
                      <ul className="space-y-3">
                        {formData.features.map((feat) => (
                          <li key={feat.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]">
                            <span className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === 'primary' ? 'primary' : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}>
                              <span className="material-symbols-outlined text-sm">{feat.icon}</span>
                            </span>
                            {feat.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Column (Body content) */}
                  <div className="lg:col-span-7 space-y-6 lg:order-1">
                    
                    {/* About Section */}
                    <section className="glass-panel rounded-[2rem] p-6 glass-card-hover">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 shrink-0">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">{formData.aboutTitle}</h2>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify leading-8">
                          {renderHighlightedText(formData.aboutDescription, formData.aboutHighlights)}
                        </p>
                      </div>
                    </section>

                    {/* FAQ accordion */}
                    <CourseFAQ
                      items={formData.faqs}
                    />

                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={closeDeleteConfirm} />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">{deleteConfirm.title}</h3>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              {deleteConfirm.description}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirm.onConfirm?.();
                  closeDeleteConfirm();
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonDescriptionEditor.open && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">توضیحات جلسه</h3>
            <textarea
              rows={5}
              value={lessonDescriptionEditor.value}
              onChange={(e) => setLessonDescriptionEditor((p) => ({ ...p, value: e.target.value }))}
              placeholder="توضیحاتی درباره این جلسه برای دانشجو بنویسید..."
              className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium text-right focus:outline-none focus:border-primary"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  setLessonDescriptionMap((prev) => ({
                    ...prev,
                    [lessonDescriptionEditor.lessonId]: lessonDescriptionEditor.value.trim(),
                  }));
                  setLessonDescriptionEditor({ open: false, lessonId: "", value: "" });
                }}
                className="px-4 py-2.5 rounded-xl bg-primary text-background-dark font-black text-sm"
              >
                ذخیره توضیحات
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonFilesModal.open && (
        <div className="fixed inset-0 z-[126] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setLessonFilesModal({ open: false, lessonId: "" })}
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white">مدیریت فایل‌های جلسه</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  تعداد فایل‌ها: {lessonFileMap[lessonFilesModal.lessonId]?.length || 0}
                </span>
                <button
                  type="button"
                  onClick={() => setLessonFilesModal({ open: false, lessonId: "" })}
                  className="size-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200 transition-all cursor-pointer"
                  aria-label="بستن پنجره مدیریت فایل‌ها"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                id="lesson-files-input"
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                  handleLessonFileUpload(lessonFilesModal.lessonId, selectedFiles);
                  e.currentTarget.value = "";
                }}
              />
              <label
                htmlFor={(lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >= MAX_LESSON_FILES ? undefined : "lesson-files-input"}
                className={`h-10 px-3 inline-flex items-center justify-center rounded-xl border text-sm font-black transition-all ${
                  (lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >= MAX_LESSON_FILES
                    ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "border-amber-300/80 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20"
                }`}
              >
                افزودن فایل
              </label>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                حداکثر {MAX_LESSON_FILES} فایل
              </span>
            </div>
            {lessonFilesError && (
              <p className="mt-2 text-xs font-bold text-red-500">{lessonFilesError}</p>
            )}

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(lessonFileMap[lessonFilesModal.lessonId] || []).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">هنوز فایلی برای این جلسه آپلود نشده است.</p>
              ) : (
                (lessonFileMap[lessonFilesModal.lessonId] || []).map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">{f.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(f.url, "_blank", "noopener,noreferrer")}
                        className="h-8 px-3 rounded-lg border border-emerald-300/70 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black cursor-pointer"
                      >
                        باز کردن
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteConfirm("حذف فایل جلسه", "آیا از حذف این فایل مطمئن هستید؟", () =>
                            removeLessonFile(lessonFilesModal.lessonId, f.id)
                          )
                        }
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <VideoPreviewModal
        open={Boolean(videoPreview)}
        title={videoPreview?.title || "پیش‌نمایش ویدیو"}
        videoUrl={videoPreview?.url || ""}
        onClose={() => setVideoPreview(null)}
      />

    </div>
  );
}
