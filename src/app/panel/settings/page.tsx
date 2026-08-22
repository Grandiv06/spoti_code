"use client";

import { Settings } from "lucide-react";
import ThemeSettingsPanel from "@/components/settings/ThemeSettingsPanel";
import ActiveSessionsPanel from "./ActiveSessionsPanel";
import SecuritySettingsPanel from "./SecuritySettingsPanel";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-5xl" dir="rtl">
      <section className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Settings className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
              حساب کاربری
            </p>
            <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl">
              تنظیمات
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              ظاهر پنل، امنیت حساب و نشست‌های فعال را از اینجا مدیریت کنید.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <ThemeSettingsPanel />
        <SecuritySettingsPanel />
      </div>
      <ActiveSessionsPanel />
    </div>
  );
}
