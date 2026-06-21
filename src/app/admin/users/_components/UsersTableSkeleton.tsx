import React from "react";

const ROW_COUNT = 6;

export default function UsersTableSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
              <th className="py-4 px-6 w-24">
                <div className="h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6">
                <div className="h-3 w-8 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6">
                <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6">
                <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6 text-center w-24">
                <div className="mx-auto h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6">
                <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6 w-32">
                <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="py-4 px-6 text-center w-48">
                <div className="mx-auto h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {Array.from({ length: ROW_COUNT }).map((_, row) => (
              <tr key={row}>
                <td className="py-4 px-6">
                  <div className="h-6 w-16 rounded-xl bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-gray-100 dark:bg-white/5" />
                    <div className="min-w-0 space-y-2">
                      <div className="h-3.5 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
                      <div className="h-2.5 w-36 rounded-full bg-gray-100 dark:bg-white/5" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-3.5 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="py-4 px-6">
                  <div className="h-6 w-14 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="mx-auto h-6 w-8 rounded-xl bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="py-4 px-6">
                  <div className="h-3.5 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
                </td>
                <td className="py-4 px-6">
                  <div className="h-3.5 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-7 w-[4.75rem] rounded-xl bg-gray-100 dark:bg-white/5" />
                    <div className="h-7 w-[4.75rem] rounded-xl bg-gray-100 dark:bg-white/5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
