"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { NotificationItem } from "@/components/social/NotificationItem";

export default function PanelNotificationsPage() {
  const { notifications, markAllNotificationsAsRead } = useSocial();
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-4xl" dir="rtl">
      <section className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Bell className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
              اطلاع‌رسانی
            </p>
            <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl">
              اعلان‌ها
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              {unreadCount > 0
                ? `${unreadCount.toLocaleString("fa-IR")} اعلان خوانده‌نشده دارید`
                : "همه اعلان‌ها را خوانده‌اید"}
            </p>
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-[11px] font-bold text-primary transition-colors hover:bg-primary/15 cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              خواندن همه
            </button>
          ) : null}
        </div>
      </section>

      {notifications && notifications.length > 0 ? (
        <section className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-12 text-center dark:border-white/10 dark:bg-[#1c1e26]/50">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Bell className="size-6" />
          </div>
          <h3 className="mb-1.5 text-base font-black text-gray-900 dark:text-white">
            اعلانی ندارید
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            وقتی اتفاق جدیدی بیفتد، اینجا نمایش داده می‌شود.
          </p>
        </div>
      )}
    </div>
  );
}
