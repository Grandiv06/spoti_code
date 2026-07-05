"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyCourses, type PanelCourseItem } from "@/lib/panel-my-courses";
import PanelCoursesSkeleton from "./PanelCoursesSkeleton";

export default function PanelCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<PanelCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        setCourses(await fetchMyCourses());
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  if (loading) {
    return <PanelCoursesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          دوره‌های من
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.enrollmentId}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`);
              }
            }}
            className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden mb-4">
              {course.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <span className="material-symbols-outlined text-5xl">image</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              مدرس: {course.instructor}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                <span>پیشرفت</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            
            <Link
              href={`/panel/courses/learn?courseId=${encodeURIComponent(course.id)}`}
              onClick={(event) => event.stopPropagation()}
              className="block w-full mt-6 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-bold hover:bg-primary hover:text-white transition-all cursor-pointer text-center"
            >
              ادامه یادگیری
            </Link>
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center text-gray-500 dark:text-gray-400 font-semibold">
          هنوز دوره‌ای برای نمایش وجود ندارد.
        </div>
      )}
    </div>
  );
}
