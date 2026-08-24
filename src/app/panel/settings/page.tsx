"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Receipt,
  Settings,
} from "lucide-react";
import ThemeSettingsPanel from "@/components/settings/ThemeSettingsPanel";
import ActiveSessionsPanel from "./ActiveSessionsPanel";
import SecuritySettingsPanel from "./SecuritySettingsPanel";

export default function SettingsPage() {
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
      </div>
    </div>
  );
}
