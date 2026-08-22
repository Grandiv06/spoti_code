"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
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
  GripVertical,
  Lock,
  Unlock,
} from "lucide-react";
import {
  useInstructorData,
  type Course,
} from "@/context/InstructorDataContext";
import CourseCard from "@/app/components/CourseCard";
import CourseHero from "@/app/components/CourseHero";
import CourseFAQ from "@/app/components/CourseFAQ";
import CourseCurriculum from "@/app/components/CourseCurriculum";
import CustomSelect from "@/components/ui/CustomSelect";
import { cn } from "@/lib/utils";
import HighlightableTextareaWithBadges from "@/components/ui/HighlightableTextareaWithBadges";
import { apiGetNoMock, apiPatchNoMock, apiPostNoMock } from "@/lib/api";
import { uploadCourseMediaFile } from "@/lib/course-media-upload";
import {
  formatVideoDuration,
  readVideoDurationFromFile,
} from "@/lib/video-duration";
import VideoPreviewModal from "@/app/instructor/courses/create/_components/VideoPreviewModal";
import {
  CreateCourseWizardFormSkeleton,
  CreateCourseWizardPreviewSkeleton,
} from "@/app/instructor/courses/create/_components/CreateCourseWizardSkeleton";
import CustomVideoPlayer from "@/components/panel/CustomVideoPlayer";
import { instructorCoursesQueryKey } from "@/hooks/api/useInstructorDashboard";
import type { InstructorCourseRow } from "@/app/instructor/courses/_lib/instructor-courses-data";
import {
  CreateCourseCategory,
  CreateCourseDifficulty,
  CreateCoursePriceType,
  type CreateCourseDto,
} from "@/types/api-dtos";

const FEATURE_ICON_OPTIONS = [
  {
    value: "all_inclusive",
    label: "بینهایت / مادام‌العمر",
    icon: "all_inclusive",
  },
  {
    value: "workspace_premium",
    label: "مدرک تحصیلی",
    icon: "workspace_premium",
  },
  { value: "forum", label: "پشتیبانی / تالار", icon: "forum" },
  { value: "video_library", label: "ویدیوی کلاسی", icon: "video_library" },
  { value: "architecture", label: "پروژه‌محور", icon: "architecture" },
] as const;

type LessonAttachmentModel = {
  id: string;
  name: string;
  url: string;
  size?: string;
};

type LessonModel = {
  id: string;
  title: string;
  duration: string;
  type: string;
  access: "free" | "locked";
  videoUrl?: string;
  description?: string;
  attachments?: LessonAttachmentModel[];
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

const DEFAULT_COURSE_FEATURES: FeatureModel[] = [
  {
    id: "feat-1",
    title: "دسترسی همیشگی به دوره و آپدیت‌ها",
    icon: "all_inclusive",
    color: "primary",
  },
  {
    id: "feat-2",
    title: "مدرک معتبر و قابل ترجمه",
    icon: "workspace_premium",
    color: "blue-500",
  },
  {
    id: "feat-3",
    title: "پشتیبانی اختصاصی در داشبورد دانشجو",
    icon: "forum",
    color: "purple-500",
  },
];

const LOCKED_FEATURE_IDS = new Set(
  DEFAULT_COURSE_FEATURES.map((feature) => feature.id),
);

function isLockedFeature(id: string) {
  return LOCKED_FEATURE_IDS.has(id);
}

function mergeFeaturesWithLocked(features: FeatureModel[]) {
  const customFeatures = features.filter(
    (feature) => !isLockedFeature(feature.id),
  );
  return [...DEFAULT_COURSE_FEATURES, ...customFeatures];
}

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

function formatAttachmentSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildChaptersWithLessonMeta(
  chapters: ChapterModel[],
  lessonDescriptionMap: Record<string, string>,
  lessonFileMap: Record<string, LessonAttachmentModel[]>,
): ChapterModel[] {
  return chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => {
      const description =
        lessonDescriptionMap[lesson.id]?.trim() ||
        lesson.description?.trim() ||
        "";
      const files = lessonFileMap[lesson.id] ?? lesson.attachments ?? [];
      const attachments = files
        .filter((file) => file.url && !file.url.startsWith("blob:"))
        .map((file) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          ...(file.size ? { size: file.size } : {}),
        }));

      return {
        ...lesson,
        ...(description ? { description } : {}),
        ...(attachments.length ? { attachments } : {}),
      };
    }),
  }));
}

type LessonRowActions = {
  onStartEditTitle: (lessonId: string) => void;
  onChangeTitle: (chapterId: string, lessonId: string, value: string) => void;
  onEndEditTitle: (lessonId: string) => void;
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
  isEditingTitle: boolean;
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
  isEditingTitle,
  isActiveTarget,
  lessonVideo,
  lessonUploadProgress,
  lessonFileCount,
  hasDescription,
  actions,
}: SortableLessonRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
  });
  const isOpen = lesson.access === "free";

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
      className={`group/lesson flex flex-col gap-2.5 rounded-xl border px-2.5 py-2.5 text-[9px] font-bold select-none transition-all sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${
        isDragging
          ? "opacity-0 border-primary/50 ring-2 ring-primary/25 bg-primary/5 shadow-lg"
          : isActiveTarget
            ? "border-dashed border-primary/40 ring-2 ring-primary/10 bg-primary/5"
            : isOpen
              ? "border-emerald-500/20 bg-gradient-to-l from-emerald-500/[0.06] to-transparent dark:from-emerald-500/[0.08] hover:border-emerald-500/30"
              : "border-white/5 bg-[#14161c]/80 dark:bg-black/20 hover:border-white/10 hover:bg-[#171a22]"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 w-full sm:flex-1">
        <button
          type="button"
          aria-label="جابجایی ویدیو"
          title="جابجایی ویدیو"
          className={`size-7 inline-flex items-center justify-center rounded-lg border transition-all shrink-0 ${
            isDragging
              ? "cursor-grabbing border-primary/40 bg-primary/10 text-primary"
              : "cursor-grab active:cursor-grabbing border-white/10 bg-white/[0.04] text-gray-500 hover:text-gray-200 hover:border-primary/30"
          }`}
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => actions.onToggleAccess(chapterId, lesson.id)}
          title={
            isOpen
              ? "ویدیو باز است — کلیک برای قفل"
              : "ویدیو قفل است — کلیک برای باز کردن"
          }
          className={`size-7 inline-flex items-center justify-center rounded-lg border transition-all shrink-0 cursor-pointer ${
            isOpen
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
              : "border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          }`}
        >
          {isOpen ? (
            <Unlock className="w-3.5 h-3.5" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
        </button>

        {isEditingTitle ? (
          <input
            autoFocus
            value={lesson.title}
            onChange={(e) =>
              actions.onChangeTitle(chapterId, lesson.id, e.target.value)
            }
            onBlur={() => actions.onEndEditTitle(lesson.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.onEndEditTitle(lesson.id);
            }}
            placeholder="عنوان جلسه"
            className="h-8 min-w-0 flex-1 px-2.5 rounded-lg border border-primary/40 bg-white/5 text-[10px] font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => actions.onStartEditTitle(lesson.id)}
            className={`text-[10px] font-black hover:text-primary transition-colors cursor-text truncate min-w-0 flex-1 text-right ${
              lesson.title.trim()
                ? "text-gray-800 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500 italic"
            }`}
            title={lesson.title.trim() || "ویرایش عنوان جلسه"}
          >
            {lesson.title.trim() || "عنوان جلسه"}
          </button>
        )}

        <span
          className={`shrink-0 inline-flex h-5 items-center rounded-md px-1.5 text-[8px] font-black tracking-wide ${
            isOpen
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          {isOpen ? "باز" : "قفل"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 flex-wrap w-full sm:w-auto">
        <span
          dir="ltr"
          title="مدت زمان از روی ویدیو محاسبه می‌شود"
          className="h-7 px-2 inline-flex items-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-[9px] font-semibold tabular-nums tracking-[0.08em] text-sky-300 select-none"
        >
          {lesson.duration}
        </span>

        <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {!lessonVideo && (
            <label className="size-7 inline-flex items-center justify-center rounded-lg border border-sky-500/25 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all cursor-pointer overflow-hidden">
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
                <span className="text-[8px] font-black leading-none">
                  {lessonUploadProgress}%
                </span>
              ) : (
                <Video className="w-3.5 h-3.5" />
              )}
            </label>
          )}
          {lessonVideo && typeof lessonUploadProgress !== "number" && (
            <>
              <button
                type="button"
                onClick={() =>
                  actions.onOpenVideo(
                    lessonVideo.url,
                    lessonVideo.name || lesson.title,
                  )
                }
                className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-[8px] font-black cursor-pointer"
              >
                پیش‌نمایش
              </button>
              <button
                type="button"
                onClick={() => actions.onRequestDeleteVideo(lesson.id)}
                className="size-7 inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

        <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => actions.onOpenFilesModal(lesson.id)}
            className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all text-[8px] font-black cursor-pointer"
          >
            فایل ({lessonFileCount})
          </button>
          <button
            type="button"
            onClick={() => actions.onOpenDescriptionEditor(lesson.id)}
            className={`h-7 px-2.5 inline-flex items-center justify-center rounded-lg border transition-all text-[8px] font-black cursor-pointer ${
              hasDescription
                ? "border-indigo-500/25 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                : "border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
            }`}
          >
            توضیح
          </button>
        </div>

        <button
          type="button"
          onClick={() => actions.onRequestDeleteLesson(chapterId, lesson.id)}
          className="size-7 inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type ChapterLessonDropZoneProps = {
  chapter: ChapterModel;
  activeLessonId: string | null;
  lessonDropTargetId: string | null;
  editingLessonTitleId: string | null;
  lessonUploadProgress: Record<string, number>;
  lessonVideoMap: Record<string, { name: string; url: string }>;
  lessonFileMap: Record<string, LessonAttachmentModel[]>;
  lessonDescriptionMap: Record<string, string>;
  actions: LessonRowActions;
};

function ChapterLessonDropZone({
  chapter,
  activeLessonId,
  lessonDropTargetId,
  editingLessonTitleId,
  lessonUploadProgress,
  lessonVideoMap,
  lessonFileMap,
  lessonDescriptionMap,
  actions,
}: ChapterLessonDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: chapter.id });

  return (
    <SortableContext
      items={chapter.lessons.map((lesson) => lesson.id)}
      strategy={rectSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-12 rounded-2xl p-1 transition-all ${
          activeLessonId && isOver ? "bg-primary/5 ring-1 ring-primary/25" : ""
        }`}
      >
        {chapter.lessons.length === 0 ? (
          <div
            className={`rounded-xl border border-dashed px-4 py-3.5 text-[10px] font-bold transition-all text-center ${
              activeLessonId && isOver
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-white/10 bg-black/10 text-gray-500"
            }`}
          >
            {activeLessonId
              ? "جلسه را برای قرارگیری در این فصل رها کنید."
              : "هنوز ویدیویی به این سرفصل اضافه نشده است."}
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
                isEditingTitle={editingLessonTitleId === lesson.id}
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
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5 text-[9px] font-black text-primary/80 text-center">
            رها کردن برای قرارگیری در انتهای این فصل
          </div>
        )}
      </div>
    </SortableContext>
  );
}

type LessonDragOverlayProps = {
  lesson?: LessonModel;
};

function LessonDragOverlay({ lesson }: LessonDragOverlayProps) {
  if (!lesson) return null;
  const isOpen = lesson.access === "free";

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/40 bg-[#1a1c23] px-3 py-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.85)] text-[9px] font-bold w-[min(720px,calc(100vw-2rem))]">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="size-7 inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </span>
        <span
          className={`size-7 inline-flex items-center justify-center rounded-lg border shrink-0 ${
            isOpen
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
              : "border-amber-500/25 bg-amber-500/10 text-amber-400"
          }`}
        >
          {isOpen ? (
            <Unlock className="w-3.5 h-3.5" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
        </span>
        <span className="truncate text-white">{lesson.title}</span>
      </div>
      <span className="text-[9px] font-semibold tabular-nums tracking-[0.08em] text-gray-300 shrink-0">
        {lesson.duration}
      </span>
    </div>
  );
}

function clampWizardStep(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(5, Math.round(value)));
}

function readWizardStepFromParams(
  searchParams: Pick<URLSearchParams, "get">,
  fallback = 1,
) {
  return clampWizardStep(Number(searchParams.get("step") ?? String(fallback)));
}

/** Stable snapshot of wizard fields used to skip unnecessary draft POSTs. */
function buildWizardDirtySnapshot(
  form: WizardFormData,
  lessonDescriptionMap: Record<string, string>,
  lessonFileMap: Record<string, LessonAttachmentModel[]>,
) {
  return JSON.stringify({
    title: form.title,
    category: form.category,
    level: form.level,
    language: form.language,
    duration: form.duration,
    price: form.price,
    isPaid: form.isPaid,
    cover: form.cover,
    introVideo: form.introVideo,
    shortDescription: form.shortDescription,
    heroTitle: form.heroTitle,
    specialWords: form.specialWords,
    aboutTitle: form.aboutTitle,
    aboutDescription: form.aboutDescription,
    aboutHighlights: form.aboutHighlights,
    features: form.features,
    chapters: buildChaptersWithLessonMeta(
      form.chapters,
      lessonDescriptionMap,
      lessonFileMap,
    ),
    faqs: form.faqs,
  });
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

function persistableMediaUrl(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw || raw.startsWith("blob:") || raw.startsWith("data:")) return "";
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
  courseRow?: {
    category?: unknown;
    level?: unknown;
    cover?: unknown;
    thumbnail?: unknown;
    introVideo?: unknown;
  },
): WizardFormData {
  if (!draftData) return prev;

  return {
    ...prev,
    ...draftData,
    category: normalizeCategoryForUi(
      draftData.category ?? courseRow?.category ?? prev.category,
    ),
    level: normalizeLevelForUi(
      draftData.level ?? courseRow?.level ?? prev.level,
    ),
    cover: normalizeCoverForUi(
      draftData.cover ?? courseRow?.cover ?? courseRow?.thumbnail ?? prev.cover,
      prev.cover,
    ),
    introVideo: normalizeIntroVideoForUi(
      draftData.introVideo ?? courseRow?.introVideo ?? prev.introVideo,
      prev.introVideo,
    ),
    features: mergeFeaturesWithLocked(
      Array.isArray(draftData.features) ? draftData.features : prev.features,
    ),
  };
}

const WIZARD_FIELD_CLASS =
  "bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all";

const WIZARD_DROPZONE_CLASS =
  "border border-dashed border-gray-200/80 dark:border-white/10 rounded-2xl bg-gray-50/60 dark:bg-white/[0.03] hover:border-primary/35 hover:bg-primary/[0.04] dark:hover:bg-primary/[0.06] transition-all";

const WIZARD_SECTION_CLASS =
  "rounded-2xl border border-gray-200/70 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-4 md:p-5";

export default function CreateCourseWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const draftCourseId = searchParams.get("draftCourseId");
  const { addCourse, profile, updateCourse, showToast } = useInstructorData();
  const loadedDraftIdRef = useRef<string | null>(null);
  const userChangedStepRef = useRef(false);
  const userEditedFormRef = useRef(false);
  const heroTitleTouchedRef = useRef(false);
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const markFormEdited = () => {
    userEditedFormRef.current = true;
  };
  const [step, setStep] = useState(() =>
    readWizardStepFromParams(searchParams),
  );
  const [maxReachedStep, setMaxReachedStep] = useState(() =>
    readWizardStepFromParams(searchParams),
  );
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(() => Boolean(draftCourseId));
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
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
  const isNavigatingBypassRef = useRef(false);

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
      color: "green",
    },

    // Step 3: Details & Accordions
    aboutTitle: "درباره این دوره",
    aboutDescription: "",
    aboutHighlights: [] as string[],

    features: [...DEFAULT_COURSE_FEATURES],

    chapters: [],

    faqs: [],
  });

  const syncStepToUrl = (
    nextStep: number,
    courseIdOverride?: string | null,
  ) => {
    const courseId = courseIdOverride ?? draftCourseId ?? createdCourseId;
    if (!courseId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("draftCourseId", courseId);
    params.set("step", String(clampWizardStep(nextStep)));
    const nextQuery = params.toString();
    if (nextQuery === searchParams.toString()) return;

    router.replace(`/instructor/courses/create?${nextQuery}`, {
      scroll: false,
    });
  };

  const goToStep = (
    nextStep: number,
    fromUser = false,
    courseIdOverride?: string | null,
  ) => {
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
      lastSavedSnapshotRef.current = null;
      setMaxReachedStep(1);
      setIsLoadingDraft(false);
      return;
    }
    if (loadedDraftIdRef.current === draftCourseId) {
      setIsLoadingDraft(false);
      return;
    }

    userEditedFormRef.current = false;
    heroTitleTouchedRef.current = false;
    setIsLoadingDraft(true);

    const requestedStep = readWizardStepFromParams(searchParams);
    let cancelled = false;

    apiGetNoMock<unknown>(
      `/api/instructor-dashboard/courses/${encodeURIComponent(draftCourseId)}/draft`,
    )
      .then((response) => {
        if (cancelled || !response || typeof response !== "object") return;
        const root = response as { data?: unknown };
        const data =
          root.data && typeof root.data === "object"
            ? (root.data as Record<string, unknown>)
            : {};
        const draftData =
          data.draftData && typeof data.draftData === "object"
            ? (data.draftData as Partial<WizardFormData>)
            : null;
        loadedDraftIdRef.current = draftCourseId;
        setCreatedCourseId(String(data.id ?? data.courseId ?? draftCourseId));
        const draftStep = clampWizardStep(
          Number(data.draftStep ?? requestedStep),
        );
        setMaxReachedStep((prev) => Math.max(prev, draftStep, requestedStep));
        if (!userChangedStepRef.current) {
          setStep(draftStep);
          syncStepToUrl(draftStep, draftCourseId);
        }
        if (!userEditedFormRef.current && draftData) {
          const mergedCover = normalizeCoverForUi(
            draftData.cover ?? data.cover ?? data.thumbnail,
          );
          const mergedIntroVideo = normalizeIntroVideoForUi(
            draftData.introVideo ?? data.introVideo,
          );
          if (mergedCover) {
            setCoverProgress(100);
          }
          if (mergedIntroVideo) {
            setVideoFile(null);
            setVideoProgress(100);
          }
          const restoredLessonVideos: Record<
            string,
            { name: string; url: string }
          > = {};
          const restoredDescriptions: Record<string, string> = {};
          const restoredLessonFiles: Record<string, LessonAttachmentModel[]> =
            {};
          const chapterSource = Array.isArray(draftData.chapters)
            ? draftData.chapters
            : [];
          for (const chapter of chapterSource) {
            if (
              !chapter ||
              typeof chapter !== "object" ||
              !Array.isArray((chapter as ChapterModel).lessons)
            )
              continue;
            for (const lesson of (chapter as ChapterModel).lessons) {
              const url =
                typeof lesson.videoUrl === "string"
                  ? lesson.videoUrl.trim()
                  : "";
              if (url && !url.startsWith("blob:")) {
                restoredLessonVideos[lesson.id] = { name: lesson.title, url };
              }
              const description =
                typeof lesson.description === "string"
                  ? lesson.description.trim()
                  : "";
              if (description) {
                restoredDescriptions[lesson.id] = description;
              }
              if (Array.isArray(lesson.attachments)) {
                const files = lesson.attachments
                  .map((file) => {
                    if (!file || typeof file !== "object") return null;
                    const name =
                      typeof file.name === "string" ? file.name.trim() : "";
                    const fileUrl =
                      typeof file.url === "string" ? file.url.trim() : "";
                    if (!name || !fileUrl || fileUrl.startsWith("blob:"))
                      return null;
                    return {
                      id:
                        typeof file.id === "string"
                          ? file.id
                          : `file-${Math.random().toString(36).slice(2, 9)}`,
                      name,
                      url: fileUrl,
                      ...(typeof file.size === "string"
                        ? { size: file.size }
                        : {}),
                    };
                  })
                  .filter(Boolean) as LessonAttachmentModel[];
                if (files.length > 0) {
                  restoredLessonFiles[lesson.id] = files;
                }
              }
            }
          }
          setFormData((prev) => {
            const merged = mergeDraftIntoWizardForm(prev, draftData, {
              category: data.category,
              level: data.level,
              cover: data.cover,
              thumbnail: data.thumbnail,
              introVideo: data.introVideo,
            });
            lastSavedSnapshotRef.current = buildWizardDirtySnapshot(
              merged,
              restoredDescriptions,
              restoredLessonFiles,
            );
            return merged;
          });
          if (Object.keys(restoredLessonVideos).length > 0) {
            setLessonVideoMap(restoredLessonVideos);
          }
          if (Object.keys(restoredDescriptions).length > 0) {
            setLessonDescriptionMap(restoredDescriptions);
          }
          if (Object.keys(restoredLessonFiles).length > 0) {
            setLessonFileMap(restoredLessonFiles);
          }
        } else if (!userEditedFormRef.current) {
          // Draft row exists but has empty draftData — treat current empty form as clean baseline.
          lastSavedSnapshotRef.current = null;
        }
      })
      .catch(() => {
        if (!cancelled) {
          showToast("دریافت پیش‌نویس دوره انجام نشد.", "error");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingDraft(false);
        }
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
  const [videoProgress, setVideoProgress] = useState(0);
  const videoObjectUrlRef = useRef<string | null>(null);
  const videoUploadTokenRef = useRef(0);
  const coverObjectUrlRef = useRef<string | null>(null);

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
  const [lesType, setLesType] = useState("video");
  const [lesAccess, setLesAccess] = useState("locked");
  const [editingLesId, setEditingLesId] = useState<string | null>(null);

  // Custom FAQ Editor Input
  const [isFaqEditorOpen, setIsFaqEditorOpen] = useState(true);
  const [openFaqItemId, setOpenFaqItemId] = useState<string | null>(null);
  const [editingFaqQuestionId, setEditingFaqQuestionId] = useState<
    string | null
  >(null);
  const [editingFaqAnswerId, setEditingFaqAnswerId] = useState<string | null>(
    null,
  );
  const [editingLessonTitleId, setEditingLessonTitleId] = useState<
    string | null
  >(null);
  const [editingChapterTitleId, setEditingChapterTitleId] = useState<
    string | null
  >(null);
  const [lessonUploadProgress, setLessonUploadProgress] = useState<
    Record<string, number>
  >({});
  const [lessonVideoMap, setLessonVideoMap] = useState<
    Record<string, { name: string; url: string }>
  >({});
  const lessonVideoFilesRef = useRef<Record<string, File>>({});
  const lessonAttachmentFilesRef = useRef<Record<string, Record<string, File>>>(
    {},
  );
  const [videoPreview, setVideoPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [lessonFileMap, setLessonFileMap] = useState<
    Record<string, LessonAttachmentModel[]>
  >({});
  const [lessonDescriptionMap, setLessonDescriptionMap] = useState<
    Record<string, string>
  >({});
  const [lessonDescriptionEditor, setLessonDescriptionEditor] = useState<{
    open: boolean;
    lessonId: string;
    value: string;
  }>({ open: false, lessonId: "", value: "" });
  const [lessonFilesModal, setLessonFilesModal] = useState<{
    open: boolean;
    lessonId: string;
  }>({
    open: false,
    lessonId: "",
  });
  const MAX_LESSON_FILES = 3;
  const [draggedChapterId, setDraggedChapterId] = useState<string | null>(null);
  const [dragOverChapterId, setDragOverChapterId] = useState<string | null>(
    null,
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonDropTargetId, setLessonDropTargetId] = useState<string | null>(
    null,
  );
  const [collapsedChapters, setCollapsedChapters] = useState<
    Record<string, boolean>
  >({});
  /** Independent collapse state for the live curriculum preview panel. */
  const [previewCollapsedChapters, setPreviewCollapsedChapters] = useState<
    Record<string, boolean>
  >({});
  const [finalPreviewLesson, setFinalPreviewLesson] = useState<{
    lessonId: string;
    title: string;
    duration: string;
    videoUrl: string;
  } | null>(null);
  const [finalPreviewPlayTick, setFinalPreviewPlayTick] = useState(0);
  const [finalPreviewNotice, setFinalPreviewNotice] = useState<string | null>(
    null,
  );
  const [draggedFaqId, setDraggedFaqId] = useState<string | null>(null);
  const [dragOverFaqId, setDragOverFaqId] = useState<string | null>(null);
  const [lessonFilesError, setLessonFilesError] = useState("");
  const lastLessonHoverRef = useRef<{
    activeId: string;
    overId: string;
  } | null>(null);

  const renderHighlightedText = (text: string, highlights: string[]) => {
    if (!text) return null;
    if (!highlights.length) return text;

    const sortedHighlights = [...highlights]
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    const pattern = sortedHighlights
      .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
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
      priceType:
        formData.isPaid === "free"
          ? CreateCoursePriceType.FREE
          : CreateCoursePriceType.CASH,
      thumbnailFileId: undefined,
    };
  };

  const extractCourseId = (value: unknown) => {
    if (!value || typeof value !== "object") return "";
    const record = value as Record<string, unknown>;
    const nested =
      record.data && typeof record.data === "object"
        ? (record.data as Record<string, unknown>)
        : record;
    const candidate = nested.id ?? nested.courseId ?? nested.slug ?? nested._id;
    return typeof candidate === "string" ? candidate : "";
  };

  const buildCourseDraftPayload = (
    currentStep = step,
    overrides?: Partial<WizardFormData>,
    courseIdOverride?: string | null,
  ) => {
    const source = { ...formData, ...overrides };
    const resolvedCourseId =
      courseIdOverride ?? createdCourseId ?? draftCourseId ?? undefined;
    return {
      courseId: resolvedCourseId,
      step: currentStep,
      title: source.title,
      category: mapCategoryToApi(source.category),
      level: mapLevelToLocal(mapLevelToApi(source.level)),
      language: source.language,
      duration: source.duration,
      price: source.isPaid === "free" ? 0 : source.price,
      isPaid: source.isPaid,
      cover: persistableMediaUrl(source.cover),
      introVideo: persistableMediaUrl(source.introVideo),
      shortDescription: source.shortDescription,
      heroTitle: source.heroTitle,
      specialWords: source.specialWords,
      aboutTitle: source.aboutTitle,
      aboutDescription: source.aboutDescription,
      aboutHighlights: source.aboutHighlights,
      features: mergeFeaturesWithLocked(source.features),
      chapters:
        overrides?.chapters !== undefined
          ? overrides.chapters
          : buildChaptersWithLessonMeta(
              source.chapters,
              lessonDescriptionMap,
              lessonFileMap,
            ),
      faqs: source.faqs,
    };
  };

  const applyLessonVideoUrl = (
    lessonId: string,
    url: string,
    fileName: string,
  ) => {
    setLessonVideoMap((prev) => ({
      ...prev,
      [lessonId]: { name: fileName, url },
    }));
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoUrl: url } : lesson,
        ),
      })),
    }));
  };

  const applyLessonDescription = (lessonId: string, description: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, description } : lesson,
        ),
      })),
    }));
  };

  const applyLessonAttachments = (
    lessonId: string,
    files: LessonAttachmentModel[],
  ) => {
    const attachments = files.filter(
      (file) => file.url && !file.url.startsWith("blob:"),
    );
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => {
          if (lesson.id !== lessonId) return lesson;
          const nextLesson = { ...lesson };
          if (attachments.length > 0) {
            nextLesson.attachments = attachments;
          } else {
            delete nextLesson.attachments;
          }
          return nextLesson;
        }),
      })),
    }));
  };

  const uploadPendingCourseMedia = async (
    courseId: string,
  ): Promise<Partial<WizardFormData>> => {
    let nextCover = formData.cover;
    let nextIntroVideo = formData.introVideo;
    let nextChapters = formData.chapters;
    let nextLessonFileMap = { ...lessonFileMap };
    let uploaded = false;

    if (
      coverFile &&
      (!nextCover || nextCover.startsWith("blob:") || nextCover.startsWith("data:"))
    ) {
      nextCover = await uploadCourseMediaFile(courseId, coverFile, "cover");
      if (coverObjectUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
      }
      coverObjectUrlRef.current = nextCover;
      uploaded = true;
    }

    if (videoFile && (!nextIntroVideo || nextIntroVideo.startsWith("blob:"))) {
      nextIntroVideo = await uploadCourseMediaFile(
        courseId,
        videoFile,
        "intro",
      );
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
      const currentUrl =
        currentLesson?.videoUrl ?? lessonVideoMap[lessonId]?.url ?? "";
      if (currentUrl && !currentUrl.startsWith("blob:")) {
        delete lessonVideoFilesRef.current[lessonId];
        continue;
      }

      const uploadedUrl = await uploadCourseMediaFile(
        courseId,
        file,
        "lesson",
        lessonId,
      );
      if (lessonVideoMap[lessonId]?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(lessonVideoMap[lessonId].url);
      }
      nextChapters = nextChapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, videoUrl: uploadedUrl }
            : lesson,
        ),
      }));
      setLessonVideoMap((prev) => ({
        ...prev,
        [lessonId]: { name: file.name, url: uploadedUrl },
      }));
      delete lessonVideoFilesRef.current[lessonId];
      uploaded = true;
    }

    const pendingAttachments = { ...lessonAttachmentFilesRef.current };
    for (const [lessonId, filesById] of Object.entries(pendingAttachments)) {
      for (const [fileId, file] of Object.entries(filesById)) {
        const currentFiles = nextLessonFileMap[lessonId] ?? [];
        const entry = currentFiles.find((item) => item.id === fileId);
        if (!entry?.url?.startsWith("blob:")) {
          delete lessonAttachmentFilesRef.current[lessonId]?.[fileId];
          continue;
        }

        const uploadedUrl = await uploadCourseMediaFile(
          courseId,
          file,
          "attachment",
          lessonId,
        );
        URL.revokeObjectURL(entry.url);
        nextLessonFileMap = {
          ...nextLessonFileMap,
          [lessonId]: currentFiles.map((item) =>
            item.id === fileId ? { ...item, url: uploadedUrl } : item,
          ),
        };
        delete lessonAttachmentFilesRef.current[lessonId]?.[fileId];
        uploaded = true;
      }
    }

    const mergedChapters = buildChaptersWithLessonMeta(
      nextChapters,
      lessonDescriptionMap,
      nextLessonFileMap,
    );

    if (uploaded) {
      setFormData((prev) => ({
        ...prev,
        cover: nextCover,
        introVideo: nextIntroVideo,
        chapters: mergedChapters,
      }));
      if (Object.keys(nextLessonFileMap).length > 0) {
        setLessonFileMap(nextLessonFileMap);
      }
    }

    return uploaded
      ? {
          cover: nextCover,
          introVideo: nextIntroVideo,
          chapters: mergedChapters,
        }
      : {};
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    markFormEdited();
    if (coverObjectUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }

    setCoverFile(file);
    setCoverProgress(15);
    const previewUrl = URL.createObjectURL(file);
    coverObjectUrlRef.current = previewUrl;
    setFormData((prev) => ({ ...prev, cover: previewUrl }));

    const courseId = createdCourseId ?? draftCourseId;
    if (!courseId) {
      setCoverProgress(100);
      return;
    }

    void (async () => {
      try {
        const uploadedUrl = await uploadCourseMediaFile(
          courseId,
          file,
          "cover",
          undefined,
          (percent) => setCoverProgress(Math.max(15, Math.min(99, percent))),
        );
        if (coverObjectUrlRef.current?.startsWith("blob:")) {
          URL.revokeObjectURL(coverObjectUrlRef.current);
        }
        coverObjectUrlRef.current = uploadedUrl;
        setFormData((prev) => ({ ...prev, cover: uploadedUrl }));
        setCoverProgress(100);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "بارگذاری تصویر کاور انجام نشد.",
          "error",
        );
        setCoverProgress(100);
      }
    })();
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    markFormEdited();
    if (videoObjectUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
      videoObjectUrlRef.current = null;
    }

    const uploadToken = videoUploadTokenRef.current + 1;
    videoUploadTokenRef.current = uploadToken;

    setVideoFile(file);
    setVideoProgress(1);
    setFormData((prev) => ({ ...prev, introVideo: "" }));

    const previewUrl = URL.createObjectURL(file);
    videoObjectUrlRef.current = previewUrl;

    const finishWithUrl = (url: string) => {
      if (videoUploadTokenRef.current !== uploadToken) return;
      setVideoProgress(100);
      setFormData((prev) => ({ ...prev, introVideo: url }));
    };

    if (createdCourseId) {
      try {
        const uploadedUrl = await uploadCourseMediaFile(
          createdCourseId,
          file,
          "intro",
          undefined,
          (percent) => {
            if (videoUploadTokenRef.current !== uploadToken) return;
            setVideoProgress(Math.max(1, Math.min(99, percent)));
          },
        );
        if (videoUploadTokenRef.current !== uploadToken) return;
        URL.revokeObjectURL(previewUrl);
        videoObjectUrlRef.current = uploadedUrl;
        finishWithUrl(uploadedUrl);
      } catch (error) {
        if (videoUploadTokenRef.current !== uploadToken) return;
        URL.revokeObjectURL(previewUrl);
        videoObjectUrlRef.current = null;
        setVideoFile(null);
        setVideoProgress(0);
        setFormData((prev) => ({ ...prev, introVideo: "" }));
        showToast(
          error instanceof Error
            ? error.message
            : "آپلود ویدیوی معرفی انجام نشد.",
          "error",
        );
      }
      return;
    }

    // No course yet — keep local preview after a short premium progress animation.
    await new Promise<void>((resolve) => {
      let current = 1;
      const interval = window.setInterval(() => {
        if (videoUploadTokenRef.current !== uploadToken) {
          window.clearInterval(interval);
          resolve();
          return;
        }
        current = Math.min(100, current + 12);
        setVideoProgress(current);
        if (current >= 100) {
          window.clearInterval(interval);
          resolve();
        }
      }, 70);
    });

    if (videoUploadTokenRef.current !== uploadToken) return;
    finishWithUrl(previewUrl);
  };

  const clearIntroVideo = () => {
    markFormEdited();
    videoUploadTokenRef.current += 1;
    setVideoFile(null);
    setVideoProgress(0);
    if (videoObjectUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(videoObjectUrlRef.current);
    }
    videoObjectUrlRef.current = null;
    setFormData((prev) => ({ ...prev, introVideo: "" }));
  };

  useEffect(() => {
    return () => {
      if (videoObjectUrlRef.current) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
        videoObjectUrlRef.current = null;
      }
      if (coverObjectUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
        coverObjectUrlRef.current = null;
      }
    };
  }, []);

  // Feature actions
  const addOrUpdateFeature = () => {
    if (!featTitle.trim()) return;
    if (editingFeatId && isLockedFeature(editingFeatId)) return;
    markFormEdited();

    if (editingFeatId) {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.id === editingFeatId
            ? { ...f, title: featTitle, icon: featIcon }
            : f,
        ),
      }));
      setEditingFeatId(null);
    } else {
      const newFeat = {
        id: `feat-${Math.random().toString(36).substr(2, 9)}`,
        title: featTitle,
        icon: featIcon,
        color: "primary",
      };
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeat],
      }));
    }
    setFeatTitle("");
  };

  const deleteFeature = (id: string) => {
    if (isLockedFeature(id)) return;
    markFormEdited();
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const editFeature = (feat: { id: string; title: string; icon: string }) => {
    if (isLockedFeature(feat.id)) return;
    markFormEdited();
    setFeatTitle(feat.title);
    setFeatIcon(feat.icon);
    setEditingFeatId(feat.id);
  };

  // Chapter actions
  const addOrUpdateChapter = () => {
    if (!chapTitle.trim()) return;

    if (editingChapId) {
      setFormData((prev) => ({
        ...prev,
        chapters: prev.chapters.map((c) =>
          c.id === editingChapId
            ? { ...c, title: chapTitle, subtitle: chapSubtitle }
            : c,
        ),
      }));
      setEditingChapId(null);
    } else {
      const chapNumber = String(formData.chapters.length + 1).padStart(2, "0");
      const newChap: ChapterModel = {
        id: `chap-${Math.random().toString(36).substr(2, 9)}`,
        title: chapTitle,
        subtitle: chapSubtitle,
        number: chapNumber,
        lessons: [],
      };
      setFormData((prev) => ({
        ...prev,
        chapters: [...prev.chapters, newChap],
      }));
    }
    setChapTitle("");
    setChapSubtitle("");
  };

  const deleteChapter = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== id),
    }));
  };

  const editChapter = (chap: {
    id: string;
    title: string;
    subtitle: string;
  }) => {
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
      duration: "00:00",
      type: "video",
      access: "locked",
    };
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, lessons: [...c.lessons, newLes] } : c,
      ),
    }));
    setEditingLessonTitleId(newLes.id);
  };

  const endEditChapterTitle = (chapterId: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) =>
        chapter.id === chapterId && !chapter.title.trim()
          ? { ...chapter, title: "سرفصل جدید" }
          : chapter,
      ),
    }));
    setEditingChapterTitleId(null);
  };

  const updateChapterTitleInline = (chapId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, title: value } : c,
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
      number: String(idx + 1).padStart(2, "0"),
    }));

    setFormData((prev) => ({ ...prev, chapters: finalChaps }));
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
      const lessonIndex = chapter.lessons.findIndex(
        (lesson) => lesson.id === lessonId,
      );
      if (lessonIndex !== -1) {
        return { chapterId: chapter.id, lessonIndex };
      }
    }

    return null;
  };

  const isChapterDropZone = (id: string) =>
    formData.chapters.some((chapter) => chapter.id === id);

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
    }),
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
    if (
      lastLessonHoverRef.current &&
      `${lastLessonHoverRef.current.activeId}:${lastLessonHoverRef.current.overId}` ===
        signature
    ) {
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
    reorderLessons(
      activeLocation.chapterId,
      activeId,
      overLocation.chapterId,
      overId,
    );
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
      setFormData((prev) => ({
        ...prev,
        chapters: prev.chapters.map(
          (c): ChapterModel => ({
            ...c,
            lessons: c.lessons.map(
              (l): LessonModel =>
                l.id === editingLesId
                  ? {
                      ...l,
                      title: lesTitle,
                      type: lesType,
                      access: (lesAccess === "free" ? "free" : "locked") as
                        | "free"
                        | "locked",
                    }
                  : l,
            ),
          }),
        ),
      }));
      setEditingLesId(null);
    } else {
      const newLes: LessonModel = {
        id: `les-${Math.random().toString(36).substr(2, 9)}`,
        title: lesTitle,
        duration: "00:00",
        type: lesType,
        access: "locked",
      };
      setFormData((prev) => ({
        ...prev,
        chapters: prev.chapters.map(
          (c): ChapterModel =>
            c.id === selectedChapIdForLesson
              ? { ...c, lessons: [...c.lessons, newLes as LessonModel] }
              : c,
        ),
      }));
    }
    setLesTitle("");
  };

  const deleteLesson = (chapId: string, lesId: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? { ...c, lessons: c.lessons.filter((l) => l.id !== lesId) }
          : c,
      ),
    }));
  };

  const reorderLessons = (
    sourceChapterId: string,
    sourceLessonId: string,
    targetChapterId: string,
    targetLessonId?: string,
  ) => {
    if (!sourceChapterId || !sourceLessonId || !targetChapterId) return;

    setFormData((prev) => {
      const nextChapters = prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: [...chapter.lessons],
      }));

      const sourceChapterIndex = nextChapters.findIndex(
        (chapter) => chapter.id === sourceChapterId,
      );
      const targetChapterIndex = nextChapters.findIndex(
        (chapter) => chapter.id === targetChapterId,
      );
      if (sourceChapterIndex < 0 || targetChapterIndex < 0) return prev;

      const sourceChapter = nextChapters[sourceChapterIndex];
      const targetChapter = nextChapters[targetChapterIndex];
      const sourceLessonIndex = sourceChapter.lessons.findIndex(
        (lesson) => lesson.id === sourceLessonId,
      );
      if (sourceLessonIndex < 0) return prev;

      const [movedLesson] = sourceChapter.lessons.splice(sourceLessonIndex, 1);
      const targetLessonIndex = targetLessonId
        ? targetChapter.lessons.findIndex(
            (lesson) => lesson.id === targetLessonId,
          )
        : -1;

      if (targetLessonIndex >= 0) {
        const adjustedTargetIndex =
          sourceChapterId === targetChapterId &&
          sourceLessonIndex < targetLessonIndex
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
    setLesType(les.type);
    setLesAccess(les.access);
    setEditingLesId(les.id);
  };

  const updateLessonTitleInline = (
    chapId: string,
    lesId: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? {
              ...c,
              lessons: c.lessons.map((l) =>
                l.id === lesId ? { ...l, title: value } : l,
              ),
            }
          : c,
      ),
    }));
  };

  const toggleLessonAccess = (chapId: string, lesId: string) => {
    markFormEdited();
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) =>
        chapter.id === chapId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson) =>
                lesson.id === lesId
                  ? {
                      ...lesson,
                      access: lesson.access === "free" ? "locked" : "free",
                    }
                  : lesson,
              ),
            }
          : chapter,
      ),
    }));
  };

  /** Lock or unlock every lesson in a chapter in one action. */
  const toggleChapterAccess = (chapId: string) => {
    markFormEdited();
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => {
        if (chapter.id !== chapId) return chapter;
        const allLocked =
          chapter.lessons.length === 0 ||
          chapter.lessons.every((lesson) => lesson.access === "locked");
        const nextAccess: "free" | "locked" = allLocked ? "free" : "locked";
        return {
          ...chapter,
          lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            access: nextAccess,
          })),
        };
      }),
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

    void (async () => {
      try {
        const seconds = await readVideoDurationFromFile(file);
        const durationLabel = formatVideoDuration(seconds);
        setFormData((prev) => ({
          ...prev,
          chapters: prev.chapters.map((chapter) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson) =>
              lesson.id === lessonId
                ? { ...lesson, duration: durationLabel }
                : lesson,
            ),
          })),
        }));
      } catch {
        // Keep previous duration if metadata cannot be read.
      }
    })();

    if (createdCourseId) {
      try {
        const uploadedUrl = await uploadCourseMediaFile(
          createdCourseId,
          file,
          "lesson",
          lessonId,
        );
        URL.revokeObjectURL(previewUrl);
        delete lessonVideoFilesRef.current[lessonId];
        applyLessonVideoUrl(lessonId, uploadedUrl, file.name);
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "آپلود ویدیوی جلسه انجام نشد.",
          "error",
        );
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
          lesson.id === lessonId ? { ...lesson, videoUrl: undefined } : lesson,
        ),
      })),
    }));
  };

  const endEditLessonTitle = (lessonId: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId && !lesson.title.trim()
            ? { ...lesson, title: "جلسه جدید" }
            : lesson,
        ),
      })),
    }));
    setEditingLessonTitleId(null);
  };

  const lessonRowActions: LessonRowActions = {
    onStartEditTitle: (lessonId) => setEditingLessonTitleId(lessonId),
    onChangeTitle: updateLessonTitleInline,
    onEndEditTitle: endEditLessonTitle,
    onToggleAccess: toggleLessonAccess,
    onOpenFilesModal: (lessonId) =>
      setLessonFilesModal({ open: true, lessonId }),
    onOpenDescriptionEditor: (lessonId) =>
      setLessonDescriptionEditor({
        open: true,
        lessonId,
        value: lessonDescriptionMap[lessonId] || "",
      }),
    onUploadVideo: handleLessonVideoUpload,
    onOpenVideo: (url, title) =>
      setVideoPreview({ url, title: title || "پیش‌نمایش ویدیو" }),
    onRequestDeleteVideo: (lessonId) =>
      openDeleteConfirm(
        "حذف ویدیوی آپلود شده",
        "آیا از حذف این فایل ویدیو مطمئن هستید؟",
        () => removeLessonVideo(lessonId),
      ),
    onRequestDeleteLesson: (chapterId, lessonId) =>
      openDeleteConfirm(
        "حذف جلسه",
        "آیا مطمئن هستید که می‌خواهید این جلسه حذف شود؟",
        () => deleteLesson(chapterId, lessonId),
      ),
  };

  const handleLessonFileUpload = async (lessonId: string, files?: File[]) => {
    if (!lessonId) {
      setLessonFilesError("جلسه‌ای برای آپلود انتخاب نشده است.");
      return;
    }
    if (!files || files.length === 0) return;

    markFormEdited();
    const current = lessonFileMap[lessonId] || [];
    const remaining = Math.max(0, MAX_LESSON_FILES - current.length);
    if (remaining === 0) {
      setLessonFilesError(
        `حداکثر ${MAX_LESSON_FILES} فایل برای هر جلسه مجاز است.`,
      );
      return;
    }

    const selected = files.slice(0, remaining);
    const newEntries = selected.map((file) => ({
      id: `file-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: formatAttachmentSize(file.size),
    }));

    if (!lessonAttachmentFilesRef.current[lessonId]) {
      lessonAttachmentFilesRef.current[lessonId] = {};
    }
    selected.forEach((file, index) => {
      lessonAttachmentFilesRef.current[lessonId][newEntries[index].id] = file;
    });

    let workingFiles = [...current, ...newEntries];
    setLessonFileMap((prev) => ({
      ...prev,
      [lessonId]: workingFiles,
    }));
    setLessonFilesError("");

    if (createdCourseId) {
      for (const entry of newEntries) {
        const file = lessonAttachmentFilesRef.current[lessonId]?.[entry.id];
        if (!file) continue;
        try {
          const uploadedUrl = await uploadCourseMediaFile(
            createdCourseId,
            file,
            "attachment",
            lessonId,
          );
          URL.revokeObjectURL(entry.url);
          delete lessonAttachmentFilesRef.current[lessonId]?.[entry.id];
          workingFiles = workingFiles.map((item) =>
            item.id === entry.id ? { ...item, url: uploadedUrl } : item,
          );
        } catch (error) {
          showToast(
            error instanceof Error
              ? error.message
              : "آپلود فایل ضمیمه انجام نشد.",
            "error",
          );
        }
      }
      setLessonFileMap((prev) => ({ ...prev, [lessonId]: workingFiles }));
      applyLessonAttachments(lessonId, workingFiles);
    }
  };

  const removeLessonFile = (lessonId: string, fileId: string) => {
    markFormEdited();
    const list = lessonFileMap[lessonId] || [];
    const target = list.find((f) => f.id === fileId);
    if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
    delete lessonAttachmentFilesRef.current[lessonId]?.[fileId];
    const nextList = list.filter((f) => f.id !== fileId);
    setLessonFileMap((prev) => {
      const copy = { ...prev };
      if (nextList.length) copy[lessonId] = nextList;
      else delete copy[lessonId];
      return copy;
    });
    applyLessonAttachments(lessonId, nextList);
  };

  const DEFAULT_FAQ_QUESTION = "سوال جدید";
  const DEFAULT_FAQ_ANSWER = "پاسخ این سوال را وارد کنید.";

  // FAQ actions
  const addFAQBox = () => {
    const newFaq = {
      id: `faq-${Math.random().toString(36).substr(2, 9)}`,
      question: DEFAULT_FAQ_QUESTION,
      answer: DEFAULT_FAQ_ANSWER,
    };
    setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    setOpenFaqItemId(newFaq.id);
  };

  const deleteFAQ = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
  };

  const updateFAQQuestionInline = (faqId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) =>
        f.id === faqId ? { ...f, question: value } : f,
      ),
    }));
  };

  const updateFAQAnswerInline = (faqId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) =>
        f.id === faqId ? { ...f, answer: value } : f,
      ),
    }));
  };

  // List updates
  const addHighlightItem = () => {
    if (
      newHighlight.trim() &&
      !formData.aboutHighlights.includes(newHighlight.trim())
    ) {
      setFormData((p) => ({
        ...p,
        aboutHighlights: [...p.aboutHighlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlightItem = (item: string) => {
    setFormData((p) => ({
      ...p,
      aboutHighlights: p.aboutHighlights.filter((h) => h !== item),
    }));
  };

  const openDeleteConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
  ) => {
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
      if (
        formData.isPaid === "paid" &&
        (!formData.price || formData.price <= 0)
      ) {
        newErrors.price = "قیمت دوره نقدی باید بیشتر از صفر باشد.";
      }
      if (!formData.duration.trim())
        newErrors.duration = "مدت زمان دوره الزامی است.";
      if (!formData.level) newErrors.level = "سطح آموزشی دوره الزامی است.";
    }

    if (currentStep === 2) {
      if (!formData.heroTitle.trim())
        newErrors.heroTitle = "عنوان معرفی هیرو الزامی است.";
      if (!formData.shortDescription.trim())
        newErrors.shortDescription = "توضیح کوتاه هیرو الزامی است.";
    }

    if (currentStep === 3) {
      if (!formData.aboutDescription.trim())
        newErrors.aboutDescription = "توضیحات درباره این دوره الزامی است.";
      if (formData.faqs.length === 0) {
        newWarnings.faqs =
          "توصیه می‌شود حداقل یک سوال متداول جهت راهنمایی دانشجویان اضافه کنید.";
      }
    }

    if (currentStep === 4) {
      if (formData.chapters.length === 0)
        newErrors.chapters = "حداقل وارد کردن یک فصل آموزشی الزامی است.";
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    return Object.keys(newErrors).length === 0;
  };

  const hasPendingWizardMedia = () => {
    if (
      coverFile &&
      (!formData.cover ||
        formData.cover.startsWith("blob:") ||
        formData.cover.startsWith("data:"))
    ) {
      return true;
    }
    if (
      videoFile &&
      (!formData.introVideo || formData.introVideo.startsWith("blob:"))
    ) {
      return true;
    }
    if (Object.keys(lessonVideoFilesRef.current).length > 0) return true;
    return Object.values(lessonAttachmentFilesRef.current).some(
      (filesById) => Object.keys(filesById).length > 0,
    );
  };

  const captureWizardSnapshot = (
    form = formData,
    descriptions = lessonDescriptionMap,
    files = lessonFileMap,
  ) => buildWizardDirtySnapshot(form, descriptions, files);

  const hasAnyFormInput = () => {
    return (
      formData.title.trim().length > 0 ||
      formData.heroTitle.trim().length > 0 ||
      formData.shortDescription.trim().length > 0 ||
      formData.aboutDescription.trim().length > 0 ||
      Boolean(formData.cover) ||
      Boolean(formData.introVideo) ||
      formData.chapters.length > 0 ||
      formData.faqs.length > 0 ||
      hasPendingWizardMedia() ||
      userEditedFormRef.current
    );
  };

  const isWizardDirty = () => {
    if (isNavigatingBypassRef.current) return false;
    if (lastSavedSnapshotRef.current === null) {
      return hasAnyFormInput();
    }
    if (hasPendingWizardMedia()) return true;
    return captureWizardSnapshot() !== lastSavedSnapshotRef.current;
  };

  // Browser reload / close tab / URL change listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isWizardDirty()) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  // Intercept in-app link clicks (Sidebar, header, etc.)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (isNavigatingBypassRef.current) return;
      if (!isWizardDirty()) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor || !anchor.href) return;

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.origin === currentUrl.origin &&
          targetUrl.pathname === currentUrl.pathname
        ) {
          return;
        }

        if (
          anchor.getAttribute("download") != null ||
          (targetUrl.pathname === currentUrl.pathname && targetUrl.hash)
        ) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        setPendingNavigationUrl(anchor.href);
        setUnsavedModalOpen(true);
      } catch {
        // ignore URL parse errors
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
  });

  // Intercept browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (isNavigatingBypassRef.current) return;
      if (isWizardDirty()) {
        window.history.pushState(null, "", window.location.href);
        setPendingNavigationUrl("BACK");
        setUnsavedModalOpen(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });

  const confirmLeave = () => {
    isNavigatingBypassRef.current = true;
    setUnsavedModalOpen(false);
    const target = pendingNavigationUrl;
    setPendingNavigationUrl(null);

    if (target === "BACK") {
      window.history.back();
    } else if (target) {
      window.location.href = target;
    }
  };

  const cancelLeave = () => {
    setUnsavedModalOpen(false);
    setPendingNavigationUrl(null);
  };

  const syncCourseDraftStepInCache = (courseId: string, draftStep: number) => {
    queryClient.setQueryData<InstructorCourseRow[]>(
      instructorCoursesQueryKey,
      (prev) => {
        if (!prev) return prev;
        return prev.map((course) =>
          course.id === courseId ? { ...course, draftStep } : course,
        );
      },
    );
  };

  const persistDraftStepOnly = async (courseId: string, nextStep: number) => {
    await apiPatchNoMock(
      `/api/instructor-dashboard/courses/${encodeURIComponent(courseId)}/draft`,
      { step: nextStep },
    );
    syncCourseDraftStepInCache(courseId, nextStep);
  };

  // Navigation handlers
  const persistCourseDraft = async (
    currentStep = step,
    options?: { silent?: boolean; formOverrides?: Partial<WizardFormData> },
  ): Promise<string | null> => {
    const existingCourseId = createdCourseId ?? draftCourseId;
    let mediaOverrides: Partial<WizardFormData> = { ...options?.formOverrides };
    const initialResponse = await apiPostNoMock<unknown>(
      "/api/instructor-dashboard/courses/drafts",
      buildCourseDraftPayload(currentStep, mediaOverrides, existingCourseId),
    );
    const courseId = extractCourseId(initialResponse) || existingCourseId;

    if (!courseId) {
      return null;
    }

    setCreatedCourseId(courseId);

    const uploadedMedia = await uploadPendingCourseMedia(courseId);
    if (Object.keys(uploadedMedia).length > 0) {
      mediaOverrides = {
        ...options?.formOverrides,
        ...uploadedMedia,
      };
      await apiPostNoMock<unknown>(
        "/api/instructor-dashboard/courses/drafts",
        buildCourseDraftPayload(currentStep, mediaOverrides, courseId),
      );
      if (uploadedMedia.cover) {
        setFormData((prev) => ({ ...prev, cover: uploadedMedia.cover as string }));
        setCoverFile(null);
      }
      if (uploadedMedia.introVideo) {
        setFormData((prev) => ({
          ...prev,
          introVideo: uploadedMedia.introVideo as string,
        }));
      }
      if (uploadedMedia.chapters) {
        setFormData((prev) => ({
          ...prev,
          chapters: uploadedMedia.chapters as ChapterModel[],
        }));
      }
      setVideoFile(null);
    }

    if (options?.formOverrides?.heroTitle) {
      setFormData((prev) => ({
        ...prev,
        heroTitle: options.formOverrides?.heroTitle as string,
      }));
    }

    const payload = buildStep1CoursePayload();
    const nextFormForSnapshot = {
      ...formData,
      ...options?.formOverrides,
      ...(uploadedMedia.cover ? { cover: uploadedMedia.cover } : {}),
      ...(uploadedMedia.introVideo
        ? { introVideo: uploadedMedia.introVideo }
        : {}),
      ...(uploadedMedia.chapters
        ? { chapters: uploadedMedia.chapters as ChapterModel[] }
        : {}),
    };
    lastSavedSnapshotRef.current = captureWizardSnapshot(nextFormForSnapshot);
    userEditedFormRef.current = false;

    if (courseId) {
      setCreatedCourseId(courseId);
      const nextCover = persistableMediaUrl(nextFormForSnapshot.cover);
      queryClient.setQueryData<InstructorCourseRow[]>(
        instructorCoursesQueryKey,
        (prev) => {
          const row: InstructorCourseRow = {
            id: courseId,
            cover: nextCover || "/images/course1.jpg",
            title: formData.title,
            status: "draft",
            category: formData.category,
            studentsCount: 0,
            revenue: 0,
            updatedAt: new Date().toISOString(),
            slug: payload.slug ?? "",
            shortDescription: formData.shortDescription,
            level: formData.level,
            price: payload.price,
            rating: 0,
            durationHours: Number(formData.duration) || 0,
            createdAt: new Date().toISOString(),
            draftStep: currentStep,
          };
          if (!prev) return [row];
          const exists = prev.some((course) => course.id === courseId);
          return exists
            ? prev.map((course) =>
                course.id === courseId
                  ? {
                      ...course,
                      title: row.title,
                      cover: row.cover,
                      category: row.category,
                      shortDescription: row.shortDescription,
                      level: row.level,
                      price: row.price,
                      draftStep: currentStep,
                      updatedAt: row.updatedAt,
                    }
                  : course,
              )
            : [row, ...prev];
        },
      );
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
      if (!options?.silent) {
        showToast("پیش‌نویس دوره ذخیره شد.", "success");
      }
      return localCourseId;
    }

    if (!options?.silent) {
      showToast("پیش‌نویس دوره ذخیره شد.", "success");
    }
    return courseId;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    const nextStep = clampWizardStep(step + 1);
    const existingCourseId = createdCourseId ?? draftCourseId;
    const heroTitlePrefill =
      step === 1 &&
      !heroTitleTouchedRef.current &&
      !formData.heroTitle.trim() &&
      formData.title.trim()
        ? formData.title
        : null;
    const formOverrides = heroTitlePrefill
      ? { heroTitle: heroTitlePrefill }
      : undefined;

    if (heroTitlePrefill) {
      setFormData((prev) => ({ ...prev, heroTitle: heroTitlePrefill }));
    }

    const dirty = Boolean(formOverrides) || isWizardDirty();

    try {
      setIsSavingStep1(true);

      let savedCourseId = existingCourseId;

      if (dirty || !existingCourseId) {
        // Persist form data and set resume position to the *next* step so leaving
        // mid-wizard reopens on the step they advanced into.
        savedCourseId = await persistCourseDraft(nextStep, { formOverrides });
        if (!savedCourseId) return;
      }
      // No field changes → skip draft payload POST; just advance the wizard UI.

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

  const handleSubmitWizard = async (
    status: "published" | "draft" | "pending",
  ) => {
    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3) ||
      !validateStep(4)
    ) {
      goToStep(1, true);
      return;
    }

    // Map wizard chapters to DB schema chapter/lessons
    const chaptersWithMeta = buildChaptersWithLessonMeta(
      formData.chapters,
      lessonDescriptionMap,
      lessonFileMap,
    );
    const formattedChapters: Course["chapters"] = chaptersWithMeta.map(
      (chap) => ({
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
          ...(les.videoUrl ? { videoUrl: les.videoUrl } : {}),
          ...(les.description ? { description: les.description } : {}),
          ...(les.attachments?.length ? { attachments: les.attachments } : {}),
        })),
      }),
    );

    // Construct partial course object
    const finalCoursePayload: Partial<Course> = {
      title: formData.title,
      cover:
        formData.cover ||
        "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
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
      specialWords: formData.specialWords,
    };

    try {
      setIsSavingStep1(true);
      let courseId = createdCourseId ?? draftCourseId ?? null;
      const dirty = isWizardDirty();

      if (dirty || !courseId || hasPendingWizardMedia()) {
        const initialResponse = await apiPostNoMock<unknown>(
          "/api/instructor-dashboard/courses/drafts",
          buildCourseDraftPayload(5, undefined, courseId),
        );
        courseId = extractCourseId(initialResponse) || courseId;
        if (!courseId) {
          throw new Error("شناسه دوره از سرور دریافت نشد.");
        }
        setCreatedCourseId(courseId);

        const mediaOverrides = await uploadPendingCourseMedia(courseId);
        if (Object.keys(mediaOverrides).length > 0) {
          await apiPostNoMock<unknown>(
            "/api/instructor-dashboard/courses/drafts",
            buildCourseDraftPayload(5, mediaOverrides, courseId),
          );
        }
        lastSavedSnapshotRef.current = captureWizardSnapshot();
        userEditedFormRef.current = false;
      } else if (courseId) {
        // Ensure final resume step is 5 without re-sending unchanged draft payload.
        await persistDraftStepOnly(courseId, 5);
      }

      if (!courseId) {
        throw new Error("شناسه دوره از سرور دریافت نشد.");
      }

      if (status === "pending" || status === "published") {
        const publishResponse = await apiPatchNoMock<unknown>(
          `/api/instructor-dashboard/courses/${encodeURIComponent(courseId)}/publish`,
          {},
        );
        const publishedRecord =
          publishResponse &&
          typeof publishResponse === "object" &&
          "data" in publishResponse
            ? ((publishResponse as { data?: Record<string, unknown> }).data ??
              {})
            : {};
        const nextStatus =
          publishedRecord.status === "published" ? "published" : "pending";
        updateCourse(courseId, {
          ...finalCoursePayload,
          status: nextStatus,
          draftStep: 5,
        });
        showToast(
          nextStatus === "published"
            ? "دوره با موفقیت منتشر شد."
            : "دوره برای بررسی و تایید ادمین ارسال شد.",
          "success",
        );
      } else {
        updateCourse(courseId, {
          ...finalCoursePayload,
          status: "draft",
          draftStep: 5,
        });
        showToast("دوره به عنوان پیش‌نویس ذخیره شد.", "success");
      }

      setCreatedCourseId(courseId);
      syncCourseDraftStepInCache(courseId, 5);
      router.push("/instructor/courses");
    } catch (error) {
      console.error("Failed to submit course wizard", error);
      showToast(
        error instanceof Error ? error.message : "ثبت نهایی دوره انجام نشد.",
        "error",
      );
    } finally {
      setIsSavingStep1(false);
    }
  };

  // Total lessons count
  const totalLessonsCount = formData.chapters.reduce(
    (sum, ch) => sum + ch.lessons.length,
    0,
  );

  const finalPreviewChapters = useMemo(
    () =>
      formData.chapters.map((chapter) => ({
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
        subtitle: chapter.subtitle,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration || "",
          isFree: lesson.access === "free",
          isLocked: lesson.access === "locked",
          isUnlocked: true,
          videoUrl: (
            lesson.videoUrl ||
            lessonVideoMap[lesson.id]?.url ||
            ""
          ).trim(),
        })),
      })),
    [formData.chapters, lessonVideoMap],
  );

  useEffect(() => {
    if (!finalPreviewNotice) return;
    const timeoutId = window.setTimeout(() => setFinalPreviewNotice(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [finalPreviewNotice]);

  return (
    <div
      className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 text-right min-h-screen overflow-x-hidden"
      dir="rtl"
    >
      {/* 1. Page Header */}
      <div className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-6 sm:mb-10 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 leading-snug">
              استودیوی پیشرفته ایجاد دوره جدید
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
              ساده، گام‌به‌گام و مجهز به پیش‌نمایش زنده و کاملاً هماهنگ با صفحه
              نهایی و واقعی دوره.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stepper Area */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 mb-6 sm:mb-10">
        {/* Mobile: compact current-step banner */}
        <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
          <div className="min-w-0 text-right">
            <p className="text-[10px] font-bold text-gray-500">
              مرحله {step.toLocaleString("fa-IR")} از ۵
            </p>
            <p className="text-xs font-black text-gray-900 dark:text-white truncate">
              {
                [
                  "اطلاعات کارت دوره",
                  "معرفی و هیرو دوره",
                  "جزئیات و محتوای دوره",
                  "ویدیوها و جلسات",
                  "بررسی نهایی",
                ][step - 1]
              }
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-black text-primary">
            {Math.round(((step - 1) / 4) * 100)}٪
          </span>
        </div>

        <div className="relative flex items-start justify-between overflow-x-auto sm:overflow-visible pt-1 sm:pt-2 pb-2 sm:pb-0 scrollbar-none gap-3 sm:gap-6 -mx-1 px-1">
          {/* Connector Line behind steps */}
          <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-6 sm:top-8 -translate-y-1/2 h-[2px] sm:h-[3px] bg-gray-100 dark:bg-white/10 z-0">
            {/* Active Connector Progress */}
            <div
              className="absolute right-0 top-0 h-full bg-primary transition-all duration-500"
              style={{
                width:
                  step === 1
                    ? "0%"
                    : step === 2
                      ? "25%"
                      : step === 3
                        ? "50%"
                        : step === 4
                          ? "75%"
                          : "100%",
              }}
            />
          </div>

          {[
            {
              stepNum: 1,
              label: "اطلاعات کارت دوره",
              shortLabel: "کارت",
              desc: "تصویر، قیمت و مشخصات",
            },
            {
              stepNum: 2,
              label: "معرفی و هیرو دوره",
              shortLabel: "هیرو",
              desc: "ویدیو، شعار و کلمات ویژه",
            },
            {
              stepNum: 3,
              label: "جزئیات و محتوای دوره",
              shortLabel: "جزئیات",
              desc: "ویژگی‌ها، توضیحات و سوالات",
            },
            {
              stepNum: 4,
              label: "ویدیوها و جلسات",
              shortLabel: "ویدیو",
              desc: "مدیریت سرفصل و فایل‌ها",
            },
            {
              stepNum: 5,
              label: "بررسی نهایی",
              shortLabel: "نهایی",
              desc: "پیش‌نمایش کلی و انتشار",
            },
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
                disabled={!isReachable || isLoadingDraft}
                className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed group shrink-0 min-w-[3.25rem] sm:min-w-0"
              >
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-background-dark shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-105 sm:scale-110 z-20"
                      : isVisited
                        ? "bg-[#e6fbf0] dark:bg-[#132d21] text-primary border border-primary/20 z-10"
                        : "bg-gray-100 dark:bg-[#252833] text-gray-400 dark:text-gray-600 border border-transparent z-10"
                  }`}
                >
                  {isVisited ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    item.stepNum
                  )}
                </div>
                <div className="text-center max-w-[72px] sm:max-w-[120px]">
                  <span
                    className={`text-[9px] sm:text-xs block transition-all duration-300 leading-tight ${
                      isActive
                        ? "text-primary font-black"
                        : isVisited
                          ? "text-gray-800 dark:text-gray-200 font-bold"
                          : "text-gray-400 dark:text-gray-600 font-medium"
                    }`}
                  >
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                  <span
                    className={`hidden sm:block text-[9px] font-bold mt-1 transition-all duration-300 ${
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
          className={`w-full bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-5 md:p-6 lg:p-7 min-h-0 sm:min-h-[520px] flex flex-col justify-between ${
            step === 1 ? "lg:col-span-6 lg:order-1" : ""
          }`}
        >
          {isLoadingDraft ? (
            <CreateCourseWizardFormSkeleton step={step} />
          ) : (
            <>
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
                    این اطلاعات در لیست دوره‌ها و کارت کوچک دوره نمایش داده
                    می‌شود.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="flex flex-col gap-2.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      نام دوره <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: استایل‌دهی با CSS"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className={`px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.title ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
                    />
                    {errors.title && (
                      <span className="text-[10px] text-red-500 font-bold">
                        {errors.title}
                      </span>
                    )}
                  </div>

                  {/* Level */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      سطح آموزشی دوره
                    </label>
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
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      دسته‌بندی اصلی
                    </label>
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
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    وضعیت قیمت دوره
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, isPaid: "free" }));
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
                      onClick={() =>
                        setFormData((p) => ({ ...p, isPaid: "paid" }))
                      }
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
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      مدت زمان دوره <span className="text-red-500">*</span>
                    </label>
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
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        قیمت دوره (به تومان){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="1450000"
                          value={
                            formData.price === 0 ? "" : String(formData.price)
                          }
                          onChange={handlePriceChange}
                          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.price ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-black focus:border-primary focus:outline-none transition-all text-left`}
                          dir="ltr"
                        />
                        <span className="absolute right-4 text-xs font-bold text-gray-400">
                          تومان
                        </span>
                      </div>
                      {errors.price && (
                        <span className="text-[10px] text-red-500 font-bold">
                          {errors.price}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Cover Image Upload (Mock) */}
                <div className="flex flex-col gap-3.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    تصویر کاور دوره
                  </label>
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
                        <p className="text-[9px] text-gray-400 font-bold">
                          PNG, JPG حداکثر ۵ مگابایت (اندازه 16:9)
                        </p>
                      </>
                    ) : coverProgress < 100 ? (
                      <div className="w-full space-y-2 px-4 z-20">
                        <FileImage className="w-8 h-8 text-primary mx-auto" />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>درحال آپلود...</span>
                          <span>{coverProgress}٪</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${coverProgress}%` }}
                          />
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
                          <span>
                            {coverFile?.name} (
                            {Math.round((coverFile?.size || 0) / 1024)} KB)
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markFormEdited();
                            if (coverObjectUrlRef.current?.startsWith("blob:")) {
                              URL.revokeObjectURL(coverObjectUrlRef.current);
                            }
                            coverObjectUrlRef.current = null;
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
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله دوم: هیرو و معرفی دوره
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    این جزئیات در ابتدای صفحه اختصاصی دوره قرار دارند و نرخ
                    تبدیل دانشجو را می‌سازند.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Right Column: Hero Texts */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-5 md:p-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/[0.08] shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-base">title</span>
                        </span>
                        <span className="text-xs font-black text-gray-900 dark:text-white">
                          اطلاعات متنی هیرو
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-700 dark:text-gray-200">
                          عنوان اصلی هیرو <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: متخصص React و Next.js"
                          value={formData.heroTitle}
                          onChange={(e) => {
                            heroTitleTouchedRef.current = true;
                            markFormEdited();
                            setFormData((p) => ({
                              ...p,
                              heroTitle: e.target.value,
                            }));
                          }}
                          className={`px-4 py-3 ${WIZARD_FIELD_CLASS} text-xs font-bold text-right ${errors.heroTitle ? "border-red-500 ring-2 ring-red-500/15" : ""}`}
                        />
                        {errors.heroTitle && (
                          <span className="text-[10px] font-bold text-red-500">
                            {errors.heroTitle}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-black text-gray-700 dark:text-gray-200">
                            توضیح کوتاه هیرو <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] font-bold tabular-nums text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                            {formData.shortDescription.length.toLocaleString("fa-IR")} از{" "}
                            {(180).toLocaleString("fa-IR")}
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="توضیح کوتاهی که در هیرو بالای صفحه قرار می‌گیرد و هدف دوره را بیان می‌کند..."
                          value={formData.shortDescription}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              shortDescription: e.target.value,
                            }))
                          }
                          className={`min-h-[105px] px-4 py-3 ${WIZARD_FIELD_CLASS} text-xs font-bold text-right leading-relaxed ${errors.shortDescription ? "border-red-500 ring-2 ring-red-500/15" : ""}`}
                        />
                        {errors.shortDescription && (
                          <span className="text-[10px] font-bold text-red-500">
                            {errors.shortDescription}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 dark:bg-primary/[0.06] border border-primary/15 p-3 text-[11px] text-gray-600 dark:text-gray-300">
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">
                        lightbulb
                      </span>
                      <span>
                        عنوان و توضیح هیرو اولین بخشی است که دانشجویان مشاهده می‌کنند. جذاب و مختصر بنویسید.
                      </span>
                    </div>
                  </div>

                  {/* Left Column: Video Intro & Upload */}
                  <div className="lg:col-span-5 flex flex-col p-5 md:p-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/[0.08] shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                          <span className="material-symbols-outlined text-base">video_library</span>
                        </span>
                        <div>
                          <span className="text-xs font-black text-gray-900 dark:text-white block">
                            ویدیوی معرفی دوره
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            اختیاری · MP4 یا MKV تا ۵۰MB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-h-[220px]">
                      {videoProgress > 0 && videoProgress < 100 ? (
                        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white to-emerald-500/[0.06] p-5 shadow-sm dark:from-primary/[0.14] dark:via-[#1c1e26] dark:to-emerald-500/[0.08] dark:border-primary/20">
                          <div className="relative z-10 flex flex-col items-center text-center gap-3">
                            <div className="relative flex size-14 shrink-0 items-center justify-center">
                              <svg className="size-14 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="27"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="5"
                                  className="text-gray-200/80 dark:text-white/10"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="27"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 27}`}
                                  strokeDashoffset={`${2 * Math.PI * 27 * (1 - videoProgress / 100)}`}
                                  className="text-primary transition-[stroke-dashoffset] duration-300 ease-out drop-shadow-[0_0_10px_rgba(36,180,126,0.45)]"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black tabular-nums text-primary">
                                {videoProgress.toLocaleString("fa-IR")}٪
                              </span>
                            </div>

                            <div>
                              <p className="text-xs font-black text-gray-900 dark:text-white">
                                در حال آپلود ویدیو
                              </p>
                              <p className="mt-0.5 truncate text-[10px] font-bold text-gray-500 dark:text-gray-400 max-w-[200px]">
                                {videoFile?.name || "ویدیو"}
                              </p>
                            </div>

                            <div className="w-full space-y-1">
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                                <div
                                  className="h-full rounded-full bg-primary shadow-xs transition-[width] duration-300 ease-out"
                                  style={{ width: `${videoProgress}%` }}
                                />
                              </div>
                              <p className="text-[9px] font-bold text-gray-400">
                                صفحه را تا پایان باز نگه دارید
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : formData.introVideo ? (
                        <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-black">
                          <CustomVideoPlayer
                            key={formData.introVideo}
                            src={formData.introVideo}
                            compact
                            forceLandscape
                          />
                          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#14161c] px-3 py-2.5">
                            <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                              <Check className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">
                                {videoFile?.name || "ویدیوی معرفی بارگذاری شد"}
                              </span>
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary">
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
                                className="cursor-pointer rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-400 transition-colors hover:bg-red-500/20"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`relative ${WIZARD_DROPZONE_CLASS} flex flex-1 min-h-[190px] flex-col items-center justify-center p-6 text-center`}
                        >
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                          />
                          <span className="mb-2.5 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <UploadCloud className="h-5 w-5" />
                          </span>
                          <p className="mb-1 text-xs font-black text-gray-700 dark:text-gray-300">
                            انتخاب یا رها کردن ویدیو
                          </p>
                          <p className="text-[10px] font-medium text-gray-400">
                            MP4 یا MKV حداکثر ۵۰ مگابایت
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COURSE DETAILS & FAQ */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله سوم: محتوای عمیق صفحه دوره
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                    در این مرحله توضیحات کامل درباره دوره و سوالات متداول را تعریف کنید.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Right Column: About Section */}
                  <div className="lg:col-span-7 p-5 md:p-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/[0.08] space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-base">description</span>
                      </span>
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        ۱. بخش درباره این دوره
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        توضیحات درباره دوره (پاراگراف‌ها){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <HighlightableTextareaWithBadges
                        rows={5}
                        placeholder="متن کامل درباره دوره، اهداف و مهارت‌هایی که دانشجو یاد می‌گیرد..."
                        value={formData.aboutDescription}
                        onChange={(value) =>
                          setFormData((p) => ({
                            ...p,
                            aboutDescription: value,
                          }))
                        }
                        highlights={formData.aboutHighlights}
                        onAddHighlight={(value) => {
                          const normalizedValue = value.trim();
                          if (
                            !normalizedValue ||
                            formData.aboutHighlights.includes(normalizedValue)
                          )
                            return;
                          setFormData((prev) => ({
                            ...prev,
                            aboutHighlights: [
                              ...prev.aboutHighlights,
                              normalizedValue,
                            ],
                          }));
                        }}
                        onRemoveHighlight={(item) =>
                          openDeleteConfirm(
                            "حذف عبارت هایلایت",
                            "آیا مطمئن هستید که می‌خواهید این عبارت حذف شود؟",
                            () => removeHighlightItem(item),
                          )
                        }
                        manualValue={newHighlight}
                        onManualValueChange={setNewHighlight}
                        onManualAdd={addHighlightItem}
                        error={errors.aboutDescription}
                        textareaClassName={`px-4 py-3 bg-gray-50 dark:bg-white/[0.04] border ${errors.aboutDescription ? "border-red-500" : "border-gray-200/60 dark:border-white/[0.08]"} rounded-xl text-xs font-medium focus:border-primary focus:outline-none transition-all text-right leading-7`}
                        inputClassName="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-xl text-[11px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                        addButtonClassName="h-10 px-4 sm:px-3 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                        removeButtonClassName="cursor-pointer"
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-2 rounded-xl bg-primary/5 dark:bg-primary/[0.06] border border-primary/15 p-3 text-[11px] text-gray-600 dark:text-gray-300">
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">
                        info
                      </span>
                      <span>
                        عبارات کلیدی و هایلایت‌ها به شکل بج در صفحه دوره نمایش داده می‌شوند.
                      </span>
                    </div>
                  </div>

                  {/* Left Column: FAQ Section */}
                  <div className="lg:col-span-5 p-5 md:p-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/[0.08] space-y-4 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <HelpCircle className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs font-black text-gray-900 dark:text-white block">
                            ۲. سوالات متداول
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                        {formData.faqs.length.toLocaleString("fa-IR")} سوال
                      </span>
                    </div>

                    {warnings.faqs && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 rounded-xl text-[10px] font-bold flex items-center gap-1.5 leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{warnings.faqs}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addFAQBox}
                      className="w-full py-2.5 bg-primary/15 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن سوال جدید</span>
                    </button>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {formData.faqs.length === 0 ? (
                        <div className="py-8 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/[0.02]">
                          <span className="material-symbols-outlined text-3xl text-gray-400 mb-1 block">
                            quiz
                          </span>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            هنوز سوالی اضافه نکرده‌اید
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            روی دکمه افزودن سوال جدید کلیک کنید
                          </p>
                        </div>
                      ) : (
                        formData.faqs.map((faq) => {
                          const isOpen = openFaqItemId === faq.id;
                          return (
                            <div
                              key={faq.id}
                              className={`rounded-2xl border transition-all ${
                                isOpen
                                  ? "bg-gray-50/90 dark:bg-white/[0.06] border-gray-200 dark:border-white/15"
                                  : "bg-gray-50/70 dark:bg-white/[0.03] border-gray-200/90 dark:border-white/12"
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (dragOverFaqId !== faq.id)
                                  setDragOverFaqId(faq.id);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedFaqId)
                                  reorderFaqs(draggedFaqId, faq.id);
                                setDraggedFaqId(null);
                                setDragOverFaqId(null);
                              }}
                              onDragLeave={(e) => {
                                const next = e.relatedTarget as Node | null;
                                if (!next || !e.currentTarget.contains(next))
                                  setDragOverFaqId(null);
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenFaqItemId((prev) =>
                                    prev === faq.id ? null : faq.id,
                                  )
                                }
                                className={`w-full px-4 py-3 flex items-center justify-between gap-2 text-right cursor-pointer ${
                                  dragOverFaqId === faq.id
                                    ? "ring-2 ring-primary/20 rounded-2xl"
                                    : ""
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
                                    placeholder={DEFAULT_FAQ_QUESTION}
                                    onChange={(e) =>
                                      updateFAQQuestionInline(
                                        faq.id,
                                        e.target.value,
                                      )
                                    }
                                    onBlur={() => setEditingFaqQuestionId(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        setEditingFaqQuestionId(null);
                                    }}
                                    className="h-8 w-full max-w-[75%] px-2.5 rounded-lg border border-primary/40 bg-white dark:bg-white/5 text-xs font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                ) : (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (faq.question === DEFAULT_FAQ_QUESTION) {
                                        updateFAQQuestionInline(faq.id, "");
                                      }
                                      setEditingFaqQuestionId(faq.id);
                                    }}
                                    className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[75%] cursor-text text-right"
                                  >
                                    {faq.question || DEFAULT_FAQ_QUESTION}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 shrink-0">
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteConfirm(
                                        "حذف سوال متداول",
                                        "آیا مطمئن هستید که می‌خواهید این سوال حذف شود؟",
                                        () => deleteFAQ(faq.id),
                                      );
                                    }}
                                    className="size-7 inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </span>
                                  <span className="size-7 inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500">
                                    <ChevronDown
                                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    />
                                  </span>
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-3.5 pt-0 border-t border-gray-200/70 dark:border-white/10">
                                  {editingFaqAnswerId === faq.id ? (
                                    <textarea
                                      autoFocus
                                      rows={3}
                                      value={faq.answer}
                                      placeholder={DEFAULT_FAQ_ANSWER}
                                      onChange={(e) =>
                                        updateFAQAnswerInline(
                                          faq.id,
                                          e.target.value,
                                        )
                                      }
                                      onBlur={() => setEditingFaqAnswerId(null)}
                                      className="mt-3 w-full px-3 py-2 rounded-lg border border-primary/40 bg-white dark:bg-white/5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                                    />
                                  ) : (
                                    <p
                                      onClick={() => {
                                        if (faq.answer === DEFAULT_FAQ_ANSWER) {
                                          updateFAQAnswerInline(faq.id, "");
                                        }
                                        setEditingFaqAnswerId(faq.id);
                                      }}
                                      className="pt-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed text-right w-full cursor-text"
                                    >
                                      {faq.answer || DEFAULT_FAQ_ANSWER}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: LESSONS & CHAPTER CURRICULUM EDITOR */}
            {step === 4 && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-5 sm:h-6 bg-primary rounded-full shrink-0" />
                    <span className="leading-snug">
                      مرحله چهارم: مدیریت ویدیوها و جلسات
                    </span>
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1.5 leading-relaxed">
                    با آپلود ویدیو، مدت زمان هر جلسه به‌صورت خودکار از فایل
                    محاسبه می‌شود و قابل ویرایش نیست.
                  </p>
                </div>

                <div className="p-3.5 sm:p-5 md:p-6 bg-gradient-to-b from-[#15171e] via-[#12141a] to-[#101218] rounded-2xl sm:rounded-[1.75rem] border border-white/[0.08] space-y-4 sm:space-y-5 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)]">
                  <div className="flex flex-col gap-1 border-b border-white/[0.06] pb-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-sm font-black text-white block">
                        سرفصل‌ها و جلسات درسی
                      </span>
                      <p className="text-[10px] text-gray-500 font-bold mt-1 leading-relaxed">
                        هر ویدیو پیش‌فرض قفل است. مدت زمان بعد از آپلود خودکار
                        پر می‌شود.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      {formData.chapters.length} سرفصل
                    </span>
                  </div>
                  {errors.chapters && (
                    <span className="text-[10px] text-red-500 font-bold block">
                      {errors.chapters}
                    </span>
                  )}

                  <div className="flex justify-stretch sm:justify-end">
                    <button
                      type="button"
                      onClick={addChapterInline}
                      className="h-11 w-full sm:w-auto px-4 bg-primary text-white rounded-xl text-xs font-black transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/25 hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن سرفصل جدید
                    </button>
                  </div>

                  <div className="rounded-2xl bg-black/20 border border-white/[0.06] p-2.5 sm:p-3 md:p-4">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3 gap-2">
                      <span className="text-xs font-black text-white">
                        لیست فصل‌ها و جلسات
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 shrink-0">
                        {formData.chapters.length} فصل
                      </span>
                    </div>
                    <DndContext
                      sensors={lessonDragSensors}
                      collisionDetection={closestCorners}
                      onDragStart={handleLessonDragStart}
                      onDragOver={handleLessonDragOver}
                      onDragEnd={handleLessonDragEnd}
                      onDragCancel={handleLessonDragCancel}
                    >
                      <div className="space-y-3 sm:space-y-4 max-h-[min(60vh,420px)] overflow-y-auto overflow-x-hidden pr-0.5">
                        {formData.chapters.map((chap, chapIdx) => {
                          const chapterAllLocked =
                            chap.lessons.length === 0 ||
                            chap.lessons.every(
                              (lesson) => lesson.access === "locked",
                            );
                          const openLessonCount = chap.lessons.filter(
                            (lesson) => lesson.access === "free",
                          ).length;
                          return (
                            <div
                              key={chap.id}
                              className={`relative overflow-hidden rounded-2xl border space-y-3 transition-all ${
                                dragOverChapterId === chap.id
                                  ? "border-primary/60 ring-2 ring-primary/20 bg-primary/[0.04]"
                                  : "border-white/[0.08] bg-gradient-to-br from-[#1b1e27] to-[#15171e]"
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (dragOverChapterId !== chap.id)
                                  setDragOverChapterId(chap.id);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedChapterId)
                                  reorderChapters(draggedChapterId, chap.id);
                                setDraggedChapterId(null);
                                setDragOverChapterId(null);
                              }}
                              onDragLeave={(e) => {
                                const next = e.relatedTarget as Node | null;
                                if (!next || !e.currentTarget.contains(next))
                                  setDragOverChapterId(null);
                              }}
                            >
                              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
                              <div className="flex flex-col gap-3 border-b border-white/[0.06] px-3 pt-3.5 pb-2.5 sm:px-3.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <button
                                    type="button"
                                    draggable
                                    aria-label="جابجایی سرفصل"
                                    title="برای جابجایی بکشید"
                                    onDragStart={() => {
                                      setDraggedChapterId(chap.id);
                                      setDragOverChapterId(chap.id);
                                    }}
                                    onDragEnd={() => {
                                      setDraggedChapterId(null);
                                      setDragOverChapterId(null);
                                    }}
                                    className="size-8 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:text-white hover:border-primary/30 cursor-grab active:cursor-grabbing shrink-0"
                                    style={{ touchAction: "none" }}
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </button>
                                  <span className="text-[10px] bg-primary/15 text-primary px-2.5 py-1 rounded-lg font-black shrink-0 tabular-nums">
                                    {chap.number}
                                  </span>
                                  {editingChapterTitleId === chap.id ? (
                                    <input
                                      autoFocus
                                      value={chap.title}
                                      onChange={(e) =>
                                        updateChapterTitleInline(
                                          chap.id,
                                          e.target.value,
                                        )
                                      }
                                      onBlur={() =>
                                        endEditChapterTitle(chap.id)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          endEditChapterTitle(chap.id);
                                      }}
                                      placeholder="عنوان سرفصل"
                                      className="h-9 min-w-0 flex-1 px-3 rounded-xl border border-primary/40 bg-white/5 text-[11px] font-black text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingChapterTitleId(chap.id)
                                      }
                                      className={`text-[12px] font-black hover:text-primary transition-colors cursor-text truncate text-right min-w-0 flex-1 ${
                                        chap.title.trim()
                                          ? "text-white"
                                          : "text-gray-500 italic"
                                      }`}
                                      title={
                                        chap.title.trim() ||
                                        "ویرایش عنوان سرفصل"
                                      }
                                    >
                                      {chap.title.trim() || "عنوان سرفصل"}
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleChapterAccess(chap.id)}
                                    disabled={chap.lessons.length === 0}
                                    title={
                                      chapterAllLocked
                                        ? "باز کردن همه ویدیوهای این فصل"
                                        : "قفل کردن همه ویدیوهای این فصل"
                                    }
                                    className={`h-8 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-xl border text-[10px] font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                      chapterAllLocked
                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                    }`}
                                  >
                                    {chapterAllLocked ? (
                                      <>
                                        <Lock className="w-3.5 h-3.5" />
                                        فصل قفل
                                      </>
                                    ) : (
                                      <>
                                        <Unlock className="w-3.5 h-3.5" />
                                        فصل باز
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCollapsedChapters((prev) => ({
                                        ...prev,
                                        [chap.id]: !prev[chap.id],
                                      }))
                                    }
                                    className="size-8 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] transition-all cursor-pointer"
                                    title={
                                      collapsedChapters[chap.id]
                                        ? "باز کردن فصل"
                                        : "بستن فصل"
                                    }
                                  >
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 transition-transform ${collapsedChapters[chap.id] ? "-rotate-90" : ""}`}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveChapter(chapIdx, "up")}
                                    disabled={chapIdx === 0}
                                    className="size-8 hidden sm:inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] cursor-pointer"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveChapter(chapIdx, "down")}
                                    disabled={
                                      chapIdx === formData.chapters.length - 1
                                    }
                                    className="size-8 hidden sm:inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] cursor-pointer"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteConfirm(
                                        "حذف فصل",
                                        "با حذف فصل، تمام جلسات داخل آن هم حذف می‌شوند. ادامه می‌دهید؟",
                                        () => deleteChapter(chap.id),
                                      )
                                    }
                                    className="size-8 inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => addLessonInline(chap.id)}
                                    className="h-8 px-2.5 sm:px-3 inline-flex items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary text-[10px] font-black hover:bg-primary/25 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5 ml-0.5" />
                                    ویدیو
                                  </button>
                                  <span className="text-[9px] font-bold text-gray-500 mr-auto">
                                    {chap.lessons.length} ویدیو
                                    {chap.lessons.length > 0
                                      ? ` · ${openLessonCount} باز`
                                      : ""}
                                  </span>
                                </div>
                              </div>

                              {!collapsedChapters[chap.id] && (
                                <div className="px-2 sm:px-3 pb-3">
                                  <ChapterLessonDropZone
                                    chapter={chap}
                                    activeLessonId={activeLessonId}
                                    lessonDropTargetId={lessonDropTargetId}
                                    editingLessonTitleId={editingLessonTitleId}
                                    lessonUploadProgress={lessonUploadProgress}
                                    lessonVideoMap={lessonVideoMap}
                                    lessonFileMap={lessonFileMap}
                                    lessonDescriptionMap={lessonDescriptionMap}
                                    actions={lessonRowActions}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <DragOverlay>
                        <LessonDragOverlay
                          lesson={
                            activeLessonId
                              ? (() => {
                                  const location =
                                    getLessonLocation(activeLessonId);
                                  return location
                                    ? formData.chapters[
                                        formData.chapters.findIndex(
                                          (chapter) =>
                                            chapter.id === location.chapterId,
                                        )
                                      ]?.lessons[location.lessonIndex]
                                    : undefined;
                                })()
                              : undefined
                          }
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
                    داده‌های وارد شده را از کادر سمت چپ به صورت کاملاً زنده در
                    قالب صفحه واقعی وب بررسی کرده و وضعیت انتشار را تعیین کنید.
                  </p>
                </div>

                {/* Final Checklist Card */}
                <div className="p-5 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">
                    لیست نهایی بررسی کیفیت دوره:
                  </span>

                  <div className="space-y-2.5 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>
                        نام دوره:{" "}
                        <strong className="text-gray-900 dark:text-white">
                          {formData.title}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>
                        قیمت دوره:{" "}
                        <strong className="text-primary font-black">
                          {formData.isPaid === "free"
                            ? "رایگان"
                            : `${formData.price.toLocaleString("fa-IR")} تومان`}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>
                        مشخصات پایه:{" "}
                        <strong>
                          سطح{" "}
                          {formData.level === "elementary"
                            ? "مقدماتی"
                            : formData.level === "intermediate"
                              ? "متوسط"
                              : "پیشرفته"}{" "}
                          • {formData.duration} تدریس
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>
                        محتوای تدریس:{" "}
                        <strong>
                          {formData.chapters.length} فصل درسی •{" "}
                          {totalLessonsCount} جلسه فعال
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black">
                      قوانین و حریم خصوصی انتشار دوره
                    </p>
                    <p className="text-[10px] font-semibold leading-relaxed">
                      با کلیک بر روی «ارسال برای بررسی»، دوره جهت بازبینی تایید
                      کیفیت توسط تیم محتوای اسپاتی‌کد لود شده و طی ۲۴ ساعت تایید
                      می‌گردد. همچنین برای تکمیل سرفصل‌ها بعداً می‌توانید آن را
                      به صورت «پیش‌نویس» در پنل خود ذخیره کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Bottom controls */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center pt-6 sm:pt-8 border-t border-gray-100/50 dark:border-white/5 mt-6 sm:mt-8">
            {/* Back Button */}
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبلی</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/instructor/courses")}
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
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
                className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-6 py-3.5 bg-primary hover:bg-primary-hover disabled:bg-primary/60 disabled:hover:scale-100 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer select-none"
              >
                <span>{isSavingStep1 ? "در حال ذخیره..." : "مرحله بعدی"}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex w-full sm:w-auto flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={isSavingStep1}
                  onClick={() => void handleSubmitWizard("draft")}
                  className="w-full sm:w-auto px-5 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingStep1
                    ? "در حال ذخیره..."
                    : "ذخیره به عنوان پیش‌نویس"}
                </button>
                <button
                  type="button"
                  disabled={isSavingStep1}
                  onClick={() => void handleSubmitWizard("pending")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer disabled:bg-primary/60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSavingStep1
                    ? "در حال ارسال..."
                    : "ارسال برای بررسی و انتشار"}
                </button>
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* --- LEFT SIDE: LIVE PREVIEW PANEL (6 cols on large screens, sticky scroll) --- */}
        <div
          className={`w-full rounded-2xl sm:rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-3 sm:p-4 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-md shadow-inner scrollbar-thin space-y-4 sm:space-y-6 overflow-x-hidden ${
            step === 1
              ? "lg:col-span-6 lg:order-2 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto"
              : ""
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b dark:border-white/5 pb-3">
            <span className="text-xs font-black text-gray-500 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              پیش‌نمایش زنده
            </span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-1 rounded-full font-black w-fit">
              مطابق با فرانت اند اصلی
            </span>
          </div>

          <div className="w-full relative transition-all duration-500">
            {isLoadingDraft ? (
              <CreateCourseWizardPreviewSkeleton step={step} />
            ) : (
              <>
            {/* PREVIEW: STEP 1 (Focus on course card only) */}
            {step === 1 && (
              <div className="py-12 animate-in fade-in duration-500 flex flex-col items-center w-full">
                <div className="text-center mb-6">
                  <span className="text-[10px] text-gray-400 font-bold block">
                    موقعیت: نمایش در صفحه اصلی یا آرشیو دوره‌ها
                  </span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">
                    کارت دوره شما (CourseCard)
                  </span>
                </div>
                <div className="w-full max-w-[390px]">
                  <CourseCard
                    title={formData.title}
                    instructor={profile?.name || "اصغر رضایی"}
                    instructorImg={profile?.avatar || "/images/inst1.jpg"}
                    image={formData.cover}
                    hours={formData.duration}
                    price={
                      formData.isPaid === "free" ? "رایگان" : formData.price
                    }
                    disableViewNavigation
                  />
                </div>
              </div>
            )}

            {/* PREVIEW: STEP 2 (Focus on hero only) */}
            {step === 2 && (
              <div className="py-6 animate-in fade-in duration-500">
                <div className="text-center mb-4">
                  <span className="text-[10px] text-gray-400 font-bold block">
                    موقعیت: هیرو بالای صفحه جزئیات دوره
                  </span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">
                    هیرو سکشن اصلی (CourseHero)
                  </span>
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
                  <span className="text-[10px] text-gray-400 font-bold block">
                    موقعیت: بدنه اصلی صفحه جزئیات دوره (سازگار با موبایل/دسکتاپ)
                  </span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">
                    سکشن‌های درونی و جزئیات
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Col (Sidebar equivalent) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    {/* Price Card Sidebar */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md relative overflow-hidden text-center">
                      <div className="absolute -top-10 -right-10 size-24 bg-primary/10 rounded-full blur-2xl" />
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">
                          مبلغ نهایی ثبت نام
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free"
                              ? "رایگان"
                              : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">
                              تومان
                            </span>
                          )}
                        </div>
                        <button
                          className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none"
                          onClick={(e) => e.preventDefault()}
                        >
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            verified_user
                          </span>
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
                          <li
                            key={feat.id}
                            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]"
                          >
                            <span
                              className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === "primary" ? "primary" : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {feat.icon}
                              </span>
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
                          <span className="material-symbols-outlined text-lg">
                            description
                          </span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">
                          {formData.aboutTitle}
                        </h2>
                      </div>

                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify leading-8">
                          {renderHighlightedText(
                            formData.aboutDescription,
                            formData.aboutHighlights,
                          )}
                        </p>
                      </div>
                    </section>

                    {/* FAQ Section */}
                    <CourseFAQ items={formData.faqs} />
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: STEP 4 (Complete page layout) */}
            {step === 4 && (
              <div className="py-6 animate-in fade-in duration-500 space-y-4">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">
                    موقعیت: مدیریت جلسات و فایل‌های هر ویدیو
                  </span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">
                    پنل سرفصل‌ها و ویدیوها
                  </span>
                </div>

                <div className="rounded-2xl sm:rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-2.5 sm:p-3 md:p-4 overflow-hidden">
                  <div className="flex flex-col gap-3 border-b border-gray-200/70 dark:border-white/10 pb-3 px-1 md:px-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-gray-900 dark:text-white text-right">
                      سرفصل‌های آموزشی
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 flex-wrap">
                      <span className="rounded-full bg-gray-200/80 dark:bg-white/10 px-2.5 sm:px-3 py-1.5">
                        {formData.chapters.reduce(
                          (sum, ch) => sum + ch.lessons.length,
                          0,
                        )}{" "}
                        جلسه
                      </span>
                      <span className="rounded-full bg-gray-200/80 dark:bg-white/10 px-2.5 sm:px-3 py-1.5">
                        {formData.chapters.length} فصل
                      </span>
                      {formData.chapters.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const allCollapsed = formData.chapters.every(
                              (chapter) => previewCollapsedChapters[chapter.id],
                            );
                            if (allCollapsed) {
                              setPreviewCollapsedChapters({});
                            } else {
                              setPreviewCollapsedChapters(
                                Object.fromEntries(
                                  formData.chapters.map((chapter) => [
                                    chapter.id,
                                    true,
                                  ]),
                                ),
                              );
                            }
                          }}
                          className="rounded-full bg-gray-200/80 dark:bg-white/10 px-2.5 sm:px-3 py-1.5 hover:bg-primary/15 hover:text-primary transition-colors cursor-pointer"
                        >
                          {formData.chapters.every(
                            (chapter) => previewCollapsedChapters[chapter.id],
                          )
                            ? "باز کردن همه"
                            : "بستن همه"}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    {formData.chapters.length === 0 ? (
                      <div className="rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] py-10 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
                        هنوز فصلی ثبت نشده است.
                      </div>
                    ) : (
                      formData.chapters.map((chapter, chapterIndex) => {
                        const chapterLessons = chapter.lessons;
                        const isPreviewCollapsed =
                          !!previewCollapsedChapters[chapter.id];
                        return (
                          <div
                            key={chapter.id}
                            className="rounded-2xl sm:rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-[#1c1e26] p-3 sm:p-4 md:p-5 space-y-3 overflow-hidden"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#24304a] text-emerald-400 text-sm font-black shadow-lg shadow-black/10 shrink-0">
                                  {String(chapterIndex + 1).padStart(2, "0")}
                                </span>
                                <div className="text-right min-w-0">
                                  <p className="text-sm md:text-base font-black text-white truncate">
                                    {chapter.title}
                                  </p>
                                  <p className="text-[10px] md:text-xs font-bold text-gray-400">
                                    {chapterLessons.length} جلسه
                                    {chapter.subtitle
                                      ? ` · ${chapter.subtitle}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewCollapsedChapters((prev) => ({
                                    ...prev,
                                    [chapter.id]: !prev[chapter.id],
                                  }))
                                }
                                className="size-10 rounded-full bg-[#3a3d46] text-white/90 inline-flex items-center justify-center cursor-pointer hover:bg-[#454854] transition-colors shrink-0"
                                title={
                                  isPreviewCollapsed
                                    ? "باز کردن سرفصل"
                                    : "بستن سرفصل"
                                }
                                aria-expanded={!isPreviewCollapsed}
                              >
                                <ChevronDown
                                  className={`w-5 h-5 transition-transform duration-200 ${
                                    isPreviewCollapsed ? "-rotate-90" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {!isPreviewCollapsed && (
                              <div className="space-y-2 pt-2">
                                {chapterLessons.length === 0 ? (
                                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] py-8 text-center text-[10px] font-bold text-gray-500">
                                    هنوز جلسه‌ای به این فصل اضافه نشده است.
                                  </div>
                                ) : (
                                  chapterLessons.map((lesson, lessonIndex) => {
                                    const lessonDurationPreview =
                                      lesson.duration || "12:20";
                                    return (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl bg-[#262833] px-3 py-3 md:px-4"
                                      >
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <span
                                            className={`inline-flex size-8 items-center justify-center rounded-xl ${lesson.access === "free" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}
                                          >
                                            <span className="material-symbols-outlined text-[18px]">
                                              {lesson.type === "video"
                                                ? "videocam"
                                                : lesson.type === "pdf"
                                                  ? "description"
                                                  : lesson.type === "quiz"
                                                    ? "quiz"
                                                    : "text_snippet"}
                                            </span>
                                          </span>
                                          <div className="text-right">
                                            <p className="text-[11px] md:text-sm font-bold text-white">
                                              {lesson.title ||
                                                `جلسه ${lessonIndex + 1}`}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                              <span className="rounded-full bg-white/5 px-2 py-0.5 text-gray-300">
                                                {lesson.access === "free"
                                                  ? "باز"
                                                  : "قفل"}
                                              </span>
                                              <span className="font-semibold tabular-nums tracking-[0.08em]">
                                                {lessonDurationPreview}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {lessonVideoMap[lesson.id] ? (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setVideoPreview({
                                                  url: lessonVideoMap[lesson.id]
                                                    .url,
                                                  title:
                                                    lesson.title ||
                                                    lessonVideoMap[lesson.id]
                                                      .name,
                                                })
                                              }
                                              className="size-8 rounded-xl inline-flex items-center justify-center bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20 cursor-pointer"
                                              title="پیش‌نمایش ویدیو"
                                            >
                                              <Video className="w-4 h-4" />
                                            </button>
                                          ) : null}
                                          {(lessonFileMap[lesson.id]?.length ||
                                            0) > 0 ? (
                                            <span className="size-8 rounded-xl inline-flex items-center justify-center bg-amber-500/10 text-amber-400 text-[9px] font-black">
                                              {lessonFileMap[lesson.id].length}
                                            </span>
                                          ) : null}
                                          {lessonDescriptionMap[lesson.id] ? (
                                            <span className="size-8 rounded-xl inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                                              <span className="material-symbols-outlined text-[16px]">
                                                notes
                                              </span>
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
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
                  <span className="text-[10px] text-gray-400 font-bold block">
                    بازبینی نهایی: نمایش صفحه کامل جزئیات دوره
                  </span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">
                    کل صفحه واقعی دوره (Full Detail Page Preview)
                  </span>
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
                  introVideo={
                    finalPreviewLesson?.videoUrl || formData.introVideo
                  }
                  specialWords={formData.specialWords}
                  isPreviewActive={Boolean(finalPreviewLesson)}
                  activeVideoTitle={finalPreviewLesson?.title}
                  activeVideoDuration={finalPreviewLesson?.duration}
                  playTrigger={finalPreviewPlayTick}
                  onResetPreview={() => {
                    setFinalPreviewLesson(null);
                    setFinalPreviewPlayTick((prev) => prev + 1);
                  }}
                  disableFallbackVideo
                  missingVideoMessage={
                    finalPreviewLesson
                      ? "ویدیوی این جلسه در حال حاضر قابل پخش نیست."
                      : "ویدیوی معرفی را بارگذاری کنید تا پیش‌نمایش پخش شود."
                  }
                />

                {/* 2. Grid body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (Sidebar) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    {/* Sidebar price */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md text-center">
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">
                          مبلغ نهایی ثبت نام
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free"
                              ? "رایگان"
                              : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">
                              تومان
                            </span>
                          )}
                        </div>
                        <button
                          className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none"
                          onClick={(e) => e.preventDefault()}
                        >
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            verified_user
                          </span>
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
                          <li
                            key={feat.id}
                            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]"
                          >
                            <span
                              className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === "primary" ? "primary" : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {feat.icon}
                              </span>
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
                          <span className="material-symbols-outlined text-lg">
                            description
                          </span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">
                          {formData.aboutTitle}
                        </h2>
                      </div>

                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify leading-8">
                          {renderHighlightedText(
                            formData.aboutDescription,
                            formData.aboutHighlights,
                          )}
                        </p>
                      </div>
                    </section>

                    {finalPreviewNotice ? (
                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-700 dark:text-amber-300 text-sm font-bold">
                        {finalPreviewNotice}
                      </div>
                    ) : null}

                    {finalPreviewChapters.length > 0 ? (
                      <CourseCurriculum
                        totalLessons={totalLessonsCount}
                        chapters={finalPreviewChapters}
                        activeLessonId={finalPreviewLesson?.lessonId || null}
                        coursePurchased
                        onLessonSelect={(lesson) => {
                          if (!lesson.videoUrl?.trim()) {
                            setFinalPreviewNotice(
                              "ویدیوی این جلسه هنوز برای پیش‌نمایش در دسترس نیست",
                            );
                            return;
                          }
                          setFinalPreviewNotice(null);
                          setFinalPreviewLesson({
                            lessonId: lesson.id,
                            title: lesson.title,
                            duration: lesson.duration,
                            videoUrl: lesson.videoUrl,
                          });
                          setFinalPreviewPlayTick((prev) => prev + 1);
                        }}
                      />
                    ) : (
                      <div className="rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] py-10 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
                        هنوز سرفصل یا ویدیویی برای پیش‌نمایش ثبت نشده است.
                      </div>
                    )}

                    {/* FAQ accordion */}
                    <CourseFAQ items={formData.faqs} />
                  </div>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={closeDeleteConfirm}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              {deleteConfirm.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              {deleteConfirm.description}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
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

      {/* Unsaved Changes Confirmation Modal */}
      {unsavedModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
            onClick={cancelLeave}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6 sm:p-7 text-right transform-gpu">
            <div className="size-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4 shadow-lg shadow-amber-500/10">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              تغییرات ذخیره‌نشده دارید!
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              اطلاعاتی در این مرحله از فرم وارد کرده‌اید که هنوز ذخیره نشده است. در صورت خروج از صفحه یا ریلود کردن، تمام تغییرات شما از دست خواهد رفت.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={confirmLeave}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs transition-all cursor-pointer text-center"
              >
                خروج بدون ذخیره
              </button>
              <button
                type="button"
                onClick={cancelLeave}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-hover hover:to-emerald-700 text-white font-black text-xs shadow-lg shadow-primary/25 transition-all cursor-pointer text-center"
              >
                ماندن در صفحه و ادامه ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonDescriptionEditor.open && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() =>
              setLessonDescriptionEditor({
                open: false,
                lessonId: "",
                value: "",
              })
            }
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              توضیحات جلسه
            </h3>
            <textarea
              rows={5}
              value={lessonDescriptionEditor.value}
              onChange={(e) =>
                setLessonDescriptionEditor((p) => ({
                  ...p,
                  value: e.target.value,
                }))
              }
              placeholder="توضیحاتی درباره این جلسه برای دانشجو بنویسید..."
              className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium text-right focus:outline-none focus:border-primary"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setLessonDescriptionEditor({
                    open: false,
                    lessonId: "",
                    value: "",
                  })
                }
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  markFormEdited();
                  const trimmed = lessonDescriptionEditor.value.trim();
                  setLessonDescriptionMap((prev) => ({
                    ...prev,
                    [lessonDescriptionEditor.lessonId]: trimmed,
                  }));
                  applyLessonDescription(
                    lessonDescriptionEditor.lessonId,
                    trimmed,
                  );
                  setLessonDescriptionEditor({
                    open: false,
                    lessonId: "",
                    value: "",
                  });
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
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                مدیریت فایل‌های جلسه
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  تعداد فایل‌ها:{" "}
                  {lessonFileMap[lessonFilesModal.lessonId]?.length || 0}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLessonFilesModal({ open: false, lessonId: "" })
                  }
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
                  const selectedFiles = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  handleLessonFileUpload(
                    lessonFilesModal.lessonId,
                    selectedFiles,
                  );
                  e.currentTarget.value = "";
                }}
              />
              <label
                htmlFor={
                  (lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >=
                  MAX_LESSON_FILES
                    ? undefined
                    : "lesson-files-input"
                }
                className={`h-10 px-3 inline-flex items-center justify-center rounded-xl border text-sm font-black transition-all ${
                  (lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >=
                  MAX_LESSON_FILES
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
              <p className="mt-2 text-xs font-bold text-red-500">
                {lessonFilesError}
              </p>
            )}

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(lessonFileMap[lessonFilesModal.lessonId] || []).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  هنوز فایلی برای این جلسه آپلود نشده است.
                </p>
              ) : (
                (lessonFileMap[lessonFilesModal.lessonId] || []).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2"
                  >
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">
                      {f.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(f.url, "_blank", "noopener,noreferrer")
                        }
                        className="h-8 px-3 rounded-lg border border-emerald-300/70 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black cursor-pointer"
                      >
                        باز کردن
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteConfirm(
                            "حذف فایل جلسه",
                            "آیا از حذف این فایل مطمئن هستید؟",
                            () =>
                              removeLessonFile(lessonFilesModal.lessonId, f.id),
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
