"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  comment: string;
  date: string;
  userId?: string;
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
  reviews?: Review[];
  totalReviews?: number | string;
}

export default function CourseReviews({
  reviews = MOCK_REVIEWS,
  totalReviews = "۱۲۸",
}: CourseReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", comment: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to API (formData + rating)
    setIsModalOpen(false);
    setFormData({ name: "", comment: "" });
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
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-bold text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">edit_square</span>
          ثبت نظر
        </button>
      </div>

      {/* Modal ثبت نظر */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#14161c] rounded-4xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-10 rounded-2xl bg-primary/20 dark:bg-primary/30 text-primary">
                  <span className="material-symbols-outlined filled text-xl">rate_review</span>
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">ثبت نظر</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-10 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="بستن"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="review-name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1">
                  نام و نام خانوادگی
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full h-12 px-5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <span className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1 mb-2">
                  امتیاز شما
                </span>
                <div
                  className="flex gap-1 cursor-pointer"
                  dir="ltr"
                  onMouseLeave={() => setHoverRating(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const displayRating = hoverRating ?? rating;
                    const isFilled = star <= displayRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-0 border-0"
                        aria-label={`${star} ستاره`}
                      >
                        <span
                          className={`material-symbols-outlined text-3xl transition-colors ${
                            isFilled ? "filled text-amber-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                          style={{ fontVariationSettings: isFilled ? '"FILL" 1, "wght" 400' : '"FILL" 0, "wght" 400' }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="review-comment" className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1">
                  نظر شما
                </label>
                <textarea
                  id="review-comment"
                  value={formData.comment}
                  onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                  required
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                  placeholder="تجربه خود از این دوره را با دیگران به اشتراک بگذارید..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  ارسال نظر
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 px-6 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="glass-panel rounded-4xl p-6 md:p-8 transition-all duration-300 hover:bg-white/40 dark:hover:bg-white/5"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-4 shrink-0">
                {review.userId ? (
                  <Link
                    href={`/social/profile/${review.userId}`}
                    className="flex items-center gap-4 group/profile shrink-0"
                  >
                    <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg transition-transform group-hover/profile:scale-105">
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover/profile:text-primary transition-colors">
                        {review.author}
                      </h4>
                      <span className="text-sm text-primary font-bold">{review.role}</span>
                    </div>
                  </Link>
                ) : (
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
                )}
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
