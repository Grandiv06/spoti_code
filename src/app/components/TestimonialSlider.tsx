"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const testimonials = [
  {
    id: 1,
    name: "سهراب امینی",
    role: "توسعه‌دهنده React",
    image: "/images/student1.jpg",
    content: "پروژه‌های عملی این آکادمی باعث شد ترس من از کدنویسی بریزه و الان در یک شرکت معتبر مشغولم."
  },
  {
    id: 2,
    name: "سارا رضایی",
    role: "توسعه‌دهنده موبایل",
    image: "/images/student2.jpg",
    content: "بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در دوره موبایل بود. منتورها واقعاً دلسوزانه کمک می‌کنند."
  },
  {
    id: 3,
    name: "نیما حسینی",
    role: "متخصص دیتاساینس",
    image: "/images/student3.jpg",
    content: "محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴ ساعته واقعاً یک مزیت بزرگه."
  }
];

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Move "Next" in RTL means shifting everything Right (ActiveIndex decreases? Wait)
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Move "Prev" in RTL means shifting everything Left (ActiveIndex increases)
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getPosition = (index: number) => {
    const total = testimonials.length;
    let diff = index - activeIndex;
    
    if (diff < -1) diff += total;
    if (diff > 1) diff -= total;
    
    return diff;
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative">
        <h2 className="text-4xl font-black mb-4">نظرات دانشجویان ما</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-20 text-lg">
          بشنوید از کسانی که این مسیر را با موفقیت پیموده‌اند.
        </p>

        {/* Navigation Arrows - با فاصله بیشتر از باکس‌ها */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between z-20 pointer-events-none md:-mx-20 lg:-mx-28">
          <button 
            type="button"
            onClick={handleNext}
            className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:scale-110 transition-all pointer-events-auto z-20 ml-2 mr-6 md:mr-10"
            aria-label="بعدی"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button 
            type="button" 
            onClick={handlePrev}
            className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:scale-110 transition-all pointer-events-auto z-20 mr-2 ml-6 md:ml-10"
            aria-label="قبلی"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 relative">
          {/* بکگراند سبز - همیشه زیر کارت وسط (ستون وسط) */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            aria-hidden
          >
            <div
              className="absolute top-0 rounded-4xl bg-primary shadow-2xl shadow-primary/30"
              style={{
                width: "calc((100% - 5rem) / 3)",
                left: "calc((100% - 5rem) / 3 + 2.5rem)",
                height: "100%",
              }}
            />
          </div>

          {testimonials.map((t, index) => {
            const position = getPosition(index);
            const isCenter = position === 0;
            const isLeft = position === -1;
            const isRight = position === 1;
            const orderClass = isLeft ? "order-1" : isCenter ? "order-2" : "order-3";

            return (
              <div 
                key={t.id}
                className={`transition-[transform,box-shadow] duration-500 ease-in-out ${orderClass}
                  ${isCenter 
                    ? "bg-primary md:bg-primary/0 p-10 rounded-4xl relative scale-105 z-10 text-white" 
                    : "bg-white dark:bg-surface-dark p-10 rounded-4xl shadow-xl relative mt-8" 
                  }
                  ${(!isCenter && !isRight && !isLeft) ? "hidden" : "block"}
                `}
              >
                <Image
                  alt="Student"
                  className={`rounded-full border-4 shadow-lg absolute left-1/2 -translate-x-1/2 transition-all duration-500
                    ${isCenter ? "w-24 h-24 border-white -top-12 z-20" : "w-20 h-20 border-white dark:border-gray-800 -top-10"}
                  `}
                  src={t.image}
                  width={isCenter ? 96 : 80}
                  height={isCenter ? 96 : 80}
                />
                
                <p className={`leading-loose italic transition-all duration-500 ${isCenter ? "mt-8 text-white/90" : "mt-6 text-gray-600 dark:text-gray-400"}`}>
                  &quot;{t.content}&quot;
                </p>
                
                <h4 className={`transition-all duration-500 ${isCenter ? "font-black text-2xl mt-6" : "font-bold text-xl mt-6"}`}>{t.name}</h4>
                  
                {isCenter ? (
                  <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold mt-2 inline-block">
                    {t.role}
                  </span>
                ) : (
                  <span className="text-primary text-sm font-bold block mt-0">
                    {t.role}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
