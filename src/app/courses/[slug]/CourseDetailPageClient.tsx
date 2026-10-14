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
import CoursePriceDisplay from "@/app/components/CoursePriceDisplay";

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    if (!loading && courseData) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [loading, courseData]);

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
    const payablePrice = courseData.displayPrice ?? courseData.price;
    const hasDisplayDiscount =
      !courseData.isFree &&
      courseData.discountPercent != null &&
      courseData.discountPercent > 0 &&
      payablePrice < courseData.price;
    const priceLabel = courseData.isFree
      ? "رایگان"
      : payablePrice.toLocaleString("fa-IR");

    const purchaseCourse = {
      id: courseData.id,
      slug: courseData.slug,
      title: courseData.title,
      price: courseData.isFree ? "0" : String(payablePrice),
      image: coverImage ?? courseData.cover ?? courseData.thumbnail ?? "",
      instructor: instructorName,
    };

    const priceBlock = showPriceCard ? (
      <div className="relative z-10 text-center">
        <span className="text-[11px] md:text-sm font-bold text-gray-500 dark:text-gray-400 mb-1.5 md:mb-2 block">
          مبلغ نهایی ثبت‌نام
        </span>
        {courseData.isFree ? (
          <div className="flex items-center gap-1.5 md:gap-2 justify-center">
            <span className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              {priceLabel}
            </span>
          </div>
        ) : hasDisplayDiscount ? (
          <div className="flex flex-col items-center gap-2">
            <CoursePriceDisplay
              price={payablePrice}
              originalPrice={courseData.price}
              discountPercent={courseData.discountPercent}
            />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-2 justify-center">
            <span className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              {priceLabel}
            </span>
            <span className="text-sm md:text-lg font-bold text-primary">تومان</span>
          </div>
        )}
      </div>
    ) : null;

    return (
      <aside className="lg:col-span-4 relative z-20 order-1 lg:order-2 mb-1 lg:mb-0 min-w-0">
        <div className="lg:sticky lg:top-28 space-y-3 sm:space-y-4 lg:space-y-6">
          {showPriceCard ? (
            <div className="glass-panel rounded-[1.5rem] md:rounded-4xl p-5 sm:p-6 md:p-8 border border-gray-200/80 dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.02)] relative overflow-hidden group bg-white/95 dark:bg-white/[0.03]">
              <div className="absolute -top-12 -right-12 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              {priceBlock}
            </div>
          ) : null}

          {courseData.features.length > 0 ? (
            <div className="glass-panel rounded-[1.5rem] md:rounded-4xl p-5 sm:p-6 md:p-8 border border-gray-200/80 dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.02)] bg-white/95 dark:bg-white/[0.03]">
              <h4 className="font-black text-gray-900 dark:text-white text-sm md:text-base mb-3.5 sm:mb-4 pr-3 border-r-4 border-primary rounded-r flex items-center gap-2">
                ویژگی‌های متمایز
              </h4>
              <ul className="space-y-3 sm:space-y-3.5">
                {courseData.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold text-xs md:text-sm"
                  >
                    <span className="size-8 sm:size-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-xs flex items-center justify-center shrink-0 border border-emerald-200/70 dark:border-emerald-800/40">
                      <span className="material-symbols-outlined text-base">{feature.icon}</span>
                    </span>
                    <span className="leading-6">{feature.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!isAdminPreview ? (
            <div className="hidden lg:block">
              <CoursePurchaseAction course={purchaseCourse} />
            </div>
          ) : null}
        </div>

        {!isAdminPreview ? (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
            <div className="mx-auto flex max-w-[1440px] items-center gap-3">
              {showPriceCard ? (
                <div className="min-w-0 shrink-0 text-right">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">مبلغ ثبت‌نام</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {courseData.isFree ? "رایگان" : `${priceLabel} تومان`}
                  </p>
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <CoursePurchaseAction course={purchaseCourse} />
              </div>
            </div>
          </div>
        ) : null}
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
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/[0.04] dark:bg-primary/[0.07] rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-[400px] h-[400px] bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] rounded-full blur-[120px] -z-10" />

      {isAdminPreview && previewMeta && courseData ? (
        <AdminCoursePreviewBar
          courseId={courseData.id}
          courseTitle={courseData.title}
          instructorName={previewMeta.instructorName}
          approvalStatus={previewMeta.approvalStatus}
          submittedAt={previewMeta.submittedAt}
        />
      ) : null}

      <main className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-12 py-6 sm:py-8 md:py-12 relative z-10 pb-32 lg:pb-12">
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
