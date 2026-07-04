"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, Star, Loader2, Filter, BookOpen, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { apiDeleteNoMock, apiGetNoMock, apiPatchNoMock } from "@/lib/api";
import { cn } from "@/lib/utils";
import CustomSelect from "@/components/ui/CustomSelect";
import InstructorReviewList from "./_components/InstructorReviewList";
import {
  ReviewDetailSkeleton,
  ReviewListSkeleton,
  ReviewStatsBadgesSkeleton,
} from "./_components/InstructorReviewsSkeleton";

type ApiRecord = Record<string, unknown>;

type ReviewReply = {
  text: string;
  createdAt: string;
};

type InstructorReview = {
  id: string;
  studentName: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  createdAtTimestamp: number;
  courseId: string;
  courseTitle: string;
  parentId?: string;
  reply?: ReviewReply;
};

type ReviewStats = {
  total: number;
  answered: number;
  pending: number;
};

type ReviewCourseOption = {
  id: string;
  title: string;
};

type PendingReplyAction =
  | { type: "edit" }
  | { type: "delete" }
  | null;

const statusFilterOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "pending", label: "بدون پاسخ" },
  { value: "answered", label: "پاسخ داده‌شده" },
];

const ratingFilterOptions = [
  { value: "all", label: "همه امتیازها" },
  { value: "5", label: "۵ ستاره" },
  { value: "4", label: "۴ ستاره" },
  { value: "3", label: "۳ ستاره" },
  { value: "2", label: "۲ ستاره" },
  { value: "1", label: "۱ ستاره" },
];

const sortFilterOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
];

const filterSelectClassName =
  "h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4";

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];
  for (const key of ["data", "items", "results", "list"] as const) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = unwrapList(candidate);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

function normalizeString(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalizeRating(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.min(5, Math.round(value)));
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(1, Math.min(5, Math.round(parsed)));
  }
  return 5;
}

function normalizeCreatedAt(value: unknown): { label: string; timestamp: number } {
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return {
        label: new Date(parsed).toLocaleDateString("fa-IR"),
        timestamp: parsed,
      };
    }
    return { label: value.trim(), timestamp: 0 };
  }
  return { label: "", timestamp: 0 };
}

function unwrapPayload(value: unknown): unknown {
  if (isRecord(value) && "data" in value) return value.data;
  return value;
}

function unwrapRecordPayload(value: unknown): ApiRecord {
  const payload = unwrapPayload(value);
  return isRecord(payload) ? payload : {};
}

function buildReviewsQuery(input: {
  status: string;
  rating: string;
  courseId: string;
  search: string;
  sort: string;
}) {
  const params = new URLSearchParams();
  if (input.status !== "all") params.set("status", input.status);
  if (input.rating !== "all") params.set("rating", input.rating);
  if (input.courseId !== "all") params.set("courseId", input.courseId);
  if (input.search.trim()) params.set("search", input.search.trim());
  if (input.sort !== "newest") params.set("sort", input.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeComment(record: unknown, index: number): InstructorReview {
  const row = isRecord(record) ? record : {};
  const author = isRecord(row.author) ? row.author : isRecord(row.user) ? row.user : isRecord(row.student) ? row.student : {};
  const reply = isRecord(row.reply) ? row.reply : isRecord(row.answer) ? row.answer : undefined;
  const createdAt = normalizeCreatedAt(row.createdAtIso ?? row.isoCreatedAt ?? row.createdAt ?? row.createdAtAt ?? row.date ?? row.timestamp);

  const commentText = normalizeString(row.content ?? row.comment ?? row.text ?? row.body ?? row.description, "");
  const replyText = reply ? normalizeString(reply.content ?? reply.text ?? reply.answer ?? reply.body, "") : "";

  return {
    id: normalizeString(row.id ?? row._id ?? row.commentId ?? row.reviewId, `REV-${String(index + 1).padStart(3, "0")}`),
    studentName: normalizeString(author.fullName ?? author.name ?? author.displayName ?? row.studentName ?? row.userName, "دانشجو"),
    avatar: typeof author.avatar === "string" ? author.avatar : typeof row.avatar === "string" ? row.avatar : undefined,
    rating: normalizeRating(row.rating ?? row.score ?? row.stars),
    comment: commentText,
    createdAt: createdAt.label,
    createdAtTimestamp: createdAt.timestamp,
    courseId: normalizeString(
      row.commentableId ??
        row.courseId ??
        (isRecord(row.course) ? row.course.id ?? row.course.courseId : undefined) ??
        "",
      "unknown-course"
    ),
    courseTitle: normalizeString(
      row.courseTitle ??
        row.courseName ??
        (isRecord(row.course) ? row.course.title ?? row.course.name : undefined) ??
        "",
      "دوره نامشخص"
    ),
    parentId: typeof row.parentId === "string" ? row.parentId : undefined,
    ...(replyText
      ? {
          reply: {
            text: replyText,
            createdAt: normalizeCreatedAt((reply && (reply.createdAtIso ?? reply.createdAt ?? reply.date)) ?? row.replyCreatedAt ?? row.updatedAt).label,
          },
        }
      : {}),
  };
}

export default function InstructorReviewsPage() {
  const [reviews, setReviews] = useState<InstructorReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ total: 0, answered: 0, pending: 0 });
  const [reviewCourses, setReviewCourses] = useState<ReviewCourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editReplyText, setEditReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const [pendingReplyAction, setPendingReplyAction] = useState<PendingReplyAction>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const courseFilterOptions = useMemo(() => {
    return [
      { value: "all", label: "همه دوره‌های ثبت‌شده" },
      ...reviewCourses.map((course) => ({ value: course.id, label: course.title })),
    ];
  }, [reviewCourses]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async (options?: { silent?: boolean }) => {
      if (!options?.silent) setIsLoading(true);
      setLoadError("");
      try {
        const response = await apiGetNoMock<unknown>(
          `/api/instructor-dashboard/reviews${buildReviewsQuery({
            status: statusFilter,
            rating: ratingFilter,
            courseId: courseFilter,
            search: debouncedSearch,
            sort: sortFilter,
          })}`
        );
        const payload = unwrapRecordPayload(response);
        const nextReviews = unwrapList(payload.items ?? response).map(normalizeComment);
        const stats = isRecord(payload.stats) ? payload.stats : {};
        const courses = Array.isArray(payload.courses) ? payload.courses : [];
        if (!cancelled) {
          setReviews(nextReviews);
          setReviewStats({
            total: typeof stats.total === "number" ? stats.total : nextReviews.length,
            answered: typeof stats.answered === "number" ? stats.answered : nextReviews.filter((review) => Boolean(review.reply)).length,
            pending: typeof stats.pending === "number" ? stats.pending : nextReviews.filter((review) => !review.reply).length,
          });
          setReviewCourses(
            courses
              .map((course) => (isRecord(course) ? { id: normalizeString(course.id), title: normalizeString(course.title) } : null))
              .filter((course): course is ReviewCourseOption => Boolean(course?.id && course.title))
          );
          setSelectedReviewId((current) => current || nextReviews[0]?.id || "");
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setLoadError("بارگذاری نظرات انجام نشد.");
      } finally {
        if (!cancelled && !options?.silent) setIsLoading(false);
      }
    };

    loadReviews();
    const intervalId = window.setInterval(() => {
      void loadReviews({ silent: true });
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [statusFilter, ratingFilter, courseFilter, debouncedSearch, sortFilter]);

  useEffect(() => {
    if (reviews.length === 0) {
      setSelectedReviewId("");
      return;
    }

    if (!reviews.some((review) => review.id === selectedReviewId)) {
      setSelectedReviewId(reviews[0].id);
    }
  }, [reviews, selectedReviewId]);

  const active = reviews.find((review) => review.id === selectedReviewId) || null;

  const listItems = useMemo(
    () =>
      reviews.map((review) => ({
        id: review.id,
        studentName: review.studentName,
        avatar: review.avatar,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        courseTitle: review.courseTitle,
        hasReply: Boolean(review.reply),
      })),
    [reviews]
  );

  const handleSubmitReply = async () => {
    if (!active || !replyText.trim() || active.reply || isSubmittingReply) return;

    try {
      setIsSubmittingReply(true);
      const response = await apiPatchNoMock<unknown>(
        `/api/instructor-dashboard/reviews/${encodeURIComponent(active.id)}/reply`,
        { content: replyText.trim() }
      );
      const updatedReview = normalizeComment(unwrapPayload(response), 0);

      setReviews((prev) =>
        prev.map((review) => (review.id === active.id ? updatedReview : review))
      );
      setReplyText("");
    } catch (error) {
      console.error(error);
      setLoadError("ثبت پاسخ انجام نشد. دوباره تلاش کنید.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleStartEditReply = () => {
    if (!active?.reply) return;
    setEditingReplyId(active.id);
    setEditReplyText(active.reply.text);
    setLoadError("");
  };

  const handleCancelEditReply = () => {
    setEditingReplyId("");
    setEditReplyText("");
  };

  const requestSaveEditedReply = () => {
    if (!active || !active.reply || !editReplyText.trim() || isSubmittingReply) return;
    setPendingReplyAction({ type: "edit" });
  };

  const saveEditedReply = async () => {
    if (!active || !active.reply || !editReplyText.trim() || isSubmittingReply) return;

    try {
      setIsSubmittingReply(true);
      const response = await apiPatchNoMock<unknown>(
        `/api/instructor-dashboard/reviews/${encodeURIComponent(active.id)}/reply`,
        { content: editReplyText.trim() }
      );
      const updatedReview = normalizeComment(unwrapPayload(response), 0);

      setReviews((prev) =>
        prev.map((review) => (review.id === active.id ? updatedReview : review))
      );
      handleCancelEditReply();
    } catch (error) {
      console.error(error);
      setLoadError("ویرایش پاسخ انجام نشد. دوباره تلاش کنید.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const requestDeleteReply = () => {
    if (!active?.reply || isDeletingReply) return;
    setPendingReplyAction({ type: "delete" });
  };

  const deleteReply = async () => {
    if (!active?.reply || isDeletingReply) return;

    try {
      setIsDeletingReply(true);
      const response = await apiDeleteNoMock<unknown>(
        `/api/instructor-dashboard/reviews/${encodeURIComponent(active.id)}/reply`
      );
      const updatedReview = normalizeComment(unwrapPayload(response), 0);

      setReviews((prev) =>
        prev.map((review) => (review.id === active.id ? updatedReview : review))
      );
      handleCancelEditReply();
    } catch (error) {
      console.error(error);
      setLoadError("حذف پاسخ انجام نشد. دوباره تلاش کنید.");
    } finally {
      setIsDeletingReply(false);
    }
  };

  const closeReplyActionModal = () => {
    if (isSubmittingReply || isDeletingReply) return;
    setPendingReplyAction(null);
  };

  const confirmReplyAction = async () => {
    if (pendingReplyAction?.type === "edit") {
      await saveEditedReply();
      setPendingReplyAction(null);
      return;
    }

    if (pendingReplyAction?.type === "delete") {
      await deleteReply();
      setPendingReplyAction(null);
    }
  };

  const actionModalCopy =
    pendingReplyAction?.type === "edit"
      ? {
          title: "تایید ویرایش پاسخ",
          description: "آیا مطمئن هستید که می‌خواهید متن پاسخ مدرس را ویرایش کنید؟",
          confirmLabel: "بله، ویرایش شود",
          confirmClassName: "bg-primary text-white hover:bg-primary-hover",
        }
      : pendingReplyAction?.type === "delete"
        ? {
            title: "تایید حذف پاسخ",
            description: "آیا مطمئن هستید که می‌خواهید پاسخ مدرس را حذف کنید؟ این نظر دوباره بدون پاسخ نمایش داده می‌شود.",
            confirmLabel: "بله، حذف شود",
            confirmClassName: "bg-rose-500 text-white hover:bg-rose-600",
          }
        : null;

  return (
    <div className="mx-auto max-w-[1320px] pb-20 text-right animate-in fade-in duration-500" dir="rtl">
      <section className="mb-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] md:p-8">
        <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-2xl font-black leading-tight text-gray-900 dark:text-white md:text-3xl">نظرات دانشجویان</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-gray-500 dark:text-gray-400">
              مشاهده و مدیریت بازخوردهای دانشجویان با دسترسی سریع و فیلترهای کاربردی
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <MessageSquare className="h-8 w-8" />
          </div>
        </div>
      </section>

      <section className="mb-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative group md:col-span-2 xl:col-span-2">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="جستجو در نظرات، دانشجو یا عنوان دوره..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full min-h-[46px] w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pr-11 pl-3 text-xs font-bold text-gray-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <CustomSelect
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="وضعیت"
            size="md"
            className={filterSelectClassName}
            icon={<Filter className="h-4 w-4" />}
          />

          <CustomSelect
            options={courseFilterOptions}
            value={courseFilter}
            onChange={setCourseFilter}
            placeholder="دوره"
            size="md"
            className={filterSelectClassName}
            icon={<BookOpen className="h-4 w-4" />}
          />

          <CustomSelect
            options={ratingFilterOptions}
            value={ratingFilter}
            onChange={setRatingFilter}
            placeholder="امتیاز"
            size="md"
            className={filterSelectClassName}
            icon={<Star className="h-4 w-4" />}
          />

          <CustomSelect
            options={sortFilterOptions}
            value={sortFilter}
            onChange={setSortFilter}
            placeholder="مرتب‌سازی"
            size="md"
            className={filterSelectClassName}
            icon={<ArrowUpDown className="h-4 w-4" />}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black">
          {isLoading ? (
            <ReviewStatsBadgesSkeleton />
          ) : (
            <>
              <span className="rounded-lg bg-primary/10 px-3 py-1 text-primary">
                کل نظرات: {reviewStats.total.toLocaleString("fa-IR")}
              </span>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-500">
                پاسخ داده‌شده: {reviewStats.answered.toLocaleString("fa-IR")}
              </span>
              <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-500">
                بدون پاسخ: {reviewStats.pending.toLocaleString("fa-IR")}
              </span>
            </>
          )}
        </div>
      </section>

      {loadError && (
        <div className="mb-5 rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {loadError}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className={cn("order-2 lg:order-1", isLoading || active ? "block" : "hidden lg:block")}>
          {isLoading ? (
            <ReviewDetailSkeleton />
          ) : active ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">{active.studentName}</h3>
                  <p className="text-[10px] font-semibold text-gray-400">
                    {active.courseTitle} • {active.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", i < active.rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-white/10")}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                <p className="text-xs font-semibold leading-7 text-gray-700 dark:text-gray-200">{active.comment}</p>
              </div>

              {active.reply ? (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black text-primary">پاسخ مدرس</p>
                    {editingReplyId !== active.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleStartEditReply}
                          className="inline-flex items-center gap-1 rounded-lg bg-white/80 px-2.5 py-1.5 text-[10px] font-black text-gray-600 transition hover:text-primary dark:bg-white/10 dark:text-gray-300"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={requestDeleteReply}
                          disabled={isDeletingReply}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-[10px] font-black text-rose-500 transition hover:bg-rose-500/15 disabled:opacity-60"
                        >
                          {isDeletingReply ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          حذف
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {editingReplyId === active.id ? (
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        value={editReplyText}
                        onChange={(event) => setEditReplyText(event.target.value)}
                        className="w-full rounded-2xl border border-primary/20 bg-white/80 p-4 text-xs font-semibold leading-7 text-gray-700 outline-none focus:border-primary dark:bg-black/20 dark:text-white"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={requestSaveEditedReply}
                          disabled={isSubmittingReply || !editReplyText.trim()}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmittingReply && <Loader2 className="h-4 w-4 animate-spin" />}
                          ذخیره ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditReply}
                          className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-500 transition hover:bg-white dark:border-white/10 dark:hover:bg-white/5"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold leading-7 text-gray-700 dark:text-gray-200">{active.reply.text}</p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="پاسخ شما به این نظر..."
                    className="w-full rounded-2xl border border-gray-200/70 bg-gray-50 p-4 text-xs font-semibold text-gray-700 outline-none focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmittingReply}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingReply && <Loader2 className="h-4 w-4 animate-spin" />}
                    ثبت پاسخ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <p className="text-sm font-bold text-gray-400">نظری برای نمایش یافت نشد.</p>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          {isLoading ? (
            <ReviewListSkeleton />
          ) : (
            <InstructorReviewList
              reviews={listItems}
              selectedReviewId={active?.id}
              onSelect={(reviewId) => {
                setSelectedReviewId(reviewId);
                setReplyText("");
                handleCancelEditReply();
              }}
            />
          )}
        </div>
      </div>

      {actionModalCopy ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 text-right shadow-2xl dark:border-white/10 dark:bg-[#1c1e26]">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">{actionModalCopy.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-7 text-gray-500 dark:text-gray-400">
              {actionModalCopy.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeReplyActionModal}
                disabled={isSubmittingReply || isDeletingReply}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-500 transition hover:bg-gray-50 disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => void confirmReplyAction()}
                disabled={isSubmittingReply || isDeletingReply}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60",
                  actionModalCopy.confirmClassName
                )}
              >
                {(isSubmittingReply || isDeletingReply) && <Loader2 className="h-4 w-4 animate-spin" />}
                {actionModalCopy.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
