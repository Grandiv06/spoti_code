"use client";

import { useEffect, useState } from "react";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
  isFree?: boolean;
  isFreePreview?: boolean;
  isUnlocked?: boolean;
  videoUrl?: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "1",
    number: "۰۱",
    title: "مبانی و مفاهیم پایه‌ای",
    subtitle: "شروع قدرتمند با جاوااسکریپت مدرن",
    lessons: [
      { id: "1-1", title: "آشنایی با اکوسیستم React", duration: "۱۲:۲۰", isLocked: false },
      { id: "1-2", title: "نصب و راه‌اندازی پروژه", duration: "۱۸:۴۵", isLocked: false },
      { id: "1-3", title: "Component و JSX", duration: "۲۵:۱۰", isLocked: false },
    ],
  },
  {
    id: "2",
    number: "۰۲",
    title: "عمیق شدن در Hooks",
    subtitle: "مدیریت حرفه‌ای وضعیت",
    lessons: [
      { id: "2-1", title: "مفهوم Closure و useState", duration: "۱۵:۰۰", isLocked: false },
      { id: "2-2", title: "هوک useEffect و چرخه حیات", duration: "۲۲:۳۰", isLocked: false },
      { id: "2-3", title: "هوک‌های سفارشی (Custom Hooks)", duration: "۱۹:۱۵", isLocked: true },
    ],
  },
  {
    id: "3",
    number: "۰۳",
    title: "معماری Next.js 14",
    subtitle: "رندرینگ سمت سرور و کلاینت",
    lessons: [
      { id: "3-1", title: "معرفی App Router", duration: "۱۴:۰۰", isLocked: false },
      { id: "3-2", title: "Server Components vs Client", duration: "۲۰:۳۰", isLocked: false },
      { id: "3-3", title: "مسیریابی و Layouts", duration: "۱۷:۴۵", isLocked: true },
    ],
  },
  {
    id: "4",
    number: "۰۴",
    title: "API Routes و Data Fetching",
    subtitle: "ارتباط با سرور و دیتابیس",
    lessons: [
      { id: "4-1", title: "Route Handlers", duration: "۱۶:۲۰", isLocked: false },
      { id: "4-2", title: "Server Actions", duration: "۲۳:۱۰", isLocked: true },
    ],
  },
];

interface CourseCurriculumProps {
  totalLessons?: number;
  chapters?: Chapter[];
  activeLessonId?: string | null;
  coursePurchased?: boolean;
  onLessonSelect?: (lesson: Lesson, chapter: Chapter) => void;
  onLockedLessonClick?: () => void;
}

const isLessonPlayable = (lesson: Lesson, coursePurchased: boolean) =>
  coursePurchased ||
  lesson.isUnlocked === true ||
  lesson.isFreePreview === true ||
  lesson.isFree === true ||
  (typeof lesson.isLocked === "boolean" ? !lesson.isLocked : false);

export default function CourseCurriculum({
  totalLessons = 120,
  chapters = MOCK_CHAPTERS,
  activeLessonId = null,
  coursePurchased = false,
  onLessonSelect,
  onLockedLessonClick,
}: CourseCurriculumProps) {
  const [isCurriculumVisible, setIsCurriculumVisible] = useState(true);
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeLessonId) return;
    const activeChapter = chapters.find((chapter) =>
      chapter.lessons.some((lesson) => lesson.id === activeLessonId)
    );
    if (activeChapter) {
      setIsCurriculumVisible(true);
      setOpenChapterId(activeChapter.id);
    }
  }, [activeLessonId, chapters]);

  const toggleChapter = (id: string) => {
    setOpenChapterId((prev) => (prev === id ? null : id));
  };

  const collapseAll = () => setIsCurriculumVisible(false);
  const showCurriculum = () => setIsCurriculumVisible(true);

  if (!isCurriculumVisible) {
    return (
      <section className="space-y-6">
        <button
          type="button"
          onClick={showCurriculum}
          className="glass-panel group flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-[2rem] border border-gray-200/80 px-5 py-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-gray-50/60 dark:border-white/[0.06] dark:shadow-none dark:hover:bg-white/[0.02] md:rounded-4xl md:px-8 md:py-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm transition-transform group-hover:scale-105 dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
              <span className="material-symbols-outlined filled text-xl md:text-2xl">toc</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">سرفصل‌های آموزشی</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {chapters.length} فصل • {totalLessons} جلسه
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-2xl text-gray-400 transition-transform group-hover:translate-y-0.5 dark:text-gray-500 md:text-3xl">
            expand_more
          </span>
        </button>
      </section>
    );
  }

  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:shadow-none md:rounded-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <h2 className="flex items-center gap-3 text-xl font-black text-gray-900 dark:text-white md:text-2xl">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
            <span className="material-symbols-outlined filled text-xl md:text-2xl">toc</span>
          </div>
          سرفصل‌های آموزشی
        </h2>
        <div className="flex flex-row-reverse items-center gap-3">
          <button
            type="button"
            onClick={collapseAll}
            className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary px-4 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            بستن
          </button>
          <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-300">
            {chapters.length} فصل
          </span>
          <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-300">
            {totalLessons} جلسه
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 md:p-6">
        {chapters.map((chapter) => {
          const isOpen = openChapterId === chapter.id;
          return (
            <div
              key={chapter.id}
              className={`group overflow-hidden rounded-2xl border transition-all duration-300 md:rounded-3xl ${
                isOpen
                  ? "border-gray-200/80 bg-gray-50/80 dark:border-white/[0.06] dark:bg-white/[0.03]"
                  : "border-gray-200/60 bg-white hover:border-gray-200/80 hover:bg-gray-50/60 dark:border-white/[0.04] dark:bg-white/[0.02] dark:hover:border-white/[0.06] dark:hover:bg-white/[0.04]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-4 md:p-6 lg:p-8 text-right cursor-pointer gap-2 md:gap-4 lg:gap-6"
              >
                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 w-[calc(100%-48px)]">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg font-black transition-all md:size-12 md:rounded-2xl md:text-xl lg:size-14 lg:rounded-3xl lg:text-2xl ${
                      isOpen
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:group-hover:bg-white/15"
                    }`}
                  >
                    {chapter.number}
                  </span>
                  <div className="min-w-0 pr-1">
                    <h3
                      className={`font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-0.5 md:mb-1 transition-colors truncate ${
                        isOpen ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white group-hover:text-primary-dark"
                      }`}
                    >
                      {chapter.title}
                    </h3>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium truncate block">
                      {chapter.subtitle}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all md:size-10 ${
                    isOpen
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-white/15"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg md:text-xl lg:text-2xl transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-200/80 bg-white/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02] md:p-6 lg:p-8">
                  <ul className="mr-3 space-y-4 border-r-2 border-gray-200 pr-6 dark:border-white/10">
                    {chapter.lessons.map((lesson) => {
                      const playable = isLessonPlayable(lesson, coursePurchased);
                      const isActive = activeLessonId === lesson.id;

                      return (
                        <li
                          key={lesson.id}
                          className={`flex items-center justify-between group/li transition-all rounded-2xl px-3 py-2 ${
                            isActive ? "bg-primary/10 dark:bg-primary/15 ring-1 ring-primary/30" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (!playable) {
                                onLockedLessonClick?.();
                                return;
                              }
                              onLessonSelect?.(lesson, chapter);
                            }}
                            className={`flex items-center gap-3 transition-colors text-right ${
                              playable
                                ? "text-gray-700 dark:text-gray-300 group-hover/li:text-gray-900 dark:group-hover/li:text-white cursor-pointer"
                                : "text-gray-500 dark:text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!playable}
                          >
                            {playable ? (
                              <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
                            ) : (
                              <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-xl">lock</span>
                            )}
                            <span className="font-bold text-sm">{lesson.title}</span>
                          </button>

                          <span
                            className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                              playable
                                ? "bg-primary/10 dark:bg-white/10 text-primary"
                                : "bg-gray-200/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500"
                            }`}
                          >
                            {playable ? lesson.duration : "قفل"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
