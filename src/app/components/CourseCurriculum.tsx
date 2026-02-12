"use client";

import { useState } from "react";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
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
      {
        id: "1-1",
        title: "آشنایی با اکوسیستم React",
        duration: "۱۲:۲۰",
        isLocked: false,
      },
      {
        id: "1-2",
        title: "نصب و راه‌اندازی پروژه",
        duration: "۱۸:۴۵",
        isLocked: false,
      },
      {
        id: "1-3",
        title: "Component و JSX",
        duration: "۲۵:۱۰",
        isLocked: false,
      },
    ],
  },
  {
    id: "2",
    number: "۰۲",
    title: "عمیق شدن در Hooks",
    subtitle: "مدیریت حرفه‌ای وضعیت",
    lessons: [
      {
        id: "2-1",
        title: "مفهوم Closure و useState",
        duration: "۱۵:۰۰",
        isLocked: false,
      },
      {
        id: "2-2",
        title: "هوک useEffect و چرخه حیات",
        duration: "۲۲:۳۰",
        isLocked: false,
      },
      {
        id: "2-3",
        title: "هوک‌های سفارشی (Custom Hooks)",
        duration: "۱۹:۱۵",
        isLocked: true,
      },
    ],
  },
  {
    id: "3",
    number: "۰۳",
    title: "معماری Next.js 14",
    subtitle: "رندرینگ سمت سرور و کلاینت",
    lessons: [
      {
        id: "3-1",
        title: "معرفی App Router",
        duration: "۱۴:۰۰",
        isLocked: false,
      },
      {
        id: "3-2",
        title: "Server Components vs Client",
        duration: "۲۰:۳۰",
        isLocked: false,
      },
      {
        id: "3-3",
        title: "مسیریابی و Layouts",
        duration: "۱۷:۴۵",
        isLocked: true,
      },
    ],
  },
  {
    id: "4",
    number: "۰۴",
    title: "API Routes و Data Fetching",
    subtitle: "ارتباط با سرور و دیتابیس",
    lessons: [
      {
        id: "4-1",
        title: "Route Handlers",
        duration: "۱۶:۲۰",
        isLocked: false,
      },
      { id: "4-2", title: "Server Actions", duration: "۲۳:۱۰", isLocked: true },
    ],
  },
];

interface CourseCurriculumProps {
  totalLessons?: number;
  chapters?: Chapter[];
}

export default function CourseCurriculum({
  totalLessons = 120,
  chapters = MOCK_CHAPTERS,
}: CourseCurriculumProps) {
  const [isCurriculumVisible, setIsCurriculumVisible] = useState(true);
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);

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
          className="w-full glass-panel rounded-4xl px-8 py-8 flex items-center justify-between gap-4 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center size-14 rounded-3xl bg-primary/20 dark:bg-primary/30 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined filled text-3xl">
                toc
              </span>
            </span>
            <div className="text-right">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                سرفصل‌های آموزشی
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {chapters.length} فصل • {totalLessons} جلسه
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl group-hover:translate-x-1 transition-transform">
            expand_more
          </span>
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-4xl px-8 py-6 flex flex-wrap items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined filled text-primary">
            toc
          </span>
          سرفصل‌های آموزشی
        </h2>
        <div className="flex flex-row-reverse items-center gap-3">
          <button
            type="button"
            onClick={collapseAll}
            className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary px-4 py-2 rounded-2xl bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            بستن همه
          </button>
          <span className="text-sm font-bold text-primary bg-white/50 dark:bg-white/10 px-4 py-2 rounded-2xl shadow-sm">
            {totalLessons} جلسه
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {chapters.map((chapter) => {
          const isOpen = openChapterId === chapter.id;
          return (
            <div
              key={chapter.id}
              className={`glass-panel rounded-4xl overflow-hidden transition-all duration-300 group ${
                isOpen
                  ? "bg-white/40 dark:bg-white/5 border border-white/80 dark:border-gray-700 shadow-lg"
                  : "hover:bg-white/40 dark:hover:bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-right"
              >
                <div className="flex items-center gap-6">
                  <span
                    className={`flex items-center justify-center size-14 rounded-3xl text-2xl font-black transition-all ${
                      isOpen
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                        : "bg-white dark:bg-gray-800 shadow-md text-primary group-hover:text-primary-dark group-hover:scale-110"
                    }`}
                  >
                    {chapter.number}
                  </span>
                  <div>
                    <h3
                      className={`font-bold text-xl mb-1 transition-colors ${
                        isOpen
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-900 dark:text-white group-hover:text-primary-dark"
                      }`}
                    >
                      {chapter.title}
                    </h3>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {chapter.subtitle}
                    </span>
                  </div>
                </div>
                <div
                  className={`size-10 rounded-full flex items-center justify-center transition-all ${
                    isOpen
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                      : "bg-white/50 dark:bg-white/10 group-hover:bg-primary group-hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="p-6 md:p-8 bg-white/20 dark:bg-white/5 backdrop-blur-sm border-t border-white/50 dark:border-gray-700">
                  <ul className="space-y-4 border-r-2 border-primary/30 pr-6 mr-3">
                    {chapter.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className={`flex items-center justify-between group/li ${
                          lesson.isLocked ? "" : "cursor-pointer"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-3 transition-colors ${
                            lesson.isLocked
                              ? "text-gray-500 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-300 group-hover/li:text-gray-900 dark:group-hover/li:text-white"
                          }`}
                        >
                          {lesson.isLocked ? (
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-xl">
                              lock
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-primary text-xl">
                              play_circle
                            </span>
                          )}
                          <span className="font-bold text-sm">
                            {lesson.title}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            lesson.isLocked
                              ? "bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500"
                              : "bg-white/50 dark:bg-white/10 text-primary"
                          }`}
                        >
                          {lesson.isLocked ? "قفل" : lesson.duration}
                        </span>
                      </li>
                    ))}
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
