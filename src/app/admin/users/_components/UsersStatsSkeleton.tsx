import React from "react";

export default function UsersStatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 animate-pulse sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]"
        >
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-[11px] w-20 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-9 w-9 rounded-2xl bg-gray-200 dark:bg-white/10" />
            </div>
            <div>
              <div className="mb-1 h-7 w-14 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-[10px] w-24 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
