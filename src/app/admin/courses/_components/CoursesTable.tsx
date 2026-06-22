import React from "react";
import { Course } from "./types";
import CourseStatusBadge from "./CourseStatusBadge";
import {
  Eye,
  Edit2,
  BarChart3,
  Trash2,
  GraduationCap,
  User,
  Calendar,
} from "lucide-react";

interface CoursesTableProps {
  courses: Course[];
  onShowDetails: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
  onShowStats?: (course: Course) => void;
  onClearFilters?: () => void;
}

export default function CoursesTable({
  courses,
  onShowDetails,
  onEditCourse,
  onDeleteCourse,
  onShowStats,
  onClearFilters,
}: CoursesTableProps) {
  const formatRevenue = (value: number) => {
    return `${value.toLocaleString("fa-IR")} تومان`;
  };

  if (courses.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-12 text-center animate-in fade-in duration-300">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black/20 flex items-center justify-center text-gray-400 dark:text-gray-600 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">هنوز دوره‌ای ایجاد نشده است</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
          دوره جدیدی تعریف نکرده‌اید یا فیلترهای جستجو هیچ نتیجه‌ای را شامل نمی‌شوند. لطفاً معیارهای جستجو را تغییر دهید یا دوره جدیدی ثبت کنید.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-5 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-black/20 dark:hover:bg-black/35 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-2xl transition-all"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto w-full rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
        <table className="w-full min-w-[900px] text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] text-gray-400 dark:text-gray-500 font-black select-none bg-gray-50/50 dark:bg-black/10">
              <th className="py-4.5 px-6">کد دوره</th>
              <th className="py-4.5 px-4">عنوان دوره</th>
              <th className="py-4.5 px-4">مدرس</th>
              <th className="py-4.5 px-4">دسته‌بندی</th>
              <th className="py-4.5 px-4 text-center">تعداد دانشجو</th>
              <th className="py-4.5 px-4">درآمد کل</th>
              <th className="py-4.5 px-4">وضعیت</th>
              <th className="py-4.5 px-4">آخرین بروزرسانی</th>
              <th className="py-4.5 px-6 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="group hover:bg-gray-50/40 dark:hover:bg-black/10 transition-colors duration-250 text-xs text-gray-800 dark:text-gray-200"
              >
                <td className="py-4 px-6 font-black text-gray-900 dark:text-white">{course.id}</td>
                <td className="py-4 px-4 font-black">
                  <div className="max-w-[200px] truncate" title={course.title}>
                    {course.title}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400 font-semibold">{course.instructor}</td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 font-black text-[10px] text-gray-600 dark:text-gray-400">
                    {course.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-bold">{course.students.toLocaleString("fa-IR")}</td>
                <td className="py-4 px-4 font-black text-emerald-600 dark:text-emerald-400">{formatRevenue(course.revenue)}</td>
                <td className="py-4 px-4"><CourseStatusBadge status={course.status} /></td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-500 font-bold select-none">{course.updatedAt}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onShowDetails(course)}
                      className="p-2 bg-gray-50 hover:bg-primary/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary rounded-xl transition-all hover:scale-105"
                      title="نمایش جزئیات"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditCourse(course)}
                      className="p-2 bg-gray-50 hover:bg-amber-500/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-all hover:scale-105"
                      title="ویرایش دوره"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {onShowStats && (
                      <button
                        onClick={() => onShowStats(course)}
                        className="p-2 bg-gray-50 hover:bg-indigo-500/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-xl transition-all hover:scale-105"
                        title="آمار دوره"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteCourse(course)}
                      className="p-2 bg-gray-50 hover:bg-rose-500/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition-all hover:scale-105"
                      title="حذف دوره"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-5 flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-2.5 h-full ${
                course.status === "منتشر شده"
                  ? "bg-emerald-500"
                  : course.status === "پیش‌نویس"
                    ? "bg-amber-500"
                    : course.status === "در انتظار بررسی"
                      ? "bg-blue-500"
                      : "bg-rose-500"
              }`}
            />

            <div className="pr-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500">{course.id}</span>
                <CourseStatusBadge status={course.status} />
              </div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-relaxed">{course.title}</h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <User className="w-3.5 h-3.5" />
                <span className="font-semibold">{course.instructor}</span>
                <span className="text-gray-300 dark:text-gray-700 select-none">•</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 font-black text-[9px]">
                  {course.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 bg-gray-50/50 dark:bg-black/15 p-3 rounded-2xl text-center select-none">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block">دانشجو</span>
                <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{course.students.toLocaleString("fa-IR")}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block">درآمد کل</span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {(course.revenue / 1000000).toFixed(0)} م
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3.5 mt-1 select-none">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                <Calendar className="w-3.5 h-3.5 text-gray-300" />
                <span>بروزرسانی: {course.updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onShowDetails(course)}
                  className="p-1.5 bg-gray-50 hover:bg-primary/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary rounded-xl transition-all"
                  title="نمایش جزئیات"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditCourse(course)}
                  className="p-1.5 bg-gray-50 hover:bg-amber-500/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-all"
                  title="ویرایش دوره"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCourse(course)}
                  className="p-1.5 bg-gray-50 hover:bg-rose-500/10 dark:bg-black/20 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition-all"
                  title="حذف دوره"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
