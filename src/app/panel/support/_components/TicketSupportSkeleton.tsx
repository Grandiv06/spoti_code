"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function TicketRowSkeleton() {
  return (
    <div className="relative flex flex-col justify-between p-8 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SkeletonBox className="h-6 w-52" rounded="rounded-lg" />
          <SkeletonBox className="h-6 w-24" rounded="rounded-full" />
          <SkeletonBox className="h-6 w-14" rounded="rounded-lg" />
        </div>

        <SkeletonBox className="h-7 w-full max-w-md" rounded="rounded-xl" />

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
            <SkeletonBox className="h-4 w-24" rounded="rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
            <SkeletonBox className="h-4 w-36" rounded="rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
            <SkeletonBox className="h-4 w-40" rounded="rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 lg:mt-0 lg:pr-8">
        <SkeletonBox className="h-12 w-[148px]" rounded="rounded-2xl" />
        <SkeletonBox className="h-12 w-12" rounded="rounded-xl" />
      </div>
    </div>
  );
}

export function TicketStatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] md:p-5"
        >
          <div className="flex items-center gap-4">
            <SkeletonBox className="h-12 w-12 shrink-0" rounded="rounded-2xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-3.5 w-20 md:w-24" rounded="rounded-md" />
              <SkeletonBox className="h-7 w-10 md:h-8 md:w-12" rounded="rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TicketListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none">
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {Array.from({ length: rows }).map((_, index) => (
            <TicketRowSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 dark:border-white/5 dark:bg-[#1c1e26]">
          <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
          <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
          <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
          <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
        </div>
      </div>
    </>
  );
}
