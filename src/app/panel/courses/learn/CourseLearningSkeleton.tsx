"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

function LessonRowSkeleton({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border ${
        active
          ? "bg-white dark:bg-[#1c1e26] border-primary/20 shadow-sm"
          : "border-transparent"
      }`}
    >
      <SkeletonBox className="mt-0.5 h-6 w-6 shrink-0" rounded="rounded-full" />
      <div className="flex-1 min-w-0 space-y-2">
        <SkeletonBox className={`h-4 ${active ? "w-full max-w-[220px]" : "w-full max-w-[180px]"}`} rounded="rounded-md" />
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-3 w-3 shrink-0" rounded="rounded-sm" />
          <SkeletonBox className="h-3 w-12" rounded="rounded-md" />
        </div>
      </div>
    </div>
  );
}

function ChapterSkeleton({
  expanded = false,
  lessonCount = 0,
}: {
  expanded?: boolean;
  lessonCount?: number;
}) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-[#14161c]/50">
      <div className="flex items-center justify-between p-4">
        <SkeletonBox className="h-4 w-40 max-w-[70%]" rounded="rounded-md" />
        <SkeletonBox className="h-5 w-5 shrink-0" rounded="rounded-md" />
      </div>

      {expanded && lessonCount > 0 && (
        <div className="space-y-1 p-2 pt-0">
          {Array.from({ length: lessonCount }).map((_, index) => (
            <LessonRowSkeleton key={index} active={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseLearningSkeleton() {
  const tabWidths = ["w-[72px]", "w-[108px]", "w-[56px]", "w-[96px]"];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500" aria-busy="true" aria-label="در حال بارگذاری صفحه دوره">
      {/* Course Header */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SkeletonBox className="h-10 w-10 shrink-0" rounded="rounded-xl" />
          <div className="space-y-2">
            <SkeletonBox className="h-6 w-52 max-w-[70vw] md:w-64" rounded="rounded-lg" />
            <SkeletonBox className="h-4 w-36" rounded="rounded-md" />
          </div>
        </div>

        <div className="flex flex-col md:w-64 space-y-2">
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
            <SkeletonBox className="h-3 w-8" rounded="rounded-md" />
          </div>
          <SkeletonBox className="h-2 w-full" rounded="rounded-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* Player + Tabs */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Video Player Card */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
            <SkeletonBox className="w-full aspect-video" rounded="rounded-2xl" />

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 px-2 pb-2">
              <div className="flex items-center gap-2">
                <SkeletonBox className="h-10 w-[108px]" rounded="rounded-xl" />
                <SkeletonBox className="h-10 w-[108px]" rounded="rounded-xl" />
              </div>
              <SkeletonBox className="h-11 w-[164px]" rounded="rounded-xl" />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              {tabWidths.map((width, index) => (
                <SkeletonBox
                  key={index}
                  className={`h-10 ${width} shrink-0 ${index === 0 ? "opacity-100" : "opacity-70"}`}
                  rounded="rounded-xl"
                />
              ))}
            </div>

            <div className="min-h-[200px] space-y-4">
              <SkeletonBox className="h-6 w-36" rounded="rounded-lg" />
              <div className="space-y-2.5">
                <SkeletonBox className="h-4 w-full" rounded="rounded-md" />
                <SkeletonBox className="h-4 w-full" rounded="rounded-md" />
                <SkeletonBox className="h-4 w-[92%]" rounded="rounded-md" />
                <SkeletonBox className="h-4 w-[78%]" rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <SkeletonBox className="h-6 w-6 shrink-0" rounded="rounded-md" />
              <SkeletonBox className="h-6 w-32" rounded="rounded-lg" />
            </div>

            <div className="space-y-3 pr-1">
              <ChapterSkeleton expanded lessonCount={3} />
              <ChapterSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
