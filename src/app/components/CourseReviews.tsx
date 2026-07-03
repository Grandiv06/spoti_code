"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import type { CreateCommentDto } from "@/types/api-dtos";
import { apiPostNoMock, apiGetNoMock } from "@/lib/api";
import { SkeletonBox } from "@/components/ui/Skeleton";

export interface ReviewReply {
  author: string;
  role: string;
  comment: string;
  date: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  comment: string;
  date: string;
  userId?: string;
  parentId?: string;
  reply?: ReviewReply;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "سهراب امینی",
    role: "توسعه‌دهنده React",
    avatar: "/images/student1.jpg",
    comment:
      "پروژه‌های عملی این دوره باعث شد ترس من از کدنویسی بریزه. محتوا بسیار کاربردی و به‌روز است. الان در یک شرکت معتبر مشغولم.",
    date: "۲ هفته پیش",
    userId: "user-1",
  },
  {
    id: "2",
    author: "سارا رضایی",
    role: "توسعه‌دهنده فرانت‌اند",
    avatar: "/images/student2.jpg",
    comment:
      "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در این دوره بود. منتورها واقعاً دلسوزانه کمک می‌کنند و محتوا عالیه.",
    date: "۱ ماه پیش",
    userId: "user-2",
    reply: {
      author: "مدرس دوره",
      role: "مدرس",
      comment: "خوشحالیم که تجربه خوبی داشتید. موفق باشید!",
      date: "۳ هفته پیش",
    },
  },
  {
    id: "3",
    author: "نیما حسینی",
    role: "متخصص دیتاساینس",
    avatar: "/images/student3.jpg",
    comment:
      "محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴ ساعته واقعاً یک مزیت بزرگه. فقط امیدوارم مباحث پیشرفته‌تر هم اضافه بشه.",
    date: "۲ ماه پیش",
    userId: "user-3",
  },
];

interface CourseReviewsProps {
  courseId: string;
  reviews?: Review[];
  totalReviews?: number | string;
}

const INITIAL_COMMENTS_SIZE = 7;
const LOAD_MORE_COMMENTS_SIZE = 4;

const getCommentsPath = (courseId: string, offset: number, limit: number) =>
  `/api/comments/course/${encodeURIComponent(courseId)}?offset=${offset}&limit=${limit}`;

const normalizeCommentsResponse = (response: { data?: unknown } | unknown) => {
  const data = response && typeof response === "object"
    ? (response as { data?: unknown }).data
    : undefined;
  const root = (data ?? response) as
    | unknown[]
    | {
        data?: unknown;
        items?: unknown[];
        total?: number;
        meta?: {
          total?: number;
          totalItems?: number;
          totalPages?: number;
          currentPage?: number;
          itemsPerPage?: number;
        };
      };
  const nestedData = !Array.isArray(root) && root?.data ? root.data : undefined;
  const source = (nestedData ?? root) as
    | unknown[]
    | {
        items?: unknown[];
        total?: number;
        meta?: {
          total?: number;
          totalItems?: number;
          totalPages?: number;
          currentPage?: number;
          itemsPerPage?: number;
        };
      };

  const items = Array.isArray(source)
    ? source
    : Array.isArray(source?.items)
      ? source.items
      : [];

  const meta = !Array.isArray(source) ? source.meta : undefined;

  const total =
    typeof (source as { total?: unknown })?.total === "number"
      ? (source as { total: number }).total
      : typeof meta?.total === "number"
        ? meta.total
        : typeof meta?.totalItems === "number"
          ? meta.totalItems
          : items.length;

  const totalPages =
    typeof meta?.totalPages === "number"
      ? meta.totalPages
      : Math.max(1, Math.ceil(total / (meta?.itemsPerPage ?? INITIAL_COMMENTS_SIZE)));

  const currentPage = typeof meta?.currentPage === "number" ? meta.currentPage : 1;

  return { items, total, totalPages, currentPage };
};

function formatCommentDate(raw: string): string {
  if (!raw) return "تازه";
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? raw : new Date(parsed).toLocaleDateString("fa-IR");
}

function extractReplyFromObject(source: unknown): ReviewReply | undefined {
  if (!source || typeof source !== "object") return undefined;

  const row = source as Record<string, unknown>;
  const text = String(row.content ?? row.comment ?? row.text ?? row.body ?? "").trim();
  if (!text) return undefined;

  const author = (row.author ?? row.user ?? row.instructor ?? {}) as Record<string, unknown>;

  return {
    author: String(author.fullName ?? author.name ?? row.authorName ?? "مدرس دوره"),
    role: String(author.role ?? "مدرس"),
    comment: text,
    date: formatCommentDate(String(row.createdAt ?? row.date ?? "")),
  };
}

function mapRowToReview(row: Record<string, unknown>, idx: number): Review {
  const user = (row.user ?? row.author ?? {}) as Record<string, unknown>;
  const createdAtRaw = String(row.createdAt ?? row.date ?? "");
  let reply = extractReplyFromObject(row.reply ?? row.answer);

  const children = row.replies ?? row.children;
  if (!reply && Array.isArray(children)) {
    for (const child of children) {
      const nestedReply = extractReplyFromObject(child);
      if (nestedReply) {
        reply = nestedReply;
        break;
      }
    }
  }

  return {
    id: String(row.id ?? `comment-${idx + 1}`),
    author: String(user.fullName ?? user.name ?? row.authorName ?? "کاربر اسپاتی‌کد"),
    role: String(user.role ?? row.role ?? "دانشجو"),
    avatar: String(user.avatar ?? row.avatar ?? "/images/student1.jpg"),
    comment: String(row.content ?? row.comment ?? ""),
    date: formatCommentDate(createdAtRaw),
    userId: typeof user.id === "string" ? user.id : undefined,
    parentId: typeof row.parentId === "string" ? row.parentId : undefined,
    reply,
  };
}

function buildReviewsWithReplies(items: unknown[]): Review[] {
  const mapped = items.map((item, idx) => mapRowToReview((item ?? {}) as Record<string, unknown>, idx));
  const topLevel = mapped.filter((review) => !review.parentId || review.parentId === review.id);
  const replyOnly = mapped.filter((review) => review.parentId && review.parentId !== review.id);
  const topLevelById = new Map(topLevel.map((review) => [review.id, review]));

  for (const replyRow of replyOnly) {
    const parent = topLevelById.get(replyRow.parentId!);
    if (!parent || parent.reply) continue;

    parent.reply = {
      author: replyRow.author,
      role: replyRow.role,
      comment: replyRow.comment,
      date: replyRow.date,
    };
  }

  return topLevel;
}

function ReviewReplyBlock({ reply }: { reply: ReviewReply }) {
  return (
    <div className="relative mt-3 mr-11 md:mr-14 pr-4 md:pr-5 border-r-2 border-primary/20 dark:border-primary/30">
      <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3.5 dark:border-white/10 dark:bg-white/[0.03] md:px-5 md:py-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary">
            <span className="material-symbols-outlined text-sm">school</span>
            پاسخ مدرس
          </span>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{reply.date}</span>
        </div>
        <p className="text-sm font-medium leading-7 text-gray-700 dark:text-gray-200 md:text-[15px]">
          {reply.comment}
        </p>
        <p className="mt-2.5 text-[11px] font-black text-gray-600 dark:text-gray-300">
          {reply.author}
          {reply.role ? ` • ${reply.role}` : ""}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review, isLast }: { review: Review; isLast?: boolean }) {
  return (
    <article
      className={`group px-4 py-5 transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02] md:px-6 md:py-6 ${
        isLast ? "" : "border-b border-gray-100 dark:border-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        {review.userId ? (
          <Link
            href={`/social/profile/${review.userId}`}
            className="group/profile shrink-0"
          >
            <div className="relative size-11 overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm transition-transform group-hover/profile:scale-105 dark:border-white/10 md:size-12">
              <Image src={review.avatar} alt={review.author} fill className="object-cover" />
            </div>
          </Link>
        ) : (
          <div className="relative size-11 shrink-0 overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm dark:border-white/10 md:size-12">
            <Image src={review.avatar} alt={review.author} fill className="object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3.5 dark:border-white/10 dark:bg-white/[0.03] md:px-5 md:py-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                {review.userId ? (
                  <Link
                    href={`/social/profile/${review.userId}`}
                    className="truncate text-sm font-black text-gray-900 transition-colors hover:text-primary dark:text-white md:text-base"
                  >
                    {review.author}
                  </Link>
                ) : (
                  <h4 className="truncate text-sm font-black text-gray-900 dark:text-white md:text-base">
                    {review.author}
                  </h4>
                )}
                <span className="block truncate text-[10px] font-bold text-gray-500 dark:text-gray-400 md:text-xs">
                  {review.role}
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-gray-400 dark:text-gray-500 md:text-xs">
                {review.date}
              </span>
            </div>
            <p className="text-justify text-sm font-medium leading-7 text-gray-600 dark:text-gray-300 md:text-[15px]">
              {review.comment}
            </p>
          </div>

          {review.reply ? <ReviewReplyBlock reply={review.reply} /> : null}
        </div>
      </div>
    </article>
  );
}

function CommentsSkeleton() {
  return (
    <div className="divide-y divide-gray-100 dark:divide-white/[0.06]" dir="rtl" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-start gap-3 md:gap-4">
            <SkeletonBox className="size-11 md:size-12 shrink-0" rounded="rounded-2xl" />
            <div className="flex-1 space-y-3">
              <SkeletonBox className="h-24 w-full" rounded="rounded-[1.35rem]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CourseReviews({
  courseId,
  reviews = MOCK_REVIEWS,
  totalReviews = "۱۲۸",
}: CourseReviewsProps) {
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [liveTotalReviews, setLiveTotalReviews] = useState<number | string>(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ comment: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCourseComments = useCallback(
    async (offset: number, limit: number, append = false) => {
      const res = await apiGetNoMock<{ data?: unknown }>(getCommentsPath(courseId, offset, limit));
      const { items, total } = normalizeCommentsResponse(res);
      const mapped = buildReviewsWithReplies(items);

      setLiveReviews((prev) => {
        if (!append) return mapped;

        const existingIds = new Set(prev.map((review) => review.id));
        const nextItems = mapped.filter((review) => !existingIds.has(review.id));
        return [...prev, ...nextItems];
      });

      const nextCount = append ? offset + mapped.length : mapped.length;
      setLiveTotalReviews(total);
      setHasMoreReviews(nextCount < total);
    },
    [courseId]
  );

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingReviews(true);
      try {
        await loadCourseComments(0, INITIAL_COMMENTS_SIZE, false);
      } catch {
        setLiveReviews(reviews);
        setLiveTotalReviews(totalReviews);
        setHasMoreReviews(false);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchComments();
  }, [loadCourseComments, reviews, totalReviews]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreReviews) return;

    setIsLoadingMore(true);
    try {
      await loadCourseComments(liveReviews.length, LOAD_MORE_COMMENTS_SIZE, true);
    } catch {
      // Keep current list on pagination failure.
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const requestBody: CreateCommentDto = {
        content: formData.comment.trim(),
        commentableType: "course",
        commentableId: courseId,
      };

      if (rating > 0) {
        requestBody.rating = rating;
      }

      await apiPostNoMock("/api/comments", requestBody);
      setIsLoadingReviews(true);
      await loadCourseComments(0, INITIAL_COMMENTS_SIZE, false);
      setIsLoadingReviews(false);
    } catch {
      // Keep modal open to allow retry on API failure.
      return;
    } finally {
      setIsSubmitting(false);
    }

    setIsModalOpen(false);
    setFormData({ comment: "" });
    setRating(5);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:shadow-none md:rounded-4xl">
      <div className="border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex w-full items-center justify-center gap-3 text-center sm:w-auto sm:justify-start sm:text-right md:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
              <span className="material-symbols-outlined filled text-xl md:text-2xl">rate_review</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                نظرات دانشجویان
              </h2>
              <span className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1 block">
                ({liveTotalReviews} نظر)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto justify-center text-sm font-bold text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base md:text-lg">edit_square</span>
            ثبت نظر
          </button>
        </div>
      </div>

      {/* Modal ثبت نظر */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0f1115] rounded-[2rem] md:rounded-4xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700/50 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 bg-white dark:bg-[#0f1115] z-10 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="flex items-center justify-center size-8 md:size-10 rounded-xl md:rounded-2xl bg-primary/20 dark:bg-primary/30 text-primary shrink-0">
                  <span className="material-symbols-outlined filled text-lg md:text-xl">rate_review</span>
                </span>
                <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">ثبت نظر</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 md:size-10 rounded-xl md:rounded-2xl bg-transparent hover:bg-transparent flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="بستن"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-1.5 md:space-y-2">
                <span className="block text-gray-700 dark:text-gray-300 text-xs md:text-sm font-bold pr-1 mb-1 md:mb-2">
                  امتیاز شما
                </span>
                <div
                  className="flex items-center cursor-pointer justify-between"
                  dir="ltr"
                  onMouseLeave={() => setHoverRating(null)}
                >
                  <div className="flex items-center gap-0">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const displayRating = hoverRating ?? rating;
                      const isFilled = star <= displayRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          className="p-0 rounded-md hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-0 border-0"
                          aria-label={`${star} ستاره`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`size-6 md:size-7 transition-all duration-200 ${
                              isFilled ? "text-primary" : "text-gray-300 dark:text-gray-600"
                            }`}
                            fill={isFilled ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={isFilled ? 1.4 : 1.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 3.7l2.6 5.26 5.8.84-4.2 4.1.99 5.78L12 16.9l-5.19 2.78.99-5.78-4.2-4.1 5.8-.84L12 3.7z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                  <span
                    dir="rtl"
                    className="inline-flex items-center gap-1 text-[11px] md:text-xs text-gray-500 dark:text-gray-400 font-semibold select-none whitespace-nowrap"
                    style={{ unicodeBidi: "isolate" }}
                  >
                    <span>{(hoverRating ?? rating).toLocaleString("fa-IR")}</span>
                    <span>از</span>
                    <span>۵</span>
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label htmlFor="review-comment" className="block text-gray-700 dark:text-gray-300 text-xs md:text-sm font-bold pr-1">
                  نظر شما
                </label>
                <textarea
                  id="review-comment"
                  value={formData.comment}
                  onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-[#2a2e36] bg-gray-50 dark:bg-[#0b0d12] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-400/90 font-medium resize-none text-sm md:text-base"
                  placeholder="تجربه خود از این دوره را با دیگران به اشتراک بگذارید..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 h-10 md:h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm md:text-base order-1 sm:order-none"
                >
                  <span className="material-symbols-outlined text-base md:text-lg">send</span>
                  {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto h-10 md:h-12 px-4 md:px-6 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition-colors cursor-pointer text-sm md:text-base order-2 sm:order-none"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="overflow-hidden rounded-[1.5rem] border border-gray-200/70 bg-white/80 dark:border-white/10 dark:bg-white/[0.02] md:rounded-[1.75rem]">
          {isLoadingReviews ? (
            <CommentsSkeleton />
          ) : liveReviews.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
              هنوز نظری برای این دوره ثبت نشده است.
            </div>
          ) : (
            <>
              {liveReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isLast={index === liveReviews.length - 1 && !hasMoreReviews}
                />
              ))}

              {hasMoreReviews ? (
                <div className="border-t border-gray-100 px-4 py-4 dark:border-white/[0.06] md:px-6 md:py-5">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.06]"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isLoadingMore ? "progress_activity" : "expand_more"}
                    </span>
                    {isLoadingMore ? "در حال بارگذاری..." : "مشاهده نظرات بیشتر"}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
