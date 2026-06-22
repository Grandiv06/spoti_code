import React from "react";

const ROW_COUNT = 6;

export function AdminOrdersStatsSkeleton() {
  return (
    <div className="mb-8 grid animate-pulse grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex min-h-[124px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]"
        >
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-[11px] w-20 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-9 w-9 rounded-2xl bg-gray-200 dark:bg-white/10" />
            </div>
            <div>
              <div
                className={`mb-1 rounded-full bg-gray-200 dark:bg-white/10 ${
                  index === 3 ? "h-5 w-28" : "h-7 w-14"
                }`}
              />
              <div className="h-[10px] w-24 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminOrdersTableSkeleton() {
  return (
    <div className="animate-pulse overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-md dark:border-white/5 dark:bg-[#1c1e26] md:p-6">
      <table className="w-full min-w-[880px] border-collapse text-[12px] font-bold">
        <thead>
          <tr className="border-b border-gray-100 text-right dark:border-white/5">
            {["w-20", "w-16", "w-20", "w-16", "w-16", "w-14", "w-12"].map((width, index) => (
              <th key={index} className="px-3 py-3">
                <div className={`h-3 rounded-full bg-gray-200 dark:bg-white/10 ${width}`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
          {Array.from({ length: ROW_COUNT }).map((_, row) => (
            <tr key={row}>
              <td className="px-3 py-3">
                <div className="h-3.5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </td>
              <td className="px-3 py-3">
                <div className="h-3.5 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
              </td>
              <td className="px-3 py-3">
                <div className="h-3.5 w-32 rounded-full bg-gray-100 dark:bg-white/5" />
              </td>
              <td className="px-3 py-3">
                <div className="h-3.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
              </td>
              <td className="px-3 py-3">
                <div className="h-3.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
              </td>
              <td className="px-3 py-3">
                <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
              </td>
              <td className="px-3 py-3">
                <div className="h-7 w-14 rounded-lg bg-gray-100 dark:bg-white/5" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
