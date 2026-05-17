import React from "react";

interface CourseStatusBadgeProps {
  status: "منتشر شده" | "پیش‌نویس" | "در انتظار بررسی" | "غیرفعال";
}

export default function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  let classes = "";
  
  switch (status) {
    case "منتشر شده":
      classes = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
      break;
    case "پیش‌نویس":
      classes = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      break;
    case "در انتظار بررسی":
      classes = "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";
      break;
    case "غیرفعال":
      classes = "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400";
      break;
    default:
      classes = "bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border tracking-wider ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 animate-pulse" />
      {status}
    </span>
  );
}
