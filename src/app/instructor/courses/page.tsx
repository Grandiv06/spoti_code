"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  PlusCircle,
  Search,
  FolderOpen,
  ChevronDown,
  PencilRuler
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import CourseCard from "@/app/components/CourseCard";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const { courses, profile } = useInstructorData();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "best_selling") {
        return b.revenue - a.revenue;
      }
      if (sortBy === "most_students") {
        return b.studentsCount - a.studentsCount;
      }
      if (sortBy === "highest_rated") {
        return b.rating - a.rating;
      }
      // default: newest ('newest')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [courses, search, statusFilter, categoryFilter, sortBy]);

  const totalLessonsCount = (course: { chapters?: Array<{ lessons?: unknown[] }> }) => {
    return course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;
  };

  const getDraftStep = (course: {
    title?: string;
    level?: string;
    shortDescription?: string;
    description?: string;
    price?: number;
    chapters?: Array<{ lessons?: unknown[] }>;
    faqs?: unknown[];
  }) => {
    let step = 1;
    const hasStep1 = Boolean(course.title?.trim()) && Boolean(course.level) && ((course.price || 0) >= 0);
    if (hasStep1) step = 2;
    const hasStep2 = Boolean(course.shortDescription?.trim());
    if (hasStep2) step = 3;
    const hasStep3 = Boolean(course.description?.trim()) || ((course.faqs?.length || 0) > 0);
    if (hasStep3) step = 4;
    const hasStep4 = (course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0) > 0;
    if (hasStep4) step = 5;
    return Math.min(step, 5);
  };

  const getPendingStatusMessage = () =>
    "وضعیت این دوره در حال بررسی می‌باشد. پس از تایید، مدیریت کامل و نمایش عمومی فعال می‌شود.";

  const isPublishedLike = (status: string) => status === "published" || status === "approved";

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500" dir="rtl">
      
      {/* 1. Top Header Banner */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">مدیریت دوره‌های آموزشی</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                شما در حال حاضر {courses.length} دوره آموزشی طراحی کرده‌اید.
              </p>
            </div>
          </div>

          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ایجاد دوره جدید</span>
          </Link>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-3xl p-6 mb-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان دوره یا کلمات کلیدی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:border-primary focus:outline-none appearance-none cursor-pointer text-right"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              <option value="Frontend">Frontend (فرانت‌اند)</option>
              <option value="Backend">Backend (بک‌اند)</option>
              <option value="DevOps">DevOps (دواپس)</option>
              <option value="Mobile">Mobile (موبایل)</option>
              <option value="UI/UX">UI/UX (طراحی رابط کاربری)</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sorting */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:border-primary focus:outline-none appearance-none cursor-pointer text-right"
            >
              <option value="newest">جدیدترین‌ها</option>
              <option value="best_selling">پرفروش‌ترین‌ها</option>
              <option value="most_students">بیشترین دانشجو</option>
              <option value="highest_rated">بیشترین امتیاز</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-4">
          <span className="text-xs text-gray-400 font-bold ml-3">وضعیت انتشار:</span>
          {[
            { id: "all", label: "همه" },
            { id: "published", label: "منتشر شده" },
            { id: "pending", label: "در انتظار بررسی" },
            { id: "draft", label: "پیش‌نویس" },
            { id: "inactive", label: "غیرفعال" },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Courses Grid / Skeleton / Empty State */}
      {!isLoaded ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-6 space-y-4 animate-pulse">
              <div className="w-full h-40 bg-gray-200 dark:bg-white/5 rounded-2xl" />
              <div className="h-6 w-2/3 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="flex gap-2 justify-between">
                <div className="h-4 w-12 bg-gray-200 dark:bg-white/5 rounded" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        // Empty State
        <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">هنوز دوره‌ای ایجاد نکرده‌اید!</h3>
          <p className="text-xs text-gray-400 font-bold mb-6 max-w-sm leading-relaxed">
            شما هیچ دوره‌ای با شرایط فیلتر شده یا در سیستم ثبت نکرده‌اید. همین حالا اولین دوره خود را تعریف کنید.
          </p>
          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-1.5 px-6 py-3.5 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ایجاد اولین دوره</span>
          </Link>
        </div>
      ) : (
        // Courses Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredCourses.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 h-full">
              <div className="h-full flex flex-col min-h-[720px]">
                <div className="flex-1">
                  <CourseCard
                    id={c.id}
                    title={c.title}
                    instructor={profile?.name || "مدرس دوره"}
                    instructorImg={profile?.avatar || "/images/inst1.jpg"}
                    image={c.title.includes("TypeScript") ? "/images/course3.jpg" : c.cover}
                    difficulty={c.level === "elementary" ? "مقدماتی" : c.level === "intermediate" ? "متوسط" : "پیشرفته"}
                    hours={String(totalLessonsCount(c))}
                    students={c.studentsCount}
                    price={c.price > 0 ? c.price : "رایگان"}
                    viewHref={`/courses/${c.id}`}
                    disableViewNavigation={!isPublishedLike(c.status)}
                    onViewClick={(e) => {
                      if (isPublishedLike(c.status)) return;
                      e.preventDefault();
                      if (c.status === "pending") {
                        alert(getPendingStatusMessage());
                        return;
                      }
                      if (c.status === "draft") {
                        const draftStep = getDraftStep(c);
                        alert(`این دوره پیش‌نویس است. ادامه و تکمیل از مرحله ${draftStep}.`);
                        router.push(`/instructor/courses/create?draftCourseId=${c.id}&step=${draftStep}`);
                        return;
                      }
                      alert("این دوره هنوز قابل مشاهده عمومی نیست.");
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    if (isPublishedLike(c.status)) {
                      router.push(`/instructor/courses/${c.id}`);
                      return;
                    }
                    if (c.status === "pending") {
                      alert(getPendingStatusMessage());
                      return;
                    }
                    if (c.status === "draft") {
                      const draftStep = getDraftStep(c);
                      router.push(`/instructor/courses/create?draftCourseId=${c.id}&step=${draftStep}`);
                      return;
                    }
                    alert("این دوره در وضعیت فعلی قابل مدیریت نیست.");
                  }}
                  className="mt-3 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white text-xs font-black shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <PencilRuler className="w-4 h-4" />
                  {c.status === "draft" ? `ادامه پیش‌نویس (مرحله ${getDraftStep(c)} از ۵)` : "مدیریت دوره"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
