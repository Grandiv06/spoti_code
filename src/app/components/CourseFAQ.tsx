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
          className="glass-panel group flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-[2rem] border border-gray-200/80 px-5 py-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-gray-50/60 dark:border-white/[0.06] dark:shadow-none dark:hover:bg-white/[0.02] md:rounded-4xl md:px-8 md:py-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm transition-transform group-hover:scale-105 dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
              <span className="material-symbols-outlined filled text-xl md:text-2xl">help</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                سوالات متداول
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {items.length} سوال
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-2xl text-gray-400 transition-transform group-hover:translate-y-0.5 dark:text-gray-500 md:text-3xl">
            expand_more
          </span>
        </button>
      </section>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:shadow-none md:rounded-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
            <span className="material-symbols-outlined filled text-xl md:text-2xl">help</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white md:text-2xl">
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

      <div className="space-y-4 p-4 md:p-6">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-2xl border transition-all duration-300 md:rounded-3xl ${
                isOpen
                  ? "border-gray-200/80 bg-gray-50/80 dark:border-white/[0.06] dark:bg-white/[0.03]"
                  : "border-gray-200/60 bg-white hover:border-gray-200/80 hover:bg-gray-50/60 dark:border-white/[0.04] dark:bg-white/[0.02] dark:hover:border-white/[0.06] dark:hover:bg-white/[0.04]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-4 md:p-6 lg:p-8 text-right cursor-pointer gap-2 md:gap-4"
              >
                <div className="flex items-start md:items-center gap-3 md:gap-4 w-[calc(100%-40px)]">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-all md:size-10 md:rounded-2xl ${
                      isOpen
                        ? "bg-primary/15 text-primary dark:bg-primary/20"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-white/15"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base md:text-xl">
                      help
                    </span>
                  </span>
                  <h3 className="font-bold text-sm md:text-base lg:text-lg text-gray-900 dark:text-white text-right leading-relaxed mt-1 md:mt-0">
                    {item.question}
                  </h3>
                </div>
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    isOpen
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-white/15"
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
                <div className="border-t border-gray-200/80 px-6 pb-6 pt-4 dark:border-white/[0.06] md:px-8 md:pb-8 md:pt-5">
                  <div className="mr-2 border-r-2 border-gray-200 pr-6 md:pr-10 dark:border-white/10">
                    <p className="text-sm leading-8 text-gray-600 dark:text-gray-300 md:text-[15px] md:leading-8 font-medium">
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
