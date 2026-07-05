"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { apiPatchNoMock } from "@/lib/api";

type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";

type AdminCoursePreviewBarProps = {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  approvalStatus: ApprovalStatus;
  submittedAt?: string | null;
};

function statusLabel(status: ApprovalStatus) {
  if (status === "approved") return "تایید شده";
  if (status === "rejected") return "رد شده";
  if (status === "draft") return "پیش‌نویس";
  return "در انتظار بررسی";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fa-IR");
}

export default function AdminCoursePreviewBar({
  courseId,
  courseTitle,
  instructorName,
  approvalStatus,
  submittedAt,
}: AdminCoursePreviewBarProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | "">("");
  const [message, setMessage] = useState("");

  const updateStatus = async (status: "approved" | "rejected") => {
    if (pendingAction) return;
    setPendingAction(status);
    setMessage("");

    try {
      await apiPatchNoMock(`/api/admin-dashboard/requests/courses/${encodeURIComponent(courseId)}`, {
        status,
      });
      setMessage(status === "approved" ? "دوره تایید و منتشر شد." : "درخواست انتشار دوره رد شد.");
      router.push("/admin/requests/courses");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "بروزرسانی درخواست دوره انجام نشد.");
    } finally {
      setPendingAction("");
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b border-amber-500/20 bg-amber-50/95 backdrop-blur-md dark:border-amber-500/15 dark:bg-[#1a1710]/95">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 md:px-12 md:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/admin/requests/courses"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-amber-500/20 bg-white/80 px-3 py-2 text-xs font-black text-gray-700 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به درخواست‌ها
            </Link>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-black text-amber-700 dark:text-amber-300">
                  <Eye className="h-3.5 w-3.5" />
                  پیش‌نمایش ادمین
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {statusLabel(approvalStatus)}
                </span>
              </div>
              <h1 className="truncate text-sm font-black text-gray-900 dark:text-white md:text-base">
                {courseTitle}
              </h1>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                مدرس: {instructorName} • ارسال: {formatDate(submittedAt)}
              </p>
            </div>
          </div>

          {approvalStatus === "pending" ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={Boolean(pendingAction)}
                onClick={() => void updateStatus("approved")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {pendingAction === "approved" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                تایید و انتشار
              </button>
              <button
                type="button"
                disabled={Boolean(pendingAction)}
                onClick={() => void updateStatus("rejected")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:opacity-60"
              >
                {pendingAction === "rejected" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                رد درخواست
              </button>
            </div>
          ) : null}
        </div>

        {message ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs font-black text-primary">
            {message}
          </div>
        ) : null}

        <p className="text-[11px] font-medium leading-6 text-amber-800/80 dark:text-amber-200/80">
          این همان صفحه‌ای است که کاربران پس از انتشار دوره می‌بینند. قبل از تایید، محتوا را کامل بررسی کنید.
        </p>
      </div>
    </div>
  );
}
