"use client";

import Link from "next/link";

export interface CourseCardProps {
  id?: string;
  title: string;
  instructor: string;
  instructorImg?: string;
  image: string;
  difficulty?: string;
  hours: string;
  students: string | number;
  price: string | number;
  alt?: string;
}

export default function CourseCard({
  id = "preview",
  title,
  instructor,
  instructorImg = "/images/inst1.jpg",
  image,
  difficulty = "متوسط",
  hours,
  students,
  price,
  alt = "Course Card Preview",
}: CourseCardProps) {
  // Safe parsing of numbers
  const formattedPrice = typeof price === "number" 
    ? price.toLocaleString("fa-IR") 
    : price;

  const formattedStudents = typeof students === "number"
    ? students.toLocaleString("fa-IR")
    : students;
  const isFreePrice = typeof formattedPrice === "string" && formattedPrice.trim() === "رایگان";

  const hasCoverImage = Boolean(image?.trim());

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-transparent dark:glass-premium rounded-4xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none transition-all duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)] w-full max-w-[400px] mx-auto text-right" dir="rtl">
      <div className="relative h-64 overflow-hidden rounded-t-4xl isolate bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#0b0f18] dark:to-[#0a0d14]">
        {hasCoverImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title || alt}
              className="object-cover w-full h-full transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
          </>
        )}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md">
            {difficulty}
          </span>
        </div>
      </div>
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-full border border-white/50 p-0.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full rounded-full object-cover"
              alt={instructor}
              src={instructorImg || "/images/inst1.jpg"}
            />
          </div>
          <span className="text-xs text-gray-500 font-bold">
            {instructor || "مدرس دوره"}
          </span>
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors min-h-[56px] line-clamp-2">
          {title || "نام دوره شما"}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            <span>{hours || "۰"} ساعت</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              groups
            </span>
            <span>{formattedStudents || "۰"} دانشجو</span>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
          <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap">
            {formattedPrice || "۰"}
            {!isFreePrice && (
              <>
                {" "}
                <span className="text-[10px] opacity-80 font-bold mr-1">
                  تومان
                </span>
              </>
            )}
          </span>
          <Link
            href={`/courses/${id}`}
            onClick={(e) => e.preventDefault()}
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
  );
}
