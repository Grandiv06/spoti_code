"use client";

import Link from "next/link";

type EnrolledCourseButtonProps = {
  courseId: string;
  compact?: boolean;
};

export default function EnrolledCourseButton({ courseId, compact = false }: EnrolledCourseButtonProps) {
  const href = `/panel/courses/learn?courseId=${encodeURIComponent(courseId)}`;

  if (compact) {
    return (
      <Link
        href={href}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2.5 text-sm font-black text-emerald-700 transition-all hover:bg-emerald-500/15 dark:text-emerald-300"
      >
        ادامه یادگیری
        <span className="material-symbols-outlined text-[18px] rtl:rotate-180">play_circle</span>
      </Link>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
        <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
          شما دانشجوی این دوره هستید
        </p>
      </div>
      <Link
        href={href}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-4 py-4 text-sm font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all hover:-translate-y-0.5 md:rounded-[2rem] md:py-6 md:text-xl"
      >
        <span className="material-symbols-outlined text-2xl md:text-[28px]">play_circle</span>
        ادامه یادگیری
      </Link>
    </div>
  );
}
