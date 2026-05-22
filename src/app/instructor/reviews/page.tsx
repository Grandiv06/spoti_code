"use client";

import React, { useMemo, useState } from "react";
import { Search, MessageSquare, Star, User } from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";

export default function InstructorReviewsPage() {
  const { courses, replyToReview } = useInstructorData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [replyText, setReplyText] = useState("");

  const publishedCourses = useMemo(() => {
    return courses.filter((c) => c.status === "published");
  }, [courses]);

  const allReviews = useMemo(() => {
    return courses.flatMap((course) =>
      course.reviews.map((review) => ({
        ...review,
        courseId: course.id,
        courseTitle: course.title,
      }))
    );
  }, [courses]);

  const stats = useMemo(() => {
    const total = allReviews.length;
    const answered = allReviews.filter((r) => !!r.reply).length;
    const pending = total - answered;
    return { total, answered, pending };
  }, [allReviews]);

  const filtered = useMemo(() => {
    return allReviews.filter((r) => {
      if (statusFilter === "answered" && !r.reply) return false;
      if (statusFilter === "pending" && r.reply) return false;
      if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
      if (courseFilter !== "all" && r.courseId !== courseFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [allReviews, statusFilter, ratingFilter, courseFilter, search]);

  const active = filtered.find((r) => r.id === selectedReviewId) || filtered[0] || null;

  const handleSubmitReply = () => {
    if (!active || !replyText.trim() || active.reply) return;
    replyToReview(active.courseId, active.id, replyText.trim());
    setReplyText("");
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
            {publishedCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
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

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        <div className={cn("lg:block", active ? "block" : "hidden lg:block")}>
          {active ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">{active.studentName}</h3>
                  <p className="text-[10px] font-semibold text-gray-400">{active.courseTitle} • {active.createdAt}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < active.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-white/10")} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                <p className="text-xs font-semibold leading-7 text-gray-700 dark:text-gray-200">{active.comment}</p>
              </div>

              {active.reply ? (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[10px] font-black text-primary mb-1">پاسخ مدرس</p>
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
                    className="rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary-hover transition-colors"
                  >
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
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <p className="text-sm font-bold text-gray-400">موردی مطابق فیلترها پیدا نشد.</p>
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedReviewId(r.id);
                  setReplyText("");
                }}
                className={cn(
                  "w-full rounded-[1.5rem] border p-4 text-right transition-all",
                  active?.id === r.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-100 bg-white hover:border-primary/20 dark:border-white/5 dark:bg-[#1c1e26]"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{r.studentName}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{r.createdAt}</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-black rounded-md px-2 py-1", r.reply ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                    {r.reply ? "پاسخ داده‌شده" : "بدون پاسخ"}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1">{r.courseTitle}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-2 leading-6">{r.comment}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
