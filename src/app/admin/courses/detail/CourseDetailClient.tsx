"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import CourseDetailView from "../[courseId]/CourseDetailView";

export default function AdminCourseDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id")?.trim() || "";

  if (!courseId) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center dark:border-white/5 dark:bg-[#1c1e26]" dir="rtl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-base font-black text-gray-900 dark:text-white">شناسه دوره مشخص نیست</h3>
        <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">برای مشاهده جزئیات، از لیست دوره‌ها اقدام کنید.</p>
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white"
        >
          بازگشت به لیست دوره‌ها
        </button>
      </div>
    );
  }

  return <CourseDetailView courseId={courseId} />;
}
