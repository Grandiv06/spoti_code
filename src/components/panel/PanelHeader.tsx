"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocial } from "@/context/SocialContext";
import { useMyProfile } from "@/hooks/api/useInstructorDashboard";

function HeaderThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-[#101218] dark:text-slate-300 cursor-pointer"
      aria-label="تغییر تم"
    >
      {mounted && theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}

export default function PanelHeader() {
  const { user } = useAuth();
  const { notifications } = useSocial();
  const { data: profile } = useMyProfile(Boolean(user));

  const userName =
    profile?.displayName?.trim() || user?.displayName || null;
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <header className="relative z-30 shrink-0 border-b border-gray-200/70 dark:border-white/5 bg-white/95 dark:bg-[#14161c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] pt-[env(safe-area-inset-top)]">
      <div className="relative flex h-16 md:h-[4.25rem] items-center justify-center px-4 md:px-6">
        <Link
          href="/"
          className="truncate text-center text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight max-w-[min(100%,12rem)] sm:max-w-[14rem] transition-colors hover:text-primary cursor-pointer"
          aria-label="اسپاتی‌کد — صفحه اصلی"
        >
          <span className="text-primary">اسپاتی</span> کد
        </Link>

        <div className="absolute inset-y-0 start-0 flex max-w-[38%] items-center ps-4 md:ps-6">
          {userName ? (
            <p
              className="truncate text-sm font-bold text-gray-900 dark:text-white leading-tight"
              title={userName}
            >
              {userName}
            </p>
          ) : (
            <span className="block h-4 w-20 rounded bg-gray-200 dark:bg-white/5 animate-pulse" />
          )}
        </div>

        <div className="absolute inset-y-0 end-0 flex items-center gap-2 pe-4 md:pe-6">
          <HeaderThemeToggle />
          <Link
            href="/panel/notifications"
            className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-[#101218] dark:text-slate-300 cursor-pointer"
            aria-label="اعلان‌ها"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black leading-none text-white">
                {unreadCount > 9 ? "۹+" : unreadCount.toLocaleString("fa-IR")}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
