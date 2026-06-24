"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type InstructorReviewListItem = {
  id: string;
  studentName: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  courseTitle: string;
  hasReply: boolean;
};

type InstructorReviewListProps = {
  reviews: InstructorReviewListItem[];
  selectedReviewId?: string;
  onSelect: (reviewId: string) => void;
  emptyMessage?: string;
};

const statusPill = {
  answered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
} as const;

export default function InstructorReviewList({
  reviews,
  selectedReviewId,
  onSelect,
  emptyMessage = "موردی مطابق فیلترها پیدا نشد.",
}: InstructorReviewListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateScrollFades = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowTopFade(scrollTop > 8);
    setShowBottomFade(scrollHeight - scrollTop - clientHeight > 8);
  }, []);

  useEffect(() => {
    updateScrollFades();
    const element = scrollRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(updateScrollFades);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [reviews.length, updateScrollFades]);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26] sm:rounded-3xl lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-white/5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 dark:text-white">لیست نظرات</p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">برای مشاهده و پاسخ انتخاب کنید</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[10px] font-black text-gray-600 dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
          {reviews.length.toLocaleString("fa-IR")}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-xs font-bold text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="relative">
          {showTopFade ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-white to-transparent dark:from-[#1c1e26]" />
          ) : null}
          {showBottomFade ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent dark:from-[#1c1e26]" />
          ) : null}

          <div
            ref={scrollRef}
            onScroll={updateScrollFades}
            className="max-h-[min(48vh,420px)] space-y-2 overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-color:rgba(156,163,175,0.45)_transparent] [scrollbar-width:thin] lg:max-h-[calc(100vh-12rem)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/15"
          >
            {reviews.map((review) => {
              const isSelected = selectedReviewId === review.id;
              const status = review.hasReply ? "answered" : "pending";

              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => onSelect(review.id)}
                  className={cn(
                    "w-full rounded-2xl border p-3 text-right transition-all duration-200",
                    isSelected
                      ? "border-primary/35 bg-primary/5 shadow-sm shadow-primary/10 ring-1 ring-primary/15"
                      : "border-gray-100 bg-gray-50/60 hover:border-primary/20 hover:bg-white dark:border-white/5 dark:bg-black/15 dark:hover:border-primary/25 dark:hover:bg-white/[0.03]"
                  )}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-black leading-none",
                        statusPill[status]
                      )}
                    >
                      {review.hasReply ? "پاسخ داده‌شده" : "بدون پاسخ"}
                    </span>
                    <span className="truncate text-[10px] font-bold text-gray-400 dark:text-gray-500">
                      {review.createdAt}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-primary/10 text-primary dark:border-white/10">
                      {review.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={review.avatar} alt={review.studentName} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <p className="truncate text-sm font-black text-gray-900 dark:text-white">{review.studentName}</p>
                  </div>

                  <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-800 dark:text-gray-100">
                    {review.comment}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="truncate">{review.courseTitle}</span>
                    <span className="flex shrink-0 items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "h-3 w-3",
                            index < review.rating
                              ? "fill-amber-500 text-amber-500"
                              : "text-gray-300 dark:text-white/10"
                          )}
                        />
                      ))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
