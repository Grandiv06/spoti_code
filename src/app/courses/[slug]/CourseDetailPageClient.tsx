"use client";

import { useEffect, useMemo, useState } from "react";
import CoursePurchaseAction from "@/app/components/CoursePurchaseAction";
import CourseFAQ from "../../components/CourseFAQ";
import CourseInstructor from "../../components/CourseInstructor";
import CourseReviews from "../../components/CourseReviews";
import CourseDetailClient from "../[id]/CourseDetailClient";
import CourseDetailSkeleton from "../_components/CourseDetailSkeleton";
import {
  readCourseMediaUrl,
  resolveCourseTeacher,
  resolveTeacherProfileHref,
} from "@/lib/course-teacher";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import type { PublicCourseDetailDto } from "@/server/dto/public-course-detail.dto";
import AdminCoursePreviewBar from "@/app/admin/requests/courses/_components/AdminCoursePreviewBar";

type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";

type AdminPreviewMeta = {
  approvalStatus: ApprovalStatus;
  submittedAt?: string | null;
  instructorName: string;
};

type CourseDetailPageClientProps = {
  slug?: string;
  adminPreviewCourseId?: string;
};

function normalizeApprovalStatus(value: unknown): ApprovalStatus {
  if (value === "approved" || value === "rejected" || value === "draft") return value;
  return "pending";
}

function normalizeChapters(rawChapters: PublicCourseDetailDto["chapters"]) {
  return rawChapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      isLocked: lesson.isLocked,
      isFree: lesson.isFree,
      isFreePreview: lesson.isFreePreview,
      isUnlocked: lesson.isUnlocked,
      videoUrl: lesson.videoUrl,
    })),
  }));
}

export default function CourseDetailPageClient({ slug, adminPreviewCourseId }: CourseDetailPageClientProps) {
  const isAdminPreview = Boolean(adminPreviewCourseId);
  const [courseData, setCourseData] = useState<PublicCourseDetailDto | null>(null);
  const [previewMeta, setPreviewMeta] = useState<AdminPreviewMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setCourseData(null);
      setPreviewMeta(null);

      try {
        if (isAdminPreview && adminPreviewCourseId) {
          const payload = await apiGetNoMock<{
            data?: {
              course?: PublicCourseDetailDto;
              approvalStatus?: unknown;
              submittedAt?: string | null;
              instructorName?: string;
            };
          }>(
            `/api/admin-dashboard/requests/courses/${encodeURIComponent(adminPreviewCourseId)}/preview`,
            getAuthHeaders()
          );

          if (!active) return;

          const preview = payload?.data;
          const course = preview?.course;
          if (course && typeof course === "object") {
            setCourseData(course);
            setPreviewMeta({
              approvalStatus: normalizeApprovalStatus(preview?.approvalStatus),
              submittedAt: preview?.submittedAt ?? null,
              instructorName: preview?.instructorName ?? course.instructorName ?? "",
            });
            return;
          }

          setNotFound(true);
          return;
        }

        if (!slug) {
          setNotFound(true);
          return;
        }

        const encodedSlug = encodeURIComponent(slug);
        const payload = await apiGetNoMock<{ data?: PublicCourseDetailDto }>(
          `/api/courses/public/slug/${encodedSlug}`
        );

        if (!active) return;

        const course = payload?.data;
        if (course && typeof course === "object") {
          setCourseData(course);
          setError(null);
          setNotFound(false);
          return;
        }

        setCourseData(null);
        setNotFound(true);
      } catch (requestError) {
        if (!active) return;
        const message = requestError instanceof Error ? requestError.message : "";
        if (message.includes("404") || message.toLowerCase().includes("not found") || message.includes("پیدا نشد")) {
          setCourseData(null);
          setNotFound(true);
          setError(null);
          return;
        }
        setCourseData(null);
        setNotFound(false);
        setError(message || "خطا در دریافت اطلاعات دوره");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCourse();

    return () => {
      active = false;
    };
  }, [adminPreviewCourseId, isAdminPreview, slug]);

  const chapters = useMemo(
    () => (courseData ? normalizeChapters(courseData.chapters) : undefined),
    [courseData]
  );

  const totalLessonsFromChapters = chapters?.reduce((sum, chapter) => sum + chapter.lessons.length, 0) ?? 0;

  const sidebar = useMemo(() => {
    if (!courseData) return null;

    const coverImage = readCourseMediaUrl(courseData as unknown as Record<string, unknown>, [
      "cover",
      "thumbnail",
      "image",
    ]);
    const instructorName = courseData.instructor?.name ?? courseData.instructorName ?? "";
    const showPriceCard = courseData.isFree || courseData.price > 0;
    const priceLabel = courseData.isFree
      ? "رایگان"
      : courseData.price.toLocaleString("fa-IR");

    return (
      <aside className="lg:col-span-4 relative z-20 order-1 lg:order-2 mb-4 lg:mb-0">
        <div className="sticky top-28 space-y-6">
          {showPriceCard ? (
            <div className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 border border-white/80 dark:border-gray-700 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="relative z-10 text-center">
                <span className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 block">
                  مبلغ نهایی ثبت‌نام
                </span>
                <div className="flex items-center gap-1.5 md:gap-2 justify-center">
                  <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    {priceLabel}
                  </span>
                  {!courseData.isFree ? (
                    <span className="text-base md:text-lg font-bold text-primary">تومان</span>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {courseData.features.length > 0 ? (
            <div className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 border border-white/60 dark:border-gray-700">
              <h4 className="font-black text-gray-900 dark:text-white text-sm md:text-base mb-4 px-2 border-r-4 border-primary rounded-r">
                ویژگی‌های متمایز
              </h4>
              <ul className="space-y-3">
                {courseData.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-xs md:text-sm"
                  >
                    <span className="size-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <span className="material-symbols-outlined text-sm">{feature.icon}</span>
                    </span>
                    {feature.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!isAdminPreview ? (
            <CoursePurchaseAction
              course={{
                id: courseData.id,
                slug: courseData.slug,
                title: courseData.title,
                price: courseData.isFree ? "0" : String(courseData.price),
                image: coverImage ?? courseData.cover ?? courseData.thumbnail ?? "",
                instructor: instructorName,
              }}
            />
          ) : null}
        </div>
      </aside>
    );
  }, [courseData, isAdminPreview]);

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-8 text-center">
          <h1 className="text-2xl font-black text-rose-600 dark:text-rose-300 mb-3">
            خطا در بارگذاری دوره
          </h1>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium">
            دریافت اطلاعات این دوره با خطا روبه‌رو شد.
          </p>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (notFound || !courseData) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">دوره پیدا نشد</h1>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium">
            {isAdminPreview
              ? "دوره‌ای برای پیش‌نمایش ادمین پیدا نشد."
              : (
                <>
                  برای اسلاگ <span className="font-black text-primary">{slug}</span> دوره منتشرشده‌ای پیدا نشد.
                </>
              )}
          </p>
        </div>
      </div>
    );
  }

  const coverImage = readCourseMediaUrl(courseData as unknown as Record<string, unknown>, [
    "cover",
    "thumbnail",
    "image",
  ]);
  const introVideo =
    readCourseMediaUrl(courseData as unknown as Record<string, unknown>, ["introVideo"]) ??
    courseData.introVideo ??
    "";
  const courseTeacher = resolveCourseTeacher(courseData as unknown as Record<string, unknown>);
  const instructorSlug = courseTeacher?.slug ?? courseData.instructorSlug;
  const instructorProfileHref = resolveTeacherProfileHref(courseTeacher, instructorSlug);
  const instructorName = courseTeacher?.fullName ?? courseData.instructor?.name ?? "";
  const instructorTitle = courseTeacher?.displayTitle ?? courseData.instructor?.displayTitle;
  const instructorBio = courseTeacher?.bio ?? courseData.instructor?.bio;
  const instructorAvatar = courseTeacher?.avatar ?? courseData.instructor?.avatar;

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      {isAdminPreview && previewMeta && courseData ? (
        <AdminCoursePreviewBar
          courseId={courseData.id}
          courseTitle={courseData.title}
          instructorName={previewMeta.instructorName}
          approvalStatus={previewMeta.approvalStatus}
          submittedAt={previewMeta.submittedAt}
        />
      ) : null}

      <main className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-10">
        <CourseDetailClient
          hero={{
            title: courseData.heroTitle || courseData.title,
            category: courseData.categoryTitle || courseData.categoryName || courseData.category,
            level: courseData.levelLabel || courseData.level,
            duration: courseData.duration || courseData.time,
            rating: courseData.rating > 0 ? courseData.rating : undefined,
            shortDescription: courseData.shortDescription,
            coverImage: coverImage ?? courseData.cover ?? courseData.thumbnail ?? "",
            introVideo,
            introVideoDuration: courseData.introVideoDuration,
            specialWords: courseData.specialWords,
          }}
          aboutTitle={courseData.aboutTitle}
          aboutDescription={courseData.aboutDescription}
          aboutHighlights={courseData.aboutHighlights}
          totalLessons={totalLessonsFromChapters}
          chapters={chapters}
          coursePurchased={false}
          previewAllLessons={isAdminPreview}
          sidebar={sidebar}
        >
          {courseData.faqs.length > 0 ? <CourseFAQ items={courseData.faqs} /> : null}
          <CourseReviews key={courseData.id} courseId={courseData.id} />
          {instructorName || instructorTitle || instructorBio || instructorAvatar ? (
            <CourseInstructor
              name={instructorName}
              title={instructorTitle}
              bio={instructorBio}
              avatar={instructorAvatar ?? ""}
              profileHref={instructorProfileHref}
            />
          ) : null}
        </CourseDetailClient>
      </main>
    </div>
  );
}
