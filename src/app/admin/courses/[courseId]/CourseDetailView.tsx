"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Edit2, 
  ExternalLink, 
  User, 
  Calendar, 
  DollarSign, 
  Award, 
  BookOpen, 
  Clock, 
  Play, 
  FileText,
  Users, 
  Star, 
  Percent, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  TrendingUp,
  ShieldAlert
} from "lucide-react";

import { Course, initialCoursesData } from "../_components/types";
import { buildMockCourseDetail, buildMockCourseDetailById, readAdminCourseDetail } from "../_components/course-detail-mock";
import CourseStatusBadge from "../_components/CourseStatusBadge";
import EditCourseModal from "../_components/EditCourseModal";

interface CourseDetailViewProps {
  courseId: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Accordion state
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    "CH-1": true, // open first chapter by default
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const cached = readAdminCourseDetail(courseId);
    if (cached) {
      setCourse(cached);
      setIsLoaded(true);
      return;
    }

    const saved = localStorage.getItem("spoticode_admin_courses");
    let coursesList = initialCoursesData;
    if (saved) {
      try {
        coursesList = JSON.parse(saved);
      } catch {
        coursesList = initialCoursesData;
      }
    }
    setCourses(coursesList);

    const found = coursesList.find((c) => c.id === courseId);
    if (found) {
      setCourse(buildMockCourseDetail(found));
    } else {
      const initialFound = initialCoursesData.find((c) => c.id === courseId);
      if (initialFound) {
        setCourse(initialFound);
      } else {
        setCourse(buildMockCourseDetailById(courseId));
      }
    }
    setIsLoaded(true);
  }, [courseId]);

  // Persist back on edits
  const saveCoursesToStorage = (updatedList: Course[]) => {
    localStorage.setItem("spoticode_admin_courses", JSON.stringify(updatedList));
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditSave = (updatedCourse: Course) => {
    setCourse(updatedCourse);
    const updatedList = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    setCourses(updatedList);
    saveCoursesToStorage(updatedList);
    setIsEditModalOpen(false);
    showToast(`مشخصات دوره با موفقیت به روز شد.`, "success");
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return `${price.toLocaleString("fa-IR")} تومان`;
  };

  const formatRevenue = (rev: number) => {
    return `${rev.toLocaleString("fa-IR")} تومان`;
  };

  // Compute lesson totals
  const totalLessons = useMemo(() => {
    if (!course) return 0;
    return course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  }, [course]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]" dir="rtl">
        <span className="text-sm font-bold text-gray-500 animate-pulse">در حال بارگذاری اطلاعات دوره...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-3xl" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">دوره مورد نظر یافت نشد</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">شناسه دوره معتبر نیست یا دوره از پلتفرم حذف شده است.</p>
        <button
          onClick={() => router.push("/admin/courses")}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl"
        >
          بازگشت به لیست دوره‌ها
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      
      {/* 1. Page Header Section */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
            <button
              onClick={() => router.push("/admin/courses")}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-black/20 dark:hover:bg-black/35 text-gray-600 dark:text-gray-400 hover:text-gray-900 border border-gray-100 dark:border-white/5 transition-all shrink-0 hover:scale-105"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center md:text-right space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest uppercase">{course.id}</span>
                <CourseStatusBadge status={course.status} />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-relaxed">{course.title}</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{course.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end select-none">
            <button
              onClick={() => showToast("صفحه پیش‌نمایش عمومی دوره در آدرس اصلی وب‌سایت شبیه‌سازی شد.", "info")}
              className="flex items-center gap-1.5 px-4.5 py-3 border border-gray-100 dark:border-white/5 bg-gray-50 hover:bg-gray-100 dark:bg-black/20 dark:hover:bg-black/35 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-2xl transition-all hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>مشاهده صفحه عمومی</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-amber-500/10 hover:scale-[1.02]"
            >
              <Edit2 className="w-4 h-4" />
              <span>ویرایش دوره</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Page Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Right side 2 cols: Specifications and Syllabus Accordion */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Course Specifications */}
          <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 md:p-8 shadow-md space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-white/5 pb-3">مشخصات عمومی و مالی دوره</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {/* Item: Instructor */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">مدرس دوره</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{course.instructor}</span>
                </div>
              </div>

              {/* Item: Category */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">دسته‌بندی و سطح</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{course.category} ({course.level})</span>
                </div>
              </div>

              {/* Item: Price */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">شهریه ثبت‌نام</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatPrice(course.price)}</span>
                </div>
              </div>

              {/* Item: Duration */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">مدت زمان کل</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{course.duration} ({totalLessons.toLocaleString("fa-IR")} جلسه)</span>
                </div>
              </div>

              {/* Item: Publish Date */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">تاریخ انتشار</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{course.publishDate}</span>
                </div>
              </div>

              {/* Item: Updated At */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mb-0.5">آخرین بروزرسانی</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{course.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="bg-gray-50/50 dark:bg-black/15 p-5 rounded-[1.5rem] border border-gray-100 dark:border-white/5 space-y-2">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black block">توضیحات تکمیلی دوره</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">{course.description}</p>
            </div>

            {/* Prerequisites & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 select-none">
              {/* Prerequisites */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black block">پیش‌نیازهای ورود به دوره</span>
                <div className="flex flex-wrap gap-1.5">
                  {course.prerequisites.length > 0 ? (
                    course.prerequisites.map((p) => (
                      <span key={p} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 italic">پیش‌نیازی ثبت نشده است.</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black block">برچسب‌های تخصصی</span>
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.length > 0 ? (
                    course.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-primary/10 border border-primary/15 text-primary">
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400 dark:text-gray-600 italic">برچسبی ثبت نشده است.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Syllabus Accordion List */}
          <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 md:p-8 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">سرفصل‌ها و محتوای تدریس</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">مشاهده و دسته‌بندی فصول و ویدیوها</p>
              </div>
              <div className="flex gap-4.5 text-[11px] font-black text-gray-500 select-none">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course.chapters.length.toLocaleString("fa-IR")} فصل</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>

            {/* Accordion container */}
            <div className="space-y-3">
              {course.chapters.map((ch) => {
                const isOpen = !!openChapters[ch.id];
                return (
                  <div 
                    key={ch.id} 
                    className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden bg-gray-50/20 dark:bg-black/10 transition-all"
                  >
                    {/* Chapter Trigger Header */}
                    <button
                      onClick={() => toggleChapter(ch.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-right font-black text-xs text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black/25 transition-all select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-black">{ch.id}</span>
                        <span>{ch.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span className="font-bold">{ch.duration}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Chapter Lessons List */}
                    {isOpen && (
                      <div className="border-t border-gray-100 dark:border-white/5 px-5 py-3 divide-y divide-gray-100/50 dark:divide-white/5 bg-white dark:bg-[#1a1c22] animate-in slide-in-from-top duration-250">
                        {ch.lessons.map((les) => (
                          <div 
                            key={les.id}
                            className="py-3 flex items-center justify-between text-xs text-gray-700 dark:text-gray-300"
                          >
                            <div className="flex items-center gap-2.5">
                              {les.isFree ? (
                                <Play className="w-4 h-4 text-emerald-500 fill-emerald-500/20 shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0" />
                              )}
                              <span className="font-semibold">{les.title}</span>
                              {les.isFree && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 border border-emerald-500/10 text-emerald-500">رایگان</span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold select-none">{les.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Left side 1 col: Performance KPIs, Recent Students list and Reviews */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card: Sales Performance Metrics */}
          <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-white/5 pb-3 mb-5">عملکرد فروش و تعامل</h3>
            
            <div className="space-y-4 select-none">
              {/* Stat 1: Total Revenue */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-emerald-800 dark:text-emerald-500 font-bold block">کل فروش دوره</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatRevenue(course.revenue)}</span>
                </div>
                <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/15">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block mb-1">تعداد خرید</span>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{course.students.toLocaleString("fa-IR")} نفر</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block mb-1">میانگین تکمیل</span>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{course.completion}%</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block mb-1">نرخ بازگشت وجه</span>
                  <span className="text-sm font-black text-rose-500">{course.refundRate}%</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block mb-1">تعداد سرفصل‌ها</span>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{course.chapters.length} فصل</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Course Recent Students */}
          <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">دانشجویان اخیر دوره</h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">آخرین ثبت‌نامی‌ها و وضعیت پیشرفت</p>
            </div>

            <div className="space-y-3.5 divide-y divide-gray-100/60 dark:divide-white/5">
              {course.studentsList.length > 0 ? (
                course.studentsList.map((st, idx) => (
                  <div key={st.id} className={`flex flex-col gap-2 ${idx > 0 ? "pt-3.5" : ""}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-black/25 flex items-center justify-center font-black text-[9px] text-gray-500 select-none">
                          {st.name.substring(0, 2)}
                        </div>
                        <div>
                          <span className="font-black text-gray-800 dark:text-gray-200 block">{st.name}</span>
                          <span className="text-[9px] text-gray-400 font-bold block">{st.purchaseDate}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                        st.status === "فعال" 
                          ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-500" 
                          : "bg-amber-500/10 border-amber-500/15 text-amber-500"
                      }`}>
                        {st.status}
                      </span>
                    </div>

                    {/* Progress strip */}
                    <div className="flex items-center justify-between text-[9px] font-black text-gray-400 px-1">
                      <span>پیشرفت: {st.progress}%</span>
                      <div className="h-1 w-28 rounded-full bg-gray-100 dark:bg-black/35 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${st.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-bold">هنوز هیچ دانشجویی در این دوره ثبت‌نام نکرده است.</div>
              )}
            </div>
          </div>

          {/* Card: Course Reviews & Rating summary */}
          <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">نظرات و امتیازها</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1">بازخورد مستقیم دانشجویان</p>
              </div>
              
              {/* Average score card */}
              <div className="flex items-center gap-1 select-none">
                <span className="text-sm font-black text-gray-900 dark:text-white">۴.۸</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              </div>
            </div>

            {/* List of Reviews */}
            <div className="space-y-4 divide-y divide-gray-100/60 dark:divide-white/5">
              {course.reviews.length > 0 ? (
                course.reviews.map((rev, idx) => (
                  <div key={rev.id} className={`space-y-2 ${idx > 0 ? "pt-4" : ""}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-gray-800 dark:text-gray-200 block">{rev.userName}</span>
                        <span className="text-[8px] text-gray-400 font-bold block mt-0.5">{rev.date}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 text-amber-500 select-none">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 shrink-0 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-gray-200 dark:text-gray-800"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-bold">هنوز هیچ نظری برای این دوره ثبت نشده است.</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Edit Course Modal Overlay Integration */}
      <EditCourseModal
        course={course}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />

      {/* Custom Toast Notifications Overlay */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full" dir="rtl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-left duration-300 ${
              t.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : t.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
