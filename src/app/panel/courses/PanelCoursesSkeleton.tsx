"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-2.5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-3">
      <div className="flex items-center gap-2.5">
        <SkeletonBox className="size-16 shrink-0 sm:size-[4.5rem]" rounded="rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBox className="h-4 w-40" rounded="rounded-md" />
          <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
          <SkeletonBox className="h-1.5 w-full" rounded="rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function PanelCoursesSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-6xl"
      aria-busy="true"
      aria-label="در حال بارگذاری دوره‌های من"
    >
      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6">
        <div className="flex items-start gap-4">
          <SkeletonBox className="size-12 shrink-0" rounded="rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBox className="h-3 w-16" rounded="rounded-md" />
            <SkeletonBox className="h-6 w-32" rounded="rounded-lg" />
            <SkeletonBox className="h-4 w-48" rounded="rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
