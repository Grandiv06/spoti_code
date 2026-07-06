import React from "react";

const ROW_COUNT = 6;

export default function UsersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm animate-pulse dark:border-white/5 dark:bg-[#1c1e26]">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-right text-sm">
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[19%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[13%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-black/10">
              <th className="px-4 py-4 text-right">
                <div className="h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-right">
                <div className="h-3 w-8 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-center">
                <div className="mx-auto h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-center">
                <div className="mx-auto h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-center">
                <div className="mx-auto h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-center">
                <div className="mx-auto h-3 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
              <th className="px-4 py-4 text-center">
                <div className="mx-auto h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {Array.from({ length: ROW_COUNT }).map((_, row) => (
              <tr key={row}>
                <td className="px-4 py-4 align-middle">
                  <div className="h-7 w-[6.5rem] rounded-xl bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center justify-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-gray-100 dark:bg-white/5" />
                    <div className="min-w-0 space-y-2">
                      <div className="h-3.5 w-28 rounded-full bg-gray-200 dark:bg-white/10" />
                      <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <div className="mx-auto h-3.5 w-24 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <div className="mx-auto h-6 w-14 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <div className="mx-auto h-6 w-8 rounded-xl bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <div className="mx-auto h-3.5 w-16 rounded-full bg-gray-100 dark:bg-white/5" />
                </td>
                <td className="px-4 py-4 text-center align-middle">
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
