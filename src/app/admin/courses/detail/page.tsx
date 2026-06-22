"use client";

import { Suspense } from "react";
import AdminCourseDetailPage from "./CourseDetailClient";

function CourseDetailFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" dir="rtl">
      <span className="animate-pulse text-sm font-bold text-gray-500">در حال بارگذاری جزئیات دوره...</span>
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={<CourseDetailFallback />}>
      <AdminCourseDetailPage />
    </Suspense>
  );
}
