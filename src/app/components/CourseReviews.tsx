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
  const [formData, setFormData] = useState({ comment: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to API (formData + rating)
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
    <section className="space-y-4 md:space-y-6">
      <div className="glass-panel rounded-[2rem] md:rounded-4xl px-6 md:px-8 py-5 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto text-center sm:text-right justify-center sm:justify-start">
          <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-100 dark:from-amber-900/30 to-white dark:to-gray-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200/50 dark:border-amber-800/50 shrink-0">
            <span className="material-symbols-outlined filled text-xl md:text-2xl">rate_review</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              نظرات دانشجویان
            </h2>
            <span className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1 block">
              ({totalReviews} نظر)
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
                              isFilled
                                ? "text-amber-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]"
                                : "text-gray-300 dark:text-gray-600"
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
                  className="w-full sm:flex-1 h-10 md:h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm md:text-base order-1 sm:order-none"
                >
                  <span className="material-symbols-outlined text-base md:text-lg">send</span>
                  ارسال نظر
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

      <div className="space-y-4 md:space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="glass-panel rounded-[2rem] md:rounded-4xl p-5 md:p-6 lg:p-8 transition-all duration-300 hover:bg-white/40 dark:hover:bg-white/5"
          >
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4 shrink-0 border-b sm:border-b-0 border-gray-100 dark:border-gray-800 pb-4 sm:pb-0">
                {review.userId ? (
                  <Link
                    href={`/social/profile/${review.userId}`}
                    className="flex items-center gap-3 md:gap-4 group/profile shrink-0 w-full sm:w-auto"
                  >
                    <div className="relative size-12 md:size-16 rounded-xl md:rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg transition-transform group-hover/profile:scale-105 shrink-0">
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white group-hover/profile:text-primary transition-colors truncate">
                        {review.author}
                      </h4>
                      <span className="text-[10px] md:text-sm text-primary font-bold truncate block">{review.role}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 md:gap-4 shrink-0 w-full sm:w-auto">
                    <div className="relative size-12 md:size-16 rounded-xl md:rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg shrink-0">
                      <Image
                        src={review.avatar}
                        alt={review.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white truncate">
                        {review.author}
                      </h4>
                      <span className="text-[10px] md:text-sm text-primary font-bold truncate block">{review.role}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed md:leading-relaxed font-medium text-justify sm:text-right">
                  {review.comment}
                </p>
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-3 md:mt-5 block text-left sm:text-right">
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
