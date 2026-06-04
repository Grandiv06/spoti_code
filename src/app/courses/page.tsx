"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

type CourseItem = {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  instructor: string;
  instructorImg: string;
  image: string;
  difficulty: string;
  hours: string;
  students: string;
  studentsCount: number;
  price: string;
};

function CourseCardSkeleton() {
  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-transparent dark:glass-premium rounded-4xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none animate-pulse"
      dir="rtl"
      aria-hidden="true"
    >
      <div className="relative h-64 overflow-hidden rounded-t-4xl isolate bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#0b0f18] dark:to-[#0a0d14]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/70 via-gray-200/40 to-gray-100 dark:from-white/10 dark:via-white/5 dark:to-white/[0.02]" />
      </div>

      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-full border border-white/50 p-0.5 overflow-hidden">
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="space-y-3 mb-3 min-h-[56px]">
          <div className="h-6 w-11/12 rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="h-6 w-2/3 rounded-full bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-1">
            <div className="size-4 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="size-1 rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="flex items-center gap-1">
            <div className="size-4 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
          <div className="h-10 w-32 rounded-2xl bg-primary/10 dark:bg-primary/15" />
          <div className="h-10 flex-1 rounded-2xl bg-gray-100 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiGet<"/api/courses/public", { data?: unknown }>(
          "/api/courses/public"
        );
        const rawList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray((res?.data as { items?: unknown[] } | undefined)?.items)
            ? ((res?.data as { items?: unknown[] }).items as unknown[])
            : [];

        const mapped = rawList.map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          const studentsCount = Number(row.studentsCount ?? row.students ?? 0);
          const rawCategory = String(
            row.categorySlug ?? row.category ?? row.track ?? "general"
          );

          return {
            id: String(row.id ?? row.slug ?? `course-${index + 1}`),
            category: rawCategory.toLowerCase(),
            categoryLabel: String(
              row.categoryTitle ?? row.categoryName ?? row.category ?? "سایر"
            ),
            title: String(row.title ?? row.name ?? "دوره بدون عنوان"),
            description: String(
              row.shortDescription ??
                row.description ??
                "توضیحات این دوره به زودی تکمیل می‌شود."
            ),
            instructor: String(
              row.instructorName ?? row.teacherName ?? "مدرس اسپاتی‌کد"
            ),
            instructorImg: String(row.instructorAvatar ?? "/images/inst1.jpg"),
            image: String(row.cover ?? row.thumbnail ?? "/images/js-green.png"),
            difficulty: String(row.difficulty ?? row.level ?? "نامشخص"),
            hours: String(row.durationHours ?? row.hours ?? "۰"),
            students: studentsCount.toLocaleString("fa-IR"),
            studentsCount,
            price: Number(row.price ?? 0).toLocaleString("fa-IR"),
          };
        });

        setAllCourses(mapped);
      } catch {
        setAllCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const byCategory = allCourses.reduce<Record<string, number>>((acc, course) => {
      acc[course.category] = (acc[course.category] ?? 0) + 1;
      return acc;
    }, {});

    const dynamicCategories = Object.keys(byCategory).map((id) => {
      const firstMatch = allCourses.find((course) => course.category === id);
      return {
        id,
        label: firstMatch?.categoryLabel ?? id,
        count: byCategory[id],
        icon: "code",
      };
    });

    return [
      { id: "all", label: "همه دوره‌ها", count: allCourses.length, icon: "stream" },
      ...dynamicCategories,
    ];
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return allCourses;
    return allCourses.filter((course) => course.category === activeFilter);
  }, [activeFilter, allCourses]);

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
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              role="status"
              aria-label="در حال بارگذاری دوره‌ها"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-20 flex items-center justify-center">
              <p className="text-xl font-bold text-gray-400">
                دوره‌ای در این دسته‌بندی یافت نشد.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredCourses.map((course) => (
                  <div
                  key={course.id}
                  className="group flex flex-col h-full bg-white dark:bg-transparent dark:glass-premium rounded-4xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none transition-all duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
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
                        مشاهده
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180 group-hover/btn:-translate-x-2 transition-transform">
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
