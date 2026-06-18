"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, Star, User, Loader2 } from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import { apiGet, apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

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
  courseId: string;
  courseTitle: string;
  parentId?: string;
  reply?: ReviewReply;
};

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

function normalizeDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? value.trim() : new Date(parsed).toLocaleDateString("fa-IR");
  }
  return "";
}

function normalizeComment(record: unknown, index: number): InstructorReview {
  const row = isRecord(record) ? record : {};
  const author = isRecord(row.author) ? row.author : isRecord(row.user) ? row.user : isRecord(row.student) ? row.student : {};
  const reply = isRecord(row.reply) ? row.reply : isRecord(row.answer) ? row.answer : undefined;

  const commentText = normalizeString(row.content ?? row.comment ?? row.text ?? row.body ?? row.description, "");
  const replyText = reply ? normalizeString(reply.content ?? reply.text ?? reply.answer ?? reply.body, "") : "";

  return {
    id: normalizeString(row.id ?? row._id ?? row.commentId ?? row.reviewId, `REV-${String(index + 1).padStart(3, "0")}`),
    studentName: normalizeString(author.fullName ?? author.name ?? author.displayName ?? row.studentName ?? row.userName, "دانشجو"),
    avatar: typeof author.avatar === "string" ? author.avatar : typeof row.avatar === "string" ? row.avatar : undefined,
    rating: normalizeRating(row.rating ?? row.score ?? row.stars),
    comment: commentText,
    createdAt: normalizeDate(row.createdAt ?? row.createdAtAt ?? row.date ?? row.timestamp),
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
            createdAt: normalizeDate((reply && (reply.createdAt ?? reply.date)) ?? row.replyCreatedAt ?? row.updatedAt),
          },
        }
      : {}),
  };
}

function buildReplyPayload(review: InstructorReview, content: string) {
  return {
    content,
    commentableType: "course" as const,
    commentableId: review.courseId,
    parentId: review.parentId || review.id,
    rating: review.rating,
  };
}

export default function InstructorReviewsPage() {
  const { courses } = useInstructorData();
  const [reviews, setReviews] = useState<InstructorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const publishedCourses = useMemo(() => courses.filter((course) => course.status === "published"), [courses]);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await apiGet<unknown>("/api/instructor-dashboard/my-comments");
        const nextReviews = unwrapList(response).map(normalizeComment);
        if (!cancelled) {
          setReviews(nextReviews);
          setSelectedReviewId((current) => current || nextReviews[0]?.id || "");
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setLoadError("بارگذاری نظرات انجام نشد.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const isAnswered = Boolean(review.reply);
      if (statusFilter === "answered" && !isAnswered) return false;
      if (statusFilter === "pending" && isAnswered) return false;
      if (ratingFilter !== "all" && review.rating !== Number(ratingFilter)) return false;
      if (courseFilter !== "all" && review.courseId !== courseFilter) return false;
      if (!search.trim()) return true;

      const q = search.trim().toLowerCase();
      return (
        review.studentName.toLowerCase().includes(q) ||
        review.comment.toLowerCase().includes(q) ||
        review.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [reviews, statusFilter, ratingFilter, courseFilter, search]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const answered = reviews.filter((review) => Boolean(review.reply)).length;
    const pending = total - answered;
    return { total, answered, pending };
  }, [reviews]);

  const active = filteredReviews.find((review) => review.id === selectedReviewId) || filteredReviews[0] || null;

  const handleSubmitReply = async () => {
    if (!active || !replyText.trim() || active.reply || isSubmittingReply) return;

    try {
      setIsSubmittingReply(true);
      await apiRequest("post", "/api/comments/reply/admin", {
        body: buildReplyPayload(active, replyText.trim()),
      });

      const now = new Date().toISOString();
      setReviews((prev) =>
        prev.map((review) =>
          review.id === active.id
            ? {
                ...review,
                reply: {
                  text: replyText.trim(),
                  createdAt: now,
                },
              }
            : review
        )
      );
      setReplyText("");
    } catch (error) {
      console.error(error);
      setLoadError("ثبت پاسخ انجام نشد. دوباره تلاش کنید.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

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

      <section className="mb-7 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto] xl:items-center">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در نظرات، دانشجو یا عنوان دوره..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200/70 bg-gray-50 pr-12 pl-4 text-sm font-semibold text-gray-800 outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-gray-200/70 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">بدون پاسخ</option>
            <option value="answered">پاسخ داده‌شده</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-12 rounded-2xl border border-gray-200/70 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            <option value="all">همه دوره‌های ثبت‌شده</option>
            {publishedCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-12 rounded-2xl border border-gray-200/70 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            <option value="all">همه امتیازها</option>
            <option value="5">۵ ستاره</option>
            <option value="4">۴ ستاره</option>
            <option value="3">۳ ستاره</option>
            <option value="2">۲ ستاره</option>
            <option value="1">۱ ستاره</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black">
          <span className="rounded-lg bg-primary/10 px-3 py-1 text-primary">کل نظرات: {stats.total.toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-500">پاسخ داده‌شده: {stats.answered.toLocaleString("fa-IR")}</span>
          <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-500">بدون پاسخ: {stats.pending.toLocaleString("fa-IR")}</span>
        </div>
      </section>

      {loadError && (
        <div className="mb-5 rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className={cn("lg:block", active ? "block" : "hidden lg:block")}>
          {isLoading ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <p className="mt-3 text-sm font-bold text-gray-400">در حال دریافت نظرات...</p>
            </div>
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
                  <p className="mb-1 text-[10px] font-black text-primary">پاسخ مدرس</p>
                  <p className="text-xs font-semibold leading-7 text-gray-700 dark:text-gray-200">{active.reply.text}</p>
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

        <div className="space-y-3">
          {filteredReviews.length === 0 ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <p className="text-sm font-bold text-gray-400">موردی مطابق فیلترها پیدا نشد.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <button
                key={review.id}
                onClick={() => {
                  setSelectedReviewId(review.id);
                  setReplyText("");
                }}
                className={cn(
                  "w-full rounded-[1.5rem] border p-4 text-right transition-all",
                  active?.id === review.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-100 bg-white hover:border-primary/20 dark:border-white/5 dark:bg-[#1c1e26]"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {review.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={review.avatar} alt={review.studentName} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{review.studentName}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{review.createdAt}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] font-black",
                      review.reply ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {review.reply ? "پاسخ داده‌شده" : "بدون پاسخ"}
                  </span>
                </div>
                <p className="mb-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">{review.courseTitle}</p>
                <p className="line-clamp-2 text-xs font-semibold leading-6 text-gray-700 dark:text-gray-300">{review.comment}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
