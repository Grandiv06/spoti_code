"use client";

import React from "react";
import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

export function ReviewStatsBadgesSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonLine key={index} className="h-6 w-28 rounded-lg" />
      ))}
    </>
  );
}

export function ReviewListSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26] sm:rounded-3xl lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-white/5">
        <div className="flex min-w-0 items-center gap-2.5">
          <SkeletonBox className="h-9 w-9 shrink-0" rounded="rounded-xl" />
          <div className="min-w-0 space-y-1.5">
            <SkeletonLine className="h-3.5 w-20" />
            <SkeletonLine className="h-2.5 w-32" />
          </div>
        </div>
        <SkeletonLine className="h-6 w-8 rounded-full" />
      </div>

      <div className="space-y-2 px-3 py-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3 dark:border-white/5 dark:bg-black/15"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <SkeletonLine className="h-5 w-20 rounded-lg" />
              <SkeletonLine className="h-2.5 w-14" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <SkeletonBox className="h-8 w-8 shrink-0" rounded="rounded-full" />
              <SkeletonLine className="h-3.5 w-24" />
            </div>
            <SkeletonLine className="mb-1 h-3 w-full" />
            <SkeletonLine className="mb-2.5 h-3 w-[80%]" />
            <div className="flex items-center justify-between gap-2">
              <SkeletonLine className="h-2.5 w-28" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((__, starIndex) => (
                  <SkeletonBox key={starIndex} className="h-3 w-3" rounded="rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewDetailSkeleton() {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-2.5 w-40" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBox key={index} className="h-4 w-4" rounded="rounded-sm" />
          ))}
        </div>
      </div>

      <SkeletonBox className="h-24 w-full" rounded="rounded-2xl" />

      <div className="mt-4 space-y-3">
        <SkeletonBox className="h-28 w-full" rounded="rounded-2xl" />
        <SkeletonBox className="h-10 w-28" rounded="rounded-xl" />
      </div>
    </div>
  );
}
