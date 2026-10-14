"use client";

import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

function PanelHeaderSkeleton({
  titleWidth = "w-40",
  subtitleWidth = "w-24",
}: {
  titleWidth?: string;
  subtitleWidth?: string;
}) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <SkeletonBox
        className="size-10 shrink-0 sm:size-11 md:size-12 !bg-emerald-500/10 dark:!bg-white/[0.06] border border-emerald-200/50 dark:border-white/5"
        rounded="rounded-xl md:rounded-2xl"
      />
      <div className="space-y-1.5">
        <SkeletonLine className={`h-5 sm:h-6 md:h-7 ${titleWidth} !bg-gray-200/90 dark:!bg-white/[0.08]`} rounded="rounded-lg" />
        <SkeletonLine className={`h-3 ${subtitleWidth} !bg-gray-200/70 dark:!bg-white/[0.05]`} rounded="rounded-md" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  const bone = "!bg-black/[0.06] dark:!bg-white/[0.08]";
  const boneMuted = "!bg-black/[0.04] dark:!bg-white/[0.05]";
  const videoBone = "!bg-white/15";
  const videoBoneStrong = "!bg-white/25";

  return (
    <div
      className="glass-panel group relative rounded-[1.5rem] sm:rounded-[2rem] md:rounded-5xl p-1.5 sm:p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] mb-8 sm:mb-12 md:mb-16 overflow-hidden"
      dir="rtl"
      aria-hidden="true"
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1fr] lg:grid-rows-1 rounded-[1.35rem] sm:rounded-4xl overflow-hidden backdrop-blur-sm bg-white/20 dark:bg-white/[0.03] min-h-0 lg:min-h-[480px]">
        {/* Course info — right column in RTL */}
        <div className="min-w-0 overflow-hidden flex flex-col justify-center relative z-10 row-start-2 lg:row-start-1 p-4 sm:p-6 md:p-12 lg:p-16">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8 justify-start">
            <SkeletonBox className="h-6 sm:h-7 md:h-8 w-20 sm:w-24 !bg-emerald-500/10 dark:!bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-700/50" rounded="rounded-xl md:rounded-2xl" />
          </div>

          <div className="mb-3 sm:mb-4 md:mb-8 w-full text-right">
            <SkeletonLine
              className={`h-8 sm:h-12 md:h-14 lg:h-16 w-3/4 max-w-lg ${bone}`}
              rounded="rounded-2xl"
            />
          </div>

          <div className="mb-5 sm:mb-8 md:mb-10 max-w-xl space-y-2.5">
            <SkeletonLine className={`h-3.5 sm:h-4 w-full ${boneMuted}`} rounded="rounded-md" />
            <SkeletonLine className={`h-3.5 sm:h-4 w-4/5 ${boneMuted}`} rounded="rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-12 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 w-full">
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <SkeletonBox className={`size-9 sm:size-10 md:size-12 shrink-0 ${bone}`} rounded="rounded-2xl" />
              <div className="flex flex-col text-right gap-1 min-w-0">
                <SkeletonLine className={`h-2.5 w-12 ${boneMuted}`} rounded="rounded-md" />
                <SkeletonLine className={`h-3.5 w-16 sm:w-20 ${bone}`} rounded="rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <SkeletonBox className={`size-9 sm:size-10 md:size-12 shrink-0 ${bone}`} rounded="rounded-2xl" />
              <div className="flex flex-col text-right gap-1 min-w-0">
                <SkeletonLine className={`h-2.5 w-12 ${boneMuted}`} rounded="rounded-md" />
                <SkeletonLine className={`h-3.5 w-16 sm:w-20 ${bone}`} rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Video preview — left column in RTL */}
        <div className="relative row-start-1 flex w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl sm:rounded-4xl lg:rounded-r-none lg:rounded-l-4xl m-1 sm:m-2 lg:m-0 aspect-video lg:aspect-auto lg:h-full bg-black">
          <SkeletonBox className={`absolute inset-0 rounded-none ${videoBone}`} rounded="rounded-none" />
          <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply dark:bg-emerald-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />

          <SkeletonBox className={`relative z-10 size-12 sm:size-14 md:size-16 ${videoBoneStrong}`} rounded="rounded-full" />

          <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 right-3 sm:right-4 md:right-8 left-3 sm:left-4 md:left-8 z-10">
            <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 p-3 sm:p-4 md:p-5 text-white backdrop-blur-md">
              <div className="flex flex-col items-start gap-1 text-right">
                <SkeletonLine className={`h-2.5 w-20 ${videoBone}`} rounded="rounded-md" />
                <SkeletonLine className={`h-3.5 sm:h-4 w-28 sm:w-36 ${videoBoneStrong}`} rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutSectionSkeleton() {
  return (
    <section
      className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] md:rounded-4xl p-5 sm:p-6 md:p-8 lg:p-12 border border-gray-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-white/[0.03]"
      aria-hidden="true"
    >
      <div className="mb-5 sm:mb-6 md:mb-8">
        <PanelHeaderSkeleton titleWidth="w-44 md:w-52" subtitleWidth="w-32" />
      </div>
      <div className="space-y-3">
        <SkeletonLine className="h-3.5 sm:h-4 w-full !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-md" />
        <SkeletonLine className="h-3.5 sm:h-4 w-[96%] !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-md" />
        <SkeletonLine className="h-3.5 sm:h-4 w-[92%] !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
        <SkeletonLine className="h-3.5 sm:h-4 w-[75%] !bg-gray-200/60 dark:!bg-white/[0.04]" rounded="rounded-md" />
      </div>
    </section>
  );
}

function ChapterSkeleton({ expanded = false }: { expanded?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all md:rounded-3xl ${
        expanded
          ? "border-emerald-300/90 bg-emerald-50/20 dark:border-emerald-700/50 dark:bg-emerald-950/15"
          : "border-gray-200/80 bg-white dark:border-white/[0.04] dark:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between p-4 md:p-6 lg:p-7 gap-2 md:gap-4 lg:gap-6">
        <div className="flex items-center gap-3 md:gap-4 lg:gap-5 w-[calc(100%-48px)]">
          <SkeletonBox
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl md:size-12 md:rounded-2xl lg:size-13 ${
              expanded ? "!bg-primary/25" : "!bg-emerald-50 dark:!bg-white/10"
            }`}
            rounded="rounded-xl md:rounded-2xl"
          />
          <div className="min-w-0 pr-1 flex-1 space-y-1.5">
            <SkeletonLine className="h-4 sm:h-5 w-3/4 max-w-[260px] !bg-gray-200/90 dark:!bg-white/[0.08]" rounded="rounded-md" />
            <SkeletonLine className="h-3 w-1/2 max-w-[180px] !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
          </div>
        </div>
        <SkeletonBox className="size-8 shrink-0 rounded-full md:size-9 !bg-gray-100 dark:!bg-white/10" rounded="rounded-full" />
      </div>

      {expanded && (
        <div className="border-t border-gray-200/80 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-black/20 sm:p-4 md:p-6">
          <div className="mr-1 space-y-2 border-r-2 border-primary/30 pr-3 dark:border-primary/20 sm:mr-2 sm:space-y-3 sm:pr-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <SkeletonBox className="size-5 shrink-0 !bg-primary/20" rounded="rounded-full" />
                  <SkeletonLine className={`h-3.5 ${index === 0 ? "w-44" : index === 1 ? "w-36" : "w-40"} !bg-gray-200/80 dark:!bg-white/[0.06]`} rounded="rounded-md" />
                </div>
                <SkeletonBox className="h-5 w-12 shrink-0 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <section
      className="glass-panel overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] bg-white/95 dark:bg-white/[0.03]"
      aria-hidden="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 px-4 py-4 dark:border-white/[0.06] sm:px-5 sm:py-5 md:px-8 md:py-6">
        <PanelHeaderSkeleton titleWidth="w-40" subtitleWidth="w-24" />
        <div className="flex flex-row-reverse flex-wrap items-center gap-2 sm:gap-3">
          <SkeletonBox className="h-8 sm:h-9 w-16 !bg-gray-100 dark:!bg-white/5" rounded="rounded-xl sm:rounded-2xl" />
          <SkeletonBox className="h-8 sm:h-9 w-16 !bg-emerald-500/10 dark:!bg-white/5" rounded="rounded-xl sm:rounded-2xl" />
          <SkeletonBox className="h-8 sm:h-9 w-16 !bg-emerald-500/10 dark:!bg-white/5" rounded="rounded-xl sm:rounded-2xl" />
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4 p-4 md:p-6">
        <ChapterSkeleton expanded />
        <ChapterSkeleton />
      </div>
    </section>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="lg:col-span-4 relative z-20 order-1 lg:order-2 mb-1 lg:mb-0 min-w-0" aria-hidden="true">
      <div className="lg:sticky lg:top-28 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Price Card */}
        <div className="glass-panel rounded-[1.5rem] md:rounded-4xl p-5 sm:p-6 md:p-8 border border-gray-200/80 dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden bg-white/95 dark:bg-white/[0.03]">
          <div className="text-center">
            <SkeletonLine className="mx-auto mb-2 h-3 w-24 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
            <div className="flex items-center justify-center gap-2">
              <SkeletonLine className="h-9 sm:h-12 w-32 md:h-14 !bg-gray-900/10 dark:!bg-white/[0.1]" rounded="rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="glass-panel rounded-[1.5rem] md:rounded-4xl p-5 sm:p-6 md:p-8 border border-gray-200/80 dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.02)] bg-white/95 dark:bg-white/[0.03]">
          <div className="mb-3.5 sm:mb-4 flex items-center gap-2 pr-3 border-r-4 border-primary/30">
            <SkeletonLine className="h-4 sm:h-5 w-28 !bg-gray-200/90 dark:!bg-white/[0.08]" rounded="rounded-md" />
          </div>
          <ul className="space-y-3 sm:space-y-3.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="flex items-center gap-3">
                <SkeletonBox className="size-8 sm:size-8.5 shrink-0 !bg-emerald-500/10 dark:!bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30" rounded="rounded-xl" />
                <SkeletonLine
                  className={`h-3.5 sm:h-4 ${index === 0 ? "w-4/5" : index === 1 ? "w-3/4" : "w-2/3"} !bg-gray-200/80 dark:!bg-white/[0.06]`}
                  rounded="rounded-md"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Purchase Action */}
        <div className="hidden lg:block">
          <SkeletonBox className="h-13 w-full !bg-primary/25 shadow-lg shadow-primary/10" rounded="rounded-2xl" />
        </div>
      </div>

      {/* Mobile Bottom Floating Action Bar Skeleton */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3">
          <div className="min-w-0 shrink-0 text-right space-y-1">
            <SkeletonLine className="h-2 w-14 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
            <SkeletonLine className="h-3.5 w-16 !bg-gray-900/10 dark:!bg-white/[0.1]" rounded="rounded-md" />
          </div>
          <div className="min-w-0 flex-1">
            <SkeletonBox className="h-11 w-full !bg-primary/25" rounded="rounded-xl" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function CourseDetailSkeleton() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-background-light text-text-light transition-colors duration-300 dark:bg-background-dark dark:text-text-dark"
      aria-busy="true"
      aria-label="در حال بارگذاری اطلاعات دوره"
    >
      <main className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-12 py-6 sm:py-8 md:py-12 relative z-10 pb-28 lg:pb-12">
        <HeroSkeleton />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="order-2 flex flex-col gap-6 md:gap-8 lg:order-1 lg:col-span-8 min-w-0">
            <AboutSectionSkeleton />
            <CurriculumSkeleton />
          </div>

          <SidebarSkeleton />
        </div>
      </main>
    </div>
  );
}

