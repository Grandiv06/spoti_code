"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
      <SkeletonBox className="aspect-video w-full" rounded="rounded-2xl" />
      <div className="mt-3.5 space-y-2">
        <SkeletonBox className="h-4 w-3/4" rounded="rounded-md" />
        <SkeletonBox className="h-3 w-1/2" rounded="rounded-md" />
      </div>
      <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-white/[0.05] space-y-2">
        <div className="flex justify-between">
          <SkeletonBox className="h-3 w-16" rounded="rounded-md" />
          <SkeletonBox className="h-3 w-8" rounded="rounded-md" />
        </div>
        <SkeletonBox className="h-2 w-full" rounded="rounded-full" />
      </div>
    </div>
  );
}

export default function PanelCoursesSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-5 pb-8"
      aria-busy="true"
      aria-label="در حال بارگذاری دوره‌های من"
      dir="rtl"
    >
      <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-7 shadow-xs dark:border-white/[0.07] dark:bg-[#101217]">
        <div className="flex items-start gap-4">
          <SkeletonBox className="size-12 sm:size-14 shrink-0" rounded="rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBox className="h-3 w-16" rounded="rounded-md" />
            <SkeletonBox className="h-6 w-32" rounded="rounded-lg" />
            <SkeletonBox className="h-4 w-48" rounded="rounded-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cards }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
