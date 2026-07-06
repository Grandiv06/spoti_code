"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Check, Moon, Monitor, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import ActiveSessionsPanel from "./ActiveSessionsPanel";

type ThemeId = "light" | "dark" | "system";

const themeOptions: Array<{
  id: ThemeId;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  { id: "light", label: "روشن", description: "مناسب محیط‌های پرنور", icon: Sun },
  { id: "dark", label: "تاریک", description: "راحت‌تر برای چشم در شب", icon: Moon },
  { id: "system", label: "سیستم", description: "هماهنگ با تنظیمات دستگاه", icon: Monitor },
];

function ThemePreview({ variant }: { variant: ThemeId }) {
  if (variant === "light") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-[#f4f6f8] p-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex gap-2">
          <div className="h-14 w-8 shrink-0 rounded-lg bg-white shadow-sm" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-3/4 rounded-full bg-white" />
            <div className="h-8 rounded-lg bg-white shadow-sm" />
            <div className="h-2 w-1/2 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-[#12141a] p-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/80" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/80" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="flex gap-2">
          <div className="h-14 w-8 shrink-0 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
            <div className="h-8 rounded-lg bg-white/10" />
            <div className="h-2 w-1/2 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="bg-[#f4f6f8] p-2">
          <div className="h-2 w-8 rounded-full bg-white" />
          <div className="mt-2 h-10 rounded-md bg-white" />
        </div>
        <div className="bg-[#12141a] p-2">
          <div className="h-2 w-8 rounded-full bg-white/15" />
          <div className="mt-2 h-10 rounded-md bg-white/10" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white/90 p-1.5 shadow-lg dark:bg-[#1c1e26]/90">
          <Monitor className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
}

function resolvedThemeLabel(theme: ThemeId | undefined, resolvedTheme: string | undefined) {
  if (theme === "system") {
    return resolvedTheme === "dark" ? "سیستم (تاریک)" : "سیستم (روشن)";
  }
  if (theme === "dark") return "تاریک";
  return "روشن";
}

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeTheme = (theme ?? "system") as ThemeId;

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تنظیمات</h1>
        <p className="text-gray-600 dark:text-gray-400">تنظیمات ظاهر و عملکرد پنل کاربری خود را مدیریت کنید.</p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#171922] dark:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)] md:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">palette</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">ظاهر و پوسته</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                حالت نمایش پنل را انتخاب کنید. تغییرات بلافاصله اعمال می‌شود.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 sm:self-auto">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            فعال: {resolvedThemeLabel(activeTheme, resolvedTheme)}
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeTheme === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[1.35rem] border text-right transition-all duration-300 cursor-pointer",
                  isActive
                    ? "border-primary/40 bg-primary/[0.06] shadow-[0_12px_30px_-16px_rgba(0,200,83,0.55)] ring-2 ring-primary/20"
                    : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                )}
              >
                <div className="p-3 pb-0">
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-black/5 shadow-inner dark:border-white/10">
                    <ThemePreview variant={option.id} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-4 pt-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-xl transition-colors",
                          isActive
                            ? "bg-primary text-white"
                            : "bg-white text-gray-500 group-hover:text-gray-700 dark:bg-white/10 dark:text-gray-400 dark:group-hover:text-gray-200"
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      <p className={cn("text-sm font-black", isActive ? "text-primary" : "text-gray-900 dark:text-white")}>
                        {option.label}
                      </p>
                    </div>
                    <p className="mt-1 pr-10 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
                      isActive
                        ? "border-primary bg-primary text-white scale-100 opacity-100"
                        : "border-gray-300 bg-white scale-90 opacity-0 group-hover:opacity-40 dark:border-white/20 dark:bg-white/5"
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 flex items-center gap-2.5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <span className="material-symbols-outlined shrink-0 text-[18px] leading-none text-gray-400">info</span>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            پوسته انتخابی شما به‌صورت خودکار ذخیره می‌شود و در تمام بخش‌های آکادمی اعمال خواهد شد.
          </p>
        </div>
      </div>

      <ActiveSessionsPanel />
    </div>
  );
}
