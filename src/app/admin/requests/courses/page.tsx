"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, Eye, Loader2, Search, XCircle } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { apiGetNoMock, apiPatchNoMock } from "@/lib/api";

type CourseRequest = {
  id: string;
  title: string;
  instructorName: string;
  shortDescription: string;
  price: number;
  categoryTitle: string;
  level: string;
  durationHours: number;
  approvalStatus: "draft" | "pending" | "approved" | "rejected";
  draftStep: number;
  submittedAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

type CourseRequestsPayload = {
  items: CourseRequest[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    draft: number;
  };
};

const statusOptions = [
  { value: "pending", label: "در انتظار بررسی" },
  { value: "approved", label: "تایید شده" },
  { value: "rejected", label: "رد شده" },
  { value: "draft", label: "پیش‌نویس‌ها" },
];

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
];

const filterSelectClassName =
  "h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapPayload(value: unknown) {
  return isRecord(value) && "data" in value ? value.data : value;
}

function normalizeApprovalStatus(value: unknown): CourseRequest["approvalStatus"] {
  if (value === "approved" || value === "rejected" || value === "draft") return value;
  return "pending";
}

function normalizePayload(value: unknown): CourseRequestsPayload {
  const payload = unwrapPayload(value);
  const record = isRecord(payload) ? payload : {};
  const items = Array.isArray(record.items) ? record.items : [];
  const stats = isRecord(record.stats) ? record.stats : {};

  return {
    items: items
      .filter(isRecord)
      .map((item) => ({
        id: String(item.id ?? item.courseId ?? ""),
        title: String(item.title ?? "دوره بدون عنوان"),
        instructorName: String(item.instructorName ?? item.instructor ?? "مدرس"),
        shortDescription: String(item.shortDescription ?? ""),
        price: Number(item.price ?? 0),
        categoryTitle: String(item.categoryTitle ?? item.category ?? "Frontend"),
        level: String(item.level ?? "intermediate"),
        durationHours: Number(item.durationHours ?? 0),
        approvalStatus: normalizeApprovalStatus(item.approvalStatus),
        draftStep: Number(item.draftStep ?? 1),
        submittedAt: item.submittedAt as string | Date | null | undefined,
        updatedAt: item.updatedAt as string | Date | null | undefined,
      }))
      .filter((item) => item.id),
    stats: {
      total: Number(stats.total ?? 0),
      pending: Number(stats.pending ?? 0),
      approved: Number(stats.approved ?? 0),
      rejected: Number(stats.rejected ?? 0),
      draft: Number(stats.draft ?? 0),
    },
  };
}

function buildQuery(input: { status: string; search: string; sort: string }) {
  const params = new URLSearchParams();
  params.set("status", input.status);
  if (input.search.trim()) params.set("search", input.search.trim());
  if (input.sort !== "newest") params.set("sort", input.sort);
  return `?${params.toString()}`;
}

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("fa-IR");
}

function statusLabel(status: CourseRequest["approvalStatus"]) {
  if (status === "approved") return "تایید شده";
  if (status === "rejected") return "رد شده";
  if (status === "draft") return "پیش‌نویس";
  return "در انتظار بررسی";
}

export default function AdminCourseRequestsPage() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [stats, setStats] = useState<CourseRequestsPayload["stats"]>({ total: 0, pending: 0, approved: 0, rejected: 0, draft: 0 });
  const [selectedId, setSelectedId] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [sortFilter, setSortFilter] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | "">("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await apiGetNoMock<unknown>(
        `/api/admin-dashboard/requests/courses${buildQuery({
          status: statusFilter,
          search: debouncedSearch,
          sort: sortFilter,
        })}`
      );
      const payload = normalizePayload(response);
      setRequests(payload.items);
      setStats(payload.stats);
      setSelectedId((current) => (payload.items.some((item) => item.id === current) ? current : payload.items[0]?.id ?? ""));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "درخواست‌های دوره بارگذاری نشدند.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, sortFilter, statusFilter]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedId) ?? requests[0],
    [requests, selectedId]
  );

  const updateStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest || pendingAction) return;
    setPendingAction(status);
    setMessage("");
    try {
      await apiPatchNoMock(`/api/admin-dashboard/requests/courses/${encodeURIComponent(selectedRequest.id)}`, { status });
      setMessage(status === "approved" ? "دوره تایید و منتشر شد." : "درخواست انتشار دوره رد شد.");
      await loadRequests();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "بروزرسانی درخواست دوره انجام نشد.");
    } finally {
      setPendingAction("");
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-2 pb-20 text-right animate-in fade-in duration-700 md:px-4" dir="rtl">
      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 px-8 py-10 md:flex-row md:px-12">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-2xl shadow-primary/40">
              <BookOpenCheck className="h-8 w-8" />
            </div>
            <div className="text-center md:text-right">
              <h1 className="mb-2 text-2xl font-black text-gray-900 dark:text-white md:text-3xl">تایید ثبت و انتشار دوره</h1>
              <p className="max-w-2xl text-xs font-medium leading-7 text-gray-500 dark:text-gray-400 md:text-sm">
                دوره‌هایی که مدرس برای انتشار ارسال کرده را بررسی کنید و در صورت تایید، آن‌ها را عمومی کنید.
              </p>
            </div>
          </div>

          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-black text-gray-600 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به مدیریت درخواست‌ها
          </Link>
        </div>
      </section>

      <section className="mb-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="group relative md:col-span-2">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو در عنوان دوره یا نام مدرس..."
              className="h-[46px] w-full rounded-2xl border border-gray-100 bg-gray-50 pr-11 pl-4 text-xs font-bold text-gray-800 outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>
          <CustomSelect className={filterSelectClassName} options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
          <CustomSelect className={filterSelectClassName} options={sortOptions} value={sortFilter} onChange={setSortFilter} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-md dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">لیست درخواست‌های دوره</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">
              {stats.pending.toLocaleString("fa-IR")} در انتظار
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex min-h-72 items-center justify-center text-xs font-bold text-gray-400">
              درخواستی برای نمایش وجود ندارد.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`flex items-stretch gap-2 rounded-2xl border transition ${
                    selectedRequest?.id === request.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-black/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className="min-w-0 flex-1 rounded-2xl p-4 text-right"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">{request.title}</h3>
                      <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black text-amber-500">
                        {statusLabel(request.approvalStatus)}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{request.instructorName}</p>
                  </button>
                  <Link
                    href={`/admin/requests/courses/${encodeURIComponent(request.id)}/preview`}
                    className="flex shrink-0 items-center justify-center rounded-2xl px-3 text-primary transition hover:bg-primary/10"
                    title="مشاهده صفحه دوره"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-md dark:border-white/5 dark:bg-[#1c1e26]">
          {!selectedRequest ? (
            <div className="flex min-h-96 items-center justify-center text-xs font-bold text-gray-400">
              یک درخواست را برای مشاهده جزئیات انتخاب کنید.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-[11px] font-black text-primary">جزئیات درخواست انتشار</p>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedRequest.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-gray-500 dark:text-gray-400">
                  {selectedRequest.shortDescription || "توضیح کوتاهی برای این دوره ثبت نشده است."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="مدرس" value={selectedRequest.instructorName} />
                <Detail label="دسته‌بندی" value={selectedRequest.categoryTitle} />
                <Detail label="سطح" value={selectedRequest.level} />
                <Detail label="مدت دوره" value={`${selectedRequest.durationHours.toLocaleString("fa-IR")} ساعت`} />
                <Detail label="قیمت" value={selectedRequest.price === 0 ? "رایگان" : `${selectedRequest.price.toLocaleString("fa-IR")} تومان`} />
                <Detail label="تاریخ ارسال" value={formatDate(selectedRequest.submittedAt ?? selectedRequest.updatedAt)} />
              </div>

              <Link
                href={`/admin/requests/courses/${encodeURIComponent(selectedRequest.id)}/preview`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-5 text-xs font-black text-primary transition hover:border-primary/40 hover:bg-primary/15"
              >
                <BookOpenCheck className="h-4 w-4" />
                مشاهده صفحه کامل دوره (پیش‌نمایش کاربر)
              </Link>

              {message ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-black text-primary">
                  {message}
                </div>
              ) : null}

              {selectedRequest.approvalStatus === "pending" ? (
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-white/5 sm:flex-row">
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void updateStatus("approved")}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {pendingAction === "approved" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    تایید و انتشار
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(pendingAction)}
                    onClick={() => void updateStatus("rejected")}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:opacity-60"
                  >
                    {pendingAction === "rejected" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    رد درخواست
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/5 dark:bg-black/20">
      <p className="mb-1 text-[10px] font-black text-gray-400">{label}</p>
      <p className="text-xs font-black text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
