import React from "react";

const statCardClasses = [
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-2 md:col-span-2 xl:col-span-1",
];

export default function UsersStatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2 animate-pulse xl:grid-cols-4">
      {statCardClasses.map((colClass, index) => (
        <div
          key={index}
          className={`${colClass} relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1c1e26]`}
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
