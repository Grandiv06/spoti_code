"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function MessageSkeleton({ align }: { align: "user" | "support" }) {
  const isUser = align === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "flex max-w-[88%] flex-col gap-2 md:max-w-[75%]",
          isUser ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isUser ? "flex-row" : "flex-row-reverse"
          )}
        >
          <SkeletonBox className="h-8 w-8 shrink-0" rounded="rounded-full" />
          <SkeletonBox className="h-3.5 w-14" rounded="rounded-md" />
          <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
        </div>
        <SkeletonBox
          className={cn(
            "w-full",
            isUser ? "h-[88px] max-w-md" : "h-[72px] max-w-sm"
          )}
          rounded="rounded-[1.75rem]"
        />
      </div>
    </div>
  );
}

function ReplyBoxSkeleton() {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none md:p-5">
      <div className="space-y-4">
        <SkeletonBox className="min-h-[88px] w-full max-h-[140px]" rounded="rounded-3xl" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <SkeletonBox className="h-3 w-48 max-w-sm" rounded="rounded-md" />

          <div className="flex w-full items-center gap-3 md:w-auto">
            <SkeletonBox className="h-[52px] w-[52px] shrink-0" rounded="rounded-2xl" />
            <SkeletonBox className="h-[52px] w-full md:w-[148px]" rounded="rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailsSkeleton() {
  return (
    <div
      className="mx-auto flex h-[calc(100dvh-7.5rem)] max-w-[1400px] flex-col overflow-hidden px-2 md:px-4 animate-in fade-in duration-500"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری جزئیات تیکت"
    >
      <div className="mb-4 shrink-0 md:mb-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3 md:space-y-4">
            <SkeletonBox className="h-5 w-40" rounded="rounded-md" />

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <SkeletonBox className="h-7 w-36" rounded="rounded-lg" />
              <SkeletonBox className="h-7 w-28" rounded="rounded-full" />
              <SkeletonBox className="h-7 w-24" rounded="rounded-full" />
            </div>

            <SkeletonBox className="h-9 w-full max-w-xl md:h-10" rounded="rounded-xl" />
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/5 md:gap-6">
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-2.5 w-14" rounded="rounded-md" />
              <div className="flex items-center gap-2">
                <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
                <SkeletonBox className="h-4 w-28" rounded="rounded-md" />
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-2.5 w-20" rounded="rounded-md" />
              <div className="flex items-center gap-2">
                <SkeletonBox className="h-4 w-4 shrink-0" rounded="rounded-md" />
                <SkeletonBox className="h-4 w-24" rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 flex-col px-1 md:px-8 lg:px-14">
        <div className="min-h-0 flex-1 overflow-hidden px-1 pb-4">
          <div className="flex flex-col gap-6 py-2">
            <MessageSkeleton align="user" />
            <MessageSkeleton align="support" />
            <MessageSkeleton align="user" />
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200/80 bg-gray-50 pt-3 dark:border-white/10 dark:bg-[#14161c] md:pt-4">
          <ReplyBoxSkeleton />
        </div>
      </div>
    </div>
  );
}
