"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useInstructorData, Lesson } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";
import InstructorQuestionsBoard from "@/components/instructor/InstructorQuestionsBoard";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;

  const {
    courses,
    questions,
    updateCourse,
    addChapter,
    updateChapter,
    deleteChapter,
    addLesson,
    updateLesson,
    deleteLesson,
    replyToReview,
    replyToQuestion,
    closeQuestion
  } = useInstructorData();

  // Find targeted course
  const course = useMemo(() => {
    return courses.find((c) => c.id === courseId);
  }, [courses, courseId]);

  // Current Active Tab
  const [activeTab, setActiveTab] = useState("overview");

  // Read tab parameter from URL if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "content", "students", "reviews", "questions", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // State for Add Chapter
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  // State for Accordion collapse/expand (chapter IDs)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "CHP-001": true, // open first by default
  });
  const [editingChapterTitleId, setEditingChapterTitleId] = useState<string | null>(null);
  const [editingLessonTitleId, setEditingLessonTitleId] = useState<string | null>(null);
  const [editingLessonDurationId, setEditingLessonDurationId] = useState<string | null>(null);
  const [chapterTitleDraft, setChapterTitleDraft] = useState("");
  const [lessonTitleDraft, setLessonTitleDraft] = useState("");
  const [lessonDurationDraft, setLessonDurationDraft] = useState("");
  const [lessonUploadProgress, setLessonUploadProgress] = useState<Record<string, number>>({});
  const [lessonVideoMap, setLessonVideoMap] = useState<Record<string, { name: string; url: string }>>({});
  const [lessonFileMap, setLessonFileMap] = useState<Record<string, { id: string; name: string; url: string }[]>>({});
  const [lessonDescriptionMap, setLessonDescriptionMap] = useState<Record<string, string>>({});
  const [lessonDescriptionEditor, setLessonDescriptionEditor] = useState<{ open: boolean; lessonId: string; value: string }>({ open: false, lessonId: "", value: "" });
  const [lessonFilesModal, setLessonFilesModal] = useState<{ open: boolean; lessonId: string }>({ open: false, lessonId: "" });
  const [lessonFilesError, setLessonFilesError] = useState("");
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
    duration: "10:00",
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
  const [questionReplyText, setQuestionReplyText] = useState("");

  // Local settings form state
  const [settingsForm, setSettingsForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: 0,
    discountPrice: 0,
    status: "draft" as any,
  });

  // Load course details into settings form
  useEffect(() => {
    if (course) {
      setSettingsForm({
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        price: course.price,
        discountPrice: course.discountPrice || 0,
        status: course.status,
      });
    }
  }, [course]);

  if (!course) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-lg font-black text-gray-900 dark:text-white">دوره مورد نظر یافت نشد!</h2>
        <button onClick={() => router.push("/instructor/courses")} className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">
          بازگشت به دوره‌ها
        </button>
      </div>
    );
  }

  // Filter course-specific questions
  const courseQuestions = questions.filter((q) => q.courseId === course.id);

  // Calculations
  const lessonsCount = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  // Handle Add Chapter Submit
  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim()) {
      addChapter(course.id, newChapterTitle.trim());
      setNewChapterTitle("");
      setIsAddingChapter(false);
    }
  };

  const addLessonInline = (chapterId: string) => {
    addLesson(course.id, chapterId, {
      title: "درس جدید",
      type: "video",
      duration: "10:00",
      isFree: false,
      status: "published",
    });
  };

  const moveChapter = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= course.chapters.length) return;
    const chapters = [...course.chapters];
    const [moved] = chapters.splice(index, 1);
    chapters.splice(target, 0, moved);
    updateCourse(course.id, { chapters });
  };

  const commitChapterTitle = (chapterId: string, currentTitle: string) => {
    const nextTitle = chapterTitleDraft.trim();
    setEditingChapterTitleId(null);
    if (!nextTitle || nextTitle === currentTitle) return;
    updateChapter(course.id, chapterId, { title: nextTitle });
  };

  const commitLessonTitle = (chapterId: string, lessonId: string, currentTitle: string) => {
    const nextTitle = lessonTitleDraft.trim();
    setEditingLessonTitleId(null);
    if (!nextTitle || nextTitle === currentTitle) return;
    updateLesson(course.id, chapterId, lessonId, { title: nextTitle });
  };

  const commitLessonDuration = (chapterId: string, lessonId: string, currentDuration: string) => {
    const nextDuration = lessonDurationDraft.trim();
    setEditingLessonDurationId(null);
    if (!nextDuration || nextDuration === currentDuration) return;
    updateLesson(course.id, chapterId, lessonId, { duration: nextDuration });
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

  const handleLessonVideoUpload = (lessonId: string, file?: File) => {
    if (!file) return;
    const videoUrl = URL.createObjectURL(file);
    setLessonUploadProgress((prev) => ({ ...prev, [lessonId]: 0 }));
    const timer = setInterval(() => {
      setLessonUploadProgress((prev) => {
        const current = prev[lessonId] ?? 0;
        const next = Math.min(100, current + 20);
        if (next >= 100) {
          clearInterval(timer);
          setLessonVideoMap((v) => ({ ...v, [lessonId]: { name: file.name, url: videoUrl } }));
          setTimeout(() => {
            setLessonUploadProgress((after) => {
              const copy = { ...after };
              delete copy[lessonId];
              return copy;
            });
          }, 350);
        }
        return { ...prev, [lessonId]: next };
      });
    }, 120);
  };

  const removeLessonVideo = (lessonId: string) => {
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
      const newFiles = selected.map((f, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setLessonFilesError("");
      return { ...prev, [lessonId]: [...current, ...newFiles] };
    });
  };

  const removeLessonFile = (lessonId: string, fileId: string) => {
    setLessonFileMap((prev) => {
      const list = prev[lessonId] || [];
      const target = list.find((f) => f.id === fileId);
      if (target?.url?.startsWith("blob:")) URL.revokeObjectURL(target.url);
      const nextList = list.filter((f) => f.id !== fileId);
      const copy = { ...prev };
      if (nextList.length) copy[lessonId] = nextList;
      else delete copy[lessonId];
      return copy;
    });
  };

  const openDeleteConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDelete({ open: true, title, message, action });
  };

  // Handle Save Lesson Submit
  const handleSaveLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLessonData.title.trim()) {
      addLesson(course.id, selectedChapterId, newLessonData);
      setIsLessonModalOpen(false);
      // reset
      setNewLessonData({
        title: "",
        type: "video",
        duration: "10:00",
        isFree: false,
        status: "published",
        fileName: "",
        fileSize: "",
      });
      setLessonFile(null);
      setLessonProgress(0);
    }
  };

  // Handle Review Reply Submit
  const handleReviewReplySubmit = (reviewId: string) => {
    if (reviewReplyText.trim()) {
      replyToReview(course.id, reviewId, reviewReplyText.trim());
      setReviewReplyText("");
      setActiveReviewReplyId("");
    }
  };

  // Handle Question Reply Submit
  const handleQuestionReplySubmit = (qstId: string) => {
    if (questionReplyText.trim()) {
      replyToQuestion(qstId, questionReplyText.trim());
      setQuestionReplyText("");
    }
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourse(course.id, settingsForm);
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
          { id: "reviews", label: "نظرات و دیدگاه‌ها", icon: MessageSquare },
          { id: "questions", label: "سوالات فنی", icon: HelpCircle },
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            {/* Left Statistics Cards */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 grid grid-cols-2 gap-4 md:gap-6">
                
                {/* Revenue Card */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold">کل درآمد دوره</span>
                    <CircleDollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                    {course.revenue.toLocaleString("fa-IR")} تومان
                  </p>
                </div>

                {/* Students Card */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold">دانشجویان ثبت‌نامی</span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                    {course.studentsCount.toLocaleString("fa-IR")} نفر
                  </p>
                </div>

                {/* Rating Card */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold">میانگین امتیازات</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                    {course.rating.toLocaleString("fa-IR")} <span className="text-[10px] text-gray-400 font-normal">/ ۵</span>
                  </p>
                </div>

                {/* Completion Rate */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold">میانگین تکمیل دوره</span>
                    <Clock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                    {course.completionRate.toLocaleString("fa-IR")}٪
                  </p>
                </div>

              </div>

              {/* Full Description display */}
              <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 space-y-4">
                <h3 className="text-xs font-black text-gray-900 dark:text-white mb-2">توضیحات تکمیلی دوره</h3>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Right Meta details sidebar */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 space-y-4">
                <h3 className="text-xs font-black text-gray-900 dark:text-white mb-4">اطلاعات فروش</h3>
                
                <div className="space-y-3 text-[10px] font-bold">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-400">قیمت اصلی:</span>
                    <span className="text-gray-800 dark:text-white">{course.price.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-400">قیمت با تخفیف:</span>
                    <span className="text-primary">
                      {course.discountPrice ? `${course.discountPrice.toLocaleString("fa-IR")} تومان` : "ندارد"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-400">سطح علمی:</span>
                    <span className="text-gray-800 dark:text-white">
                      {course.level === "advanced" && "پیشرفته"}
                      {course.level === "intermediate" && "متوسط"}
                      {course.level === "elementary" && "مقدماتی"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">زبان دوره:</span>
                    <span className="text-gray-800 dark:text-white">{course.language}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("settings")}
                  className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 text-[10px] font-black rounded-2xl transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>ویرایش جزئیات دوره</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: CONTENT MANAGER (Chapters & Lessons) --- */}
        {activeTab === "content" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">ساختار سرفصل‌ها و درس‌ها</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                سرفصل‌های آموزشی را بسازید، درس‌های جدید اضافه کرده و فایل‌های ویدیو/سند را آپلود کنید.
              </p>
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
                      className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right w-full sm:w-60"
                    />
                    <button type="submit" className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl">ذخیره</button>
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
                    return (
                      <div key={ch.id} className="p-3.5 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-200/70 dark:border-white/10 space-y-3 transition-all">
                        <div className="flex items-center justify-between border-b dark:border-white/5 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black mr-1">{chIdx + 1}</span>
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
                                className="text-[10px] font-black text-gray-900 dark:text-white hover:text-primary transition-colors cursor-text"
                              >
                                {ch.title}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => toggleChapter(ch.id)} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all" title={isExpanded ? "بستن فصل" : "باز کردن فصل"}>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${!isExpanded ? "-rotate-90" : ""}`} />
                            </button>
                            <span className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-500">drag_indicator</span>
                            <button type="button" onClick={() => moveChapter(chIdx, "up")} disabled={chIdx === 0} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => moveChapter(chIdx, "down")} disabled={chIdx === course.chapters.length - 1} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => openDeleteConfirm("حذف فصل", "با حذف فصل، تمام جلسات داخل آن حذف می‌شوند. ادامه می‌دهید؟", () => deleteChapter(course.id, ch.id))} className="size-7 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => addLessonInline(ch.id)} className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-black">
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
                              ch.lessons.map((les) => (
                                <div key={les.id} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-bold">
                                  <div className="flex items-center gap-1.5">
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
                                        className="text-[9px] font-bold hover:text-primary transition-colors cursor-text"
                                      >
                                        {les.title}
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => updateLesson(course.id, ch.id, les.id, { isFree: !les.isFree })} className={`h-6 px-2 inline-flex items-center justify-center rounded-md border text-[8px] font-black ${les.isFree ? "border-emerald-200/80 bg-emerald-50 text-emerald-600" : "border-gray-200/80 bg-gray-50 text-gray-600"}`}>
                                      {les.isFree ? "باز" : "قفل"}
                                    </button>
                                    {editingLessonDurationId === les.id ? (
                                      <input
                                        autoFocus
                                        dir="ltr"
                                        value={lessonDurationDraft}
                                        onChange={(e) => setLessonDurationDraft(e.target.value)}
                                        onBlur={() => commitLessonDuration(ch.id, les.id, les.duration)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") commitLessonDuration(ch.id, les.id, les.duration);
                                        }}
                                        className="h-6 w-16 px-1.5 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[8px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingLessonDurationId(les.id);
                                          setLessonDurationDraft(les.duration);
                                        }}
                                        className="text-[8px] opacity-75 font-mono hover:text-primary transition-colors cursor-text"
                                      >
                                        {les.duration}
                                      </button>
                                    )}
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-emerald-200/70 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-500/10">
                                      {!lessonVideoMap[les.id] && (
                                        <label className="size-6 inline-flex items-center justify-center rounded-md border border-blue-200/80 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all cursor-pointer overflow-hidden">
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              handleLessonVideoUpload(les.id, e.target.files?.[0]);
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
                                      {lessonVideoMap[les.id] && typeof lessonUploadProgress[les.id] !== "number" && (
                                        <>
                                          <button type="button" onClick={() => window.open(lessonVideoMap[les.id].url, "_blank", "noopener,noreferrer")} className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-emerald-200/80 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-[8px] font-black cursor-pointer">
                                            ویدیو
                                          </button>
                                          <button type="button" onClick={() => openDeleteConfirm("حذف ویدیو", "آیا از حذف ویدیوی این جلسه مطمئن هستید؟", () => removeLessonVideo(les.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer">
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
                                        فایل ({lessonFileMap[les.id]?.length || 0})
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setLessonDescriptionEditor({
                                            open: true,
                                            lessonId: les.id,
                                            value: lessonDescriptionMap[les.id] || "",
                                          })
                                        }
                                        className={`h-6 px-2 inline-flex items-center justify-center rounded-md border transition-all text-[8px] font-black cursor-pointer ${
                                          lessonDescriptionMap[les.id]
                                            ? "border-indigo-200/80 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                                            : "border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                        }`}
                                      >
                                        توضیح
                                      </button>
                                    </div>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-red-200/70 dark:border-red-400/20 bg-red-50/40 dark:bg-red-500/10">
                                      <button type="button" onClick={() => openDeleteConfirm("حذف جلسه", "آیا از حذف این جلسه مطمئن هستید؟", () => deleteLesson(course.id, ch.id, les.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">دانشجویان ثبت‌نامی</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  لیست شرکت‌کنندگان در دوره و پیشرفت تماشای ویدیوها توسط آن‌ها
                </p>
              </div>
            </div>

            {/* Students Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "نیما احمدی", date: "1404/12/18", progress: 95, status: "فعال", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" },
                { name: "رضا ملکی", date: "1404/12/15", progress: 68, status: "فعال", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop" },
                { name: "زهرا کیانی", date: "1404/12/10", progress: 82, status: "فعال", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
                { name: "آرمان ابراهیمی", date: "1404/12/05", progress: 10, status: "فعال", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
                { name: "مهسا زمانی", date: "1404/11/25", progress: 42, status: "غیرفعال", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-5 flex items-center gap-4 hover:border-primary/20 transition-all duration-300"
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

                    <p className="text-[8px] text-gray-400 font-bold">ثبت‌نام: {st.date.toLocaleString()}</p>
                    
                    {/* progress */}
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

        {/* --- TAB: SETTINGS & QUICK DETAILS EDIT --- */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-10 space-y-6 animate-in fade-in duration-300">
            <h3 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">تنظیمات و تغییر وضعیت انتشار</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان دوره</label>
                <input
                  type="text"
                  required
                  value={settingsForm.title}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, title: e.target.value }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت دوره</label>
                <select
                  value={settingsForm.status}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, status: e.target.value as any }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right cursor-pointer"
                >
                  <option value="published">منتشر شده</option>
                  <option value="draft">پیش‌نویس</option>
                  <option value="pending">در انتظار بررسی</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت اصلی دوره (تومان)</label>
                <input
                  type="number"
                  value={settingsForm.price}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

              {/* Discount price */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت با تخفیف (تومان)</label>
                <input
                  type="number"
                  value={settingsForm.discountPrice || ""}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, discountPrice: Number(e.target.value) }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

            </div>

            {/* Short Desc */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه</label>
              <textarea
                rows={2}
                value={settingsForm.shortDescription}
                onChange={(e) => setSettingsForm((p) => ({ ...p, shortDescription: e.target.value }))}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
              />
            </div>

            {/* Full Desc */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیحات کامل</label>
              <textarea
                rows={5}
                value={settingsForm.description}
                onChange={(e) => setSettingsForm((p) => ({ ...p, description: e.target.value }))}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
              />
            </div>

            <div className="flex justify-end border-t border-gray-100 dark:border-white/5 pt-4">
              <button
                type="submit"
                className="px-6 py-3.5 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                ذخیره تغییرات تنظیمات
              </button>
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

              <div className="grid grid-cols-2 gap-4">
                {/* Material Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نوع محتوا</label>
                  <select
                    value={newLessonData.type}
                    onChange={(e) => setNewLessonData((p) => ({ ...p, type: e.target.value as any }))}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right cursor-pointer"
                  >
                    <option value="video">ویدیو آموزشی</option>
                    <option value="pdf">سند PDF</option>
                    <option value="exercise">تمرین عملی</option>
                    <option value="text">متن ساده</option>
                    <option value="quiz">کوییز تستی</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مدت زمان (دقیقه)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 15:30"
                    value={newLessonData.duration}
                    onChange={(e) => setNewLessonData((p) => ({ ...p, duration: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                    dir="ltr"
                  />
                </div>
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
                  setLessonDescriptionEditor({ open: false, lessonId: "", value: "" });
                }}
                className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-lg"
              >
                ذخیره توضیح
              </button>
              <button type="button" onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })} className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 text-[10px] rounded-lg">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {lessonFilesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#1c1e26] border border-gray-200/70 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-900 dark:text-white">فایل‌های ضمیمه جلسه</h4>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300">تعداد فایل‌ها: {lessonFileMap[lessonFilesModal.lessonId]?.length || 0}</span>
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
                htmlFor={(lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >= MAX_LESSON_FILES ? undefined : "lesson-files-input"}
                className={`h-10 px-3 inline-flex items-center justify-center rounded-lg border text-[10px] font-black ${
                  (lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >= MAX_LESSON_FILES
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
              {(lessonFileMap[lessonFilesModal.lessonId] || []).length === 0 ? (
                <p className="text-[10px] text-gray-400 font-bold">هنوز فایلی اضافه نشده است.</p>
              ) : (
                (lessonFileMap[lessonFilesModal.lessonId] || []).map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200/70 dark:border-white/10 p-2 bg-gray-50 dark:bg-white/5">
                    <button type="button" onClick={() => window.open(f.url, "_blank", "noopener,noreferrer")} className="text-[10px] text-primary font-black truncate">{f.name}</button>
                    <button type="button" onClick={() => openDeleteConfirm("حذف فایل ضمیمه", "آیا می‌خواهید این فایل حذف شود؟", () => removeLessonFile(lessonFilesModal.lessonId, f.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setLessonFilesModal({ open: false, lessonId: "" })} className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] rounded-lg">بستن</button>
            </div>
          </div>
        </div>
      )}

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
