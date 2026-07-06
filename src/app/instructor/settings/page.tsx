"use client";

import ActiveSessionsPanel from "@/app/panel/settings/ActiveSessionsPanel";
import ThemeSettingsPanel from "@/components/settings/ThemeSettingsPanel";

export default function InstructorSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8" dir="rtl">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">تنظیمات</h1>
        <p className="text-gray-600 dark:text-gray-400">
          تنظیمات ظاهر، دستگاه‌های فعال و عملکرد پنل مدرس را مدیریت کنید.
        </p>
      </div>

      <ThemeSettingsPanel
        description="حالت نمایش پنل مدرس را انتخاب کنید. تغییرات بلافاصله اعمال می‌شود."
        infoText="پوسته انتخابی شما به‌صورت خودکار ذخیره می‌شود و در تمام بخش‌های پنل مدرس و آکادمی اعمال خواهد شد."
      />

      <ActiveSessionsPanel />
    </div>
  );
}
