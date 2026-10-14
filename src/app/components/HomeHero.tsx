"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import HeroLayeredShowcase from "./HeroLayeredShowcase";
import { apiGetNoMock } from "@/lib/api";

type PublicStatsReviewer = {
  id: string;
  userId?: string | null;
  name: string;
  avatar: string;
  rating?: number | null;
  courseTitle?: string | null;
};

type PublicStatsResponse = {
  coursesCount?: number;
  studentsCount?: number;
  durationHours?: number;
  rating?: number;
  reviewsCount?: number;
  reviewers?: PublicStatsReviewer[];
};

function toPersianDigits(value: number | string): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

function formatBadgeCount(studentsCount: number, reviewsCount: number): string {
  if (studentsCount >= 1000) {
    const inK = (studentsCount / 1000).toFixed(1).replace(/\.0$/, "");
    return `+${toPersianDigits(inK)}k`;
  }
  if (studentsCount > 0) {
    return `+${toPersianDigits(studentsCount)}`;
  }
  if (reviewsCount > 0) {
    return `+${toPersianDigits(reviewsCount)}`;
  }
  return "+۲.۵k";
}

const DEFAULT_REVIEWERS: PublicStatsReviewer[] = [
  { id: "def-1", name: "دانشجوی اسپاتی‌کد", avatar: "/images/user1.jpg" },
  { id: "def-2", name: "دانشجوی اسپاتی‌کد", avatar: "/images/user2.jpg" },
  { id: "def-3", name: "دانشجوی اسپاتی‌کد", avatar: "/images/user3.jpg" },
];

export default function HomeHero() {
  const [stats, setStats] = useState<PublicStatsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiGetNoMock<PublicStatsResponse>("/api/stats/public")
      .then((data) => {
        if (isMounted && data && typeof data === "object") {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("[HomeHero] Failed to load social proof stats", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rating = typeof stats?.rating === "number" ? stats.rating : 4.9;
  const reviewsCount = typeof stats?.reviewsCount === "number" ? stats.reviewsCount : 0;
  const studentsCount = typeof stats?.studentsCount === "number" ? stats.studentsCount : 2500;
  const badgeText = stats
    ? formatBadgeCount(studentsCount, reviewsCount)
    : "+۲.۵k";

  const reviewers =
    stats?.reviewers && stats.reviewers.length > 0
      ? stats.reviewers
      : DEFAULT_REVIEWERS;

  return (
    <header className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
      {/* Ambient background glow - soft and hardware accelerated */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[350px] sm:h-[450px] bg-primary/[0.07] dark:bg-primary/[0.09] rounded-full blur-3xl transform-gpu -z-10" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
        {/* Text Column (Right side in RTL) */}
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-center lg:text-right space-y-5 sm:space-y-6">
          {/* Main Title */}
          <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.3] sm:leading-[1.28] tracking-tight">
            مسیر{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-green-500 pb-1">
              حرفه‌ای
              <svg
                className="absolute bottom-0 left-0 w-full text-primary"
                height="8"
                viewBox="0 0 100 10"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7C25 3 50 3 75 5C85 6 92 6 98 3"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </span>{" "}
            شدن <br className="hidden sm:inline" />
            در دنیای برنامه‌نویسی
          </h1>

          {/* Subtitle */}
          <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed sm:leading-8">
            با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید
            که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما
            هستیم.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-1">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 px-7 py-3.5 sm:px-8 sm:py-4 text-base font-black text-white shadow-[0_10px_30px_-5px_rgba(34,197,94,0.45)] transition-all duration-300 hover:from-primary-hover hover:to-emerald-700 hover:shadow-[0_16px_36px_-5px_rgba(34,197,94,0.6)] hover:-translate-y-0.5 active:translate-y-0 group"
              href="/courses"
            >
              <span>شروع یادگیری</span>
              <span className="material-symbols-outlined text-xl transition-transform duration-300 rtl:rotate-180 group-hover:-translate-x-1">
                arrow_right_alt
              </span>
            </a>

            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-6 py-3.5 sm:px-7 sm:py-4 text-base font-bold text-gray-800 dark:text-white shadow-xs backdrop-blur-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:-translate-y-0.5 active:translate-y-0 group"
              href="/courses"
            >
              <span className="material-symbols-outlined text-primary text-xl transition-transform duration-300 group-hover:scale-110">
                category
              </span>
              <span>مشاهده دوره‌ها</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 sm:pt-2">
            <div className="flex -space-x-3 space-x-reverse items-center">
              {reviewers.slice(0, 3).map((reviewer, idx) => (
                <div
                  key={reviewer.id || idx}
                  title={
                    reviewer.courseTitle
                      ? `${reviewer.name} — نظر برای «${reviewer.courseTitle}»`
                      : reviewer.name
                  }
                  className="relative size-10 rounded-full ring-2 ring-white dark:ring-[#14161c] overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-800 transition-transform hover:scale-110 hover:z-20 cursor-default"
                >
                  <Image
                    alt={reviewer.name || "دانشجوی اسپاتی‌کد"}
                    className="object-cover"
                    src={reviewer.avatar || "/images/student1.jpg"}
                    fill
                    sizes="40px"
                    unoptimized
                  />
                </div>
              ))}
              <div
                title={
                  reviewsCount > 0
                    ? `${toPersianDigits(reviewsCount)} نظر ثبت‌شده برای دوره‌ها`
                    : undefined
                }
                className="flex size-10 items-center justify-center rounded-full ring-2 ring-white dark:ring-[#14161c] bg-primary/15 text-xs font-black text-primary backdrop-blur-md shadow-sm"
              >
                {badgeText}
              </div>
            </div>

            <div className="flex flex-col text-right justify-center">
              <div
                className="flex items-center gap-1 text-amber-400 text-xs font-black"
                title={
                  reviewsCount > 0
                    ? `میانگین امتیاز ${toPersianDigits(rating.toFixed(1))} از ۵ (بر اساس ${toPersianDigits(reviewsCount)} نظر)`
                    : `امتیاز ${toPersianDigits(rating.toFixed(1))} از ۵`
                }
              >
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <span
                    key={starIdx}
                    className={
                      starIdx <= Math.round(rating)
                        ? "text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-900 dark:text-white font-bold mr-1">
                  {toPersianDigits(rating.toFixed(1))}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                {stats
                  ? `بیش از ${toPersianDigits(studentsCount.toLocaleString("fa-IR"))} دانشجوی فعال`
                  : "بیش از ۲,۵۰۰ دانشجوی فعال"}
              </p>
            </div>
          </div>
        </div>

        {/* Premium Layered Visual Showcase (Left side in RTL) */}
        <div className="order-1 lg:order-2 relative lg:col-span-6 xl:col-span-6 flex items-center justify-center">
          <HeroLayeredShowcase />
        </div>
      </div>
    </header>
  );
}
