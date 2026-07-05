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
        className="size-10 shrink-0 md:size-12 !bg-gray-200/90 dark:!bg-white/[0.06]"
        rounded="rounded-xl md:rounded-2xl"
      />
      <div className="space-y-2">
        <SkeletonLine className={`h-6 md:h-7 ${titleWidth} !bg-gray-200/90 dark:!bg-white/[0.06]`} rounded="rounded-lg" />
        <SkeletonLine className={`h-3.5 ${subtitleWidth} !bg-gray-200/70 dark:!bg-white/[0.05]`} rounded="rounded-md" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  const infoBone = "!bg-black/[0.07] dark:!bg-white/10";
  const infoBoneMuted = "!bg-black/[0.05] dark:!bg-white/[0.07]";
  const videoBone = "!bg-white/15";
  const videoBoneStrong = "!bg-white/25";

  return (
    <div
      className="glass-panel group relative mb-16 overflow-hidden rounded-5xl p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] transition-all duration-700"
      dir="rtl"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />

      <div className="relative grid min-h-[500px] grid-cols-1 grid-rows-[auto_auto] overflow-hidden rounded-4xl bg-white/20 backdrop-blur-sm dark:bg-white/[0.03] lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_1fr] lg:grid-rows-1">
        {/* Course info — first in DOM → right column in RTL (matches CourseHero) */}
        <div className="relative z-10 row-start-2 flex min-w-0 flex-col justify-center overflow-hidden p-6 md:p-12 lg:row-start-1 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center justify-start gap-2 md:mb-8 md:gap-3">
            <SkeletonBox className={`h-8 w-24 ${infoBone}`} rounded="rounded-xl md:rounded-2xl" />
          </div>

          <div className="mb-4 w-full text-right md:mb-8">
            <SkeletonLine
              className={`h-10 w-full max-w-xl sm:h-12 md:h-14 lg:h-16 ${infoBone}`}
              rounded="rounded-2xl"
            />
          </div>

          <div className="mb-8 max-w-xl space-y-2.5 md:mb-10">
            <SkeletonLine className={`h-4 w-full ${infoBoneMuted}`} rounded="rounded-md" />
            <SkeletonLine className={`h-4 w-full ${infoBoneMuted}`} rounded="rounded-md" />
            <SkeletonLine className={`h-4 w-[82%] ${infoBoneMuted}`} rounded="rounded-md" />
          </div>

          <div className="flex w-full flex-col items-start gap-6 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:flex-wrap sm:items-center md:gap-12 md:pt-8">
            <div className="flex w-full items-center gap-4 sm:w-auto">
              <SkeletonBox className={`size-10 shrink-0 md:size-12 ${infoBone}`} rounded="rounded-2xl" />
              <div className="flex flex-col items-start gap-1.5 text-right">
                <SkeletonLine className={`h-3 w-14 ${infoBoneMuted}`} rounded="rounded-md" />
                <SkeletonLine className={`h-4 w-20 ${infoBone}`} rounded="rounded-md" />
              </div>
            </div>
            <div className="flex w-full items-center gap-4 sm:w-auto">
              <SkeletonBox className={`size-10 shrink-0 md:size-12 ${infoBone}`} rounded="rounded-2xl" />
              <div className="flex flex-col items-start gap-1.5 text-right">
                <SkeletonLine className={`h-3 w-16 ${infoBoneMuted}`} rounded="rounded-md" />
                <SkeletonLine className={`h-4 w-24 ${infoBone}`} rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Video — second in DOM → left column in RTL (matches CourseHero) */}
        <div className="relative row-start-1 flex min-h-[400px] w-full min-w-0 items-center justify-center overflow-hidden rounded-4xl bg-black m-2 lg:m-0 lg:ml-2 lg:min-h-0 lg:rounded-l-none lg:rounded-r-4xl">
          <SkeletonBox className={`absolute inset-0 rounded-none ${videoBone}`} rounded="rounded-none" />
          <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply dark:bg-emerald-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />

          <SkeletonBox className={`relative z-10 size-[72px] ${videoBoneStrong}`} rounded="rounded-full" />

          <div className="absolute bottom-8 right-8 left-8 z-10">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 p-5 text-white shadow-lg backdrop-blur-md">
              <div className="flex flex-col items-end gap-1.5 text-right">
                <SkeletonLine className={`h-3 w-24 ${videoBone}`} rounded="rounded-md" />
                <SkeletonLine className={`h-4 w-36 ${videoBoneStrong}`} rounded="rounded-md" />
              </div>
              <SkeletonBox className={`h-7 w-14 shrink-0 ${videoBone}`} rounded="rounded-xl" />
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
      className="glass-panel rounded-[2rem] p-6 md:rounded-4xl md:p-8 lg:p-12"
      aria-hidden="true"
    >
      <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
        <PanelHeaderSkeleton titleWidth="w-44 md:w-52" />
      </div>
      <div className="space-y-4">
        <SkeletonLine className="h-4 w-full !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-md" />
        <SkeletonLine className="h-4 w-full !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-md" />
        <SkeletonLine className="h-4 w-[96%] !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-md" />
        <SkeletonLine className="h-4 w-full !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
        <SkeletonLine className="h-4 w-[88%] !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
        <SkeletonLine className="h-4 w-[72%] !bg-gray-200/60 dark:!bg-white/[0.04]" rounded="rounded-md" />
      </div>
    </section>
  );
}

function LessonRowSkeleton({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl px-3 py-2">
      <div className="flex items-center gap-3">
        <SkeletonBox
          className={`size-5 shrink-0 ${active ? "!bg-primary/20" : "!bg-gray-200/80 dark:!bg-white/[0.06]"}`}
          rounded="rounded-full"
        />
        <SkeletonLine
          className={`h-4 ${active ? "w-48" : "w-40"} !bg-gray-200/80 dark:!bg-white/[0.06]`}
          rounded="rounded-md"
        />
      </div>
      <SkeletonBox className="h-6 w-12 shrink-0 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-lg" />
    </div>
  );
}

function ChapterSkeleton({
  expanded = false,
  lessonCount = 3,
}: {
  expanded?: boolean;
  lessonCount?: number;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border md:rounded-3xl ${
        expanded
          ? "border-gray-200/80 bg-gray-50/80 dark:border-white/[0.06] dark:bg-white/[0.03]"
          : "border-gray-200/60 bg-white dark:border-white/[0.04] dark:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 lg:gap-6">
          <SkeletonBox
            className={`size-10 shrink-0 md:size-12 lg:size-14 ${expanded ? "!bg-primary/25" : "!bg-gray-200/90 dark:!bg-white/[0.06]"}`}
            rounded="rounded-xl md:rounded-2xl lg:rounded-3xl"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonLine className="h-5 w-3/4 max-w-[280px] !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-md" />
            <SkeletonLine className="h-3.5 w-1/2 max-w-[200px] !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
          </div>
        </div>
        <SkeletonBox className="size-8 shrink-0 md:size-10 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-full" />
      </div>

      {expanded ? (
        <div className="border-t border-gray-200/80 bg-white/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02] md:p-6 lg:p-8">
          <div className="mr-3 space-y-4 border-r-2 border-gray-200 pr-6 dark:border-white/10">
            {Array.from({ length: lessonCount }).map((_, index) => (
              <LessonRowSkeleton key={index} active={index === 0} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <section
      className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] md:rounded-4xl"
      aria-hidden="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <PanelHeaderSkeleton titleWidth="w-44" subtitleWidth="w-28" />
        <div className="flex flex-row-reverse items-center gap-3">
          <SkeletonBox className="h-9 w-16 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
          <SkeletonBox className="h-9 w-20 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
          <SkeletonBox className="h-9 w-20 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
        </div>
      </div>

      <div className="space-y-4 p-4 md:p-6">
        <ChapterSkeleton expanded lessonCount={3} />
        <ChapterSkeleton />
        <ChapterSkeleton />
      </div>
    </section>
  );
}

function FAQSkeleton() {
  return (
    <section
      className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] md:rounded-4xl"
      aria-hidden="true"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <PanelHeaderSkeleton titleWidth="w-36" subtitleWidth="w-16" />
        <SkeletonBox className="h-9 w-16 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
      </div>

      <div className="divide-y divide-gray-200/80 dark:divide-white/[0.06]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 px-5 py-5 md:px-8 md:py-6">
            <SkeletonLine className="h-5 flex-1 max-w-md !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-md" />
            <SkeletonBox className="size-8 shrink-0 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsSkeleton() {
  return (
    <section
      className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] md:rounded-4xl"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] sm:flex-row md:px-8 md:py-6">
        <PanelHeaderSkeleton titleWidth="w-40" subtitleWidth="w-20" />
        <SkeletonBox className="h-10 w-full !bg-gray-200/90 dark:!bg-white/[0.06] sm:w-32" rounded="rounded-xl md:rounded-2xl" />
      </div>

      <div className="divide-y divide-gray-100 p-0 dark:divide-white/[0.06]" dir="rtl">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="px-4 py-5 md:px-6 md:py-6">
            <div className="flex items-start gap-3 md:gap-4">
              <SkeletonBox className="size-11 shrink-0 md:size-12 !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <SkeletonLine className="h-4 w-28 !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-md" />
                  <SkeletonLine className="h-3 w-16 !bg-gray-200/60 dark:!bg-white/[0.04]" rounded="rounded-md" />
                </div>
                <SkeletonBox className="h-20 w-full !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-[1.35rem]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InstructorSkeleton() {
  return (
    <section
      className="glass-panel mt-2 overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] md:mt-4 md:rounded-4xl"
      aria-hidden="true"
    >
      <div className="border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <PanelHeaderSkeleton titleWidth="w-32" />
      </div>

      <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-start md:gap-8 md:p-8">
        <div className="relative shrink-0">
          <SkeletonBox
            className="size-28 md:size-36 !bg-gray-200/90 dark:!bg-white/[0.06]"
            rounded="rounded-[1.75rem] md:rounded-[2rem]"
          />
          <SkeletonBox
            className="absolute -bottom-2 left-1/2 h-7 w-28 -translate-x-1/2 !bg-gray-200/80 dark:!bg-white/[0.05]"
            rounded="rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-4 text-center md:text-right">
          <SkeletonLine className="mx-auto h-7 w-40 md:mx-0 !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-lg" />
          <SkeletonLine className="mx-auto h-5 w-52 md:mx-0 !bg-primary/15" rounded="rounded-md" />
          <div className="space-y-2.5">
            <SkeletonLine className="h-4 w-full !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
            <SkeletonLine className="h-4 w-full !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
            <SkeletonLine className="h-4 w-[85%] !bg-gray-200/60 dark:!bg-white/[0.04]" rounded="rounded-md" />
          </div>
          <SkeletonBox className="mx-auto h-11 w-44 md:mx-0 !bg-gray-200/80 dark:!bg-white/[0.06]" rounded="rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="relative z-20 order-1 mb-4 lg:order-2 lg:col-span-4 lg:mb-0" aria-hidden="true">
      <div className="sticky top-28 space-y-6">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/80 p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] dark:border-gray-700 md:rounded-4xl md:p-8">
          <div className="text-center">
            <SkeletonLine className="mx-auto mb-3 h-3.5 w-28 !bg-gray-200/70 dark:!bg-white/[0.05]" rounded="rounded-md" />
            <div className="flex items-center justify-center gap-2">
              <SkeletonLine className="h-12 w-36 md:h-14 !bg-gray-200/90 dark:!bg-white/[0.07]" rounded="rounded-2xl" />
              <SkeletonLine className="h-5 w-12 !bg-primary/20" rounded="rounded-md" />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] border border-white/60 p-6 dark:border-gray-700 md:rounded-4xl md:p-8">
          <div className="mb-4 flex items-center gap-2 px-2">
            <SkeletonBox className="h-5 w-1 shrink-0 !bg-primary/30" rounded="rounded-full" />
            <SkeletonLine className="h-5 w-32 !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-md" />
          </div>
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="flex items-center gap-3">
                <SkeletonBox className="size-8 shrink-0 !bg-gray-200/90 dark:!bg-white/[0.06]" rounded="rounded-xl" />
                <SkeletonLine
                  className={`h-4 ${index === 0 ? "w-full" : index === 1 ? "w-[90%]" : "w-[80%]"} !bg-gray-200/80 dark:!bg-white/[0.06]`}
                  rounded="rounded-md"
                />
              </li>
            ))}
          </ul>
        </div>

        <SkeletonBox className="h-14 w-full md:h-16 !bg-primary/20" rounded="rounded-2xl md:rounded-[2rem]" />
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
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-12 md:px-12">
        <HeroSkeleton />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="order-2 flex flex-col gap-6 md:gap-8 lg:order-1 lg:col-span-8">
            <AboutSectionSkeleton />
            <CurriculumSkeleton />
            <FAQSkeleton />
            <ReviewsSkeleton />
            <InstructorSkeleton />
          </div>

          <SidebarSkeleton />
        </div>
      </main>
    </div>
  );
}
