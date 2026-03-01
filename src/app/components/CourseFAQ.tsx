"use client";

import { useState } from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const MOCK_FAQS: FAQItem[] = [
  {
    id: "1",
    question: "آیا پیش‌نیازی برای این دوره لازم است؟",
    answer:
      "بله، آشنایی با HTML، CSS و جاوااسکریپت پایه ضروری است. اگر تجربه‌ی کاری با React ندارید، پیشنهاد می‌کنیم ابتدا دوره مقدماتی React را بگذرانید.",
  },
  {
    id: "2",
    question: "دسترسی به محتوا چقدر طول می‌کشد؟",
    answer:
      "با ثبت‌نام در دوره، به صورت مادام‌العمر به تمام محتوا، ویدیوها و به‌روزرسانی‌های آینده دسترسی خواهید داشت.",
  },
  {
    id: "3",
    question: "آیا امکان دریافت مدرک وجود دارد؟",
    answer:
      "بله، پس از اتمام دوره و تکمیل پروژه‌های عملی، مدرک معتبر و قابل ترجمه برای شما صادر می‌شود.",
  },
  {
    id: "4",
    question: "نحوه پشتیبانی چگونه است؟",
    answer:
      "پشتیبانی از طریق گروه اختصاصی دیسکورد و تیکتینگ انجام می‌شود. تیم پشتیبانی در ساعات اداری پاسخگوی سوالات شماست.",
  },
];

interface CourseFAQProps {
  items?: FAQItem[];
}

export default function CourseFAQ({ items = MOCK_FAQS }: CourseFAQProps) {
  const [isFAQVisible, setIsFAQVisible] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const collapseAll = () => setIsFAQVisible(false);
  const showFAQ = () => setIsFAQVisible(true);

  if (!isFAQVisible) {
    return (
      <section className="space-y-6">
        <button
          type="button"
          onClick={showFAQ}
          className="w-full rounded-4xl px-8 py-8 flex items-center justify-between gap-4 bg-white dark:bg-[#1c1e26]/90 border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center size-14 rounded-3xl bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined filled text-3xl">
                help
              </span>
            </span>
            <div className="text-right">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                سوالات متداول
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {items.length} سوال
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl group-hover:translate-x-1 transition-transform">
            expand_more
          </span>
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-4xl overflow-hidden bg-white dark:bg-[#1c1e26]/90 border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark">
      <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 dark:border-white/[0.06]">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-gray-50 dark:to-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/80 dark:border-blue-800/50">
            <span className="material-symbols-outlined filled text-2xl">
              help
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            سوالات متداول
          </h2>
        </div>
        <button
          type="button"
          onClick={collapseAll}
          className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary px-4 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
        >
          بستن
        </button>
      </div>

      <div className="p-6 space-y-6">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-4xl overflow-hidden transition-all duration-300 group ${
                isOpen
                  ? "bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark"
                  : "bg-white dark:bg-white/[0.02] border border-gray-200/60 dark:border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200/80 dark:hover:border-white/[0.06] hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-right cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span
className={`flex items-center justify-center size-10 rounded-2xl shrink-0 transition-all ${
                    isOpen
                        ? "bg-primary/20 dark:bg-primary/30 text-primary"
                        : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 group-hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      help
                    </span>
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white text-right">
                    {item.question}
                  </h3>
                </div>
                <div
                  className={`size-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isOpen
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                      : "bg-gray-100 dark:bg-white/10 group-hover:bg-primary group-hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                  <div className="pr-14 border-r-2 border-primary/30 mr-2">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
