"use client";

import { SkeletonBox, SkeletonLine } from "@/components/ui/Skeleton";

function FieldSkeleton({ labelWidth = "w-24" }: { labelWidth?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonLine className={`h-3 ${labelWidth}`} />
      <SkeletonBox className="h-11 w-full" rounded="rounded-xl" />
    </div>
  );
}

function StepHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-6 w-2" rounded="rounded-full" />
        <SkeletonLine className="h-5 w-52 sm:w-72" rounded="rounded-lg" />
      </div>
      <SkeletonLine className="h-3 w-64 sm:w-80" />
    </div>
  );
}

function Step1FormSkeleton() {
  return (
    <div className="space-y-6">
      <StepHeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldSkeleton labelWidth="w-20" />
        <FieldSkeleton labelWidth="w-16" />
        <FieldSkeleton labelWidth="w-24" />
        <FieldSkeleton labelWidth="w-28" />
      </div>
      <div className="space-y-3">
        <SkeletonLine className="h-3 w-28" />
        <SkeletonBox className="h-[170px] w-full" rounded="rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-11 w-full" rounded="rounded-xl" />
        <SkeletonBox className="h-11 w-full" rounded="rounded-xl" />
      </div>
      <FieldSkeleton labelWidth="w-20" />
    </div>
  );
}

function Step2FormSkeleton() {
  return (
    <div className="space-y-4">
      <StepHeaderSkeleton />
      <div className="space-y-5 rounded-2xl border border-gray-100 p-4 dark:border-white/10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FieldSkeleton labelWidth="w-28" />
          <div className="space-y-2">
            <SkeletonLine className="h-3 w-36" />
            <SkeletonBox className="h-24 w-full" rounded="rounded-xl" />
          </div>
        </div>
        <div className="space-y-3 border-t border-gray-100 pt-5 dark:border-white/10">
          <SkeletonLine className="h-3 w-32" />
          <SkeletonBox className="min-h-[180px] w-full" rounded="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function Step3FormSkeleton() {
  return (
    <div className="space-y-4">
      <StepHeaderSkeleton />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4 rounded-2xl border border-gray-100 dark:border-white/10 p-4">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonBox className="h-28 w-full" rounded="rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} className="h-10 w-full" rounded="rounded-xl" />
            ))}
          </div>
        </div>
        <div className="xl:col-span-5 space-y-4 rounded-2xl border border-gray-100 dark:border-white/10 p-4">
          <SkeletonLine className="h-4 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBox className="h-10 w-10 shrink-0" rounded="rounded-xl" />
              <SkeletonLine className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border border-gray-100 dark:border-white/10 p-4">
        <SkeletonLine className="h-4 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-14 w-full" rounded="rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function Step4FormSkeleton() {
  return (
    <div className="space-y-6">
      <StepHeaderSkeleton />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-28" rounded="rounded-xl" />
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, chapter) => (
        <div
          key={chapter}
          className="space-y-3 rounded-2xl border border-gray-100 dark:border-white/10 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="h-4 w-40" />
            <SkeletonBox className="h-8 w-20" rounded="rounded-xl" />
          </div>
          {Array.from({ length: 3 }).map((_, lesson) => (
            <div
              key={lesson}
              className="flex flex-col gap-2 rounded-xl border border-gray-100 dark:border-white/5 p-3 sm:flex-row sm:items-center"
            >
              <SkeletonBox className="h-7 w-7 shrink-0" rounded="rounded-lg" />
              <SkeletonLine className="h-3 w-36 flex-1" />
              <div className="flex gap-1.5">
                <SkeletonBox className="h-7 w-14" rounded="rounded-lg" />
                <SkeletonBox className="h-7 w-7" rounded="rounded-lg" />
                <SkeletonBox className="h-7 w-7" rounded="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Step5FormSkeleton() {
  return (
    <div className="space-y-6">
      <StepHeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-gray-100 dark:border-white/10 p-4"
          >
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-5 w-40" />
            <SkeletonLine className="h-3 w-full" />
          </div>
        ))}
      </div>
      <SkeletonBox className="h-40 w-full" rounded="rounded-2xl" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBox className="h-5 w-5 shrink-0" rounded="rounded-md" />
            <SkeletonLine className="h-3 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Step1PreviewSkeleton() {
  return (
    <div className="flex flex-col items-center py-10">
      <SkeletonLine className="mb-2 h-3 w-48" />
      <SkeletonLine className="mb-6 h-4 w-36" />
      <div className="w-full max-w-[390px] overflow-hidden rounded-[1.75rem] border border-gray-100 dark:border-white/5">
        <SkeletonBox className="h-44 w-full" rounded="rounded-none" />
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-8 w-8" rounded="rounded-full" />
            <SkeletonLine className="h-3 w-24" />
          </div>
          <SkeletonLine className="h-5 w-4/5" />
          <SkeletonLine className="h-4 w-1/2" />
          <SkeletonBox className="h-10 w-full" rounded="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function Step2PreviewSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <SkeletonBox className="aspect-[16/7] w-full" rounded="rounded-2xl" />
      <div className="space-y-2 px-2">
        <SkeletonLine className="h-6 w-3/4" />
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function Step3PreviewSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <SkeletonLine className="h-5 w-40" />
      <SkeletonBox className="h-28 w-full" rounded="rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/5 p-3">
            <SkeletonBox className="h-9 w-9 shrink-0" rounded="rounded-xl" />
            <SkeletonLine className="h-3 w-full" />
          </div>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonBox key={i} className="h-12 w-full" rounded="rounded-xl" />
      ))}
    </div>
  );
}

function Step4PreviewSkeleton() {
  return (
    <div className="space-y-3 py-4">
      <SkeletonLine className="h-5 w-36" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-2xl border border-gray-100 dark:border-white/5 p-4">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonBox className="h-10 w-full" rounded="rounded-xl" />
          <SkeletonBox className="h-10 w-full" rounded="rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function Step5PreviewSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <SkeletonBox className="aspect-video w-full" rounded="rounded-2xl" />
      <SkeletonLine className="h-6 w-2/3" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-4/5" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <SkeletonBox className="h-24 w-full" rounded="rounded-2xl" />
        <SkeletonBox className="h-24 w-full" rounded="rounded-2xl" />
      </div>
    </div>
  );
}

const FORM_SKELETONS = [
  Step1FormSkeleton,
  Step2FormSkeleton,
  Step3FormSkeleton,
  Step4FormSkeleton,
  Step5FormSkeleton,
] as const;

const PREVIEW_SKELETONS = [
  Step1PreviewSkeleton,
  Step2PreviewSkeleton,
  Step3PreviewSkeleton,
  Step4PreviewSkeleton,
  Step5PreviewSkeleton,
] as const;

type WizardStepSkeletonProps = {
  step: number;
};

export function CreateCourseWizardFormSkeleton({ step }: WizardStepSkeletonProps) {
  const index = Math.min(Math.max(step, 1), 5) - 1;
  const FormSkeleton = FORM_SKELETONS[index];
  return (
    <div className="animate-in fade-in duration-300" aria-busy="true" aria-live="polite">
      <FormSkeleton />
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-6 dark:border-white/5">
        <SkeletonBox className="h-11 w-28" rounded="rounded-2xl" />
        <SkeletonBox className="h-11 w-32" rounded="rounded-2xl" />
      </div>
    </div>
  );
}

export function CreateCourseWizardPreviewSkeleton({ step }: WizardStepSkeletonProps) {
  const index = Math.min(Math.max(step, 1), 5) - 1;
  const PreviewSkeleton = PREVIEW_SKELETONS[index];
  return (
    <div className="animate-in fade-in duration-300" aria-busy="true">
      <PreviewSkeleton />
    </div>
  );
}

export function CreateCourseWizardPageSkeleton({ step = 1 }: { step?: number }) {
  return (
    <div
      className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 text-right min-h-screen overflow-x-hidden"
      dir="rtl"
      aria-busy="true"
    >
      <div className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-6 sm:mb-10 p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-4">
          <SkeletonBox className="h-12 w-12 sm:h-16 sm:w-16 shrink-0" rounded="rounded-2xl" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-6 w-56 sm:w-80" rounded="rounded-lg" />
            <SkeletonLine className="h-3 w-72 sm:w-96" />
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 mb-6 sm:mb-10">
        <div className="flex items-center justify-between gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <SkeletonBox className="h-10 w-10 sm:h-12 sm:w-12" rounded="rounded-2xl" />
              <SkeletonLine className="hidden sm:block h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className={step === 1 ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "flex flex-col gap-8"}>
        <div className={`w-full bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 ${step === 1 ? "lg:col-span-6" : ""}`}>
          <CreateCourseWizardFormSkeleton step={step} />
        </div>
        <div className={`w-full rounded-2xl sm:rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-3 sm:p-4 bg-gray-50/50 dark:bg-white/[0.02] ${step === 1 ? "lg:col-span-6" : ""}`}>
          <CreateCourseWizardPreviewSkeleton step={step} />
        </div>
      </div>
    </div>
  );
}
