"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Bell, GraduationCap, Headphones, Receipt, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserNotifications, UserNotification } from "@/hooks/api/useUserNotifications";
import { useMyProfile } from "@/hooks/api/useInstructorDashboard";
import {
  formatTicketStatusLabel,
  getTicketStatusClass,
} from "@/app/panel/support/data";
import {
  isSupportChatRoute,
  useSupportChatHeader,
} from "@/components/panel/SupportChatHeaderContext";

function getNotificationIcon(type: UserNotification["type"]) {
  switch (type) {
    case "COURSE":
      return <GraduationCap className="size-4 text-emerald-500" />;
    case "SUPPORT":
      return <Headphones className="size-4 text-indigo-500" />;
    case "ORDER":
      return <Receipt className="size-4 text-amber-500" />;
    case "SYSTEM":
    default:
      return <Sparkles className="size-4 text-primary" />;
  }
}

export default function PanelHeader() {
  const pathname = usePathname();
  const isChat = isSupportChatRoute(pathname);
  const { info: chatInfo } = useSupportChatHeader();
  const { user } = useAuth();
  const { notifications, unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useUserNotifications();
  const { data: profile } = useMyProfile(Boolean(user));
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = profile?.displayName?.trim() || user?.displayName || null;
  const recentNotifications = notifications.slice(0, 7);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationsOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsNotificationsOpen(false);
  }, [pathname]);

  if (isChat) {
    return (
      <header className="relative z-30 shrink-0 border-b border-gray-200/70 dark:border-white/[0.07] bg-white/95 dark:bg-[#090a0d]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] pt-[env(safe-area-inset-top)]">
        <div className="relative flex h-14 md:h-16 items-center gap-3 px-3 md:px-5">
          <Link
            href="/panel/support"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-[#101217] dark:text-slate-300 cursor-pointer"
            aria-label="بازگشت به تیکت‌ها"
          >
            <ArrowRight className="size-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-black leading-tight text-gray-900 dark:text-white">
              {chatInfo?.subject || "گفتگوی پشتیبانی"}
            </h1>
            {chatInfo ? (
              <p className="mt-0.5 truncate text-[10px] font-bold text-gray-500 dark:text-slate-500">
                {chatInfo.updatedAt}
              </p>
            ) : (
              <span className="mt-0.5 block h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/5" />
            )}
          </div>

          {chatInfo ? (
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                getTicketStatusClass(chatInfo.status),
              )}
            >
              {formatTicketStatusLabel(chatInfo.status)}
            </span>
          ) : (
            <span className="h-5 w-16 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/5" />
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-30 shrink-0 border-b border-gray-200/70 dark:border-white/[0.07] bg-white/95 dark:bg-[#090a0d]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] pt-[env(safe-area-inset-top)]">
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

        <div className="absolute inset-y-0 end-0 flex items-center pe-4 md:pe-6" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={cn(
              "relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors cursor-pointer",
              isNotificationsOpen
                ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-[#101217] dark:text-slate-300"
            )}
            aria-label="اعلان‌ها"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black leading-none text-white shadow-xs animate-pulse">
                {unreadCount > 9 ? "۹+" : unreadCount.toLocaleString("fa-IR")}
              </span>
            )}
          </button>

          {/* Notifications Floating Dropdown - Centered on mobile, aligned on desktop */}
          {isNotificationsOpen && (
            <>
              {/* Mobile transparent backdrop for outside clicks */}
              <div
                className="fixed inset-0 z-40 sm:hidden"
                onClick={() => setIsNotificationsOpen(false)}
                aria-hidden="true"
              />

              <div
                dir="rtl"
                className="fixed inset-x-3.5 top-[4.25rem] sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2.5 w-auto sm:w-96 max-w-sm rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-white/[0.08] dark:bg-[#101217] ring-1 ring-black/5 dark:ring-white/[0.05] animate-in fade-in-50 zoom-in-95 duration-200 z-50 text-right"
              >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.07] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bell className="size-4" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">اعلان‌ها</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {unreadCount.toLocaleString("fa-IR")} جدید
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    خواندن همه
                  </button>
                )}
              </div>

              <div className="max-h-[340px] overflow-y-auto space-y-2 pr-0.5">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || "/panel"}
                      onClick={() => {
                        if (!n.isRead) markNotificationAsRead(n.id);
                        setIsNotificationsOpen(false);
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl p-3 transition-colors relative cursor-pointer border",
                        n.isRead
                          ? "border-gray-100/80 bg-gray-50/40 hover:bg-gray-50 dark:border-white/[0.04] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                          : "border-primary/20 bg-emerald-50/40 dark:bg-primary/[0.06] hover:bg-emerald-50/70 dark:hover:bg-primary/[0.09]"
                      )}
                    >
                      <div className="relative shrink-0">
                        {n.actor.avatarUrl && n.type === "COURSE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={n.actor.avatarUrl}
                            alt={n.actor.displayName}
                            className="size-9 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                          />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#181a22] border border-gray-200/60 dark:border-white/10">
                            {getNotificationIcon(n.type)}
                          </div>
                        )}
                        {!n.isRead && (
                          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#101217]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {n.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                            {new Date(n.createdAt).toLocaleDateString("fa-IR", {
                              month: "numeric",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                          {n.message}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-slate-500">
                      <Bell className="size-5" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300">هیچ اعلانی ندارید</p>
                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-slate-500">وقتی رویدادی رخ دهد اینجا مطلع می‌شوید.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  );
}

