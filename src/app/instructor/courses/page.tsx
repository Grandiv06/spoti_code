"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  PlusCircle,
  Search,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import CourseStatusModal, {
  type CourseStatusModalVariant,
} from "@/app/instructor/courses/_components/CourseStatusModal";
import InstructorCourseCard from "@/app/instructor/courses/_components/InstructorCourseCard";
import {
  InstructorCoursesFiltersSkeleton,
  InstructorCoursesGridSkeleton,
  InstructorCoursesHeaderSkeleton,
} from "@/app/instructor/courses/_components/InstructorCoursesSkeleton";
import {
  extractInstructorCourses,
  levelToDifficultyLabel,
  normalizeInstructorCoursesProfile,
  type InstructorCourseRow,
} from "@/app/instructor/courses/_lib/instructor-courses-data";
import { apiGetNoMock } from "@/lib/api";

type StatusModalState = {
  open: boolean;
  variant: CourseStatusModalVariant;
  draftStep?: number;
  courseId?: string;
  onConfirm?: () => void;
};

export default function InstructorCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<InstructorCourseRow[]>([]);
  const [instructorName, setInstructorName] = useState("");
  const [instructorAvatar, setInstructorAvatar] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusModal, setStatusModal] = useState<StatusModalState>({
    open: false,
    variant: "pending",
  });

  const isLoading = coursesLoading || profileLoading;

  const openStatusModal = (input: Omit<StatusModalState, "open">) => {
    setStatusModal({ ...input, open: true });
  };

  const closeStatusModal = () => {
    setStatusModal((prev) => ({ ...prev, open: false, onConfirm: undefined }));
  };

  useEffect(() => {
    let cancelled = false;

    apiGetNoMock<unknown>("/api/instructor-dashboard/my-courses")
      .then((res) => {
        if (cancelled) return;
        setCourses(extractInstructorCourses(res));
      })
      .catch(() => {
        if (cancelled) return;
        setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setCoursesLoading(false);
      });

    apiGetNoMock<unknown>("/api/instructor-dashboard/profile")
      .then((res) => {
        if (cancelled) return;
        const payload =
          typeof res === "object" && res !== null && "data" in res
            ? (res as { data?: unknown }).data
            : res;
        const profile = normalizeInstructorCoursesProfile(payload);
        setInstructorName(profile.name);
        setInstructorAvatar(profile.avatar);
      })
      .catch(() => {
        if (cancelled) return;
        setInstructorName("");
        setInstructorAvatar("");
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "best_selling") {
        return b.revenue - a.revenue;
      }
      if (sortBy === "most_students") {
        return b.studentsCount - a.studentsCount;
      }
      if (sortBy === "highest_rated") {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime();
    });

    return result;
  }, [courses, search, statusFilter, categoryFilter, sortBy]);

  const isPublishedLike = (status: string) => status === "published" || status === "approved";

  const handleUnavailableView = (course: InstructorCourseRow) => {
    if (course.status === "pending") {
      openStatusModal({ variant: "pending" });
      return;
    }
    if (course.status === "draft") {
      openStatusModal({
        variant: "draft",
        draftStep: course.draftStep,
        courseId: course.id,
        onConfirm: () => {
          router.push(`/instructor/courses/create?draftCourseId=${course.id}&step=${course.draftStep}`);
        },
      });
      return;
    }
    openStatusModal({ variant: "unavailable" });
  };

  const handleManageCourse = (course: InstructorCourseRow) => {
    if (isPublishedLike(course.status)) {
      router.push(`/instructor/courses/${encodeURIComponent(course.id)}`);
      return;
    }
    if (course.status === "pending") {
      openStatusModal({ variant: "pending" });
      return;
    }
    if (course.status === "draft") {
      router.push(`/instructor/courses/create?draftCourseId=${course.id}&step=${course.draftStep}`);
      return;
    }
    openStatusModal({ variant: "not_manageable" });
  };

  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== "all" || categoryFilter !== "all";

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500" dir="rtl">
        <InstructorCoursesHeaderSkeleton />
        <InstructorCoursesFiltersSkeleton />
        <InstructorCoursesGridSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center md:text-right">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">مدیریت دوره‌های آموزشی</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                شما در حال حاضر {courses.length.toLocaleString("fa-IR")} دوره آموزشی طراحی کرده‌اید.
              </p>
            </div>
          </div>

          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ایجاد دوره جدید</span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-3xl p-6 mb-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان دوره یا کلمات کلیدی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:border-primary focus:outline-none appearance-none cursor-pointer text-right"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              <option value="Frontend">Frontend (فرانت‌اند)</option>
              <option value="Backend">Backend (بک‌اند)</option>
              <option value="DevOps">DevOps (دواپس)</option>
              <option value="Mobile">Mobile (موبایل)</option>
              <option value="UI/UX">UI/UX (طراحی رابط کاربری)</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:border-primary focus:outline-none appearance-none cursor-pointer text-right"
            >
              <option value="newest">جدیدترین‌ها</option>
              <option value="best_selling">پرفروش‌ترین‌ها</option>
              <option value="most_students">بیشترین دانشجو</option>
              <option value="highest_rated">بیشترین امتیاز</option>
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-4">
          <span className="text-xs text-gray-400 font-bold ml-3">وضعیت انتشار:</span>
          {[
            { id: "all", label: "همه" },
            { id: "published", label: "منتشر شده" },
            { id: "pending", label: "در انتظار بررسی" },
            { id: "draft", label: "پیش‌نویس" },
            { id: "inactive", label: "غیرفعال" },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
            {courses.length === 0
              ? "هنوز دوره‌ای ایجاد نکرده‌اید!"
              : "دوره‌ای با این فیلترها پیدا نشد"}
          </h3>
          <p className="text-xs text-gray-400 font-bold mb-6 max-w-sm leading-relaxed">
            {courses.length === 0
              ? "همین حالا اولین دوره خود را تعریف کنید."
              : hasActiveFilters
                ? "فیلترها یا عبارت جستجو را تغییر دهید."
                : "دوره‌ای با این وضعیت انتشار وجود ندارد."}
          </p>
          {courses.length === 0 ? (
            <Link
              href="/instructor/courses/create"
              className="flex items-center gap-1.5 px-6 py-3.5 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ایجاد اولین دوره</span>
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <InstructorCourseCard
              key={c.id}
              course={c}
              instructorName={instructorName}
              instructorAvatar={instructorAvatar || undefined}
              difficulty={levelToDifficultyLabel(c.level)}
              viewHref={`/courses/${c.slug || c.id}`}
              disableViewNavigation={!isPublishedLike(c.status)}
              onViewClick={(e) => {
                if (isPublishedLike(c.status)) return;
                e.preventDefault();
                handleUnavailableView(c);
              }}
              onManage={() => handleManageCourse(c)}
            />
          ))}
        </div>
      )}

      <CourseStatusModal
        open={statusModal.open}
        variant={statusModal.variant}
        draftStep={statusModal.draftStep}
        onClose={closeStatusModal}
        onConfirm={statusModal.onConfirm}
      />
    </div>
  );
}
