"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Users,
  CircleDollarSign,
  Star,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  PlusCircle,
} from "lucide-react";
import { apiGetNoMock } from "@/lib/api";
import { fetchMyProfile } from "@/lib/panel-profile";
import {
  ActivityTimelineSkeleton,
  HeaderBannerSkeleton,
  RecentCoursesSkeleton,
  StatsCardsSkeleton,
} from "@/app/instructor/dashboard/_components/InstructorDashboardSkeleton";
import {
  countCourseStatuses,
  extractApiList,
  normalizeCourseRow,
  normalizeOverview,
  unwrapApiPayload,
  type DashboardCourseRow,
} from "@/app/instructor/dashboard/_lib/instructor-dashboard-data";

const formatCurrency = (val: number) => val.toLocaleString("fa-IR") + " تومان";
const formatPersian = (val: string | number) => val.toLocaleString("fa-IR");

function formatActivityDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "تاریخ نامشخص";

  return new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function InstructorDashboardPage() {
  const router = useRouter();

  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overview, setOverview] = useState<ReturnType<typeof normalizeOverview> | null>(null);

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [apiCourses, setApiCourses] = useState<DashboardCourseRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const name = profile.displayName?.trim();
        setProfileName(name || null);
      })
      .catch(() => {
        if (cancelled) return;
        setProfileName(null);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    apiGetNoMock<unknown>("/api/instructor-dashboard/overview")
      .then((res) => {
        if (cancelled) return;
        const raw = unwrapApiPayload(res);
        setOverview(
          normalizeOverview(
            raw && typeof raw === "object" && !Array.isArray(raw)
              ? (raw as Record<string, unknown>)
              : null
          )
        );
      })
      .catch(() => {
        if (cancelled) return;
        setOverview(normalizeOverview(null));
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });

    apiGetNoMock<unknown>("/api/instructor-dashboard/my-courses?limit=100")
      .then((res) => {
        if (cancelled) return;
        setApiCourses(extractApiList(res).map(normalizeCourseRow));
      })
      .catch(() => {
        if (cancelled) return;
        setApiCourses([]);
      })
      .finally(() => {
        if (!cancelled) setCoursesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const recentCourses = useMemo(() => apiCourses.slice(0, 4), [apiCourses]);
  const recentActivities = useMemo(
    () =>
      apiCourses
        .filter((course) => course.updatedAt)
        .slice(0, 4)
        .map((course) => ({
          id: course.id,
          title: `دوره «${course.title}» به‌روزرسانی شد`,
          date: formatActivityDate(course.updatedAt),
        })),
    [apiCourses]
  );
  const dashboardName = profileName ?? overview?.instructorName ?? null;

  const stats = useMemo(() => {
    const base = overview ?? normalizeOverview(null);
    const statusCounts = countCourseStatuses(apiCourses);
    const hasFullStatusBreakdown = apiCourses.length >= base.totalCourses && base.totalCourses > 0;

    return {
      total: base.totalCourses,
      published: hasFullStatusBreakdown ? statusCounts.published : null,
      draft: hasFullStatusBreakdown ? statusCounts.draft : null,
      students: base.students,
      revenue: base.revenue,
      avgRating: base.avgRating,
      unansweredReviews: base.unreadComments,
      newQuestions: base.newQuestions,
    };
  }, [overview, apiCourses]);

  const statusLabel = (status: DashboardCourseRow["status"]) => {
    if (status === "published") return "منتشر شده";
    if (status === "draft") return "پیش‌نویس";
    if (status === "pending") return "در انتظار بررسی";
    return "غیرفعال";
  };

  const statusClass = (status: DashboardCourseRow["status"]) => {
    if (status === "published") return "bg-emerald-500/10 text-emerald-400";
    if (status === "draft") return "bg-gray-500/10 text-gray-400";
    if (status === "pending") return "bg-amber-500/10 text-amber-400";
    return "bg-red-500/10 text-red-400";
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500" dir="rtl">
      {profileLoading ? (
        <HeaderBannerSkeleton />
      ) : (
        <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
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
                  {dashboardName ? (
                    <>سلام، استاد {dashboardName} عزیز! 👋</>
                  ) : (
                    <>سلام، استاد عزیز! 👋</>
                  )}
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
      )}

      {overviewLoading ? (
        <StatsCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
            {stats.published !== null && stats.draft !== null ? (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                <span className="text-emerald-500">{formatPersian(stats.published)} منتشرشده</span>
                <span>•</span>
                <span className="text-amber-500">{formatPersian(stats.draft)} پیش‌نویس</span>
              </div>
            ) : null}
          </div>

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
          </div>

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
          </div>

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
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="rounded-[2rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">دوره‌های اخیر مدرس</h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  لیست دوره‌های تحت تدریس شما به ترتیب آخرین ویرایش
                </p>
              </div>
              <Link
                href="/instructor/courses"
                className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <span>مشاهده همه دوره‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            {coursesLoading ? (
              <RecentCoursesSkeleton />
            ) : apiCourses.length === 0 ? (
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
                {recentCourses.map((c) => (
                  <div
                    key={c.id}
                    className="group rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-white/10">
                      {c.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.cover}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="flex-1 min-w-0 w-full flex flex-col gap-1.5 text-right sm:text-right">
                      <div className="flex items-center gap-2 justify-between sm:justify-start">
                        <span className="text-xs font-black text-gray-900 dark:text-white truncate">
                          {c.title}
                        </span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${statusClass(c.status)}`}>
                          {statusLabel(c.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                        <span>دسته: {c.category}</span>
                        <span>•</span>
                        <span>{formatPersian(c.studentsCount)} دانشجو</span>
                        <span>•</span>
                        <span>درآمد: {formatCurrency(c.revenue)}</span>
                      </div>
                    </div>

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

        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">فعالیت‌های اخیر</h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-6">
                گزارش زنده رویدادهای مربوط به دوره‌های شما
              </p>
            </div>

            {overviewLoading || coursesLoading ? (
              <ActivityTimelineSkeleton />
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(36,180,126,0.12)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-800 dark:text-gray-100 leading-6">
                        {activity.title}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm font-bold text-gray-400">فعالیتی ثبت نشده است.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
