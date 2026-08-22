"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

export default function PanelTransactionsSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-4 pb-2 lg:max-w-6xl"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری تراکنش‌ها"
    >
      <div className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6">
        <div className="flex items-start gap-4">
          <SkeletonBox className="size-12 shrink-0" rounded="rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBox className="h-3 w-16" rounded="rounded-md" />
            <SkeletonBox className="h-6 w-36" rounded="rounded-lg" />
            <SkeletonBox className="h-4 w-52" rounded="rounded-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200/70 bg-white dark:border-white/[0.06] dark:bg-[#181a21]"
          >
            <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3">
              <SkeletonBox className="size-7 shrink-0" rounded="rounded-lg" />
              <SkeletonBox className="h-3.5 flex-1" rounded="rounded-md" />
              <SkeletonBox className="h-5 w-10 shrink-0" rounded="rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} className="h-8 w-16" rounded="rounded-full" />
        ))}
      </div>
      <SkeletonBox className="h-12 w-full" rounded="rounded-2xl" />

      <div className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200/70 bg-white p-4 dark:border-white/5 dark:bg-[#1c1e26]/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <SkeletonBox className="size-8 shrink-0" rounded="rounded-lg" />
                <div className="space-y-2">
                  <SkeletonBox className="h-4 w-36" rounded="rounded-md" />
                  <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
                </div>
              </div>
              <SkeletonBox className="h-6 w-16" rounded="rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
              <SkeletonBox className="h-4 w-20" rounded="rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
