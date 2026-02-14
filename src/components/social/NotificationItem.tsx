"use client";

import React from "react";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { SocialNotification } from "@/types/social";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import { useSocial } from "@/context/SocialContext";

interface NotificationItemProps {
  notification: SocialNotification;
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
  if (diffInSeconds < 3600)
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  if (diffInSeconds < 86400)
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  if (diffInSeconds < 2592000)
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  if (diffInSeconds < 31536000)
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { markNotificationAsRead } = useSocial();

  // ... (rest of component)

  const getIcon = () => {
    switch (notification.type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-red-500 fill-current" />;
      case "COMMENT":
        return <MessageCircle className="w-4 h-4 text-blue-500 fill-current" />;
      case "FOLLOW":
        return <UserPlus className="w-4 h-4 text-green-500 fill-current" />;
      case "MENTION":
        return <AtSign className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (notification.type) {
      case "LIKE":
        return (
          <span className="text-gray-600 dark:text-gray-300">
            پست شما را پسندید.
          </span>
        );
      case "COMMENT":
        return (
          <span className="text-gray-600 dark:text-gray-300">
            برای پست شما نظر گذاشت.
          </span>
        );
      case "FOLLOW":
        return (
          <span className="text-gray-600 dark:text-gray-300">
            شما را دنبال کرد.
          </span>
        );
      case "MENTION":
        return (
          <span className="text-gray-600 dark:text-gray-300">
            شما را در یک پست ذکر کرد.
          </span>
        );
      default:
        return null;
    }
  };

  const getLink = () => {
    if (notification.type === "FOLLOW") {
      return `/social/profile/${notification.actorId}`;
    }
    return `/social/post/${notification.entityId}`;
  };

  return (
    <Link
      href={getLink()}
      onClick={() =>
        !notification.isRead && markNotificationAsRead(notification.id)
      }
      className={cn(
        "flex items-start gap-4 p-4 rounded-2xl transition-colors relative overflow-hidden group",
        notification.isRead
          ? "bg-white dark:bg-[#1c1e26] hover:bg-gray-50 dark:hover:bg-white/[0.02]"
          : "bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10",
      )}
    >
      {/* Unread Indicator Dot */}
      {!notification.isRead && (
        <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <div className="relative shrink-0">
        <Avatar
          src={notification.actor.avatarUrl}
          alt={notification.actor.displayName}
          size="md"
        />
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1c1e26] rounded-full p-1 shadow-sm">
          {getIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
            {notification.actor.displayName}
          </span>
          {getText()}
        </div>
        <div className="text-xs text-gray-400 font-medium">
          {getRelativeTime(notification.createdAt)}
        </div>
      </div>
    </Link>
  );
};
