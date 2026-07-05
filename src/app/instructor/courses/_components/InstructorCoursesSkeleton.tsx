"use client";

import React from "react";
import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

export function InstructorCoursesHeaderSkeleton() {
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

export function InstructorCoursesFiltersSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-3xl p-6 mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonBox className="md:col-span-2 h-11" rounded="rounded-2xl" />
        <SkeletonBox className="h-11" rounded="rounded-2xl" />
        <SkeletonBox className="h-11" rounded="rounded-2xl" />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-4">
        <SkeletonLine className="h-4 w-20 ml-3" />
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBox key={index} className="h-9 w-24" rounded="rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function InstructorCoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white dark:border-white/5 dark:bg-[#1c1e26]"
        >
          <SkeletonBox className="h-44 w-full rounded-none" />
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-2.5">
              <SkeletonBox className="h-8 w-8" rounded="rounded-full" />
              <SkeletonLine className="h-3 w-24" />
            </div>
            <SkeletonLine className="h-5 w-4/5" />
            <SkeletonLine className="h-4 w-1/2" />
            <SkeletonLine className="h-7 w-24" />
            <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-white/5">
              <SkeletonBox className="h-11 w-full" rounded="rounded-2xl" />
              <SkeletonBox className="h-10 w-full" rounded="rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
