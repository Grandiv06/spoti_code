"use client";

import ThemeSettingsPanel from "@/components/settings/ThemeSettingsPanel";
import ActiveSessionsPanel from "./ActiveSessionsPanel";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تنظیمات</h1>
        <p className="text-gray-600 dark:text-gray-400">تنظیمات ظاهر و عملکرد پنل کاربری خود را مدیریت کنید.</p>
      </div>

      <ThemeSettingsPanel />

      <ActiveSessionsPanel />
    </div>
  );
}
