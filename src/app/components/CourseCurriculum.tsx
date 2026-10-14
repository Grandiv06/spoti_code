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
          className="glass-panel group flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-4xl border border-gray-200/80 dark:border-white/[0.06] px-5 py-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-emerald-300/80 bg-white/95 dark:bg-white/[0.03] md:px-8 md:py-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-10 sm:size-11 md:size-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border border-emerald-200/70 bg-emerald-50 text-primary shadow-xs transition-transform group-hover:scale-105 dark:border-emerald-800/40 dark:bg-emerald-950/40">
              <span className="material-symbols-outlined filled text-xl md:text-2xl">toc</span>
            </div>
            <div className="text-right">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white">سرفصل‌های آموزشی</h2>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
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

  const anyOpen = openChapterId !== null;

  const toggleAll = () => {
    if (anyOpen) {
      setOpenChapterId(null);
    } else if (chapters.length > 0) {
      setOpenChapterId(chapters[0].id);
    }
  };

  return (
    <section className="glass-panel overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] bg-white/95 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 px-4 py-4 dark:border-white/[0.06] sm:px-5 sm:py-5 md:px-8 md:py-6">
        <h2 className="flex min-w-0 items-center gap-2.5 text-lg font-black text-gray-900 dark:text-white sm:gap-3 sm:text-xl md:text-2xl">
          <div className="flex size-10 sm:size-11 md:size-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border border-emerald-200/70 bg-emerald-50 text-primary shadow-xs dark:border-emerald-800/40 dark:bg-emerald-950/40">
            <span className="material-symbols-outlined filled text-xl md:text-2xl">toc</span>
          </div>
          سرفصل‌های آموزشی
        </h2>
        <div className="flex flex-row-reverse flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {anyOpen ? "بستن همه" : "باز کردن"}
          </button>
          <span className="rounded-xl sm:rounded-2xl bg-emerald-50/90 border border-emerald-200/70 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs md:text-sm font-black text-emerald-800 shadow-xs dark:bg-white/5 dark:border-transparent dark:text-gray-300">
            {chapters.length} فصل
          </span>
          <span className="rounded-xl sm:rounded-2xl bg-emerald-50/90 border border-emerald-200/70 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs md:text-sm font-black text-emerald-800 shadow-xs dark:bg-white/5 dark:border-transparent dark:text-gray-300">
            {totalLessons} جلسه
          </span>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4 p-4 md:p-6">
        {chapters.map((chapter) => {
          const isOpen = openChapterId === chapter.id;
          return (
            <div
              key={chapter.id}
              className={`group overflow-hidden rounded-2xl border transition-all duration-300 md:rounded-3xl shadow-xs ${
                isOpen
                  ? "border-emerald-300/90 bg-emerald-50/20 dark:border-emerald-700/50 dark:bg-emerald-950/15"
                  : "border-gray-200/80 bg-white hover:border-emerald-300/80 hover:bg-emerald-50/15 dark:border-white/[0.04] dark:bg-white/[0.02] dark:hover:border-white/[0.08] dark:hover:bg-white/[0.04]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-4 md:p-6 lg:p-7 text-right cursor-pointer gap-2 md:gap-4 lg:gap-6"
              >
                <div className="flex items-center gap-3 md:gap-4 lg:gap-5 w-[calc(100%-48px)]">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-black transition-all md:size-12 md:rounded-2xl md:text-lg lg:size-13 lg:rounded-2xl ${
                      isOpen
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/70 group-hover:bg-emerald-100 dark:bg-white/10 dark:text-gray-200 dark:border-transparent dark:group-hover:bg-white/15"
                    }`}
                  >
                    {chapter.number}
                  </span>
                  <div className="min-w-0 pr-1">
                    <h3
                      className={`font-black text-sm sm:text-base md:text-lg mb-0.5 md:mb-1 transition-colors truncate ${
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
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all md:size-9 ${
                    isOpen
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-white/15"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg md:text-xl transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-gray-200/80 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-black/20 sm:p-4 md:p-6">
                    <ul className="mr-1 space-y-2 border-r-2 border-primary/30 pr-3 dark:border-primary/20 sm:mr-2 sm:space-y-3 sm:pr-5">
                      {chapter.lessons.map((lesson) => {
                        const playable = isLessonPlayable(lesson, coursePurchased);
                        const isActive = activeLessonId === lesson.id;

                        return (
                          <li
                            key={lesson.id}
                            className={`flex items-center justify-between gap-2 group/li transition-all rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 ${
                              isActive
                                ? "bg-primary/15 dark:bg-primary/20 ring-1 ring-primary/40"
                                : "hover:bg-white dark:hover:bg-white/[0.04]"
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
                              className={`flex min-w-0 flex-1 items-center gap-2 sm:gap-3 transition-colors text-right ${
                                playable
                                  ? "text-gray-800 dark:text-gray-200 group-hover/li:text-primary dark:group-hover/li:text-white cursor-pointer"
                                  : "text-gray-500 dark:text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={!playable}
                            >
                              {playable ? (
                                <span className="material-symbols-outlined text-primary text-xl shrink-0">play_circle</span>
                              ) : (
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-xl shrink-0">lock</span>
                              )}
                              <span className="font-bold text-[13px] sm:text-sm leading-6 line-clamp-2">{lesson.title}</span>
                            </button>

                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                                playable
                                  ? "bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                  : "bg-gray-200/80 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500"
                              }`}
                            >
                              {playable ? lesson.duration : "قفل"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
