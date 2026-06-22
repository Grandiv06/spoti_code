import React from "react";

export function AdminTicketsStatsSkeleton() {
  return (
    <div className="mb-8 grid animate-pulse grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md dark:border-white/5 dark:bg-[#1c1e26] md:p-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="h-2.5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
          </div>
          <div className="h-6 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminTicketDetailSkeleton() {
  return (
    <div className="animate-pulse rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-3">
          <div className="h-8 w-3/4 max-w-md rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-56 max-w-full rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-2xl bg-gray-100 dark:bg-white/5" />
          <div className="h-9 w-20 rounded-2xl bg-gray-100 dark:bg-white/5" />
        </div>
      </div>

      <div className="max-h-[420px] space-y-5">
        <div className="rounded-[2rem] rounded-tr-none border border-gray-100 bg-white p-6 dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2.5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="h-3 w-4/5 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
        <div className="ml-8 rounded-[2rem] rounded-tl-none border border-primary/20 bg-primary/10 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-primary/20" />
            <div className="h-2.5 w-16 rounded-full bg-primary/15" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-primary/15" />
            <div className="h-3 w-2/3 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none">
        <div className="min-h-[120px] rounded-3xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-white/5" />
        <div className="mt-5 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="h-3 w-full max-w-sm rounded-full bg-gray-100 dark:bg-white/5" />
          <div className="flex w-full items-center gap-4 md:w-auto">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-white/5" />
            <div className="h-12 flex-1 rounded-2xl bg-gray-200 dark:bg-white/10 md:w-40 md:flex-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminTicketListSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/5 dark:bg-[#1c1e26] sm:rounded-3xl">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-white/5" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-32 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
        <div className="h-6 w-8 rounded-full bg-gray-100 dark:bg-white/5" />
      </div>
      <div className="space-y-2 px-3 py-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3 dark:border-white/5 dark:bg-black/15"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="h-5 w-16 rounded-lg bg-gray-200 dark:bg-white/10" />
              <div className="h-3 w-14 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
            <div className="mb-2 h-4 w-full rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
              <div className="h-3 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
