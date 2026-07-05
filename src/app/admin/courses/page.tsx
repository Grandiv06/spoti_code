"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Course } from "./_components/types";
import { cacheAdminCourseDetail, buildMockCourseDetail } from "./_components/course-detail-mock";

import CoursesHeader from "./_components/CoursesHeader";
import CoursesStats from "./_components/CoursesStats";
import CoursesStatsSkeleton from "./_components/CoursesStatsSkeleton";
import CoursesFilters from "./_components/CoursesFilters";
import CoursesTable from "./_components/CoursesTable";
import CoursesTableSkeleton from "./_components/CoursesTableSkeleton";
import CreateCourseWizard from "./_components/CreateCourseWizard";
import EditCourseModal from "./_components/EditCourseModal";
import { useAdminCoursesQuery } from "@/hooks/api/useAdminCoursesQuery";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

function CoursesErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black">بارگذاری لیست دوره‌ها انجام نشد.</p>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          <CheckCircle2 className="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminCoursesQuery();

  useEffect(() => {
    if (data) {
      setCourses(data);
    }
  }, [data]);

  const isLoadingCourses = isPending || isFetching;
  const showCoursesContent = !isError || courses.length > 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [selectedEditCourse, setSelectedEditCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== "" || statusFilter !== "all" || categoryFilter !== "all";
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    showToast("فیلترها با موفقیت پاک شدند.", "info");
  };

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "highest_students") {
        return b.students - a.students;
      }
      if (sortBy === "highest_revenue") {
        return b.revenue - a.revenue;
      }
      if (sortBy === "highest_completion") {
        return b.completion - a.completion;
      }
      const idA = parseInt(a.id.replace("CRS-", "")) || 0;
      const idB = parseInt(b.id.replace("CRS-", "")) || 0;
      return idB - idA;
    });

    return result;
  }, [courses, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleShowDetails = (course: Course) => {
    cacheAdminCourseDetail(buildMockCourseDetail(course));
    router.push(`/admin/courses/detail?id=${encodeURIComponent(course.id)}`);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedEditCourse(course);
    setIsEditModalOpen(true);
  };

  const handleSaveCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    setIsEditModalOpen(false);
    showToast(`مشخصات دوره «${updatedCourse.title}» با موفقیت ویرایش شد.`, "success");
  };

  const handleDeleteCourse = (course: Course) => {
    if (confirm(`آیا از غیرفعال‌سازی یا حذف دوره «${course.title}» اطمینان دارید؟`)) {
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      showToast(`دوره «${course.title}» با موفقیت حذف گردید.`, "success");
    }
  };

  const handleAddCourse = (newCourse: Course) => {
    if (courses.some((c) => c.id === newCourse.id)) {
      showToast(`خطا: شناسه دوره «${newCourse.id}» قبلاً ثبت شده است.`, "error");
      return;
    }

    setCourses((prev) => [newCourse, ...prev]);
    setIsCreateWizardOpen(false);
    showToast(`دوره جدید «${newCourse.title}» با موفقیت ایجاد شد.`, "success");
  };

  const handleShowStats = (course: Course) => {
    showToast(`آمار جامع دوره «${course.title}» بزودی در داشبورد گزارشات قرار خواهد گرفت.`, "info");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <CoursesHeader onCreateCourseClick={() => setIsCreateWizardOpen(true)} />

      {isError ? (
        <div className="mb-8">
          <CoursesErrorState
            message={error?.message || "لطفاً اتصال شبکه و سطح دسترسی کاربر را بررسی کنید."}
            onRetry={() => void refetch()}
          />
        </div>
      ) : null}

      {isLoadingCourses ? (
        <CoursesStatsSkeleton />
      ) : showCoursesContent ? (
        <CoursesStats courses={courses} />
      ) : null}

      <CoursesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={handleClearFilters}
        isFiltersExpanded={isFiltersExpanded}
        setIsFiltersExpanded={setIsFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="w-full">
        {isLoadingCourses ? (
          <CoursesTableSkeleton />
        ) : showCoursesContent ? (
          <CoursesTable
            courses={filteredAndSortedCourses}
            onShowDetails={handleShowDetails}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onShowStats={handleShowStats}
            onClearFilters={handleClearFilters}
          />
        ) : null}
      </div>

      <CreateCourseWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onAdd={handleAddCourse}
      />

      <EditCourseModal
        course={selectedEditCourse}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCourse}
      />

      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full" dir="rtl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-left duration-300 ${
              t.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : t.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
