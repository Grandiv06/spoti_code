import React from "react";

export function UserDetailHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="hidden h-8 w-px bg-gray-100 dark:bg-white/5 md:block" />
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-8 w-44 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-7 w-24 rounded-xl bg-gray-100 dark:bg-white/5" />
            <div className="h-7 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
        <div className="h-12 w-full rounded-2xl bg-gray-200 dark:bg-white/10 lg:w-44" />
      </div>
    </div>
  );
}

export function UserDetailTabsSkeleton() {
  return (
    <div className="mb-8 animate-pulse overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-2 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
      <div className="flex gap-2 overflow-x-auto px-1 py-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-11 w-28 shrink-0 rounded-xl bg-gray-100 dark:bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export function UserOverviewTabSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-12" dir="rtl">
      <div className="space-y-6 lg:col-span-4">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="mx-auto mb-5 h-24 w-24 rounded-[2rem] bg-gray-200 dark:bg-white/10" />
          <div className="mx-auto mb-2 h-6 w-36 rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-white/5">
            <div className="rounded-xl border border-gray-100/50 bg-gray-50/50 p-3 dark:border-white/5 dark:bg-black/10">
              <div className="mx-auto mb-2 h-2.5 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="mx-auto h-4 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
            <div className="rounded-xl border border-gray-100/50 bg-gray-50/50 p-3 dark:border-white/5 dark:bg-black/10">
              <div className="mx-auto mb-2 h-2.5 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="mx-auto h-4 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        </div>

        <div className="space-y-3.5 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-white/5">
            <div className="h-3 w-1.5 rounded-sm bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-gray-100/50 bg-gray-50/40 p-3 dark:border-white/5 dark:bg-black/15"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-gray-100 dark:bg-white/5" />
                <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
              </div>
              <div className="h-3 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-8">
        <div className="space-y-4">
          <div className="h-3 w-36 rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[120px] flex-col justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]"
              >
                <div className="mb-2 h-9 w-9 rounded-xl bg-gray-100 dark:bg-white/5" />
                <div>
                  <div className="mb-1 h-2.5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-white/5">
            <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50/30 p-3.5 dark:bg-black/10"
            >
              <div className="h-3.5 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
                <div className="h-3 w-8 rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-white/5">
            <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
            <div className="h-3 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="rounded-2xl border border-gray-100/50 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-black/15">
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserCoursesTabSkeleton() {
  return (
    <div className="animate-pulse space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
        <div className="h-3 w-56 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="space-y-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 rounded-2xl border border-gray-100/50 bg-gray-50/30 p-4 dark:border-white/5 dark:bg-black/15 md:flex-row md:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 dark:bg-white/5" />
              <div className="min-w-0 space-y-2">
                <div className="h-3.5 w-40 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-2.5 w-52 rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-3 md:w-52">
              <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-white/5" />
              <div className="h-3 w-8 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-4 md:justify-end">
              <div className="h-6 w-14 rounded-md bg-gray-100 dark:bg-white/5" />
              <div className="h-8 w-24 rounded-xl bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserTransactionsTabSkeleton() {
  return (
    <div className="animate-pulse space-y-4" dir="rtl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
          <div className="h-3 w-36 rounded-full bg-gray-200 dark:bg-white/10" />
        </div>
        <div className="flex gap-1 self-start rounded-2xl border border-gray-100 bg-gray-50 p-1 dark:border-white/5 dark:bg-black/35 sm:self-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-7 w-12 rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                {Array.from({ length: 7 }).map((_, index) => (
                  <th key={index} className="pb-3 pr-2">
                    <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {Array.from({ length: 4 }).map((_, row) => (
                <tr key={row}>
                  <td className="py-4 pr-2">
                    <div className="h-3 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                  </td>
                  <td className="py-4">
                    <div className="h-3.5 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
                  </td>
                  <td className="py-4">
                    <div className="h-3 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
                  </td>
                  <td className="py-4">
                    <div className="h-5 w-16 rounded bg-gray-100 dark:bg-white/5" />
                  </td>
                  <td className="py-4">
                    <div className="h-3.5 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
                  </td>
                  <td className="py-4">
                    <div className="h-5 w-12 rounded bg-gray-100 dark:bg-white/5" />
                  </td>
                  <td className="py-4 pl-2 text-left">
                    <div className="ml-auto h-7 w-28 rounded-lg bg-gray-100 dark:bg-white/5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3.5 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-2xl border border-gray-100/50 bg-gray-50/20 p-4 dark:border-white/5 dark:bg-black/15"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                  <div className="h-3.5 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
                </div>
                <div className="h-5 w-12 rounded bg-gray-100 dark:bg-white/5" />
              </div>
              <div className="border-y border-gray-100 py-2 dark:border-white/5">
                <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-7 w-20 rounded-lg bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserTicketsTabSkeleton() {
  return (
    <div className="animate-pulse space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
        <div className="h-3 w-40 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="space-y-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100/50 bg-gray-50/20 p-4 dark:border-white/5 dark:bg-black/15 md:flex-row md:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 dark:bg-white/5" />
              <div className="min-w-0 space-y-2">
                <div className="h-3.5 w-48 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-2.5 w-56 rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 md:justify-end md:border-t-0 md:pt-0 dark:border-white/5">
              <div className="h-6 w-16 rounded bg-gray-100 dark:bg-white/5" />
              <div className="h-6 w-20 rounded bg-gray-100 dark:bg-white/5" />
              <div className="h-8 w-24 rounded-xl bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserActivityTabSkeleton() {
  return (
    <div className="animate-pulse space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
        <div className="h-3 w-44 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="relative mr-3 space-y-8 border-r-2 border-gray-100 py-3 pr-6 dark:border-white/5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative flex flex-col gap-4 md:flex-row md:items-start">
              <div className="absolute -right-[37px] top-0 h-8 w-8 rounded-xl bg-gray-100 dark:bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <div className="h-3.5 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
                  <div className="h-2.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-white/5" />
                <div className="h-3 w-4/5 rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserAdminNotesTabSkeleton() {
  return (
    <div className="animate-pulse space-y-4" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-gray-100 dark:bg-white/5" />
        <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="space-y-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-white/5">
          <div className="h-3 w-40 rounded-full bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-28 rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 h-2.5 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="min-h-[150px] rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-black/20" />
          </div>
          <div className="flex justify-end">
            <div className="h-11 w-32 rounded-xl bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
