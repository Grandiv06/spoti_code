"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "چگونه می‌توانم در دوره‌های اسپاتی‌کد ثبت‌نام کنم؟",
      answer: "شما می‌توانید با مراجعه به صفحه دوره‌ها، دوره مورد نظر خود را انتخاب کرده و با کلیک روی دکمه «ثبت‌نام»، مراحل خرید را انجام دهید. پس از پرداخت موفق، بلافاصله به محتوای دوره دسترسی خواهید داشت.",
    },
    {
      question: "آیا دوره‌ها پیش‌نیاز خاصی دارند؟",
      answer: "پیش‌نیازهای هر دوره در صفحه توضیحات همان دوره مشخص شده است. برای دوره‌های مقدماتی نیازی به دانش قبلی نیست، اما دوره‌های پیشرفته نیازمند تسلط بر مباحث پایه‌ای مرتبط هستند.",
    },
    {
      question: "پشتیبانی دوره‌ها به چه صورت است؟",
      answer: "پشتیبانی دوره‌ها در اسپاتی‌کد به صورت ۲۴ ساعته در روزهای کاری از طریق پنل کاربری و سیستم تیکتینگ انجام می‌شود. پاسخ به سوالات فنی معمولاً در کمتر از چند ساعت ارسال می‌شود.",
    },
    {
      question: "آیا در پایان دوره مدرک معتبری ارائه می‌شود؟",
      answer: "بله، پس از مشاهده تمامی ویدیوها و قبولی در آزمون‌ها یا پروژه‌های پایانی، مدرک دیجیتالی پایان دوره به صورت خودکار در پنل شما قرار می‌گیرد.",
    },
    {
      question: "آیا ویدیوهای دوره‌ها قابلیت دانلود دارند؟",
      answer: "برای حفظ کپی‌رایت و جلوگیری از پخش غیرمجاز، ویدیوهای دوره‌ها دارای محدودیت دانلود هستند و شما از طریق پلیر اختصاصی اسپاتی‌کد به صورت مادام‌العمر به آن‌ها دسترسی خواهید داشت.",
    },
    {
      question: "در صورت عدم رضایت از دوره، امکان بازگشت وجه وجود دارد؟",
      answer: "بله، اسپاتی‌کد ضمانت بازگشت وجه تا ۷ روز پس از خرید دوره را ارائه می‌دهد؛ البته به شرطی که بیش از ۲۰٪ از محتوای دوره را مشاهده نکرده باشید.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-[family-name:var(--font-vazir)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Mesh/Blobs - Removed entirely on mobile to save GPU */}
      <div className="hidden lg:block absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 transform-gpu"></div>
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 transform-gpu"></div>

      <main className="max-w-4xl mx-auto px-6 pt-20 sm:pt-24 lg:pt-32 pb-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary text-sm font-bold mb-6">
            <span className="material-symbols-outlined text-[20px]">help</span>
            سوالات متداول
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            پاسخ به پرتکرارترین{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-green-600 relative inline-block">
              پرسش‌های شما
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-bold leading-relaxed">
            آیا با روند ثبت‌نام یا پشتیبانی دوره‌ها مشکل دارید؟ ما به سوالات رایج شما پاسخ داده‌ایم تا با خیالی آسوده آموزش را شروع کنید.
          </p>
        </div>

        <div className="space-y-4 relative z-20">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-[2rem] border overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-[#1a1c23] border-primary/30"
                    : "bg-white/90 dark:bg-[#1a1c23]/90 border-gray-100 dark:border-white/5"
                }`}
              >
                <div
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-right cursor-pointer select-none"
                  role="button"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base md:text-lg font-black ${
                      isOpen
                        ? "text-primary-dark dark:text-primary"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[24px] shrink-0 mr-4 transform-gpu transition-transform duration-200 ${
                      isOpen ? "text-primary rotate-180" : "text-gray-400 rotate-0"
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </div>

                <div
                  className={`grid transition-all duration-200 ease-out transform-gpu ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-loose font-medium m-0">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Contact Section */}
        <div className="mt-20 p-8 rounded-[2.5rem] bg-white dark:bg-[#1a1c23]/80 border border-gray-100 dark:border-white/5 text-center shadow-sm relative overflow-hidden isolate">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
          
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
             جواب سوال خود را پیدا نکردید؟
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold max-w-lg mx-auto leading-relaxed">
            تیم پشتیبانی اسپاتی‌کد آماده است تا در سریع‌ترین زمان ممکن به سوالات شما پاسخ دهد و شما را در مسیر یادگیری راهنمایی کند.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:09121234567"
              className="px-8 py-3.5 bg-primary text-[#0d1c15] font-black rounded-2xl hover:bg-primary-hover hover:scale-105 transition-all cursor-pointer shadow-[0_4px_20px_-5px_rgba(34,197,94,0.4)]"
            >
              تماس با پشتیبانی
            </a>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              ارسال پیام به تلگرام
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
