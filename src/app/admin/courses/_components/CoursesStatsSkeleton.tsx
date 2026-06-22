import React from "react";

const ROW_COUNT = 6;

export default function CoursesStatsSkeleton() {
  return (
    <div className="mb-8 grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26] ${
            index === 4 ? "shadow-lg" : "shadow-md"
          }`}
        >
          <div className="relative z-10 mb-3 flex items-center justify-between">
            <div className="h-[11px] w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="relative z-10">
            <div
              className={`mb-1 rounded-full bg-gray-200 dark:bg-white/10 ${
                index === 4 ? "h-5 w-28" : "h-7 w-12"
              }`}
            />
            <div className="h-[10px] w-24 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
