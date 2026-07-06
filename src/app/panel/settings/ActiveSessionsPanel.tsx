"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  deviceTypeIcon,
  fetchActiveSessions,
  formatSessionDate,
  revokeActiveSession,
} from "@/lib/panel-sessions";
import type { ActiveSessionItem } from "@/lib/phone-auth";
import { cn } from "@/lib/utils";

export default function ActiveSessionsPanel() {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [maxSessions, setMaxSessions] = useState(2);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchActiveSessions();
      setSessions(result.sessions);
      setMaxSessions(result.maxSessions);
    } catch {
      setError("دریافت نشست‌های فعال انجام نشد.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleRevoke = async (session: ActiveSessionItem) => {
    if (revokingId) return;
    setRevokingId(session.id);
    setError("");

    try {
      const result = await revokeActiveSession(session.id);
      setSessions(result.sessions);
      setMaxSessions(result.maxSessions);

      if (session.isCurrent) {
        logout();
        return;
      }
    } catch {
      setError("حذف نشست انجام نشد.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/10 blur-3xl -translate-y-1/2 -translate-x-1/2 rounded-full" />

      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">devices</span>
          نشست‌های فعال
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          حداکثر {maxSessions.toLocaleString("fa-IR")} دستگاه می‌تواند همزمان وارد حساب شما باشد.
        </p>

        {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">نشست فعالی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-2xl border px-4 py-4",
                  session.isCurrent
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      {deviceTypeIcon(session.deviceType)}
                    </span>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{session.deviceLabel}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      آخرین فعالیت: {formatSessionDate(session.lastActiveAt)}
                    </p>
                    {session.ipAddress && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5" dir="ltr">
                        IP: {session.ipAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {session.isCurrent && (
                    <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">
                      این دستگاه
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleRevoke(session)}
                    disabled={revokingId === session.id}
                    className="text-xs font-bold text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                  >
                    {revokingId === session.id ? "در حال حذف..." : "خروج از دستگاه"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
