"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { usePanelMyCourses } from "@/hooks/api/usePanelMyCourses";
import PanelCoursesSkeleton from "./PanelCoursesSkeleton";

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export default function PanelCourses() {
  const router = useRouter();
  const { data: courses = [], isPending, isError } = usePanelMyCourses();

  if (isPending) {
    return <PanelCoursesSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-6xl" dir="rtl">
      <section className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6 lg:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <GraduationCap className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
              یادگیری
            </p>
            <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl">
              دوره‌های من
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              {courses.length > 0
                ? `${toPersianDigits(courses.length)} دوره در حال یادگیری`
                : "دوره‌های خریداری‌شده و پیشرفت یادگیری شما"}
            </p>
          </div>
        </div>
      </section>

      {isError || courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-12 text-center dark:border-white/10 dark:bg-[#1c1e26]/50">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="mb-1.5 text-base font-black text-gray-900 dark:text-white">
            {isError ? "خطا در دریافت دوره‌ها" : "هنوز دوره‌ای ندارید"}
          </h3>
          <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {isError
              ? "لطفاً دوباره تلاش کنید یا اتصال خود را بررسی کنید."
              : "اولین دوره را شروع کنید و مسیر یادگیری خود را بسازید."}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 cursor-pointer"
          >
            مشاهده دوره‌ها
            <ChevronLeft className="size-4" />
          </Link>
        </div>
      ) : (
        <section className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {courses.map((course) => (
            <button
              key={course.enrollmentId}
              type="button"
              onClick={() =>
                router.push(
                  `/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`,
                )
              }
              className="w-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white text-right transition-all hover:border-primary/30 dark:border-white/5 dark:bg-[#1c1e26]/80 dark:hover:bg-[#1c1e26] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 lg:flex-col lg:items-stretch lg:p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 sm:size-[4.5rem] lg:aspect-video lg:h-auto lg:w-full">
                  {course.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.image}
                      alt={course.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-gray-400 dark:text-slate-500">
                      <GraduationCap className="size-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black leading-snug text-gray-900 dark:text-white">
                        {course.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500 dark:text-slate-500">
                        مدرس: {course.instructor}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-black tabular-nums text-primary">
                      {toPersianDigits(course.progress)}٪
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary/80">
                    ادامه یادگیری
                    <ChevronLeft className="size-3.5" />
                  </p>
                </div>
              </div>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
