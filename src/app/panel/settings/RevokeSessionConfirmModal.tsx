"use client";

import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveSessionItem } from "@/lib/phone-auth";
import { deviceTypeIcon, formatSessionDate } from "@/lib/panel-sessions";

type RevokeSessionConfirmModalProps = {
  isOpen: boolean;
  session: ActiveSessionItem | null;
  isPending?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function RevokeSessionConfirmModal({
  isOpen,
  session,
  isPending = false,
  error,
  onCancel,
  onConfirm,
}: RevokeSessionConfirmModalProps) {
  if (!isOpen || !session) return null;

  const isCurrentDevice = session.isCurrent;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revoke-session-modal-title"
    >
      <button
        type="button"
        aria-label="بستن"
        onClick={onCancel}
        disabled={isPending}
        className="fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in disabled:cursor-not-allowed"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 dark:border-white/10 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <LogOut className="h-4 w-4" />
            </span>
            <h2 id="revoke-session-modal-title" className="text-base font-black text-gray-900 dark:text-white">
              {isCurrentDevice ? "حذف این دستگاه" : "خروج از دستگاه"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition-all hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-6">
          <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300">
            {isCurrentDevice
              ? "آیا از حذف این دستگاه مطمئن هستید؟ پس از تأیید، از حساب کاربری خارج می‌شوید."
              : "آیا از خروج این دستگاه از حساب کاربری مطمئن هستید؟"}
          </p>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">
                {deviceTypeIcon(session.deviceType)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{session.deviceLabel}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  آخرین فعالیت: {formatSessionDate(session.lastActiveAt)}
                </p>
              </div>
            </div>
          </div>

          {error ? <p className="text-sm font-bold text-red-500">{error}</p> : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>در حال حذف...</span>
              </>
            ) : (
              <span>{isCurrentDevice ? "بله، حذف این دستگاه" : "بله، خروج از دستگاه"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
