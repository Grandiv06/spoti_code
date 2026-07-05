"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import CoursePriceDisplay, { CourseDiscountBadge } from "@/app/components/CoursePriceDisplay";

export interface CourseCardProps {
  id?: string;
  slug?: string;
  title: string;
  instructor: string;
  instructorImg?: string;
  image: string;
  difficulty?: string;
  hours: string;
  students?: string | number;
  price: string | number;
  originalPrice?: string | number | null;
  discountPercent?: number | null;
  alt?: string;
  viewHref?: string;
  disableViewNavigation?: boolean;
  onViewClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function CourseCard({
  id,
  slug,
  title,
  instructor,
  instructorImg = "/images/inst1.jpg",
  image,
  difficulty,
  hours,
  students,
  price,
  originalPrice,
  discountPercent,
  alt = "Course Card Preview",
  viewHref,
  disableViewNavigation = false,
  onViewClick,
}: CourseCardProps) {
  const formattedStudents =
    typeof students === "number" ? students.toLocaleString("fa-IR") : students;

  return (
    <div
      className="group flex flex-col h-full bg-white dark:bg-transparent dark:glass-premium rounded-4xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none transition-all duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]"
      dir="rtl"
    >
      <div className="relative h-56 overflow-hidden rounded-t-4xl isolate">
        {image.startsWith("blob:") || image.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || alt}
            className="h-full w-full object-cover transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <Image
            src={image}
            alt={title || alt}
            fill
            className="object-cover transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          {discountPercent && discountPercent > 0 ? (
            <CourseDiscountBadge discountPercent={discountPercent} />
          ) : null}
          {difficulty && (
            <span className="rounded-2xl border border-primary/20 bg-primary/15 px-3 py-1.5 text-xs font-black text-primary backdrop-blur-xl">
              {difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-full border border-white/50 p-0.5 overflow-hidden">
            <Image
              className="w-full h-full rounded-full object-cover"
              alt={instructor}
              src={instructorImg || "/images/inst1.jpg"}
              width={32}
              height={32}
            />
          </div>
          <span className="text-xs text-gray-500 font-bold">
            {instructor || "مدرس دوره"}
          </span>
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors min-h-[48px] line-clamp-2">
          {title || "نام دوره شما"}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-6">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            <span>{hours || "۰"} ساعت</span>
          </div>
          {students !== undefined && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  groups
                </span>
                <span>{formattedStudents || "۰"} دانشجو</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-gray-100/50 dark:border-white/5">
          <CoursePriceDisplay
            price={price}
            originalPrice={originalPrice}
            discountPercent={discountPercent}
          />
          <Link
            href={viewHref || (slug ? `/courses/${slug}` : id ? `/courses/${id}` : "#")}
            onClick={(e) => {
              onViewClick?.(e);
              if (disableViewNavigation) e.preventDefault();
            }}
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
