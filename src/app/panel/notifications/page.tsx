"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCheck } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { NotificationItem } from "@/components/social/NotificationItem";
import { SocialButton } from "@/components/social/SocialButton";

export default function PanelNotificationsPage() {
  const router = useRouter();
  const { notifications, markAllNotificationsAsRead } = useSocial();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SocialButton
            variant="outline"
            onClick={() => router.push("/panel")}
            leftIcon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0"
          >
            بازگشت
          </SocialButton>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">اعلان‌ها</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} جدید
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <SocialButton
            variant="ghost"
            onClick={markAllNotificationsAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
            size="sm"
          >
            خواندن همه
          </SocialButton>
        )}
      </div>

      <div className="space-y-2">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">هیچ اعلان جدیدی ندارید.</p>
          </div>
        )}
      </div>
    </div>
  );
}
