"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

export interface UserNotification {
  id: string;
  type: "COURSE" | "SUPPORT" | "ORDER" | "SYSTEM";
  title: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
  actor: {
    displayName: string;
    avatarUrl?: string;
  };
}

const NOTIFICATIONS_QUERY_KEY = ["dashboard", "notifications"] as const;

export function useUserNotifications() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const storageKey = user?.id ? `spoticode_notifs_read_${user.id}` : null;
  const [readIds, setReadIds] = useState<string[]>([]);

  // Load read notification IDs from localStorage on mount/user change
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setReadIds(JSON.parse(stored));
      } else {
        setReadIds([]);
      }
    } catch {
      setReadIds([]);
    }
  }, [storageKey]);

  const { data, isLoading, refetch } = useQuery<{ notifications: Omit<UserNotification, "isRead">[] }>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () =>
      apiGetNoMock<{ notifications: Omit<UserNotification, "isRead">[] }>(
        "/api/dashboard/notifications",
        getAuthHeaders()
      ),
    enabled: !authLoading && isAuthenticated && Boolean(user),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const rawNotifications = Array.isArray(data?.notifications) ? data.notifications : [];

  const notifications: UserNotification[] = rawNotifications.map((n) => ({
    ...n,
    isRead: readIds.includes(n.id),
  }));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        if (storageKey && typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    [storageKey]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    const allIds = rawNotifications.map((n) => n.id);
    setReadIds(allIds);
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(allIds));
      } catch {}
    }
  }, [rawNotifications, storageKey]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refetch,
  };
}
