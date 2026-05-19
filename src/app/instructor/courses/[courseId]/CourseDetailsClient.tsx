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

  // Handle Add Lesson File Simulation
  const handleLessonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            
            {/* Top Toolbar actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">ساختار سرفصل‌ها و درس‌ها</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  سرفصل‌های آموزشی را بسازید، درس‌های جدید اضافه کرده و فایل‌های ویدیو/سند را آپلود کنید.
                </p>
              </div>

              {!isAddingChapter ? (
                <button
                  onClick={() => setIsAddingChapter(true)}
                  className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>افزودن فصل جدید</span>
                </button>
              ) : (
                <form onSubmit={handleAddChapterSubmit} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    required
                    placeholder="عنوان فصل جدید..."
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right w-full sm:w-60"
                  />
                  <button type="submit" className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl">
                    ذخیره
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingChapter(false)}
                    className="px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 rounded-xl"
                  >
                    لغو
                  </button>
                </form>
              )}
            </div>

            {/* Chapters Accordion List */}
            {course.chapters.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center">
                <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400">هیچ فصلی برای این دوره طراحی نشده است.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.chapters.map((ch) => {
                  const isExpanded = !!expandedChapters[ch.id];
                  return (
                    <div
                      key={ch.id}
                      className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md overflow-hidden transition-all duration-300"
                    >
                      {/* Chapter Accordion Trigger */}
                      <div
                        onClick={() => toggleChapter(ch.id)}
                        className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="text-right">
                            <h4 className="text-xs font-black text-gray-900 dark:text-white">{ch.title}</h4>
                            <div className="flex items-center gap-3 text-[8px] text-gray-400 mt-1 font-bold">
                              <span>{ch.lessons.length} درس</span>
                              <span>•</span>
                              <span>مدت زمان: {ch.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChapterId(ch.id);
                              setIsLessonModalOpen(true);
                            }}
                            className="p-2 border border-gray-100 dark:border-white/5 hover:border-primary text-primary hover:bg-primary/5 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>افزودن درس</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("آیا از حذف این فصل و تمام درس‌های آن اطمینان دارید؟")) {
                                deleteChapter(course.id, ch.id);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>

                      {/* Lessons List in accordion */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/5 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {ch.lessons.length === 0 ? (
                            <p className="text-[10px] text-gray-400 py-3 text-center">هنوز درسی در این فصل اضافه نشده است.</p>
                          ) : (
                            ch.lessons.map((les) => (
                              <div
                                key={les.id}
                                className="group rounded-2xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 hover:border-primary/20 transition-all duration-300"
                              >
                                <div className="flex items-center gap-3 w-full sm:w-auto text-right">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    les.type === "video" ? "bg-red-500/10 text-red-500" :
                                    les.type === "pdf" ? "bg-blue-500/10 text-blue-500" :
                                    les.type === "quiz" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                  }`}>
                                    {les.type === "video" && <Play className="w-4 h-4 shrink-0 fill-red-500/10" />}
                                    {les.type === "pdf" && <FileText className="w-4 h-4 shrink-0" />}
                                    {les.type === "quiz" && <QuizIcon className="w-4 h-4 shrink-0" />}
                                    {les.type === "exercise" && <HelpCircle className="w-4 h-4 shrink-0" />}
                                    {les.type === "text" && <FileText className="w-4 h-4 shrink-0" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white truncate">{les.title}</p>
                                    <div className="flex items-center gap-2 text-[8px] text-gray-400 mt-0.5 font-bold">
                                      <span>نوع: {
                                        les.type === "video" ? "ویدیو" :
                                        les.type === "pdf" ? "سند PDF" :
                                        les.type === "quiz" ? "کوییز" :
                                        les.type === "exercise" ? "تمرین" : "متن آموزشی"
                                      }</span>
                                      <span>•</span>
                                      <span>مدت: {les.duration} دقیقه</span>
                                      {les.fileName && (
                                        <>
                                          <span>•</span>
                                          <span className="truncate max-w-[150px]">فایل: {les.fileName} ({les.fileSize})</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                                  {/* Free/Locked Status Tag */}
                                  <button
                                    onClick={() => updateLesson(course.id, ch.id, les.id, { isFree: !les.isFree })}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-black border transition-all cursor-pointer ${
                                      les.isFree
                                        ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-500"
                                        : "bg-gray-100 dark:bg-white/5 border-transparent text-gray-400"
                                    }`}
                                  >
                                    {les.isFree ? (
                                      <>
                                        <Unlock className="w-3 h-3" />
                                        <span>رایگان (پیش‌نمایش)</span>
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="w-3 h-3" />
                                        <span>قفل خریداران</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm("آیا از حذف این درس اطمینان دارید؟")) {
                                        deleteLesson(course.id, ch.id, les.id);
                                      }
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
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
            )}
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
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">انجمن پرسش و پاسخ‌های فنی</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                سوالات تخصصی دانشجویان مربوط به جلسات مختلف این دوره را پاسخ دهید.
              </p>
            </div>

            {courseQuestions.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center">
                <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400">هیچ سوال فنی از سمت دانشجویان در این دوره ثبت نشده است.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {courseQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          {q.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={q.avatar} alt={q.studentName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-primary w-5 h-5" />
                          )}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-black text-gray-900 dark:text-white">{q.studentName}</h4>
                          <span className="text-[8px] text-gray-400 font-semibold">{q.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.lessonTitle && (
                          <span className="text-[8px] font-black bg-gray-100 dark:bg-white/5 text-gray-500 px-2.5 py-1 rounded-lg">
                            جلسه: {q.lessonTitle}
                          </span>
                        )}
                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg ${
                          q.status === "new" ? "bg-rose-500/10 text-rose-400" :
                          q.status === "answered" ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                        }`}>
                          {q.status === "new" && "جدید"}
                          {q.status === "answered" && "پاسخ داده شده"}
                          {q.status === "closed" && "بسته شده"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-right space-y-2">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white">{q.title}</h4>
                      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                        {q.description || q.text}
                      </p>

                      {q.errorText && (
                        <div className="rounded-xl border border-gray-200/70 bg-[#f7f8fb] p-3 dark:border-white/10 dark:bg-[#14161c]">
                          <div className="mb-2 flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400">
                            <FileText className="h-3.5 w-3.5" />
                            <span>متن ارور / لاگ</span>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] font-medium leading-6 text-gray-700 dark:text-gray-300">
                            {q.errorText}
                          </pre>
                        </div>
                      )}

                      {!!q.attachments?.length && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 dark:text-gray-400">
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>ضمیمه‌ها</span>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {q.attachments.map((file) => {
                              const isImage = file.type.startsWith("image/");
                              return (
                                <div key={file.id} className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                                  {isImage && file.previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={file.previewUrl} alt={file.name} className="mb-2 h-24 w-full rounded-lg object-cover" />
                                  ) : (
                                    <div className="mb-2 flex h-16 items-center justify-center rounded-lg bg-white text-gray-400 dark:bg-[#14161c]">
                                      <FileText className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="truncate text-[10px] font-black text-gray-700 dark:text-gray-200">{file.name}</p>
                                      <p className="text-[9px] font-semibold text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    {isImage ? <ImageIcon className="h-3.5 w-3.5 text-gray-400" /> : <FileText className="h-3.5 w-3.5 text-gray-400" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Answers history thread */}
                    <div className="space-y-4 pr-6 border-r-2 border-primary/20">
                      {q.replies.map((rep, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-4 rounded-2xl space-y-1.5",
                            rep.role === "instructor"
                              ? "bg-primary/5 border border-primary/10 rounded-r-none"
                              : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-l-none"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {rep.role === "instructor" && (
                              <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary text-white">مدرس</span>
                            )}
                            <span className="text-[9px] font-black text-gray-900 dark:text-white">{rep.senderName}</span>
                            <span className="text-[8px] text-gray-400 font-bold">{rep.createdAt}</span>
                          </div>
                          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed text-right">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Answer thread reply box */}
                    {q.status !== "closed" && (
                      <div className="pt-2">
                        {activeQuestionId !== q.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveQuestionId(q.id);
                                setQuestionReplyText("");
                              }}
                              className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                            >
                              پاسخ به سوال
                            </button>
                            <button
                              onClick={() => closeQuestion(q.id)}
                              className="px-3 py-2 border border-gray-200 dark:border-white/10 text-gray-500 text-[10px] font-black rounded-xl"
                            >
                              بستن تیکت
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                            <textarea
                              rows={3}
                              placeholder="پاسخ فنی خود را با دقت و شمرده بنویسید..."
                              value={questionReplyText}
                              onChange={(e) => setQuestionReplyText(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  handleQuestionReplySubmit(q.id);
                                  setActiveQuestionId("");
                                }}
                                className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                              >
                                ثبت پاسخ فنی
                              </button>
                              <button
                                onClick={() => setActiveQuestionId("")}
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
                      onChange={handleLessonFileUpload}
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

    </div>
  );
}
