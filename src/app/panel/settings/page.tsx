"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themeOptions = [
    { id: "light", label: "روشن", icon: Sun },
    { id: "dark", label: "تاریک", icon: Moon },
    { id: "system", label: "سیستم", icon: Monitor },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تنظیمات</h1>
        <p className="text-gray-600 dark:text-gray-400">تنظیمات ظاهر و عملکرد پنل کاربری خود را مدیریت کنید.</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">palette</span>
          ظاهر و پوسته
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={cn(
                  "relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all duration-300 group cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-primary text-white scale-110" : "bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:scale-110"
                )}>
                  <Icon size={24} />
                </div>
                <span className="font-medium text-sm">{option.label}</span>
                
                {isActive && (
                  <div className="absolute top-2 left-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            پوسته انتخابی شما به صورت خودکار ذخیره شده و در تمام بخش‌های آکادمی اعمال می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
