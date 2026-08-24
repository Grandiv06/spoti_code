"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Play,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { usePanelMyCourses } from "@/hooks/api/usePanelMyCourses";
import PanelCoursesSkeleton from "./PanelCoursesSkeleton";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "in_progress" | "completed";
type SortOption = "latest" | "progress_high" | "progress_low" | "title";

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default function PanelCourses() {
  const router = useRouter();
  const { data: courses = [], isPending, isError } = usePanelMyCourses();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  // Summary counts
  const totalCount = courses.length;
  const completedCount = useMemo(
    () => courses.filter((c) => (c.progress ?? 0) >= 100).length,
    [courses]
  );
  const inProgressCount = totalCount - completedCount;

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    // 1. Search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.instructor?.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (statusFilter === "in_progress") {
      list = list.filter((c) => (c.progress ?? 0) < 100);
    } else if (statusFilter === "completed") {
      list = list.filter((c) => (c.progress ?? 0) >= 100);
    }

    // 3. Sort
    if (sortBy === "progress_high") {
      list.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
    } else if (sortBy === "progress_low") {
      list.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0));
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    }

    return list;
  }, [courses, searchQuery, statusFilter, sortBy]);

  if (isPending) {
    return <PanelCoursesSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5 pb-8" dir="rtl">
      {/* Header Banner */}
      <section className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <GraduationCap className="size-6 sm:size-7" />
            </div>
            <div>
              <p className="mb-0.5 text-[11px] font-bold tracking-wide text-primary">
                میز یادگیری
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                دوره‌های من
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                مشاهده و ادامه مسیر پیشرفت در دوره‌های ثبت‌نام‌شده
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95 cursor-pointer self-start sm:self-center"
          >
            <BookOpen className="size-4" />
            <span>کاتالوگ دوره‌ها</span>
          </Link>
        </div>

        {/* Unified Integrated Stats Pills */}
        {totalCount > 0 && (
          <div className="flex items-center gap-2 sm:gap-2.5 pt-4 mt-5 border-t border-gray-100 dark:border-white/[0.06] overflow-x-auto pb-1 scrollbar-hide">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] text-xs shrink-0">
              <span className="text-gray-500 dark:text-slate-400 font-medium">کل دوره‌ها:</span>
              <span className="font-black text-gray-900 dark:text-white">{toPersianDigits(totalCount)}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/[0.06] border border-primary/20 text-xs shrink-0">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-bold">در حال یادگیری:</span>
              <span className="font-black text-primary">{toPersianDigits(inProgressCount)}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">تکمیل‌شده:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{toPersianDigits(completedCount)}</span>
            </div>
          </div>
        )}
      </section>

      {/* Error or Empty State */}
      {isError || courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-12 text-center shadow-xs dark:border-white/[0.08] dark:bg-[#101217]">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <GraduationCap className="size-7" />
          </div>
          <h3 className="mb-1.5 text-base font-black text-gray-900 dark:text-white">
            {isError ? "خطا در دریافت اطلاعات دوره‌ها" : "هنوز در دوره‌ای ثبت‌نام نکرده‌اید"}
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {isError
              ? "لطفاً دوباره تلاش کنید یا اتصال اینترنت خود را بررسی نمایید."
              : "با شروع اولین دوره تخصصی، مهارت‌های برنامه‌نویسی خود را به سطح حرفه‌ای برسانید."}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover active:scale-95 cursor-pointer"
          >
            <span>مشاهده و انتخاب دوره</span>
            <ChevronLeft className="size-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Symmetrical Search and Filters Toolbar */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در عنوان دوره یا نام مدرس..."
                  className="h-10 sm:h-11 w-full rounded-2xl border border-gray-200 bg-gray-50/80 py-2 pr-10 pl-9 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-[#0a0b0f] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-[#101217]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Symmetrical Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                {/* Status Segmented Pills */}
                <div className="grid grid-cols-3 items-center rounded-2xl bg-gray-50/90 dark:bg-[#0a0b0f] p-1 border border-gray-200/80 dark:border-white/[0.06] w-full sm:w-auto flex-1 md:flex-none">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={cn(
                      "px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap",
                      statusFilter === "all"
                        ? "bg-white text-primary shadow-xs dark:bg-[#151820] dark:text-white ring-1 ring-black/5 dark:ring-white/10"
                        : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    همه
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("in_progress")}
                    className={cn(
                      "px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap",
                      statusFilter === "in_progress"
                        ? "bg-white text-primary shadow-xs dark:bg-[#151820] dark:text-white ring-1 ring-black/5 dark:ring-white/10"
                        : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    در حال یادگیری
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("completed")}
                    className={cn(
                      "px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap",
                      statusFilter === "completed"
                        ? "bg-white text-primary shadow-xs dark:bg-[#151820] dark:text-white ring-1 ring-black/5 dark:ring-white/10"
                        : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    تکمیل‌شده
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative w-full sm:w-48 lg:w-44 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="مرتب‌سازی دوره‌ها"
                    className="h-10 sm:h-11 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50/80 py-2 pr-4 pl-10 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-[#0a0b0f] dark:text-white dark:focus:bg-[#101217] cursor-pointer"
                  >
                    <option value="latest">جدیدترین‌ها</option>
                    <option value="progress_high">بیشترین پیشرفت</option>
                    <option value="progress_low">کمترین پیشرفت</option>
                    <option value="title">عنوان (الفبا)</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-slate-500">
                <Search className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                دوره‌ای با این مشخصات یافت نشد
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                لطفاً عبارت جستجو یا فیلترهای انتخابی را تغییر دهید.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => {
                const isCompleted = (course.progress ?? 0) >= 100;

                return (
                  <div
                    key={course.enrollmentId}
                    onClick={() =>
                      router.push(
                        `/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`
                      )
                    }
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg dark:border-white/[0.07] dark:bg-[#101217] dark:hover:border-primary/30 active:scale-[0.99] cursor-pointer shadow-xs"
                  >
                    <div>
                      {/* Course Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#0a0b0f]">
                        {course.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.image}
                            alt={course.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-gray-400 dark:text-slate-600">
                            <GraduationCap className="size-10" />
                          </div>
                        )}

                        {/* Status Overlay Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black text-white shadow-xs">
                              <CheckCircle2 className="size-3" />
                              <span>تکمیل‌شده</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                              <span>در حال یادگیری</span>
                            </span>
                          )}
                        </div>

                        {/* Play Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transform transition-transform group-hover:scale-110">
                            <Play className="size-5 fill-current mr-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Course Content Info */}
                      <div className="mt-3.5">
                        <h3 className="text-sm font-black leading-snug text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                          <User className="size-3.5 shrink-0 text-gray-400 dark:text-slate-500" />
                          <span className="truncate">مدرس: {course.instructor || "اسپاتی کد"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-white/[0.05]">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-gray-500 dark:text-slate-400 text-[11px]">
                          میزان پیشرفت
                        </span>
                        <span className="text-primary font-black">
                          {toPersianDigits(course.progress ?? 0)}٪
                        </span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-l from-primary to-emerald-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, course.progress ?? 0))}%` }}
                        />
                      </div>

                      <div className="mt-3.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
                          <span>{isCompleted ? "مرور جلسات" : "ادامه یادگیری"}</span>
                          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        </span>

                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                          {isCompleted ? "پایان دوره" : "جلسات فعال"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
