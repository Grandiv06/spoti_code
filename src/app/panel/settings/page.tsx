"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  LogOut,
  Receipt,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeSettingsPanel from "@/components/settings/ThemeSettingsPanel";
import ActiveSessionsPanel from "./ActiveSessionsPanel";
import SecuritySettingsPanel from "./SecuritySettingsPanel";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-8" dir="rtl">
      {/* Header Banner */}
      <section className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
            <Settings className="size-6 sm:size-7" />
          </div>
          <div>
            <p className="mb-0.5 text-[11px] font-bold tracking-wide text-primary">
              پیکربندی حساب
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              تنظیمات کاربری
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              مدیریت پوسته، رمزنگاری و امنیت ورود، نشست‌های متصل و دسترسی مالی
            </p>
          </div>
        </div>
      </section>

      {/* Settings Sections */}
      <div className="space-y-5">
        <ThemeSettingsPanel />
        <SecuritySettingsPanel />
        <ActiveSessionsPanel />

        <section className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                <Receipt className="size-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  امور مالی و تراکنش‌ها
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  مشاهده فاکتورهای پرداخت، وضعیت سفارش‌ها و تاریخچه شارژ
                </p>
              </div>
            </div>

            <Link
              href="/panel/transactions"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95 cursor-pointer self-start sm:self-center"
            >
              <span>مشاهده لیست تراکنش‌ها</span>
              <ChevronLeft className="size-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-red-200/60 bg-red-50/30 p-5 sm:p-7 shadow-xs dark:border-red-500/20 dark:bg-red-950/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-100/70 text-red-600 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400 shadow-xs">
                <LogOut className="size-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
                  خروج از حساب کاربری
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  خروج از نشست فعلی و بازگشت به صفحه ورود
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 px-5 py-2.5 text-xs font-black text-white shadow-sm shadow-red-600/20 transition-all cursor-pointer self-start sm:self-center"
            >
              <LogOut className="size-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </section>
      </div>

      {showLogout && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          dir="rtl"
        >
          <button
            className="absolute inset-0 bg-black/60 cursor-pointer"
            onClick={() => setShowLogout(false)}
            aria-label="بستن مودال خروج"
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1c1e26] p-6 shadow-2xl">
            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
              خروج از حساب کاربری
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5 leading-relaxed">
              آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer"
              >
                تایید خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
