"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { id: "all", label: "همه دوره‌ها", count: 35, icon: "stream" },
    { id: "frontend", label: "فرانت‌اند", count: 5, icon: "code" },
    { id: "backend", label: "بک‌اند", count: 18, icon: "data_object" },
    { id: "fullstack", label: "فول‌استک", count: 12, icon: "memory" },
  ];

  const allCourses = [
    {
      id: "html",
      category: "frontend",
      title: "آشنایی با HTML",
      description: "اسکلت‌بندی وب — تگ‌های معنایی، دسترسی‌پذیری و اصول سئو",
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
      description: "قلب تعاملات — ES6+، DOM، Fetch API و مدیریت داده",
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
      id: "nextjs",
      category: "fullstack",
      title: "Next.js پیشرفته",
      description: "قدرت فول‌استک — SSR، SSG و بهینه‌سازی عملکرد",
      instructor: "امیررضا رضایی",
      instructorImg: "/images/inst1.jpg",
      image: "/images/nextjs-green.png",
      difficulty: "پیشرفته",
      hours: "۴۸",
      students: "۸۹۰",
      price: "۴,۵۰۰,۰۰۰",
      alt: "Next.js course",
    },
    {
      id: "nodejs",
      category: "backend",
      title: "توسعه بک‌اند با Node.js",
      description: "ورود به سمت سرور — روترها، میدلورها و معماری RESTful",
      instructor: "علی حسینی",
      instructorImg: "/images/inst2.jpg",
      image: "/images/nodejs-green.png",
      difficulty: "متوسط",
      hours: "۳۵",
      students: "۱,۴۲۰",
      price: "۲,۸۰۰,۰۰۰",
      alt: "Node.js course",
    },
    {
      id: "python",
      category: "backend",
      title: "جامع پایتون",
      description: "زبان همه‌منظوره — از پایه تا اسکریپت‌نویسی پیشرفته",
      instructor: "زهرا مرادی",
      instructorImg: "/images/inst3.jpg",
      image: "/images/python-green.png",
      difficulty: "مقدماتی",
      hours: "۴۵",
      students: "۳,۱۰۰",
      price: "۲,۱۰۰,۰۰۰",
      alt: "Python course",
    },
    {
      id: "django",
      category: "backend",
      title: "توسعه وب با Django",
      description: "فریمورک قدرتمند پایتون — ORM، امنیت و ساخت API",
      instructor: "زهرا مرادی",
      instructorImg: "/images/inst3.jpg",
      image: "/images/django-green.png",
      difficulty: "متوسط",
      hours: "۵۰",
      students: "۹۵۰",
      price: "۳,۲۰۰,۰۰۰",
      alt: "Django course",
    },
    {
      id: "mongodb",
      category: "backend",
      title: "پایگاه داده MongoDB",
      description: "دیتابیس‌های NoSQL — مدل‌سازی داده، کوئری‌ها و Aggregation",
      instructor: "علی حسینی",
      instructorImg: "/images/inst2.jpg",
      image: "/images/mongodb-green.png",
      difficulty: "متوسط",
      hours: "۲۰",
      students: "۱,۱۵۰",
      price: "۱,۶۰۰,۰۰۰",
      alt: "MongoDB course",
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
      description: "برنامه‌های نیتیو با جاوااسکریپت — کراس‌پلتفرم برای iOS و Android",
      instructor: "مهرداد حیدری",
      instructorImg: "/images/inst4.jpg",
      image: "/images/react-native-green.png",
      difficulty: "پیشرفته",
      hours: "۵۵",
      students: "۷۸۰",
      price: "۴,۲۰۰,۰۰۰",
      alt: "React Native course",
    },
    {
      id: "docker",
      category: "fullstack",
      title: "داکر و استقرار پروژه‌ها",
      description: "کانتینرسازی — ساخت Image، مدیریت Containerها و Docker Compose",
      instructor: "امیررضا رضایی",
      instructorImg: "/images/inst1.jpg",
      image: "/images/docker-green.png",
      difficulty: "پیشرفته",
      hours: "۱۵",
      students: "۲,۴۰۰",
      price: "۱,۵۰۰,۰۰۰",
      alt: "Docker course",
    },
  ];

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return allCourses;
    return allCourses.filter(course => course.category === activeFilter);
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
              از بین ده‌ها دوره تخصصی، مسیر یادگیری خود را پیدا کنید و به یک برنامه‌نویس حرفه‌ای تبدیل شوید.
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
                      ${isActive 
                        ? "bg-primary border-primary text-[#0d1c15] shadow-[0_4px_20px_-5px_rgba(34,197,94,0.4)]" 
                        : "bg-white dark:bg-[#1C1F26] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                    )}
                    <span className={`material-symbols-outlined text-[18px] relative z-10 transition-transform duration-300 ${isActive ? "" : "opacity-60 group-hover:opacity-100"}`}>
                      {cat.icon}
                    </span>
                    <span className="font-bold whitespace-nowrap text-sm relative z-10">
                      {cat.label}
                    </span>
                    <span className={`
                      ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full text-[10px] font-black relative z-10
                      ${isActive ? "bg-[#0d1c15]/20 text-[#0d1c15]" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"}
                    `}>
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
              <p className="text-xl font-bold text-gray-400">دوره‌ای در این دسته‌بندی یافت نشد.</p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                    <Image
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={course.alt}
                      src={course.image}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                      <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {course.difficulty}
                      </span>
                      <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[20px]">
                            favorite
                          </span>
                        </button>
                        <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[20px]">
                            share
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-8 rounded-full border border-white/50 p-0.5">
                        <Image
                          className="w-full h-full rounded-full object-cover"
                          alt={course.instructor}
                          src={course.instructorImg}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-bold">
                        {course.instructor}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span>{course.hours} ساعت</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          groups
                        </span>
                        <span>{course.students} دانشجو</span>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                      <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                        {course.price}{" "}
                        <span className="text-[10px] opacity-80 font-bold mr-1">
                          تومان
                        </span>
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-background-dark text-gray-900 dark:text-white rounded-2xl py-2.5 font-bold transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        مشاهده دوره
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180 group-hover/btn:translate-x-1 transition-transform">
                          arrow_right_alt
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
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
