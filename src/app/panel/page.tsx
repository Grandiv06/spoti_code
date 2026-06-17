 "use client";

import { useEffect, useState } from "react";
import { apiGetNoMock } from "@/lib/api";

type DashboardOverviewResponse = {
  data?: {
    enrolledCoursesCount?: number;
    myCommentsCount?: number;
    acceptedCommentsCount?: number;
    waitingCommentsCount?: number;
    hasActiveOrder?: boolean;
  };
};

export default function PanelDashboard() {
  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);
  const [myCommentsCount, setMyCommentsCount] = useState(0);
  const [acceptedCommentsCount, setAcceptedCommentsCount] = useState(0);
  const [waitingCommentsCount, setWaitingCommentsCount] = useState(0);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const result = await apiGetNoMock<DashboardOverviewResponse>(
          "/api/dashboard/overview",
          token ? { Authorization: `Bearer ${token}` } : undefined
        );

        const payload = result?.data ?? {};
        setEnrolledCoursesCount(payload.enrolledCoursesCount ?? 0);
        setMyCommentsCount(payload.myCommentsCount ?? 0);
        setAcceptedCommentsCount(payload.acceptedCommentsCount ?? 0);
        setWaitingCommentsCount(payload.waitingCommentsCount ?? 0);
        setHasActiveOrder(Boolean(payload.hasActiveOrder));
      } catch {
        setEnrolledCoursesCount(0);
        setMyCommentsCount(0);
        setAcceptedCommentsCount(0);
        setWaitingCommentsCount(0);
        setHasActiveOrder(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            خوش اومدی، <span className="text-primary">کاربر عزیز</span>! 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            از داشبورد خودت می‌تونی به دوره‌ها و وضعیت یادگیریت دسترسی داشته باشی.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">دوره‌های ثبت‌نامی</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{enrolledCoursesCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500">
            <span className="material-symbols-outlined text-2xl">comment</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">کامنت‌های من</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{myCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">کامنت‌های تاییدشده</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{acceptedCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">در انتظار بررسی</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{waitingCommentsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasActiveOrder ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-gray-50 dark:bg-gray-500/10 text-gray-400"}`}>
            <span className="material-symbols-outlined text-2xl">
              {hasActiveOrder ? "shopping_cart_checkout" : "shopping_cart_off"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">سفارش فعال</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{hasActiveOrder ? "دارد" : "ندارد"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
