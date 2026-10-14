"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  GraduationCap,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePanelDashboardOverview } from "@/hooks/api/usePanelDashboardOverview";
import { usePanelMyCourses } from "@/hooks/api/usePanelMyCourses";
import { SkeletonBox } from "@/components/ui/Skeleton";

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function StatTile({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  href?: string;
}) {
  const hasValue = value > 0;

  const content = (
    <div className="flex flex-col justify-between p-3.5 min-h-[5.5rem] sm:min-h-[4.25rem] lg:min-h-[4.75rem] sm:flex-row sm:items-center sm:gap-3.5 sm:px-5 sm:py-3.5 lg:gap-4 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between sm:contents">
        <div
          className={cn(
            "flex size-9 sm:size-10 lg:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border transition-transform duration-300 group-hover:scale-110",
            hasValue
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-400",
          )}
        >
          <Icon className="size-4 sm:size-4.5 lg:size-5" strokeWidth={2.25} />
        </div>

        <span
          className={cn(
            "flex sm:hidden items-center text-xl font-black tabular-nums tracking-tight",
            hasValue ? "text-primary" : "text-gray-900 dark:text-white",
          )}
        >
          {value.toLocaleString("fa-IR")}
        </span>
      </div>

      <div className="mt-2.5 sm:mt-0 min-w-0 flex-1">
        <p className="text-xs lg:text-[13px] font-bold leading-snug text-gray-600 dark:text-slate-300 sm:text-gray-500 sm:dark:text-slate-400">
          {title}
        </p>
      </div>

      <span
        className={cn(
          "hidden sm:flex shrink-0 items-center text-xl sm:text-2xl font-black tabular-nums tracking-tight",
          hasValue ? "text-primary" : "text-gray-900 dark:text-white",
        )}
      >
        {value.toLocaleString("fa-IR")}
      </span>
    </div>
  );

  const className = cn(
    "group block rounded-3xl bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5 active:scale-[0.98]",
    hasValue ? "hover:border-primary/30" : "hover:border-gray-300 dark:hover:border-white/10",
    href && "cursor-pointer",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-6xl animate-pulse" dir="rtl">
      <div className="h-44 rounded-4xl bg-white/60 dark:bg-[#1c1e26]/60 border border-white/20 dark:border-white/5 p-6" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-3xl bg-white/60 dark:bg-[#1c1e26]/60 border border-white/20 dark:border-white/5"
          />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-3xl bg-white/60 dark:bg-[#1c1e26]/60 border border-white/20 dark:border-white/5"
          />
        ))}
      </div>
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-6xl" dir="rtl">
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.08] p-6 text-red-600 dark:text-red-300 backdrop-blur-xl">
        <p className="text-sm font-black">بارگذاری داشبورد انجام نشد.</p>
        <p className="mt-1.5 text-xs font-medium opacity-90 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-red-600 px-5 text-xs font-black text-white transition-colors hover:bg-red-700 cursor-pointer shadow-lg shadow-red-600/20"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export default function PanelDashboard() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = usePanelDashboardOverview();
  const { data: courses = [], isPending: coursesPending } = usePanelMyCourses();

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <DashboardError
        message={error?.message || "لطفاً اتصال شبکه و ورود خود را بررسی کنید."}
        onRetry={() => void refetch()}
      />
    );
  }

  const { labels } = data;
  const recentCourses = courses.slice(0, 6);

  const stats = [
    {
      title: labels.enrolledCourses,
      value: data.enrolledCoursesCount,
      icon: GraduationCap,
      href: "/panel/courses",
    },
    {
      title: labels.myComments,
      value: data.myCommentsCount,
      icon: MessageSquare,
    },
    {
      title: labels.acceptedComments,
      value: data.acceptedCommentsCount,
      icon: CheckCircle2,
    },
    {
      title: labels.waitingComments,
      value: data.waitingCommentsCount,
      icon: Clock,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-5 pb-4 lg:max-w-6xl lg:space-y-6" dir="rtl">
      {/* Welcome Card - Profile Glassmorphism & Pattern Style */}
      <section className="relative overflow-hidden rounded-4xl border border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl p-5 sm:p-7 shadow-xs hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-48 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-10 size-48 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black mb-2.5 border border-primary/20">
              <Sparkles className="size-3.5" />
              <span>داشبورد کاربری</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-gray-900 dark:text-white tracking-tight">
              {labels.welcomeTitle}
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-gray-500 dark:text-slate-400 max-w-xl">
              {data.enrolledCoursesCount > 0
                ? `شما هم‌اکنون ${toPersianDigits(data.enrolledCoursesCount)} دوره فعال در حال یادگیری دارید.`
                : labels.welcomeSubtitle}
            </p>
          </div>

          <Link
            href="/panel/courses"
            className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-7 text-sm font-black text-white shadow-xl shadow-green-500/25 transition-all hover:shadow-green-500/35 active:scale-95 cursor-pointer shrink-0"
          >
            <PlayCircle className="size-4.5" />
            <span>ادامه یادگیری</span>
          </Link>
        </div>
      </section>

      {/* Active Order Alert */}
      {data.hasActiveOrder ? (
        <Link
          href="/panel/transactions"
          className="group flex w-full items-center gap-3.5 rounded-3xl border border-primary/30 bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl p-4 text-primary transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-green-500/5 active:scale-[0.99] cursor-pointer"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
            <AlertCircle className="size-5" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {labels.activeOrder}
            </p>
            <p className="text-xs font-bold text-primary/90 mt-0.5">
              {labels.activeOrderYes} — برای بررسی وضعیت و جزئیات کلیک کنید.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            مشاهده
            <ChevronLeft className="size-4" />
          </span>
        </Link>
      ) : null}

      {/* Quick Stats Grid */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">
            خلاصه آمار و وضعیت
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat) => (
            <StatTile
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
            />
          ))}
        </div>
      </section>

      {/* Enrolled Courses Section */}
      <section className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-4xl p-5 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              دوره‌های در حال یادگیری
            </h2>
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-0.5 truncate">
              لیست آخرین دوره‌های ثبت‌نامی و درصد پیشرفت آموزشی
            </p>
          </div>
          <Link
            href="/panel/courses"
            className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 text-xs font-black text-primary hover:text-primary-hover transition-colors group cursor-pointer"
          >
            <span>مشاهده همه دوره‌ها</span>
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1 shrink-0" />
          </Link>
        </div>

        {coursesPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 animate-pulse">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 rounded-3xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-gray-800"
              />
            ))}
          </div>
        ) : recentCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-white/40 dark:bg-[#14161c]/40 p-8 sm:p-12 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <GraduationCap className="size-7" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white mb-1.5">
              هنوز دوره‌ای ندارید
            </h3>
            <p className="mx-auto mb-6 max-w-sm text-xs font-medium leading-relaxed text-gray-500 dark:text-slate-400">
              اولین دوره آموزشی خود را شروع کنید تا مهارت‌های کاربردی برنامه‌نویسی را بیاموزید.
            </p>
            <Link
              href="/courses"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 text-sm font-black text-white shadow-xl shadow-green-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <GraduationCap className="size-4.5" />
              <span>مشاهده دوره‌ها</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {recentCourses.map((course) => (
              <div
                key={course.enrollmentId || course.id}
                onClick={() =>
                  router.push(
                    `/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`
                  )
                }
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#14161c] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer active:scale-[0.99]"
              >
                {/* Thumbnail */}
                <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {course.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.image}
                      alt={course.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-gray-400 dark:text-slate-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <GraduationCap className="size-10 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-3 end-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-black text-white border border-white/10">
                    {toPersianDigits(course.progress)}٪
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 block">
                      مدرس: {course.instructor || "اسپاتی‌کد"}
                    </span>
                    <h3 className="font-black text-gray-900 dark:text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-white/[0.04]">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-slate-400">
                      <span>میزان پیشرفت</span>
                      <span className="tabular-nums font-black text-gray-900 dark:text-white">
                        {toPersianDigits(course.progress)}٪
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                        style={{ width: `${Math.max(4, course.progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Action Links */}
                  <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-gray-50 dark:border-white/[0.04]">
                    <Link
                      href={`/courses/${encodeURIComponent(course.id)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      جزئیات دوره
                    </Link>
                    <span className="inline-flex items-center gap-1 text-xs font-black text-primary group-hover:text-primary-hover transition-colors">
                      <span>ادامه یادگیری</span>
                      <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

