"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <SkeletonBox className="aspect-video w-full mb-4" rounded="rounded-2xl" />

      <SkeletonBox className="h-6 w-[85%] mb-2" rounded="rounded-lg" />
      <SkeletonBox className="h-4 w-32 mb-4" rounded="rounded-md" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-12" rounded="rounded-md" />
          <SkeletonBox className="h-3 w-8" rounded="rounded-md" />
        </div>
        <SkeletonBox className="h-2 w-full" rounded="rounded-full" />
      </div>

      <SkeletonBox className="h-12 w-full mt-6" rounded="rounded-xl" />
    </div>
  );
}

export default function PanelCoursesSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500" aria-busy="true" aria-label="در حال بارگذاری دوره‌های من">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-8 w-36" rounded="rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: cards }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
