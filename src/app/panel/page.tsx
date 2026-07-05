"use client";

import Link from "next/link";
import { usePanelDashboardOverview } from "@/hooks/api/usePanelDashboardOverview";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 h-36" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 h-28"
          />
        ))}
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <p className="text-sm font-black">بارگذاری داشبورد انجام نشد.</p>
      <p className="mt-2 text-xs opacity-90">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
      >
        تلاش مجدد
      </button>
    </div>
  );
}

export default function PanelDashboard() {
  const { data, isPending, isError, error, refetch } = usePanelDashboardOverview();

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

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-black text-gray-900 dark:text-white">{labels.welcomeTitle}</h2>
            <p className="font-medium text-gray-500 dark:text-gray-400">{labels.welcomeSubtitle}</p>
          </div>
          <Link
            href="/panel/courses"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.25)] transition hover:opacity-95"
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            ادامه یادگیری
          </Link>
        </div>
        <div className="pointer-events-none absolute top-0 left-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.enrolledCourses}</p>
            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{data.enrolledCoursesCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
            <span className="material-symbols-outlined text-2xl">comment</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.myComments}</p>
            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{data.myCommentsCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.acceptedComments}</p>
            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{data.acceptedCommentsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
