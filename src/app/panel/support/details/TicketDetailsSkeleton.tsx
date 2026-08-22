"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function MessageSkeleton({ align }: { align: "user" | "support" }) {
  const isUser = align === "user";

  return (
    <div
      dir="ltr"
      className={cn("flex w-full gap-2.5", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser ? (
        <SkeletonBox className="mt-0.5 size-8 shrink-0" rounded="rounded-xl" />
      ) : null}
      <SkeletonBox
        className={cn("h-16", isUser ? "w-48" : "w-56")}
        rounded="rounded-2xl"
      />
      {isUser ? (
        <SkeletonBox className="mt-0.5 size-8 shrink-0" rounded="rounded-xl" />
      ) : null}
    </div>
  );
}

export default function TicketDetailsSkeleton() {
  return (
    <div
      className="mx-auto flex h-full w-full max-w-3xl flex-col lg:max-w-6xl lg:flex-row lg:gap-4 lg:px-4 lg:py-3"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری گفتگوی پشتیبانی"
    >
      <div className="hidden w-72 shrink-0 rounded-[1.35rem] border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26] lg:block">
        <SkeletonBox className="mb-2 h-3 w-20" rounded="rounded-md" />
        <SkeletonBox className="mb-4 h-5 w-40" rounded="rounded-lg" />
        <SkeletonBox className="mb-5 h-6 w-24" rounded="rounded-full" />
        <div className="space-y-3">
          <SkeletonBox className="h-4 w-full" rounded="rounded-md" />
          <SkeletonBox className="h-4 w-4/5" rounded="rounded-md" />
          <SkeletonBox className="h-4 w-3/4" rounded="rounded-md" />
        </div>
      </div>
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden border-y border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#111111] sm:mx-3 sm:my-2 sm:rounded-[1.35rem] sm:border lg:mx-0 lg:my-0">
        <div className="min-h-0 flex-1 space-y-3 px-3.5 py-4 sm:px-5">
          <MessageSkeleton align="user" />
          <MessageSkeleton align="support" />
          <MessageSkeleton align="user" />
        </div>
        <div className="shrink-0 border-t border-gray-200/70 bg-gray-50 p-3 dark:border-white/5 dark:bg-[#141414] sm:p-3.5">
          <div className="flex items-end gap-2">
            <SkeletonBox className="h-11 flex-1" rounded="rounded-2xl" />
            <SkeletonBox className="size-11 shrink-0" rounded="rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
