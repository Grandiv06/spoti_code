"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CustomVideoPlayer from "@/components/panel/CustomVideoPlayer";
// Mock Data
const courseData = {
  id: "1",
  title: "مسترکلاس ری‌اکت و نکست جی‌اس",
  instructor: "سروش مشایخی",
  progress: 45,
  chapters: [
    {
      id: "ch1",
      title: "فصل اول: مقدمه و مفاهیم پایه",
      lessons: [
        {
          id: "l1",
          title: "معرفی دوره و پیش‌نیازها",
          duration: "12:30",
          isWatched: true,
          isCompleted: true,
          isLocked: false,
          videoUrl: "#",
          description: "در این جلسه به معرفی کامل دوره، پیش‌نیازهای لازم برای شروع، و ابزارهایی که در طول دوره نیاز داریم می‌پردازیم.",
          attachments: [
            { name: "اسلایدهای معرفی دوره.pdf", size: "2.4 MB" },
          ],
        },
        {
          id: "l2",
          title: "نصب و راه‌اندازی محیط توسعه",
          duration: "18:45",
          isWatched: true,
          isCompleted: true,
          isLocked: false,
          videoUrl: "#",
          description: "آموزش نصب Node.js، VS Code و افزونه‌های کاربردی برای برنامه‌نویسی ری‌اکت.",
          attachments: [],
        },
      ],
    },
    {
      id: "ch2",
      title: "فصل دوم: ورود به دنیای ری‌اکت",
      lessons: [
        {
          id: "l3",
          title: "کامپوننت‌ها و JSX",
          duration: "25:10",
          isWatched: true,
          isCompleted: false,
          isLocked: false,
          videoUrl: "#",
          description: "آشنایی با مفهوم کامپوننت در ری‌اکت و نحوه استفاده از سینتکس JSX برای ساخت رابط کاربری.",
          attachments: [
            { name: "کدهای جلسه.zip", size: "1.1 MB" },
            { name: "تمرین.pdf", size: "500 KB" },
          ],
        },
        {
          id: "l4",
          title: "مدیریت State و Props",
          duration: "32:00",
          isWatched: false,
          isCompleted: false,
          isLocked: false,
          videoUrl: "#",
          description: "آموزش مدیریت وضعیت (State) در کامپوننت‌های تابعی و نحوه انتقال داده‌ها با Props.",
          attachments: [],
        },
      ],
    },
    {
      id: "ch3",
      title: "فصل سوم: پروژه‌های عملی",
      lessons: [
        {
          id: "l5",
          title: "پروژه اول: ساخت لیست وظایف (To-Do App)",
          duration: "45:20",
          isWatched: false,
          isCompleted: false,
          isLocked: true,
          videoUrl: "#",
          description: "پیاده‌سازی یک اپلیکیشن لیست وظایف کامل با استفاده از مفاهیم آموخته شده در فصل‌های قبل.",
          attachments: [
            { name: "assets.zip", size: "5.4 MB" },
          ],
        },
      ],
    },
  ],
};

export default function CourseLearningClient() {
  const params = useParams();
  const [activeLessonId, setActiveLessonId] = useState(courseData.chapters[1].lessons[0].id); // Default to lesson 3 for demo
  const [activeTab, setActiveTab] = useState("description");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([courseData.chapters[1].id]);

  // Find active lesson details
  let activeLesson = courseData.chapters[0].lessons[0];
  courseData.chapters.forEach(ch => {
    const lesson = ch.lessons.find(l => l.id === activeLessonId);
    if (lesson) activeLesson = lesson;
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "attachments", label: "فایل‌های پیوست" },
    { id: "comments", label: "نظرات" },
    { id: "qa", label: "پرسش و پاسخ" },
  ];

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/panel/courses" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-xl rotate-180">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {courseData.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مدرس: {courseData.instructor}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>پیشرفت کلی دوره</span>
            <span className="text-primary">{courseData.progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${courseData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Video Player & Details */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Video Player */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
            <CustomVideoPlayer 
              key={activeLesson.id}
              src={activeLesson.videoUrl} 
              title={activeLesson.title}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 px-2 pb-2">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  درس قبلی
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-colors cursor-pointer">
                  درس بعدی
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
              </div>

              <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeLesson.isCompleted 
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30" 
                : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
              }`}>
                <span className="material-symbols-outlined text-[20px]">
                  {activeLesson.isCompleted ? "task_alt" : "check_circle"}
                </span>
                {activeLesson.isCompleted ? "تکمیل شده" : "تکمیل این درس"}
              </button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            {/* Tabs Header */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === "description" && (
                <div className="text-gray-600 dark:text-gray-300 leading-loose text-sm md:text-base">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">درباره این جلسه</h3>
                  <p>{activeLesson.description}</p>
                </div>
              )}

              {activeTab === "attachments" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">فایل‌های ضمیمه</h3>
                  {activeLesson.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeLesson.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#14161c] hover:border-primary/30 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c1e26] flex items-center justify-center text-primary shadow-sm">
                              <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{file.size}</p>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-white dark:bg-[#1c1e26] flex items-center justify-center text-gray-400 hover:text-primary shadow-sm transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">folder_off</span>
                      <p className="text-sm">فایلی برای این جلسه ضمیمه نشده است.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                  <p className="text-sm">بخش نظرات در حال به‌روزرسانی است.</p>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">help_center</span>
                  <p className="text-sm">بخش پرسش و پاسخ به زودی اضافه می‌شود.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">سرفصل‌های دوره</h2>
            </div>

            <div className="space-y-3 pr-1">
              {courseData.chapters.map((chapter) => {
                const isExpanded = expandedChapters.includes(chapter.id);
                
                return (
                  <div key={chapter.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-[#14161c]/50">
                    {/* Chapter Header */}
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white text-right">{chapter.title}</h3>
                      <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                        keyboard_arrow_down
                      </span>
                    </button>

                    {/* Chapter Lessons */}
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                      <div className="p-2 pt-0 space-y-1">
                        {chapter.lessons.map((lesson) => {
                          const isActive = activeLessonId === lesson.id;
                          
                          return (
                            <div 
                              key={lesson.id}
                              onClick={() => !lesson.isLocked && setActiveLessonId(lesson.id)}
                              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                                lesson.isLocked 
                                  ? "opacity-60 cursor-not-allowed" 
                                  : "cursor-pointer hover:bg-white dark:hover:bg-[#1c1e26]"
                              } ${
                                isActive 
                                  ? "bg-white dark:bg-[#1c1e26] border border-primary/20 shadow-sm" 
                                  : "border border-transparent"
                              }`}
                            >
                              {/* Icon Status */}
                              <div className={`mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${
                                isActive ? "text-primary" : 
                                lesson.isCompleted ? "text-green-500 bg-green-50 dark:bg-green-500/10" : 
                                lesson.isLocked ? "text-gray-400" : "text-gray-400"
                              }`}>
                                <span className="material-symbols-outlined text-[18px]">
                                  {isActive ? "play_circle" : 
                                   lesson.isCompleted ? "check_circle" : 
                                   lesson.isLocked ? "lock" : "play_circle"}
                                </span>
                              </div>

                              {/* Lesson Details */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${
                                  isActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                }`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    {lesson.duration}
                                  </span>
                                  {lesson.isWatched && !lesson.isCompleted && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                      دیده شده
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
