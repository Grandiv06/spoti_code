"use client";

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
    <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3 lg:min-h-[4.5rem] lg:gap-3 lg:p-4">
      <span
        className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border lg:size-10 lg:rounded-xl",
          hasValue
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-[#14161c] dark:text-slate-400",
        )}
      >
        <Icon className="size-3.5 lg:size-4" strokeWidth={2.25} />
      </span>
      <span className="line-clamp-2 min-w-0 flex-1 text-[11px] font-bold leading-snug text-gray-500 dark:text-slate-400 lg:text-xs">
        {title}
      </span>
      <span
        className={cn(
          "flex min-h-[28px] shrink-0 items-center text-lg font-black leading-none tracking-tight tabular-nums sm:text-xl lg:text-2xl",
          hasValue ? "text-primary" : "text-gray-900 dark:text-white",
        )}
      >
        {value.toLocaleString("fa-IR")}
      </span>
    </div>
  );

  const className = cn(
    "block rounded-xl border bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 active:scale-[0.98] dark:bg-[#181a21]",
    hasValue
      ? "border-primary/20"
      : "border-gray-200/70 dark:border-white/[0.06]",
    href && "cursor-pointer hover:border-primary/35",
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
    <div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4 pb-2 lg:max-w-6xl">
      <div className="rounded-2xl border border-gray-200/70 bg-white p-3.5 dark:border-white/[0.07] dark:bg-[#1c1e26]/80 sm:p-4">
        <SkeletonBox className="mb-2 h-3 w-20" rounded="rounded-md" />
        <SkeletonBox className="mb-2 h-6 w-40" rounded="rounded-lg" />
        <SkeletonBox className="mb-4 h-4 w-56" rounded="rounded-md" />
        <SkeletonBox className="h-10 w-full" rounded="rounded-xl" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200/70 bg-white dark:border-white/[0.06] dark:bg-[#181a21]"
          >
            <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3">
              <SkeletonBox className="size-7 shrink-0" rounded="rounded-lg" />
              <SkeletonBox className="h-3.5 flex-1" rounded="rounded-md" />
              <SkeletonBox className="h-6 w-8 shrink-0" rounded="rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200/70 bg-white p-2.5 dark:border-white/[0.06] dark:bg-[#111318] sm:p-3"
          >
            <div className="flex items-center gap-2.5">
              <SkeletonBox className="size-14 shrink-0 sm:size-16" rounded="rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBox className="h-4 w-40" rounded="rounded-md" />
                <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
                <SkeletonBox className="h-1.5 w-full" rounded="rounded-full" />
              </div>
            </div>
          </div>
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
    <div className="mx-auto w-full max-w-3xl lg:max-w-6xl">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-5 text-red-600 dark:text-red-300">
        <p className="text-sm font-black">بارگذاری داشبورد انجام نشد.</p>
        <p className="mt-1.5 text-xs font-medium opacity-90">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-xs font-black text-white transition-colors hover:bg-red-700 cursor-pointer"
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
  const recentCourses = courses.slice(0, 5);

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
    <div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4 pb-2 lg:max-w-6xl lg:space-y-6" dir="rtl">
      <section className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-primary/10 via-white to-white p-3.5 dark:border-white/[0.07] dark:from-[#10231a] dark:via-[#1c1e26] dark:to-[#16181f] sm:p-4 lg:rounded-3xl lg:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-40 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
              داشبورد شما
            </p>
            <h2 className="text-lg font-black leading-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
              {labels.welcomeTitle}
            </h2>
            <p className="mt-1 text-sm leading-snug text-gray-500 dark:text-slate-400">
              {data.enrolledCoursesCount > 0
                ? `${toPersianDigits(data.enrolledCoursesCount)} دوره فعال دارید`
                : labels.welcomeSubtitle}
            </p>
          </div>
          <Link
            href="/panel/courses"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)] transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer sm:h-11 sm:w-auto sm:shrink-0"
          >
            <PlayCircle className="size-4" />
            ادامه یادگیری
          </Link>
        </div>
      </section>

      {data.hasActiveOrder ? (
        <Link
          href="/panel/transactions"
          className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.08] px-3 py-2.5 text-primary transition-all active:scale-[0.99] cursor-pointer"
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <AlertCircle className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1 text-[13px] font-bold leading-snug">
            {labels.activeOrder} — {labels.activeOrderYes}
          </span>
          <span className="shrink-0 text-[11px] font-bold opacity-70">مشاهده</span>
          <ChevronLeft className="size-4 shrink-0 opacity-50" />
        </Link>
      ) : null}

      <section>
        <div className="mb-2 flex items-center justify-between px-0.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">خلاصه سریع</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-4">
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

      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">آخرین دوره‌ها</h3>
          <Link
            href="/panel/courses"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-primary transition-colors hover:text-primary-hover cursor-pointer"
          >
            مشاهده همه
            <ChevronLeft className="size-3.5" />
          </Link>
        </div>

        {coursesPending ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200/70 bg-white p-2.5 dark:border-white/[0.06] dark:bg-[#111318] sm:p-3"
              >
                <div className="flex items-center gap-2.5">
                  <SkeletonBox className="size-14 shrink-0 sm:size-16" rounded="rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBox className="h-4 w-40" rounded="rounded-md" />
                    <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-7 text-center dark:border-white/10 dark:bg-[#1c1e26]/60">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>
            <p className="mb-1 text-sm font-bold text-gray-800 dark:text-slate-300">
              هنوز دوره‌ای ندارید
            </p>
            <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-slate-500">
              اولین دوره را شروع کنید و مسیر یادگیری خود را بسازید
            </p>
            <Link
              href="/courses"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer"
            >
              <GraduationCap className="size-4" />
              مشاهده دوره‌ها
            </Link>
          </div>
        ) : (
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {recentCourses.map((course) => (
              <button
                key={course.enrollmentId}
                type="button"
                onClick={() =>
                  router.push(
                    `/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`,
                  )
                }
                className="w-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white text-right transition-all hover:border-primary/30 dark:border-white/[0.06] dark:bg-[#111318] dark:hover:bg-[#16181f] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 sm:size-16">
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
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
