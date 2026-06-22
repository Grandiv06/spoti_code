import React from "react";

const ROW_COUNT = 5;

export default function CoursesTableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="hidden w-full overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-md dark:border-white/5 dark:bg-[#1c1e26] lg:block">
        <table className="w-full min-w-[900px] border-collapse text-right">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-black/10">
              {Array.from({ length: 9 }).map((_, index) => (
                <th key={index} className="px-4 py-4 first:px-6 last:px-6">
                  <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-white/10" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {Array.from({ length: ROW_COUNT }).map((_, row) => (
              <tr key={row}>
                <td className="px-6 py-4">
                  <div className="h-3.5 w-24 rounded-full bg-gray-200 dark:bg-white/10" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-3.5 w-36 rounded-full bg-gray-200 dark:bg-white/10" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-3.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-16 rounded-lg bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="mx-auto h-3.5 w-8 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-3.5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-3.5 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-8 w-8 rounded-xl bg-gray-100 dark:bg-white/5" />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md dark:border-white/5 dark:bg-[#1c1e26]"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="h-2.5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-6 w-14 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
            <div className="mb-3 h-4 w-3/4 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="mb-4 h-3 w-1/2 rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="mb-4 grid grid-cols-2 gap-2.5 rounded-2xl bg-gray-50/50 p-3 dark:bg-black/15">
              {Array.from({ length: 2 }).map((__, statIndex) => (
                <div key={statIndex} className="space-y-1 text-center">
                  <div className="mx-auto h-2 w-10 rounded-full bg-gray-100 dark:bg-white/5" />
                  <div className="mx-auto h-3 w-8 rounded-full bg-gray-200 dark:bg-white/10" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 dark:border-white/5">
              <div className="h-2.5 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((__, actionIndex) => (
                  <div key={actionIndex} className="h-7 w-7 rounded-xl bg-gray-100 dark:bg-white/5" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
