"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { id: "all", label: "همه دوره‌ها", count: 5, icon: "stream" },
    { id: "frontend", label: "فرانت‌اند", count: 5, icon: "code" },
  ];

  const allCourses = [
    {
      id: "html",
      category: "frontend",
      title: "آشنایی با HTML",
      description: "آشنایی با پایه و اساس وب و ساختار صفحات",
      instructor: "نیما علوی",
      instructorImg: "/images/inst3.jpg",
      image: "/images/html-green.png",
      difficulty: "مقدماتی",
      hours: "۱۲",
      students: "۱,۸۵۰",
      price: "۹۸۰,۰۰۰",
      alt: "HTML course",
    },
    {
      id: "css",
      category: "frontend",
      title: "استایل‌دهی با CSS",
      description: "جادوی بصری وب — Flexbox، Grid و طراحی واکنش‌گرا",
      instructor: "سارا محمدی",
      instructorImg: "/images/inst2.jpg",
      image: "/images/css-green.png",
      difficulty: "مقدماتی",
      hours: "۱۸",
      students: "۲,۱۲۰",
      price: "۱,۴۵۰,۰۰۰",
      alt: "CSS course",
    },
    {
      id: "javascript",
      category: "frontend",
      title: "جادوی جاوااسکریپت",
      description: "قلب تعاملات — ES۶+، DOM، Fetch API و مدیریت داده",
      instructor: "امیررضا رضایی",
      instructorImg: "/images/inst1.jpg",
      image: "/images/js-green.png",
      difficulty: "متوسط",
      hours: "۳۲",
      students: "۱,۶۵۰",
      price: "۲,۲۰۰,۰۰۰",
      alt: "JavaScript course",
    },
    {
      id: "react",
      category: "frontend",
      title: "فریمورک React",
      description: "تفکر کامپوننتی — هوک‌ها، مدیریت وضعیت و اکوسیستم React",
      instructor: "مهرداد حیدری",
      instructorImg: "/images/inst4.jpg",
      image: "/images/react-green.png",
      difficulty: "متوسط",
      hours: "۴۰",
      students: "۱,۲۴۰",
      price: "۳,۵۰۰,۰۰۰",
      alt: "React course",
    },
    {
      id: "typescript",
      category: "frontend",
      title: "تایپ‌اسکریپت پیشرفته",
      description: "کدنویسی امن و مقیاس‌پذیر — Typeها، Interfaceها و Generics",
      instructor: "امیررضا رضایی",
      instructorImg: "/images/inst1.jpg",
      image: "/images/ts-green.png",
      difficulty: "پیشرفته",
      hours: "۲۵",
      students: "۱,۳۴۰",
      price: "۱,۹۰۰,۰۰۰",
      alt: "TypeScript course",
    },
    {
      id: "react-native",
      category: "frontend",
      title: "توسعه موبایل با React Native",
      description:
        "برنامه‌های نیتیو با جاوااسکریپت — کراس‌پلتفرم برای iOS و Android",
      instructor: "مهرداد حیدری",
      instructorImg: "/images/inst4.jpg",
      image: "/images/react-native-green.png",
      difficulty: "پیشرفته",
      hours: "۵۵",
      students: "۷۸۰",
      price: "۴,۲۰۰,۰۰۰",
      alt: "React Native course",
    },
  ];

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return allCourses;
    return allCourses.filter((course) => course.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg"></div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-20 py-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12 relative z-20">
          {/* Title Area */}
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              کاوش در دنیای{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-green-600 relative inline-block">
                برنامه‌نویسی
              </span>
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-bold">
              از بین ده‌ها دوره تخصصی، مسیر یادگیری خود را پیدا کنید و به یک
              برنامه‌نویس حرفه‌ای تبدیل شوید.
            </p>
          </div>

          {/* Toolbar: Filters & Search */}
          <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-6">
            {/* Minimal Filters */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map((cat) => {
                const isActive = activeFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={`
                      group relative flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden transition-all duration-300 outline-none cursor-pointer shrink-0 border
                      ${
                        isActive
                          ? "bg-primary border-primary text-[#0d1c15] shadow-[0_4px_20px_-5px_rgba(34,197,94,0.4)]"
                          : "bg-white dark:bg-[#1C1F26] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                    )}
                    <span
                      className={`material-symbols-outlined text-[18px] relative z-10 transition-transform duration-300 ${isActive ? "" : "opacity-60 group-hover:opacity-100"}`}
                    >
                      {cat.icon}
                    </span>
                    <span className="font-bold whitespace-nowrap text-sm relative z-10">
                      {cat.label}
                    </span>
                    <span
                      className={`
                      ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full text-[10px] font-black relative z-10
                      ${isActive ? "bg-[#0d1c15]/20 text-[#0d1c15]" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"}
                    `}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-[22rem] shrink-0 group">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[22px]">
                  search
                </span>
              </div>
              <input
                className="w-full bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-white/10 rounded-full py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-gray-400 dark:placeholder-gray-500 font-bold text-gray-700 dark:text-white outline-none text-sm shadow-sm"
                placeholder="جستجوی پیشرفته دوره..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="w-full">
          {filteredCourses.length === 0 ? (
            <div className="py-20 flex items-center justify-center">
              <p className="text-xl font-bold text-gray-400">
                دوره‌ای در این دسته‌بندی یافت نشد.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className="block relative h-full bg-white dark:bg-[#161920] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 md:hover:border-primary/30 transition-all duration-500 shadow-sm md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none group">
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-[#111216]">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                    </div>
                    
                    <div className="p-7 flex flex-col h-[calc(100%-16rem)] justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Image
                              src={course.instructorImg}
                              alt={course.instructor}
                              width={24}
                              height={24}
                              className="rounded-full border border-gray-200 dark:border-white/10"
                            />
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                              {course.instructor}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 mt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            <span>{course.hours} ساعت</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">groups</span>
                            <span>{course.students} دانشجو</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-white/5 mt-auto">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#111216] px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                          مشاهده
                          <span className="material-symbols-outlined text-[18px] rtl:rotate-180">east</span>
                        </div>
                        <span className="text-primary-dark dark:text-primary/90 font-black text-[15px] bg-primary/10 px-3 py-1.5 rounded-xl">
                          {course.price} <span className="text-[10px] font-bold opacity-80">تومان</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-24 flex justify-center gap-4">
                <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer">
                  <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </button>
                <button className="size-16 rounded-full bg-primary text-background-dark font-black text-xl flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-110 cursor-pointer">
                  ۱
                </button>
                <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg cursor-pointer">
                  ۲
                </button>
                <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg cursor-pointer">
                  ۳
                </button>
                <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer">
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    chevron_left
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
