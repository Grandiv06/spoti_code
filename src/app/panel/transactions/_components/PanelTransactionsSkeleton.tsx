"use client";

import { SkeletonBox } from "@/components/ui/Skeleton";

export function TransactionStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1c1e26] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden relative"
        >
          <div className="flex items-center gap-4 relative z-10">
            <SkeletonBox className="h-12 w-12 shrink-0" rounded="rounded-2xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-3 w-24" rounded="rounded-md" />
              <div className="flex items-baseline gap-2">
                <SkeletonBox className="h-6 w-28" rounded="rounded-lg" />
                <SkeletonBox className="h-2.5 w-10" rounded="rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionHeaderSkeleton() {
  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none mb-8">
      <div className="relative z-10 px-8 py-12 md:px-16 flex flex-col md:flex-row items-center gap-10">
        <SkeletonBox className="h-16 w-16 shrink-0" rounded="rounded-2xl" />
        <div className="text-center md:text-right space-y-3 w-full max-w-xl">
          <SkeletonBox className="h-10 w-56 mx-auto md:mx-0 md:mr-0" rounded="rounded-xl" />
          <SkeletonBox className="h-5 w-full max-w-md mx-auto md:mx-0" rounded="rounded-lg" />
          <SkeletonBox className="h-5 w-[85%] max-w-sm mx-auto md:mx-0" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function TransactionFiltersSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white dark:bg-[#1c1e26] p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        <SkeletonBox className="h-[52px] w-full sm:max-w-md" rounded="rounded-2xl" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SkeletonBox className="h-[44px] w-full sm:w-36" rounded="rounded-2xl" />
          <SkeletonBox className="h-[44px] w-full sm:w-36" rounded="rounded-2xl" />
        </div>
      </div>
      <SkeletonBox className="h-[44px] w-full lg:w-48" rounded="rounded-2xl" />
    </div>
  );
}

function TransactionTableRowSkeleton() {
  return (
    <tr>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <SkeletonBox className="h-10 w-10 shrink-0" rounded="rounded-xl" />
          <div className="space-y-2 flex-1">
            <SkeletonBox className="h-4 w-48 max-w-full" rounded="rounded-md" />
            <SkeletonBox className="h-3 w-32" rounded="rounded-md" />
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <SkeletonBox className="h-3 w-36" rounded="rounded-md" />
      </td>
      <td className="px-8 py-6 space-y-2">
        <SkeletonBox className="h-3 w-20" rounded="rounded-md" />
        <SkeletonBox className="h-2.5 w-14" rounded="rounded-md" />
      </td>
      <td className="px-8 py-6">
        <SkeletonBox className="h-5 w-24" rounded="rounded-md" />
      </td>
      <td className="px-8 py-6">
        <SkeletonBox className="h-7 w-20" rounded="rounded-full" />
      </td>
      <td className="px-8 py-6">
        <SkeletonBox className="h-9 w-9" rounded="rounded-xl" />
      </td>
    </tr>
  );
}

function TransactionTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="hidden lg:block bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
              {["w-36", "w-16", "w-24", "w-24", "w-14", "w-14"].map((width, index) => (
                <th key={index} className="px-8 py-6">
                  <SkeletonBox className={`h-3 ${width} mr-auto`} rounded="rounded-md" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {Array.from({ length: 5 }).map((_, index) => (
              <TransactionTableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1c1e26] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBox className="h-10 w-10 shrink-0" rounded="rounded-xl" />
                <div className="space-y-2">
                  <SkeletonBox className="h-3 w-28" rounded="rounded-md" />
                  <SkeletonBox className="h-5 w-16" rounded="rounded-full" />
                </div>
              </div>
              <SkeletonBox className="h-6 w-24" rounded="rounded-md" />
            </div>
            <SkeletonBox className="h-4 w-full" rounded="rounded-md" />
            <SkeletonBox className="h-3 w-40" rounded="rounded-md" />
            <SkeletonBox className="h-12 w-full" rounded="rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PanelTransactionsSkeleton() {
  return (
    <div
      className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-500"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری تراکنش‌ها"
    >
      <TransactionHeaderSkeleton />
      <TransactionStatsSkeleton />
      <TransactionFiltersSkeleton />
      <TransactionTableSkeleton />
    </div>
  );
}
