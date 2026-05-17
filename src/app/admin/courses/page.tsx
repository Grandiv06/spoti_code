"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { 
  Course, 
  initialCoursesData 
} from "./_components/types";

import CoursesHeader from "./_components/CoursesHeader";
import CoursesStats from "./_components/CoursesStats";
import CoursesFilters from "./_components/CoursesFilters";
import CoursesTable from "./_components/CoursesTable";
import CreateCourseWizard from "./_components/CreateCourseWizard";
import EditCourseModal from "./_components/EditCourseModal";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminCoursesPage() {
  const router = useRouter();

  // Central Courses State with localStorage persistence
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("spoticode_admin_courses");
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        setCourses(initialCoursesData);
      }
    } else {
      setCourses(initialCoursesData);
      localStorage.setItem("spoticode_admin_courses", JSON.stringify(initialCoursesData));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("spoticode_admin_courses", JSON.stringify(courses));
    }
  }, [courses, isLoaded]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Modals States
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [selectedEditCourse, setSelectedEditCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toast System State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== "" || statusFilter !== "all" || categoryFilter !== "all";
  }, [searchQuery, statusFilter, categoryFilter]);

  // Clear Filters Handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    showToast("فیلترها با موفقیت پاک شدند.", "info");
  };

  // Filter and Sort Logic
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // 4. Sorting
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
      // default or 'newest'
      const idA = parseInt(a.id.replace("CRS-", "")) || 0;
      const idB = parseInt(b.id.replace("CRS-", "")) || 0;
      return idB - idA; // higher ID is newer
    });

    return result;
  }, [courses, searchQuery, statusFilter, categoryFilter, sortBy]);



  // Operations
  const handleShowDetails = (course: Course) => {
    router.push(`/admin/courses/${course.id}`);
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
      // Completely remove or we can change status to "غیرفعال"
      // Let's completely remove it from this list
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      showToast(`دوره «${course.title}» با موفقیت حذف گردید.`, "success");
    }
  };

  const handleAddCourse = (newCourse: Course) => {
    // Check if ID already exists
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
      
      {/* Redesigned Premium Header Component */}
      <CoursesHeader onCreateCourseClick={() => setIsCreateWizardOpen(true)} />

      {/* Redesigned KPIs Component */}
      <CoursesStats courses={courses} />

      {/* Search and Filters Section */}
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

      {/* Main Table (takes full width) */}
      <div className="w-full">
        <CoursesTable
          courses={filteredAndSortedCourses}
          onShowDetails={handleShowDetails}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
          onShowStats={handleShowStats}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Stepper Modal: Create Course */}
      <CreateCourseWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onAdd={handleAddCourse}
      />

      {/* Modal: Edit Course Details */}
      <EditCourseModal
        course={selectedEditCourse}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCourse}
      />

      {/* Custom Toast Notifications Overlay */}
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
