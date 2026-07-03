"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

type ProfileCourse = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  image?: string;
};

export default function ProjectsTabs() {
  const [activeTab, setActiveTab] = useState<"courses">("courses");
  const [courses, setCourses] = useState<ProfileCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const result = await apiGetNoMock<{ data?: unknown }>(
          "/api/dashboard/my-courses",
          getAuthHeaders()
        );

        const rawList = Array.isArray(result?.data)
          ? result.data
          : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
            ? ((result?.data as { items?: unknown[] }).items as unknown[])
            : [];

        const mapped = rawList.map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          const course =
            typeof row.course === "object" && row.course
              ? (row.course as Record<string, unknown>)
              : row;
          const teacher =
            typeof course.teacher === "object" && course.teacher
              ? (course.teacher as Record<string, unknown>)
              : null;
          const progressRaw = Number(row.progressPercent ?? row.progress ?? 0);

          return {
            id: String(course.id ?? row.courseId ?? index + 1),
            title: String(course.title ?? course.name ?? "دوره بدون عنوان"),
            instructor: String(teacher?.fullName ?? teacher?.name ?? "نامشخص"),
            progress: Number.isFinite(progressRaw)
              ? Math.max(0, Math.min(100, progressRaw))
              : 0,
            image:
              typeof course.thumbnail === "string"
                ? course.thumbnail
                : typeof course.cover === "string"
                  ? course.cover
                  : undefined,
          };
        });

        setCourses(mapped);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  return (
    <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm min-h-[500px]">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab("courses")}
          className={cn(
            "pb-4 -mb-[17px] px-2 font-bold text-lg transition-colors border-b-2",
            activeTab === "courses"
              ? "text-green-500 border-green-500 cursor-pointer"
              : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          )}
        >
          دوره‌های شرکت شده
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto py-1 hide-scrollbar">
        {["همه دوره‌ها", "دوره‌های خریداری شده"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-gray-800"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14161c] p-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
          هنوز در دوره‌ای ثبت‌نام نکرده‌اید.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative bg-white dark:bg-[#14161c] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 relative">
                {course.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <span className="text-4xl opacity-20">🖼️</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium mb-1 block">
                      مدرس: {course.instructor}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-green-500 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                    <span>پیشرفت</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <Link
                    href={`/courses/${encodeURIComponent(course.id)}`}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    جزئیات دوره
                  </Link>
                  <Link
                    href={`/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`}
                    className="flex items-center gap-1.5 text-xs text-green-500 hover:text-green-600 transition-colors mr-auto"
                  >
                    ادامه یادگیری
                  </Link>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
