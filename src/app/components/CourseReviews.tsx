"use client";

import Image from "next/image";

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  comment: string;
  date: string;
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
  },
  {
    id: "2",
    author: "سارا رضایی",
    role: "توسعه‌دهنده فرانت‌اند",
    avatar: "/images/student2.jpg",
    comment:
      "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در این دوره بود. منتورها واقعاً دلسوزانه کمک می‌کنند و محتوا عالیه.",
    date: "۱ ماه پیش",
  },
  {
    id: "3",
    author: "نیما حسینی",
    role: "متخصص دیتاساینس",
    avatar: "/images/student3.jpg",
    comment:
      "محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴ ساعته واقعاً یک مزیت بزرگه. فقط امیدوارم مباحث پیشرفته‌تر هم اضافه بشه.",
    date: "۲ ماه پیش",
  },
];

interface CourseReviewsProps {
  reviews?: Review[];
  totalReviews?: number | string;
}

export default function CourseReviews({
  reviews = MOCK_REVIEWS,
  totalReviews = "۱۲۸",
}: CourseReviewsProps) {
  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-4xl px-8 py-6 flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-100 dark:from-amber-900/30 to-white dark:to-gray-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200/50 dark:border-amber-800/50">
            <span className="material-symbols-outlined filled text-2xl">rate_review</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              نظرات دانشجویان
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 block">
              ({totalReviews} نظر)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="glass-panel rounded-4xl p-6 md:p-8 transition-all duration-300 hover:bg-white/40 dark:hover:bg-white/5"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-4 shrink-0">
                <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    {review.author}
                  </h4>
                  <span className="text-sm text-primary font-bold">{review.role}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {review.comment}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-5 block">
                  {review.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
