"use client";

import React from "react";
import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

export function HeaderBannerSkeleton() {
  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
      <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
          <SkeletonBox className="w-16 h-16 shrink-0" rounded="rounded-2xl" />
          <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
            <SkeletonLine className="h-7 w-56 md:w-72" />
            <SkeletonLine className="h-4 w-64 md:w-80" />
          </div>
        </div>
        <SkeletonBox className="h-11 w-36 shrink-0" rounded="rounded-2xl" />
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <SkeletonLine className="h-3 w-16" />
            <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
          </div>
          <SkeletonLine className="h-8 w-14 mb-2" />
          <SkeletonLine className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}

export function RecentCoursesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 flex flex-col sm:flex-row items-center gap-4"
        >
          <SkeletonBox className="w-full sm:w-28 h-20 shrink-0" rounded="rounded-xl" />
          <div className="flex-1 w-full space-y-2">
            <SkeletonLine className="h-4 w-48" />
            <SkeletonLine className="h-3 w-64" />
          </div>
          <SkeletonBox className="h-9 w-24 shrink-0" rounded="rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="relative border-r-2 border-gray-200/50 dark:border-white/5 pr-6 space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative space-y-2">
          <SkeletonLine className="h-3.5 w-28" />
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}
