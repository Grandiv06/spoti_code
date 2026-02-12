"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import VideoControls from "./VideoControls";

// ویدیوی تستی برای جلسه اول دوره
const TEST_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export default function CourseHero() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggle = () => {
    if (!isVideoExpanded && gridRef.current) {
      setFixedHeight(gridRef.current.offsetHeight);
    }
    if (!isVideoExpanded) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setIsVideoExpanded((prev) => !prev);
  };

  return (
    <div className="glass-panel rounded-5xl p-2 mb-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
      <div
        ref={gridRef}
        className="relative grid grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-[var(--hero-col1,1fr)_1fr] lg:grid-rows-1 rounded-4xl bg-white/20 dark:bg-white/5 overflow-hidden backdrop-blur-sm min-h-[500px] lg:min-h-[480px] transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={
          {
            "--hero-col1": isVideoExpanded ? "0fr" : "1fr",
            ...(fixedHeight ? { height: fixedHeight } : {}),
          } as React.CSSProperties
        }
      >
        {/* Course Info - collapses when video expands */}
        <div
          className={`min-w-0 overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 row-start-2 lg:row-start-1 transition-opacity duration-500 ease-out ${
            isVideoExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="bg-emerald-100/80 dark:bg-emerald-900/30 backdrop-blur-md text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-700">
              فرانت‌اند
            </span>
            <span className="bg-amber-100/80 dark:bg-amber-900/30 backdrop-blur-md text-amber-700 dark:text-amber-300 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              ۴.۹
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.2] mb-8">
            متخصص{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary-dark to-emerald-500 drop-shadow-sm">
              React
            </span>{" "}
            و{" "}
            <span className="relative inline-block">
              Next.js
              <svg
                className="absolute w-full h-3 -bottom-1 right-0 text-primary opacity-60"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                />
              </svg>
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium leading-loose max-w-xl mb-10">
            مسیر صفر تا صد ورود به بازار کار جهانی. یادگیری عمیق هوک‌ها، SSR، و
            معماری مدرن وب با جدیدترین نسخه Next.js 14.
          </p>
          <div className="flex flex-wrap items-center gap-6 md:gap-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                  سطح دوره
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">پیشرفته</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700">
                <span className="material-symbols-outlined text-2xl">schedule</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                  مدت زمان
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">۶۵ ساعت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section - expands to full width on play */}
        <div
          className={`relative cursor-pointer overflow-hidden min-h-[400px] lg:min-h-0 row-start-1 group/video transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isVideoExpanded
              ? "rounded-4xl m-0"
              : "rounded-4xl lg:rounded-l-none lg:rounded-r-4xl m-2 lg:m-0 lg:ml-2"
          }`}
        >
          {/* Thumbnail - hidden when video is playing */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isVideoExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/video:scale-105"
              alt="Course Preview"
              src="/images/course3.jpg"
              fill
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-emerald-900/20 dark:bg-emerald-900/40 mix-blend-multiply transition-colors group-hover/video:bg-emerald-900/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
          </div>

          {/* Video - visible and plays when expanded */}
          <video
            ref={videoRef}
            src={TEST_VIDEO_URL}
            className={`absolute inset-0 w-full h-full object-cover ${
              isVideoExpanded ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
            }`}
            playsInline
            preload="metadata"
            muted={false}
            controls={false}
            loop
          />

          {/* Custom controls - only when expanded */}
          {isVideoExpanded && (
            <div className="absolute bottom-0 right-0 left-0 z-20 p-4">
              <VideoControls
                videoRef={videoRef}
                videoUrl={TEST_VIDEO_URL}
                title="جلسه اول رایگان"
                subtitle="آشنایی با اکوسیستم React"
              />
            </div>
          )}

          {/* Play button / Close when expanded - pointer-events-none so controls below are clickable */}
          <div
            className={`absolute z-20 pointer-events-none ${
              isVideoExpanded ? "top-4 left-4" : "inset-0 flex items-center justify-center"
            }`}
          >
            <button
              type="button"
              onClick={handleToggle}
              className="relative focus:outline-none focus:ring-0 pointer-events-auto"
              aria-label={isVideoExpanded ? "بستن ویدیو" : "پخش ویدیو"}
            >
              {!isVideoExpanded ? (
                <div className="relative group/btn">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
                  <div className="size-24 rounded-full bg-white/10 backdrop-blur-lg border border-white/50 flex items-center justify-center group-hover/btn:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(34,197,94,0.8)]">
                    <span className="material-symbols-outlined text-4xl filled pl-1">
                      play_arrow
                    </span>
                  </div>
                </div>
              ) : (
                <div className="size-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span className="material-symbols-outlined text-2xl text-white">
                    arrow_back
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Video info overlay - only when collapsed */}
          {!isVideoExpanded && (
            <div className="absolute bottom-8 right-8 left-8 z-20">
              <div className="bg-black/40 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex items-center justify-between text-white shadow-lg">
                <div className="flex flex-col">
                  <span className="text-xs text-white/70 mb-1">جلسه اول رایگان</span>
                  <span className="font-bold text-base">آشنایی با اکوسیستم React</span>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1.5 rounded-xl font-mono dir-ltr">
                  05:34
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
