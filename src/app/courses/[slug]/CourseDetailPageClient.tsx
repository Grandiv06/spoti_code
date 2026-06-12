"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddToCartButton from "../../components/AddToCartButton";
import CourseFAQ from "../../components/CourseFAQ";
import CourseReviews from "../../components/CourseReviews";
import CourseDetailClient from "../[id]/CourseDetailClient";
import {
  findPublicInstructorByName,
  getPublicInstructorById,
  getPublicInstructorBySlug,
} from "@/lib/public-instructors";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "https://spoticode.vercel.app";

type CourseRecord = Record<string, unknown>;

const normalizeChapters = (rawChapters: unknown) => {
  if (!Array.isArray(rawChapters)) return undefined;
  return rawChapters.map((chapter, chapterIndex) => {
    const chapterRecord = chapter as CourseRecord;
    const lessons = Array.isArray(chapterRecord.lessons) ? chapterRecord.lessons : [];
    return {
      id: String(chapterRecord.id ?? `chapter-${chapterIndex + 1}`),
      number: String(chapterIndex + 1).padStart(2, "0"),
      title: typeof chapterRecord.title === "string" ? chapterRecord.title : "",
      subtitle: typeof chapterRecord.subtitle === "string" ? chapterRecord.subtitle : "",
      lessons: lessons.map((lesson, lessonIndex) => {
        const lessonRecord = lesson as CourseRecord;
        return {
          id: String(lessonRecord.id ?? `lesson-${chapterIndex + 1}-${lessonIndex + 1}`),
          title: typeof lessonRecord.title === "string" ? lessonRecord.title : "",
          duration: typeof lessonRecord.duration === "string" ? lessonRecord.duration : "",
          isLocked: typeof lessonRecord.isLocked === "boolean" ? lessonRecord.isLocked : undefined,
          isFree: typeof lessonRecord.isFree === "boolean" ? lessonRecord.isFree : undefined,
          isFreePreview: typeof lessonRecord.isFreePreview === "boolean" ? lessonRecord.isFreePreview : undefined,
          isUnlocked: typeof lessonRecord.isUnlocked === "boolean" ? lessonRecord.isUnlocked : undefined,
          videoUrl: typeof lessonRecord.videoUrl === "string" ? lessonRecord.videoUrl : undefined,
        };
      }),
    };
  });
};

export default function CourseDetailPageClient({ slug }: { slug: string }) {
  const [courseData, setCourseData] = useState<CourseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCourse = async () => {
      const encodedSlug = encodeURIComponent(slug);
      setLoading(true);
      setError(null);
      setNotFound(false);
      setCourseData(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/public/slug/${encodedSlug}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!active) return;

        if (response.status === 404) {
          setCourseData(null);
          setError(null);
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const payload = (await response.json()) as unknown;
        const coursePayload =
          payload && typeof payload === "object"
            ? ((payload as { data?: unknown }).data ?? payload)
            : null;

        if (!active) return;
        if (coursePayload && typeof coursePayload === "object") {
          setCourseData(coursePayload as CourseRecord);
          setError(null);
          setNotFound(false);
          return;
        }

        setCourseData(null);
        setError(null);
        setNotFound(true);
      } catch (fetchError) {
        if (!active) return;
        setCourseData(null);
        setNotFound(false);
        setError(fetchError instanceof Error ? fetchError.message : "خطا در دریافت اطلاعات دوره");
      }
    };

    loadCourse()
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const data = courseData ?? {};
  const title = typeof data.title === "string" ? data.title : typeof data.name === "string" ? data.name : undefined;
  const category = typeof data.categoryTitle === "string" ? data.categoryTitle : typeof data.categoryName === "string" ? data.categoryName : typeof data.category === "string" ? data.category : undefined;
  const level = typeof data.difficulty === "string" ? data.difficulty : typeof data.level === "string" ? data.level : undefined;
  const duration = typeof data.time === "string" ? data.time : typeof data.duration === "string" ? data.duration : typeof data.hours === "string" ? data.hours : undefined;
  const rating = typeof data.rating === "string" || typeof data.rating === "number" ? Number(data.rating) : undefined;
  const shortDescription = typeof data.about === "string" ? data.about : typeof data.shortDescription === "string" ? data.shortDescription : typeof data.description === "string" ? data.description : undefined;
  const coverImage = typeof data.cover === "string" ? data.cover : typeof data.thumbnail === "string" ? data.thumbnail : typeof data.thumbnailFile === "string" ? data.thumbnailFile : undefined;
  const introVideo = typeof data.introVideo === "string" ? data.introVideo : undefined;
  const chapters = normalizeChapters(data.chapters);
  const priceNumber = typeof data.price === "string" || typeof data.price === "number" ? Number(data.price) : undefined;
  const displayPrice = typeof priceNumber === "number" && Number.isFinite(priceNumber) ? priceNumber.toLocaleString("fa-IR") : undefined;
  const basePrice = typeof priceNumber === "number" && Number.isFinite(priceNumber) ? Math.round(priceNumber * 1.33) : undefined;
  const basePriceDisplay = typeof basePrice === "number" ? basePrice.toLocaleString("fa-IR") : undefined;
  const discountPercent = typeof basePrice === "number" && typeof priceNumber === "number" && basePrice > 0 ? Math.round(((basePrice - priceNumber) / basePrice) * 100) : undefined;

  const instructorProfile =
    getPublicInstructorBySlug(typeof data.instructorSlug === "string" ? data.instructorSlug : "") ??
    getPublicInstructorById(typeof data.instructorId === "string" ? data.instructorId : "") ??
    findPublicInstructorByName(
      typeof data.instructorName === "string" ? data.instructorName : typeof data.teacher === "string" ? data.teacher : ""
    );

  const instructorName =
    instructorProfile?.fullName ??
    (typeof data.instructorName === "string" ? data.instructorName : typeof data.teacher === "string" ? data.teacher : undefined);
  const instructorTitle = instructorProfile?.displayTitle;
  const instructorBio = instructorProfile?.shortBio;
  const instructorAvatar = instructorProfile?.avatar;
  const specialWord = typeof data.specialWord === "string" ? data.specialWord : undefined;
  const teacherName = typeof data.teacher === "string" ? data.teacher : undefined;
  const studentsCount =
    typeof data.studentsCount === "number"
      ? data.studentsCount
      : typeof data.students === "number"
        ? data.students
        : undefined;
  const totalLessonsFromChapters = chapters?.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const mediaPreview = typeof data.thumbnailFile === "string" ? data.thumbnailFile : coverImage;
  const heroSpecialWord = specialWord ?? (typeof data.specialWords === "string" ? data.specialWords : undefined);

  const sidebar = useMemo(
    () => (
      <aside className="lg:col-span-4 relative z-20 order-1 lg:order-2 mb-4 lg:mb-0">
        <div className="sticky top-28 space-y-6">
          {priceNumber !== undefined ? (
            <div className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 border border-white/80 dark:border-gray-700 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="relative z-10 text-center">
                {basePriceDisplay ? (
                  <div className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 line-through decoration-red-500 decoration-2 mb-1.5 md:mb-2">
                    {basePriceDisplay} تومان
                  </div>
                ) : null}
                {displayPrice ? (
                  <div className="flex items-center gap-1.5 md:gap-2 justify-center">
                    <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                      {displayPrice}
                    </span>
                    <span className="text-base md:text-lg font-bold text-primary">تومان</span>
                  </div>
                ) : null}
                {typeof discountPercent === "number" ? (
                  <span className="mt-3 md:mt-4 inline-flex bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full">
                    {discountPercent.toLocaleString("fa-IR")}٪ تخفیف محدود
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    ),
    [basePriceDisplay, displayPrice, discountPercent, priceNumber]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden">
        <main className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-10">
          <section className="glass-panel rounded-[2rem] md:rounded-4xl p-2 mb-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="rounded-[1.75rem] md:rounded-4xl overflow-hidden bg-[#1f2726] dark:bg-[#1f2726] p-4 md:p-5">
              <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] min-h-[420px] md:min-h-[560px] bg-[linear-gradient(180deg,rgba(120,145,144,0.78),rgba(35,43,42,0.92))] border border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_15%_85%,rgba(34,197,94,0.08),transparent_18%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[78%] h-[72%] rounded-[1.75rem] md:rounded-[2rem] bg-[#0e1315]/90 border border-black/30 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_25%)]" />
                    <div className="absolute inset-0 px-6 py-5 md:px-8 md:py-6">
                      <div className="h-3 w-20 rounded-full bg-white/10 mb-4" />
                      <div className="h-2 w-full rounded-full bg-white/5 mb-2" />
                      <div className="h-[72%] rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(17,24,39,0.95),rgba(2,6,23,0.98))] border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-y-4 left-4 w-[18%] rounded-2xl bg-white/[0.03]" />
                        <div className="absolute inset-x-[28%] top-[18%] h-2 w-[34%] rounded-full bg-emerald-500/70" />
                        <div className="absolute inset-x-[28%] top-[30%] h-2 w-[42%] rounded-full bg-cyan-400/60" />
                        <div className="absolute inset-x-[28%] top-[42%] h-2 w-[30%] rounded-full bg-amber-400/60" />
                        <div className="absolute inset-x-[28%] top-[54%] h-2 w-[36%] rounded-full bg-sky-400/60" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.07),transparent_25%)]" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute z-10 size-24 md:size-28 rounded-full bg-white/95 backdrop-blur-sm border border-white/40 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] flex items-center justify-center">
                    <div className="size-0 border-y-[14px] md:border-y-[16px] border-y-transparent border-l-[20px] md:border-l-[22px] border-l-primary ml-1" />
                  </div>
                </div>

                <div className="absolute inset-x-4 md:inset-x-6 bottom-4 md:bottom-6">
                  <div className="rounded-[1.5rem] md:rounded-[1.75rem] bg-black/38 backdrop-blur-md border border-white/8 px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="h-10 md:h-11 min-w-20 px-4 rounded-2xl bg-white/20 text-white flex items-center justify-center text-sm md:text-base font-bold">
                        05:34
                      </div>
                      <div className="hidden sm:block h-9 w-px bg-white/10" />
                      <div className="space-y-1 min-w-0">
                        <div className="h-4 w-28 rounded-full bg-white/20" />
                        <div className="h-5 w-40 md:w-56 rounded-full bg-white/25" />
                      </div>
                    </div>
                    <div className="hidden sm:block h-10 w-24 rounded-[1.1rem] bg-white/10 border border-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
              <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gray-200/70 dark:bg-gray-700/70 shrink-0" />
                  <div className="h-8 w-40 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
                <div className="space-y-4">
                  <div className="h-5 w-full rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                  <div className="h-5 w-11/12 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                  <div className="h-5 w-10/12 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
              </section>

              <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gray-200/70 dark:bg-gray-700/70 shrink-0" />
                  <div className="h-8 w-44 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-4 md:p-5 space-y-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]"
                    >
                      <div className="h-3 w-20 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20" />
                      <div className="h-5 w-full rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gray-200/70 dark:bg-gray-700/70 shrink-0" />
                  <div className="h-8 w-40 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
                <div className="space-y-4">
                  <div className="h-14 rounded-3xl bg-gray-200/70 dark:bg-gray-700/70" />
                  <div className="h-14 rounded-3xl bg-gray-200/70 dark:bg-gray-700/70" />
                  <div className="h-14 rounded-3xl bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
              </section>

              <section className="rounded-4xl overflow-hidden bg-white dark:bg-[#1c1e26]/90 border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark">
                <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                    <div className="h-8 w-44 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-24 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                    <div className="h-10 w-24 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-4 md:p-6 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="h-5 w-2/5 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                        <div className="h-10 w-10 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                      </div>
                      <div className="h-4 w-full rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gray-200/70 dark:bg-gray-700/70 shrink-0" />
                  <div className="h-8 w-40 rounded-2xl bg-gray-200/70 dark:bg-gray-700/70" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-[2rem] border border-gray-200/70 dark:border-white/10 p-5 md:p-6 lg:p-8 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-gray-200/70 dark:bg-gray-700/70 shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 w-40 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                          <div className="h-4 w-24 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                        </div>
                      </div>
                      <div className="h-4 w-full rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                      <div className="h-4 w-4/5 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4 relative z-20 order-1 lg:order-2 mb-4 lg:mb-0">
              <div className="sticky top-28 space-y-6">
                <div className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 border border-white/80 dark:border-gray-700 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden">
                  <div className="space-y-3 text-center">
                    <div className="h-4 w-24 mx-auto rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                    <div className="h-14 w-40 mx-auto rounded-3xl bg-gray-200/70 dark:bg-gray-700/70" />
                    <div className="h-6 w-28 mx-auto rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
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
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !courseData) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            دوره پیدا نشد
          </h1>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium">
            برای اسلاگ <span className="font-black text-primary">{slug}</span> دوره‌ای در API پیدا نشد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <main className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-10">
        <CourseDetailClient
          hero={{
            title: title ?? "",
            category: category ?? "",
            level: level ?? "",
            duration: duration ?? "",
            rating: rating ?? 0,
            shortDescription: shortDescription ?? "",
            coverImage: mediaPreview ?? "",
            introVideo: introVideo ?? "",
            specialWords: {
              underlined: heroSpecialWord ? [heroSpecialWord] : undefined,
              color: "green",
            },
          }}
          aboutDescription={typeof data.aboutDescription === "string" ? data.aboutDescription : undefined}
          totalLessons={totalLessonsFromChapters ?? 0}
          chapters={chapters}
          coursePurchased={Boolean(data.isPurchased ?? data.userHasPurchased ?? data.enrolled ?? false)}
          sidebar={sidebar}
        >
          {data.faqs || data.faq ? <CourseFAQ /> : null}
          {title && priceNumber !== undefined && mediaPreview ? (
            <AddToCartButton
              course={{
                id: String(data.id ?? slug),
                title,
                price: String(priceNumber),
                image: mediaPreview,
                instructor: instructorName ?? "",
              }}
            />
          ) : null}
          {typeof data.id === "string" ? <CourseReviews courseId={String(data.id)} /> : null}
          {instructorName ? (
            <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover mt-2 md:mt-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 text-center md:text-right">
                {instructorAvatar ? (
                  <Image
                    src={instructorAvatar}
                    alt={instructorName}
                    width={160}
                    height={160}
                    className="size-32 md:size-40 rounded-[2rem] md:rounded-[2.5rem] object-cover"
                  />
                ) : null}
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-1 md:mb-2">
                    {instructorName}
                  </h3>
                  {instructorTitle ? (
                    <span className="text-sm md:text-base text-primary font-bold block mb-3 md:mb-4">
                      {instructorTitle}
                    </span>
                  ) : null}
                  {!instructorTitle && teacherName ? (
                    <span className="text-sm md:text-base text-primary font-bold block mb-3 md:mb-4">
                      {teacherName}
                    </span>
                  ) : null}
                  {instructorBio ? (
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6 text-justify md:text-right">
                      {instructorBio}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
          {Array.isArray(data.students) || studentsCount ? (
            <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover mt-2 md:mt-4">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                دانشجویانی که در این دوره شرکت کردند
              </h2>
            </section>
          ) : null}
        </CourseDetailClient>
      </main>
    </div>
  );
}
