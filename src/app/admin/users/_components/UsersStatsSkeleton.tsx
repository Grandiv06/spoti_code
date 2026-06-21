import React from "react";

const statCardClasses = [
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-2 md:col-span-3 xl:col-span-1",
];

export default function UsersStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 animate-pulse">
      {statCardClasses.map((colClass, index) => (
        <div
          key={index}
          className={`${colClass} bg-white dark:bg-[#1c1e26] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden relative flex flex-col justify-between`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="h-[11px] w-20 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-9 w-9 rounded-2xl bg-gray-200 dark:bg-white/10" />
            </div>
            <div>
              <div
                className={`rounded-full bg-gray-200 dark:bg-white/10 mb-1 ${
                  index === 5 ? "h-5 w-28" : "h-7 w-14"
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
