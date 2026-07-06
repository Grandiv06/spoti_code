"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  deviceTypeIcon,
  fetchActiveSessions,
  formatSessionDate,
  revokeActiveSession,
} from "@/lib/panel-sessions";
import type { ActiveSessionItem } from "@/lib/phone-auth";
import { cn } from "@/lib/utils";
import RevokeSessionConfirmModal from "./RevokeSessionConfirmModal";

function formatIpAddress(value: string | null) {
  if (!value) return null;
  if (value === "::1" || value === "127.0.0.1") return "دستگاه محلی";
  return value;
}

export default function ActiveSessionsPanel() {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [maxSessions, setMaxSessions] = useState(2);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sessionToRevoke, setSessionToRevoke] = useState<ActiveSessionItem | null>(null);
  const [modalError, setModalError] = useState("");

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

  const handleRevokeClick = (session: ActiveSessionItem) => {
    if (revokingId) return;
    setModalError("");
    setSessionToRevoke(session);
  };

  const handleRevokeCancel = () => {
    if (revokingId) return;
    setSessionToRevoke(null);
    setModalError("");
  };

  const handleRevokeConfirm = async () => {
    if (!sessionToRevoke || revokingId) return;

    const session = sessionToRevoke;
    setRevokingId(session.id);
    setModalError("");
    setError("");

    try {
      const result = await revokeActiveSession(session.id);
      setSessions(result.sessions);
      setMaxSessions(result.maxSessions);
      setSessionToRevoke(null);

      if (session.isCurrent) {
        logout();
        return;
      }
    } catch {
      setModalError("حذف نشست انجام نشد.");
    } finally {
      setRevokingId(null);
    }
  };

  const usagePercent = maxSessions > 0 ? Math.min(100, (sessions.length / maxSessions) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#171922] dark:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)] md:p-7">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mb-7">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/10 text-violet-600 shadow-sm dark:text-violet-300">
            <span className="material-symbols-outlined text-[22px]">devices</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">نشست‌های فعال</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              دستگاه‌هایی که هم‌اکنون به حساب شما متصل هستند را مدیریت کنید.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500">
          <span>ظرفیت نشست</span>
          <span>{usagePercent.toLocaleString("fa-IR")}٪</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              usagePercent >= 100 ? "bg-amber-500" : "bg-primary"
            )}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="relative mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="relative space-y-3 animate-pulse">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-[1.35rem] border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="size-12 rounded-2xl bg-gray-200 dark:bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-2.5 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-gray-200 bg-gray-50/70 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-white/10">
            <span className="material-symbols-outlined text-[24px]">phonelink_off</span>
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">نشست فعالی ثبت نشده است</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">پس از ورود، دستگاه‌های متصل اینجا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <div className="relative space-y-3">
          {sessions.map((session) => {
            const ipLabel = formatIpAddress(session.ipAddress);

            return (
              <div
                key={session.id}
                className={cn(
                  "group relative overflow-hidden rounded-[1.35rem] border p-4 transition-all duration-300",
                  session.isCurrent
                    ? "border-primary/30 bg-gradient-to-l from-primary/[0.08] to-transparent shadow-[0_12px_30px_-20px_rgba(0,200,83,0.45)] ring-1 ring-primary/15"
                    : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                )}
              >
                {session.isCurrent && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-primary" />
                )}

                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-105",
                        session.isCurrent
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-500 dark:border-white/10 dark:bg-[#1c1e26] dark:text-gray-300"
                      )}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {deviceTypeIcon(session.deviceType)}
                      </span>
                    </div>

                    <div className="min-w-0 text-right">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-black text-gray-900 dark:text-white">
                          {session.deviceLabel}
                        </p>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                            این دستگاه
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        آخرین فعالیت: {formatSessionDate(session.lastActiveAt)}
                      </p>

                      {ipLabel && (
                        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                          <span className="material-symbols-outlined text-[13px]">language</span>
                          <span dir="ltr">{ipLabel}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevokeClick(session)}
                    disabled={revokingId === session.id}
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
                      session.isCurrent
                        ? "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                    )}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {session.isCurrent ? "حذف این دستگاه" : "خروج از دستگاه"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative mt-6 flex items-start gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="material-symbols-outlined mt-0.5 text-base text-gray-400">info</span>
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          حداکثر {maxSessions.toLocaleString("fa-IR")} دستگاه می‌تواند همزمان وارد حساب شما باشد. با حذف یک نشست،
          آن دستگاه از حساب خارج می‌شود.
        </p>
      </div>

      <RevokeSessionConfirmModal
        isOpen={Boolean(sessionToRevoke)}
        session={sessionToRevoke}
        isPending={Boolean(sessionToRevoke && revokingId === sessionToRevoke.id)}
        error={modalError}
        onCancel={handleRevokeCancel}
        onConfirm={() => void handleRevokeConfirm()}
      />
    </div>
  );
}
