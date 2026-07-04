"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Filter,
  Loader2,
  MessageSquareText,
  Search,
  Star,
  User,
  XCircle,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { apiGetNoMock, apiPatchNoMock } from "@/lib/api";
import { cn } from "@/lib/utils";

type ReviewApprovalStatus = "pending" | "approved" | "rejected";

type ReviewRequest = {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  content: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  approvalStatus: ReviewApprovalStatus;
  createdAt: string;
  createdAtIso: string;
};

type ReviewRequestsPayload = {
  items: ReviewRequest[];
  courses: Array<{ id: string; title: string }>;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

const statusFilterOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار تایید" },
  { value: "approved", label: "تایید شده" },
  { value: "rejected", label: "رد شده" },
];

const sortFilterOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
];

const filterSelectClassName =
  "h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapPayload(value: unknown) {
  if (isRecord(value) && "data" in value) return value.data;
  return value;
}

function normalizeApprovalStatus(value: unknown): ReviewApprovalStatus {
  if (value === "approved" || value === "rejected") return value;
  return "pending";
}

function buildReviewsRequestQuery(input: {
  status: string;
  courseId: string;
  search: string;
  sort: string;
}) {
  const params = new URLSearchParams();
  if (input.status !== "all") params.set("status", input.status);
  if (input.courseId !== "all") params.set("courseId", input.courseId);
  if (input.search.trim()) params.set("search", input.search.trim());
  if (input.sort !== "newest") params.set("sort", input.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizePayload(value: unknown): ReviewRequestsPayload {
  const payload = unwrapPayload(value);
  const record = isRecord(payload) ? payload : {};
  const items = Array.isArray(record.items) ? record.items : [];
  const courses = Array.isArray(record.courses) ? record.courses : [];
  const stats = isRecord(record.stats) ? record.stats : {};

  return {
    items: items
      .map((item) => (isRecord(item) ? item : null))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map((item) => ({
        id: String(item.id ?? ""),
        studentName: String(item.studentName ?? "کاربر اسپاتی‌کد"),
        studentAvatar: String(item.studentAvatar ?? "/images/student1.jpg"),
        rating: Number(item.rating ?? 5),
        content: String(item.content ?? ""),
        courseId: String(item.courseId ?? ""),
        courseTitle: String(item.courseTitle ?? "دوره نامشخص"),
        instructorName: String(item.instructorName ?? "مدرس"),
        approvalStatus: normalizeApprovalStatus(item.approvalStatus),
        createdAt: String(item.createdAt ?? ""),
        createdAtIso: String(item.createdAtIso ?? ""),
      }))
      .filter((item) => item.id),
    courses: courses
      .map((course) =>
        isRecord(course) ? { id: String(course.id ?? ""), title: String(course.title ?? "") } : null
      )
      .filter((course): course is { id: string; title: string } => Boolean(course?.id && course.title)),
    stats: {
      total: typeof stats.total === "number" ? stats.total : 0,
      pending: typeof stats.pending === "number" ? stats.pending : 0,
      approved: typeof stats.approved === "number" ? stats.approved : 0,
      rejected: typeof stats.rejected === "number" ? stats.rejected : 0,
    },
  };
}

function getStatusLabel(status: ReviewApprovalStatus) {
  if (status === "approved") return "تایید شده";
  if (status === "rejected") return "رد شده";
  return "در انتظار تایید";
}

function statusClassName(status: ReviewApprovalStatus) {
  if (status === "approved") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500";
  if (status === "rejected") return "border-rose-500/20 bg-rose-500/10 text-rose-500";
  return "border-amber-500/20 bg-amber-500/10 text-amber-500";
}

export default function AdminReviewRequestsPage() {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([]);
  const [stats, setStats] = useState<ReviewRequestsPayload["stats"]>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<ReviewApprovalStatus | "">("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const courseFilterOptions = useMemo(
    () => [
      { value: "all", label: "همه دوره‌ها" },
      ...courses.map((course) => ({ value: course.id, label: course.title })),
    ],
    [courses]
  );

  const loadRequests = useCallback(async () => {
    setLoadError("");
    setIsLoading(true);
    try {
      const response = await apiGetNoMock<unknown>(
        `/api/admin-dashboard/requests/reviews${buildReviewsRequestQuery({
          status: statusFilter,
          courseId: courseFilter,
          search: debouncedSearch,
          sort: sortFilter,
        })}`
      );
      const payload = normalizePayload(response);
      setRequests(payload.items);
      setCourses(payload.courses);
      setStats(payload.stats);
      setSelectedId((current) => {
        if (payload.items.some((item) => item.id === current)) return current;
        return payload.items[0]?.id ?? "";
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "درخواست‌ها بارگذاری نشدند.");
    } finally {
      setIsLoading(false);
    }
  }, [courseFilter, debouncedSearch, sortFilter, statusFilter]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const selectedRequest = requests.find((item) => item.id === selectedId) ?? requests[0];

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest || pendingAction) return;

    setActionMessage("");
    setPendingAction(status);
    try {
      await apiPatchNoMock(`/api/admin-dashboard/requests/reviews/${encodeURIComponent(selectedRequest.id)}`, {
        status,
      });
      setActionMessage(status === "approved" ? "نظر با موفقیت برای نمایش تایید شد." : "درخواست نمایش نظر رد شد.");
      await loadRequests();
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "بروزرسانی وضعیت نظر انجام نشد.");
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
              <MessageSquareText className="h-8 w-8" />
            </div>
            <div className="text-center md:text-right">
              <h1 className="mb-2 text-2xl font-black text-gray-900 dark:text-white md:text-3xl">
                تایید نمایش نظرات
              </h1>
              <p className="max-w-2xl text-xs font-medium leading-7 text-gray-500 dark:text-gray-400 md:text-sm">
                نظرهای ثبت‌شده توسط کاربران را بررسی کنید و مشخص کنید در صفحه عمومی دوره نمایش داده شوند یا خیر.
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
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="group relative md:col-span-2">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو در متن نظر، دانشجو، مدرس یا دوره..."
              className="h-full min-h-[46px] w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pr-11 pl-3 text-xs font-bold text-gray-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <CustomSelect
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="وضعیت"
            className={filterSelectClassName}
            icon={<Filter className="h-4 w-4" />}
          />
          <CustomSelect
            options={courseFilterOptions}
            value={courseFilter}
            onChange={setCourseFilter}
            placeholder="دوره"
            className={filterSelectClassName}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <CustomSelect
            options={sortFilterOptions}
            value={sortFilter}
            onChange={setSortFilter}
            placeholder="مرتب‌سازی"
            className={filterSelectClassName}
            icon={<ArrowUpDown className="h-4 w-4" />}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black">
          <span className="rounded-lg bg-primary/10 px-3 py-1 text-primary">کل درخواست‌ها: {stats.total.toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-500">در انتظار: {stats.pending.toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-500">تایید شده: {stats.approved.toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-rose-500/10 px-3 py-1 text-rose-500">رد شده: {stats.rejected.toLocaleString("fa-IR")}</span>
        </div>
      </section>

      {loadError ? (
        <div className="mb-5 rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {loadError}
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="order-2 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] lg:order-1">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedRequest ? (
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">{selectedRequest.studentName}</h2>
                  <p className="mt-1 text-[11px] font-bold text-gray-400">
                    {selectedRequest.courseTitle} • مدرس: {selectedRequest.instructorName} • {selectedRequest.createdAt}
                  </p>
                </div>
                <span className={cn("rounded-xl border px-3 py-1.5 text-[11px] font-black", statusClassName(selectedRequest.approvalStatus))}>
                  {getStatusLabel(selectedRequest.approvalStatus)}
                </span>
              </div>

              <div className="mb-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-5 w-5",
                      index < selectedRequest.rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-white/10"
                    )}
                  />
                ))}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-white/5 dark:bg-white/5">
                <p className="whitespace-pre-wrap text-sm font-semibold leading-8 text-gray-700 dark:text-gray-200">
                  {selectedRequest.content}
                </p>
              </div>

              {actionMessage ? (
                <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs font-black text-primary">
                  {actionMessage}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleUpdateStatus("approved")}
                  disabled={Boolean(pendingAction) || selectedRequest.approvalStatus === "approved"}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingAction === "approved" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  تایید نمایش نظر
                </button>
                <button
                  type="button"
                  onClick={() => void handleUpdateStatus("rejected")}
                  disabled={Boolean(pendingAction) || selectedRequest.approvalStatus === "rejected"}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingAction === "rejected" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  رد درخواست
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <MessageSquareText className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm font-black text-gray-400">درخواستی برای نمایش وجود ندارد.</p>
            </div>
          )}
        </section>

        <aside className="order-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26] sm:rounded-3xl lg:sticky lg:top-6 lg:order-2">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-white/5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 dark:text-white">درخواست‌های نظر</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">برای مشاهده جزئیات انتخاب کنید</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[10px] font-black text-gray-600 dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
              {requests.length.toLocaleString("fa-IR")}
            </span>
          </div>

          <div className="max-h-[min(52vh,520px)] space-y-2 overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-color:rgba(156,163,175,0.45)_transparent] [scrollbar-width:thin] lg:max-h-[calc(100vh-12rem)]">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              ))
            ) : requests.length ? (
              requests.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setActionMessage("");
                  }}
                  className={cn(
                    "w-full rounded-2xl border p-3 text-right transition-all duration-200",
                    selectedRequest?.id === item.id
                      ? "border-primary/35 bg-primary/5 shadow-sm shadow-primary/10 ring-1 ring-primary/15"
                      : "border-gray-100 bg-gray-50/60 hover:border-primary/20 hover:bg-white dark:border-white/5 dark:bg-black/15 dark:hover:bg-white/[0.03]"
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className={cn("shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-black leading-none", statusClassName(item.approvalStatus))}>
                      {getStatusLabel(item.approvalStatus)}
                    </span>
                    <span className="truncate text-[10px] font-bold text-gray-400 dark:text-gray-500">
                      {item.createdAt}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-primary/10 text-primary dark:border-white/10">
                      {item.studentAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.studentAvatar} alt={item.studentName} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <p className="truncate text-sm font-black text-gray-900 dark:text-white">{item.studentName}</p>
                  </div>
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-800 dark:text-gray-100">
                    {item.content}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="truncate">{item.courseTitle}</span>
                    <span className="flex shrink-0 items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "h-3 w-3",
                            index < item.rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-white/10"
                          )}
                        />
                      ))}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-xs font-bold text-gray-400">درخواستی مطابق فیلترها پیدا نشد.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
