"use client";

import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

const metricCardTints = [
  "from-emerald-500/10 to-emerald-500/5 border-emerald-400/20",
  "from-blue-500/10 to-blue-500/5 border-blue-400/20",
  "from-amber-500/10 to-amber-500/5 border-amber-400/20",
  "from-primary/15 to-primary/5 border-primary/20",
] as const;

const tabWidths = ["w-16", "w-24", "w-28", "w-20"] as const;

export default function CourseDetailsSkeleton() {
  return (
    <div
      className="max-w-[1400px] mx-auto pb-20 text-right"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری جزئیات دوره"
    >
      {/* Back link */}
      <div className="mb-6 flex items-center gap-1.5">
        <SkeletonBox className="h-4 w-4" rounded="rounded-md" />
        <SkeletonLine className="h-3 w-36" />
      </div>

      {/* Course header card */}
      <div className="relative mb-8 w-full overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-[#1c1e26] md:p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-[200px] w-[200px] translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
          <SkeletonBox className="h-36 w-full shrink-0 md:w-56" rounded="rounded-2xl" />

          <div className="min-w-0 flex-1 space-y-3 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <SkeletonBox className="h-6 w-20" rounded="rounded-full" />
              <SkeletonBox className="h-6 w-24" rounded="rounded-full" />
            </div>

            <SkeletonLine className="mx-auto h-7 w-40 md:mx-0 md:h-8 md:w-56" rounded="rounded-lg" />
            <SkeletonLine className="mx-auto h-3 w-full max-w-md md:mx-0" />
            <SkeletonLine className="mx-auto h-3 w-3/4 max-w-sm md:mx-0" />

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <SkeletonLine className="h-3 w-14" />
              <SkeletonBox className="h-1 w-1" rounded="rounded-full" />
              <SkeletonLine className="h-3 w-12" />
              <SkeletonBox className="h-1 w-1" rounded="rounded-full" />
              <SkeletonLine className="h-3 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-gray-100 pb-px scrollbar-hide dark:border-white/5">
        {tabWidths.map((widthClass, index) => (
          <div
            key={widthClass}
            className={`flex items-center gap-2 px-5 py-3.5 ${
              index === 0
                ? "rounded-t-xl border-b-2 border-primary/40 bg-primary/5"
                : "border-b-2 border-transparent"
            }`}
          >
            <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
            <SkeletonBox className={`h-3 ${widthClass}`} rounded="rounded-md" />
          </div>
        ))}
      </div>

      {/* Overview metrics */}
      <div className="min-h-[400px]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-[#1c1e26] md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <SkeletonLine className="h-5 w-40" rounded="rounded-lg" />
            <SkeletonLine className="h-3 w-44" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {metricCardTints.map((tint) => (
              <div key={tint} className={`rounded-2xl border bg-gradient-to-br p-5 ${tint}`}>
                <div className="mb-3 flex items-center justify-between">
                  <SkeletonLine className="h-3 w-24" />
                  <SkeletonBox className="h-4 w-4" rounded="rounded-md" />
                </div>
                <SkeletonLine className="h-7 w-28" rounded="rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
