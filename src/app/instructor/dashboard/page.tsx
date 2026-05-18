"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FileCheck,
  FileEdit,
  Users,
  CircleDollarSign,
  Star,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  ChevronLeft,
  Settings,
  PlusCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";

export default function InstructorDashboardPage() {
  const router = useRouter();
  const { courses, questions, transactions, profile } = useInstructorData();

  // Statistics Computations
  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((c) => c.status === "published").length;
    const pending = courses.filter((c) => c.status === "pending").length;
    const draft = courses.filter((c) => c.status === "draft").length;
    
    const students = courses.reduce((sum, c) => sum + c.studentsCount, 0);
    const revenue = courses.reduce((sum, c) => sum + c.revenue, 0);
    
    // Average rating
    const ratedCourses = courses.filter((c) => c.rating > 0);
    const avgRating = ratedCourses.length > 0 
      ? (ratedCourses.reduce((sum, c) => sum + c.rating, 0) / ratedCourses.length).toFixed(1)
      : "0";

    // Unanswered reviews
    const unansweredReviews = courses.reduce(
      (sum, c) => sum + c.reviews.filter((r) => !r.reply).length, 
      0
    );

    // New questions
    const newQuestions = questions.filter((q) => q.status === "new").length;

    return {
      total,
      published,
      pending,
      draft,
      students,
      revenue,
      avgRating,
      unansweredReviews,
      newQuestions,
    };
  }, [courses, questions]);

  // Format currency
  const formatCurrency = (val: number) => {
    return val.toLocaleString("fa-IR") + " تومان";
  };

  // Format Persian digits
  const formatPersian = (val: string | number) => {
    return val.toLocaleString("fa-IR");
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500" dir="rtl">
      
      {/* 1. Header Banner */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">
                سلام، استاد {profile.name} عزیز! 👋
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                «از این بخش می‌توانید دوره‌ها، دانشجوها، نظرات و درآمد خود را مدیریت کنید.»
              </p>
            </div>
          </div>

          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ایجاد دوره جدید</span>
          </Link>
        </div>
      </div>

      {/* 2. Statistical Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Card 1: Total Courses */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">کل دوره‌ها</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center text-blue-500">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
            {formatPersian(stats.total)}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
            <span className="text-emerald-500">{formatPersian(stats.published)} منتشرشده</span>
            <span>•</span>
            <span className="text-amber-500">{formatPersian(stats.draft)} پیش‌نویس</span>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">کل دانشجویان</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
            {formatPersian(stats.students)}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+۱۲٪ این ماه</span>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">مجموع درآمد</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-1 truncate">
            {formatCurrency(stats.revenue)}
          </p>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
            سهم خالص مدرس (۷۰ درصد)
          </div>
        </div>

        {/* Card 4: Average Rating */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md group hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">امتیاز دوره‌ها</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5 fill-amber-500/10" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
            {formatPersian(stats.avgRating)} <span className="text-sm font-medium text-gray-400">/ ۵</span>
          </p>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
            میانگین آرای کل شرکت‌کنندگان
          </div>
        </div>

        {/* Unanswered Reviews Alert */}
        {stats.unansweredReviews > 0 && (
          <div className="col-span-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-3.5 flex items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 shrink-0 animate-bounce" />
              <span className="text-xs font-bold leading-relaxed">
                شما تعداد {formatPersian(stats.unansweredReviews)} دیدگاه پاسخ‌داده‌نشده از دانشجویان دارید.
              </span>
            </div>
            <Link
              href="/instructor/courses"
              className="text-[10px] font-black underline hover:text-amber-600 transition-colors"
            >
              مشاهده و پاسخ
            </Link>
          </div>
        )}

        {/* New Questions Alert */}
        {stats.newQuestions > 0 && (
          <div className="col-span-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-3.5 flex items-center justify-between gap-3 text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="text-xs font-bold leading-relaxed">
                تعداد {formatPersian(stats.newQuestions)} سوال جدید مطرح شده در انجمن‌ها منتظر پاسخ شماست!
              </span>
            </div>
            <Link
              href="/instructor/questions"
              className="text-[10px] font-black underline hover:text-rose-600 transition-colors"
            >
              پاسخ به سوالات
            </Link>
          </div>
        )}

      </div>

      {/* 3. Main Split Grid (Recent Courses & Activity Timeline) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Courses List (Col-Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="rounded-[2rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">دوره‌های اخیر مدرس</h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">لیست دوره‌های تحت تدریس شما به ترتیب آخرین ویرایش</p>
              </div>
              <Link
                href="/instructor/courses"
                className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <span>مشاهده همه دوره‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-bold text-gray-400 mb-4">هنوز هیچ دوره‌ای ایجاد نکرده‌اید.</p>
                <Link
                  href="/instructor/courses/create"
                  className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
                >
                  ساخت اولین دوره
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="group rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300"
                  >
                    {/* Cover */}
                    <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.cover}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 w-full flex flex-col gap-1.5 text-right sm:text-right">
                      <div className="flex items-center gap-2 justify-between sm:justify-start">
                        <span className="text-xs font-black text-gray-900 dark:text-white truncate">
                          {c.title}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                          c.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : c.status === "draft"
                            ? "bg-gray-500/10 text-gray-400"
                            : c.status === "pending"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {c.status === "published" && "منتشر شده"}
                          {c.status === "draft" && "پیش‌نویس"}
                          {c.status === "pending" && "در انتظار بررسی"}
                          {c.status === "inactive" && "غیرفعال"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                        <span>دسته: {c.category}</span>
                        <span>•</span>
                        <span>{formatPersian(c.studentsCount)} دانشجو</span>
                        <span>•</span>
                        <span>درآمد: {formatCurrency(c.revenue)}</span>
                      </div>

                      {/* Completion rate bar */}
                      <div className="mt-1 w-full max-w-xs">
                        <div className="flex justify-between text-[8px] text-gray-400 mb-1 font-bold">
                          <span>میانگین پیشرفت دوره:</span>
                          <span>{formatPersian(c.completionRate)}٪</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${c.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Manage Button */}
                    <button
                      onClick={() => router.push(`/instructor/courses/${c.id}`)}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-white/10 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-[10px] font-black rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      مدیریت دوره
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Activities Feed */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">فعالیت‌های اخیر</h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-6">گزارش زنده رویدادهای مربوط به دوره‌های شما</p>
            </div>

            {/* Timeline Wrapper */}
            <div className="relative border-r-2 border-gray-200/50 dark:border-white/5 pr-6 space-y-6">
              
              {/* Event 1: New Lesson Uploaded */}
              <div className="relative">
                {/* Timeline Dot */}
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-white dark:bg-[#1c1e26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white mb-1">درس جدید آپلود شد</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    «مفهوم Server Actions در ری‌اکت ۱۹» به فصل دوم اضافه شد.
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block mt-1">۲ ساعت پیش</span>
                </div>
              </div>

              {/* Event 2: New Review Comment */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 border-amber-500 bg-white dark:bg-[#1c1e26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white mb-1">دانشجو نظر ثبت کرد</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    مهدی امینی امتیاز ۵ ستاره برای دوره «متخصص React و Next.js» ثبت کرد.
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block mt-1">امروز، ۱۲:۳۰</span>
                </div>
              </div>

              {/* Event 3: New Sale Purchase */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white dark:bg-[#1c1e26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white mb-1">فروش جدید انجام شد</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    دانشجو «مریم حسینی» دوره «متخصص React و Next.js» را خریداری کرد.
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block mt-1">دیروز، ۱۵:۴۰</span>
                </div>
              </div>

              {/* Event 4: Course Published */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-white dark:bg-[#1c1e26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white mb-1">دوره منتشر شد</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    دوره «TypeScript پیشرفته» مورد تایید نهایی مدیریت قرار گرفت و منتشر شد.
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block mt-1">۲ روز پیش</span>
                </div>
              </div>

              {/* Event 5: New Forum Question */}
              <div className="relative">
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full border-2 border-rose-500 bg-white dark:bg-[#1c1e26] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white mb-1">سوال جدید ثبت شد</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    علیرضا رضایی یک سوال درباره «Hydration mismatch» در دوره نکست‌جی‌اس مطرح کرد.
                  </p>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block mt-1">۳ روز پیش</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
