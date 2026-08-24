"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCheck, GraduationCap, Headphones, Receipt, Sparkles } from "lucide-react";
import { useUserNotifications, UserNotification } from "@/hooks/api/useUserNotifications";
import { cn } from "@/lib/utils";

type NotificationFilter = "all" | "unread" | "courses" | "support" | "orders";

function getNotificationIcon(type: UserNotification["type"]) {
  switch (type) {
    case "COURSE":
      return <GraduationCap className="size-5 text-emerald-500" />;
    case "SUPPORT":
      return <Headphones className="size-5 text-indigo-500" />;
    case "ORDER":
      return <Receipt className="size-5 text-amber-500" />;
    case "SYSTEM":
    default:
      return <Sparkles className="size-5 text-primary" />;
  }
}

export default function PanelNotificationsPage() {
  const { notifications, unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useUserNotifications();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "courses") return n.type === "COURSE";
    if (filter === "support") return n.type === "SUPPORT";
    if (filter === "orders") return n.type === "ORDER";
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4 pb-4 lg:max-w-4xl" dir="rtl">
      {/* Header Card */}
      <section className="rounded-2xl sm:rounded-3xl border border-gray-200/70 bg-white p-4 sm:p-6 dark:border-white/[0.07] dark:bg-[#101217] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              href="/panel"
              className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:text-primary hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="بازگشت به داشبورد"
            >
              <ArrowRight className="size-4 sm:size-5" />
            </Link>

            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Bell className="size-5 sm:size-6" />
            </div>

            <div className="min-w-0">
              <p className="mb-0.5 text-[11px] font-bold tracking-wide text-primary">
                اطلاع‌رسانی و پیام‌ها
              </p>
              <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white truncate">
                مرکز اعلان‌ها
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-95 cursor-pointer shadow-xs"
              >
                <CheckCheck className="size-4" />
                خوانده شدن همه ({unreadCount.toLocaleString("fa-IR")})
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pt-4 mt-4 border-t border-gray-100 dark:border-white/[0.07]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
              filter === "all"
                ? "bg-primary text-white shadow-xs shadow-primary/30"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            همه ({notifications.length.toLocaleString("fa-IR")})
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
              filter === "unread"
                ? "bg-primary text-white shadow-xs shadow-primary/30"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            خوانده‌نشده
            {unreadCount > 0 && (
              <span className={cn(
                "size-2 rounded-full",
                filter === "unread" ? "bg-white" : "bg-primary"
              )} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilter("courses")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1",
              filter === "courses"
                ? "bg-primary text-white shadow-xs shadow-primary/30"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            <GraduationCap className="size-3.5" />
            دوره‌ها
          </button>

          <button
            type="button"
            onClick={() => setFilter("support")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1",
              filter === "support"
                ? "bg-primary text-white shadow-xs shadow-primary/30"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            <Headphones className="size-3.5" />
            پشتیبانی
          </button>

          <button
            type="button"
            onClick={() => setFilter("orders")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1",
              filter === "orders"
                ? "bg-primary text-white shadow-xs shadow-primary/30"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            <Receipt className="size-3.5" />
            تراکنش‌ها
          </button>
        </div>
      </section>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <section className="space-y-2">
          {filteredNotifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || "/panel"}
              onClick={() => {
                if (!n.isRead) markNotificationAsRead(n.id);
              }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl transition-all relative overflow-hidden group cursor-pointer border",
                n.isRead
                  ? "bg-white dark:bg-[#101217] border-gray-100 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  : "bg-emerald-50/40 dark:bg-primary/[0.06] border-primary/20 hover:bg-emerald-50/70 dark:hover:bg-primary/[0.1] shadow-xs"
              )}
            >
              {!n.isRead && (
                <span className="absolute top-4 left-4 size-2 rounded-full bg-primary ring-4 ring-primary/20" />
              )}

              <div className="relative shrink-0">
                {n.actor.avatarUrl && n.type === "COURSE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.actor.avatarUrl}
                    alt={n.actor.displayName}
                    className="size-11 rounded-2xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                  />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gray-100 dark:bg-[#181a22] border border-gray-200/60 dark:border-white/10">
                    {getNotificationIcon(n.type)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {n.title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-medium shrink-0">
                    {new Date(n.createdAt).toLocaleDateString("fa-IR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed font-medium">
                  {n.message}
                </p>
                {n.actor.displayName && (
                  <span className="mt-2 inline-block text-[11px] font-bold text-primary/80">
                    {n.actor.displayName}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white/50 dark:border-white/10 dark:bg-[#101217]/50 px-5 py-14 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Bell className="size-7" />
          </div>
          <h3 className="mb-1 text-base font-black text-gray-900 dark:text-white">
            {filter === "unread" ? "هیچ اعلان خوانده‌نشده‌ای ندارید" : "هیچ اعلانی در این بخش وجود ندارد"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
            {filter === "unread"
              ? "همه اعلان‌های شما خوانده شده‌اند و پیام جدیدی وجود ندارد."
              : "وقتی رویدادی در حساب کاربری، دوره‌ها یا تیکت‌های شما رخ دهد، در این بخش نمایش داده می‌شود."}
          </p>
        </div>
      )}
    </div>
  );
}
