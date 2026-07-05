"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, PencilRuler, Users } from "lucide-react";
import type { MouseEvent } from "react";
import type { InstructorCourseRow } from "@/app/instructor/courses/_lib/instructor-courses-data";

type InstructorCourseCardProps = {
  course: InstructorCourseRow;
  instructorName: string;
  instructorAvatar?: string;
  difficulty?: string;
  viewHref: string;
  disableViewNavigation?: boolean;
  onViewClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onManage: () => void;
};

function statusLabel(status: InstructorCourseRow["status"]) {
  if (status === "published") return "منتشر شده";
  if (status === "draft") return "پیش‌نویس";
  if (status === "pending") return "در انتظار بررسی";
  return "غیرفعال";
}

function statusClass(status: InstructorCourseRow["status"]) {
  if (status === "published") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  if (status === "draft") return "bg-gray-500/10 text-gray-400 border-white/10";
  if (status === "pending") return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

export default function InstructorCourseCard({
  course,
  instructorName,
  instructorAvatar,
  difficulty,
  viewHref,
  disableViewNavigation = false,
  onViewClick,
  onManage,
}: InstructorCourseCardProps) {
  const priceLabel =
    course.price > 0 ? `${course.price.toLocaleString("fa-IR")} تومان` : "رایگان";
  const manageLabel =
    course.status === "draft"
      ? `ادامه پیش‌نویس · مرحله ${course.draftStep.toLocaleString("fa-IR")}`
      : "مدیریت دوره";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-[#1c1e26]">
      <div className="relative h-44 shrink-0 overflow-hidden">
        {course.cover.startsWith("blob:") || course.cover.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.cover} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Image
            src={course.cover}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {difficulty ? (
            <span className="rounded-xl border border-primary/20 bg-primary/15 px-2.5 py-1 text-[10px] font-black text-primary backdrop-blur-md">
              {difficulty}
            </span>
          ) : (
            <span />
          )}
          <span
            className={`rounded-xl border px-2.5 py-1 text-[10px] font-black backdrop-blur-md ${statusClass(course.status)}`}
          >
            {statusLabel(course.status)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="size-8 shrink-0 overflow-hidden rounded-full border border-gray-100 dark:border-white/10">
            {instructorAvatar ? (
              <Image
                src={instructorAvatar}
                alt={instructorName}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[10px] font-black text-primary">
                {instructorName.slice(0, 1) || "م"}
              </div>
            )}
          </div>
          <span className="truncate text-xs font-bold text-gray-500 dark:text-gray-400">
            {instructorName || "مدرس"}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 min-h-[2.75rem] text-base font-black leading-snug text-gray-900 transition-colors group-hover:text-primary dark:text-white">
          {course.title}
        </h3>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.durationHours.toLocaleString("fa-IR")} ساعت
          </span>
          <span className="text-gray-300 dark:text-white/10">•</span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course.studentsCount.toLocaleString("fa-IR")} دانشجو
          </span>
        </div>

        <div className="mb-4">
          <span className="inline-flex rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-black text-primary dark:text-primary">
            {priceLabel}
          </span>
        </div>

        <div className="mt-auto space-y-2 border-t border-gray-100 pt-4 dark:border-white/5">
          <button
            type="button"
            onClick={onManage}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-4 py-3 text-xs font-black text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
          >
            <PencilRuler className="h-4 w-4 shrink-0" />
            <span className="truncate">{manageLabel}</span>
          </button>

          <Link
            href={viewHref}
            onClick={(event) => {
              onViewClick?.(event);
              if (disableViewNavigation) event.preventDefault();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:text-primary"
          >
            <Eye className="h-4 w-4 shrink-0" />
            مشاهده دوره
          </Link>
        </div>
      </div>
    </article>
  );
}
