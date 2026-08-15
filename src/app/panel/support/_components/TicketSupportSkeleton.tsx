"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 dark:border-white/5 dark:bg-[#1c1e26]/80">
      <div className="mb-3 flex items-start justify-between gap-3">
        <SkeletonBox className="h-4 w-40" rounded="rounded-lg" />
        <SkeletonBox className="h-6 w-20" rounded="rounded-full" />
      </div>
      <div className="mb-3 flex items-center gap-4">
        <SkeletonBox className="h-3.5 w-20" rounded="rounded-md" />
        <SkeletonBox className="h-3.5 w-28" rounded="rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <SkeletonBox className="h-3 w-28" rounded="rounded-md" />
        <SkeletonBox className="h-3 w-20" rounded="rounded-md" />
      </div>
    </div>
  );
}

export function TicketStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200/70 bg-white dark:border-white/[0.06] dark:bg-[#181a21]"
        >
          <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3">
            <SkeletonBox className="size-7 shrink-0" rounded="rounded-lg" />
            <SkeletonBox className="h-3.5 flex-1" rounded="rounded-md" />
            <SkeletonBox className="h-6 w-8 shrink-0" rounded="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TicketListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBox key={index} className="h-8 w-24" rounded="rounded-full" />
        ))}
      </div>

      <SkeletonBox className="h-12 w-full" rounded="rounded-2xl" />

      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, index) => (
          <TicketCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
