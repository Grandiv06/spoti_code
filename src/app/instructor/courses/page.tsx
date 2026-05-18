"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  PlusCircle,
  Search,
  SlidersHorizontal,
  FolderOpen,
  ChevronDown,
  Trash2,
  Edit,
  Play,
  Star,
  Users,
  CircleDollarSign,
  Layers,
  Video,
  Clock,
  ExternalLink,
  Settings,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const { courses, deleteCourse } = useInstructorData();

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

  // Calculations
  const totalLessonsCount = (course: any) => {
    return course.chapters?.reduce((sum: number, ch: any) => sum + (ch.lessons?.length || 0), 0) || 0;
  };

  const totalChaptersCount = (course: any) => {
    return course.chapters?.length || 0;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="group relative rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Cover Image & Category Label */}
              <div className="relative w-full h-48 bg-gray-200 dark:bg-white/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.cover}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Category Pill */}
                <span className="absolute top-4 right-4 px-3 py-1 text-[9px] font-black tracking-wider bg-black/40 backdrop-blur-md text-white rounded-full">
                  {c.category}
                </span>

                {/* Rating Badge */}
                {c.rating > 0 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-[9px] font-black rounded-lg shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{c.rating.toLocaleString("fa-IR")}</span>
                  </div>
                )}
              </div>

              {/* Course Title and Descriptions */}
              <div className="p-6 flex-1 flex flex-col text-right">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] text-gray-400 font-bold">شناسه: {c.id}</span>
                  
                  {/* Status Badges */}
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg ${
                    c.status === "published"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                      : c.status === "draft"
                      ? "bg-gray-500/10 text-gray-500 border border-gray-500/15"
                      : c.status === "pending"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                      : "bg-red-500/10 text-red-500 border border-red-500/15"
                  }`}>
                    {c.status === "published" && "منتشر شده"}
                    {c.status === "draft" && "پیش‌نویس"}
                    {c.status === "pending" && "در انتظار بررسی"}
                    {c.status === "inactive" && "غیرفعال"}
                  </span>
                </div>

                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2 leading-relaxed truncate">
                  {c.title}
                </h3>
                
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-4 leading-relaxed line-clamp-2">
                  {c.shortDescription}
                </p>

                {/* Stats Icons Details */}
                <div className="grid grid-cols-3 gap-2 border-y border-gray-100 dark:border-white/5 py-3 mb-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Layers className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-[9px] font-black text-gray-900 dark:text-white">
                      {totalChaptersCount(c).toLocaleString("fa-IR")} فصل
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-x border-gray-100 dark:border-white/5">
                    <Video className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-[9px] font-black text-gray-900 dark:text-white">
                      {totalLessonsCount(c).toLocaleString("fa-IR")} درس
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <Users className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-[9px] font-black text-gray-900 dark:text-white">
                      {c.studentsCount.toLocaleString("fa-IR")} دانشجو
                    </span>
                  </div>
                </div>

                {/* Bottom Details (Price and earnings) */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold">کل فروش:</span>
                    <span className="text-xs font-black text-gray-900 dark:text-white">
                      {c.revenue > 0 ? c.revenue.toLocaleString("fa-IR") + " تومان" : "۰ تومان"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-bold">قیمت دوره:</span>
                    <span className="text-xs font-black text-primary">
                      {c.price > 0 ? c.price.toLocaleString("fa-IR") + " تومان" : "رایگان"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Hover Operations Toolbar */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push(`/instructor/courses/${c.id}`)}
                  className="px-3 py-2 bg-primary hover:bg-primary-hover text-white text-[10px] font-black rounded-xl transition-all cursor-pointer text-center"
                >
                  مدیریت دوره
                </button>
                <button
                  onClick={() => router.push(`/instructor/courses/${c.id}?tab=content`)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 text-[10px] font-black rounded-xl transition-all cursor-pointer text-center"
                >
                  فصل‌ها و درس‌ها
                </button>
                <button
                  onClick={() => router.push(`/instructor/courses/${c.id}?tab=reviews`)}
                  className="px-3 py-2 border border-gray-200 dark:border-white/10 hover:border-amber-500 text-gray-700 dark:text-gray-300 text-[9px] font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>نظرات دوره</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm("آیا از حذف این دوره اطمینان دارید؟ این عملیات غیرقابل بازگشت است.")) {
                      deleteCourse(c.id);
                    }
                  }}
                  className="px-3 py-2 border border-gray-200/50 dark:border-white/5 hover:border-red-500 text-gray-400 hover:text-red-500 text-[9px] font-black rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف دوره</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
