"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import CourseCurriculum, { type Chapter, type Lesson } from "@/app/components/CourseCurriculum";
import CourseHero from "../../components/CourseHero";

type SelectedPreviewVideo = {
  lessonId: string;
  title: string;
  duration: string;
  videoUrl: string;
};

type CourseDetailClientProps = {
  hero: {
    title: string;
    category: string;
    level: string;
    duration: string;
    rating: number;
    shortDescription: string;
    coverImage: string;
    introVideo: string;
    specialWords: {
      highlighted?: string[];
      underlined?: string[];
      color?: string;
    };
  };
  aboutDescription?: string;
  totalLessons: number;
  chapters?: Chapter[];
  coursePurchased?: boolean;
  children?: ReactNode;
  sidebar?: ReactNode;
};

const DEFAULT_ABOUT_PARAGRAPHS = [
  "این دوره حاصل تجربه‌ی سال‌ها کار بر روی پروژه‌های بزرگ مقیاس است. هدف ما صرفاً آموزش سینتکس نیست، بلکه انتقال طرز تفکر مهندسی است.",
  "در طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید. از بهینه‌سازی پرفورمنس گرفته تا مدیریت state‌های پیچیده با Redux Toolkit و پیاده‌سازی Authentication امن در Next.js. این یک دوره تئوری نیست؛ یک شبیه‌ساز محیط کار است.",
];

export default function CourseDetailClient({
  hero,
  aboutDescription,
  totalLessons,
  chapters,
  coursePurchased = false,
  children,
  sidebar,
}: CourseDetailClientProps) {
  const [selectedPreviewVideo, setSelectedPreviewVideo] = useState<SelectedPreviewVideo | null>(null);
  const [playerTick, setPlayerTick] = useState(0);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!lockedNotice) return;
    const timeoutId = window.setTimeout(() => setLockedNotice(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [lockedNotice]);

  const aboutParagraphs = useMemo(() => {
    if (!aboutDescription?.trim()) return DEFAULT_ABOUT_PARAGRAPHS;
    const normalized = aboutDescription
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
    return normalized.length ? normalized : DEFAULT_ABOUT_PARAGRAPHS;
  }, [aboutDescription]);

  const handleLessonSelect = (lesson: Lesson) => {
    const canPlay =
      coursePurchased ||
      lesson.isUnlocked === true ||
      lesson.isFreePreview === true ||
      lesson.isFree === true ||
      (typeof lesson.isLocked === "boolean" ? !lesson.isLocked : false);

    if (!canPlay) {
      setLockedNotice("برای مشاهده این جلسه باید دوره را تهیه کنید");
      return;
    }

    if (!lesson.videoUrl?.trim()) {
      setLockedNotice("ویدیوی این جلسه هنوز برای پیش‌نمایش در دسترس نیست");
      return;
    }

    setSelectedPreviewVideo({
      lessonId: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
    });
    setPlayerTick((prev) => prev + 1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetPreview = () => {
    setSelectedPreviewVideo(null);
    setPlayerTick((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <CourseHero
        title={hero.title}
        category={hero.category}
        level={hero.level}
        duration={hero.duration}
        rating={hero.rating}
        shortDescription={hero.shortDescription}
        coverImage={hero.coverImage}
        introVideo={selectedPreviewVideo?.videoUrl || hero.introVideo}
        specialWords={hero.specialWords}
        isPreviewActive={Boolean(selectedPreviewVideo)}
        activeVideoTitle={selectedPreviewVideo?.title}
        activeVideoDuration={selectedPreviewVideo?.duration}
        onResetPreview={handleResetPreview}
        playTrigger={playerTick}
        disableFallbackVideo={Boolean(selectedPreviewVideo)}
        missingVideoMessage={
          selectedPreviewVideo
            ? "ویدیوی این جلسه در حال حاضر قابل پخش نیست."
            : "ویدیوی معرفی دوره هنوز در دسترس نیست."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
          <section className="glass-panel rounded-[2rem] md:rounded-4xl p-6 md:p-8 lg:p-12 glass-card-hover">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 dark:border-gray-700 shrink-0">
                <span className="material-symbols-outlined filled text-xl md:text-2xl">
                  description
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                درباره این دوره
              </h2>
            </div>
            <div className="prose prose-base md:prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-8 md:leading-9 font-medium text-justify md:text-right">
              {aboutParagraphs.map((paragraph, index) => (
                <p key={paragraph.slice(0, 40) + index} className={index === 0 ? "mb-4" : ""}>
                  {index === 0 ? (
                    <>
                      {paragraph.replace(
                        "طرز تفکر مهندسی",
                        ""
                      )}
                      <span className="text-primary font-bold bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-md inline-block my-1 md:my-0">
                        طرز تفکر مهندسی
                      </span>
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </section>

          {lockedNotice && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-700 dark:text-amber-300 text-sm font-bold">
              {lockedNotice}
            </div>
          )}

          <CourseCurriculum
            totalLessons={totalLessons}
            chapters={chapters}
            activeLessonId={selectedPreviewVideo?.lessonId || null}
            coursePurchased={coursePurchased}
            onLessonSelect={handleLessonSelect}
            onLockedLessonClick={() => setLockedNotice("برای مشاهده این جلسه باید دوره را تهیه کنید")}
          />

          {children}
        </div>

        {sidebar}
      </div>
    </>
  );
}
