"use client";

import { usePanelDashboardOverview } from "@/hooks/api/usePanelDashboardOverview";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 h-36" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
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

  const { labels, hasActiveOrder } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{labels.welcomeTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{labels.welcomeSubtitle}</p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.enrolledCourses}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.enrolledCoursesCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500">
            <span className="material-symbols-outlined text-2xl">comment</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.myComments}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.myCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.acceptedComments}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.acceptedCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.waitingComments}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{data.waitingCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              hasActiveOrder
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
                : "bg-gray-50 dark:bg-gray-500/10 text-gray-400"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {hasActiveOrder ? "shopping_cart_checkout" : "shopping_cart_off"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{labels.activeOrder}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
              {hasActiveOrder ? labels.activeOrderYes : labels.activeOrderNo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
