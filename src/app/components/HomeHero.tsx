"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import VideoControls from "./VideoControls";

// ویدیوی تستی کوتاه (۱۵ ثانیه) برای تست پخش
const TEST_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export default function HomeHero() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggle = () => {
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;

    if (!isVideoExpanded && gridRef.current && isDesktop) {
      setFixedHeight(gridRef.current.offsetHeight);
    }
    if (isVideoExpanded) {
      setFixedHeight(null);
    }

    if (!isVideoExpanded) {
      videoRef.current?.play().catch(() => {
        // Autoplay can be blocked; keep the player open.
      });
    } else {
      videoRef.current?.pause();
    }
    setIsVideoExpanded((prev) => !prev);
  };

  return (
    <header className="relative z-10 mx-auto max-w-7xl overflow-x-hidden px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
      <div
        ref={gridRef}
        className="grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-[var(--hero-col1,1fr)_1fr] lg:grid-rows-1 lg:gap-0 lg:min-h-[480px] transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={
          {
            "--hero-col1": isVideoExpanded ? "0fr" : "1fr",
            ...(fixedHeight ? { height: fixedHeight } : {}),
          } as React.CSSProperties
        }
      >
        {/* Text Content - hidden on mobile while the video plays */}
        <div
          className={`min-w-0 overflow-hidden order-2 lg:order-1 space-y-5 sm:space-y-8 text-center lg:text-right relative z-10 transition-opacity duration-500 ease-out ${
            isVideoExpanded
              ? "hidden lg:block lg:opacity-0 lg:pointer-events-none"
              : "opacity-100"
          }`}
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm dark:bg-surface-dark sm:px-4 sm:py-2 sm:text-xs">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse"></span>
            <span className="truncate">دوره جدید Full-Stack شروع شد</span>
          </div>
          <h1 className="text-[1.7rem] font-black leading-snug text-gray-900 dark:text-white sm:text-4xl sm:leading-[1.2] lg:text-7xl">
            مسیر{" "}
            <span className="relative inline-block text-primary">
              حرفه‌ای
              <svg
                className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
                height="8"
                viewBox="0 0 100 8"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C20 2 40 2 60 4C80 6 90 6 99 2"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
            </span>{" "}
            شدن <br />
            در دنیای برنامه‌نویسی
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-text-muted-light dark:text-text-muted-dark sm:text-xl sm:leading-loose lg:mx-0">
            با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید
            که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما
            هستیم.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-5 justify-center lg:justify-start">
            <a
              className="flex items-center justify-center gap-2 rounded-[1.5rem] bg-primary px-6 py-3.5 text-sm font-extrabold text-white shadow-2xl shadow-primary/40 transition-all hover:bg-primary-hover sm:gap-3 sm:rounded-4xl sm:px-10 sm:py-5 sm:text-lg"
              href="/courses"
            >
              شروع یادگیری
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                arrow_right_alt
              </span>
            </a>
            <a
              className="flex items-center justify-center gap-2 rounded-[1.5rem] border border-white/30 bg-white/70 px-6 py-3.5 text-sm font-extrabold text-text-light shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/90 dark:border-white/10 dark:bg-[#14161c]/10 dark:text-white dark:hover:bg-[#14161c]/20 sm:gap-3 sm:rounded-4xl sm:px-10 sm:py-5 sm:text-lg"
              href="/courses"
            >
              <span className="material-symbols-outlined text-primary">
                category
              </span>
              مشاهده دوره‌ها
            </a>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 sm:gap-4 sm:pt-6 lg:justify-start">
            <div className="flex -space-x-3 space-x-reverse">
              <Image
                alt="User"
                className="h-9 w-9 rounded-full border-4 border-white shadow-md dark:border-surface-dark sm:h-12 sm:w-12"
                src="/images/user1.jpg"
                width={48}
                height={48}
              />
              <Image
                alt="User"
                className="h-9 w-9 rounded-full border-4 border-white shadow-md dark:border-surface-dark sm:h-12 sm:w-12"
                src="/images/user2.jpg"
                width={48}
                height={48}
              />
              <Image
                alt="User"
                className="h-9 w-9 rounded-full border-4 border-white shadow-md dark:border-surface-dark sm:h-12 sm:w-12"
                src="/images/user3.jpg"
                width={48}
                height={48}
              />
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-primary/20 text-[10px] font-black text-primary backdrop-blur-sm dark:border-surface-dark sm:h-12 sm:w-12 sm:text-sm">
                +۲۵۰
              </div>
            </div>
            <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark sm:text-sm">
              دانشجوی فعال در این ترم
            </p>
          </div>
        </div>

        {/* Video Section - expands to full width on play */}
        <div
          className={`order-1 lg:order-2 relative cursor-pointer overflow-hidden row-start-1 group/video transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] self-stretch ${
            isVideoExpanded
              ? "rounded-2xl sm:rounded-4xl m-0"
              : "rounded-2xl sm:rounded-4xl lg:rounded-l-none lg:rounded-r-4xl border-4 sm:border-8 border-white dark:border-surface-dark/50"
          }`}
        >
          <div
            className={`video-fullscreen-container relative w-full overflow-hidden bg-black aspect-video ${
              isVideoExpanded
                ? "is-playing h-auto rounded-2xl sm:rounded-4xl lg:h-full"
                : ""
            }`}
          >
            {/* Thumbnail - hidden when video is playing */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isVideoExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-900/60 to-black/90" />
              <Image
                alt="Coding workspace"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover/video:scale-105"
                src="/images/hero_image.jpg"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply transition-colors group-hover/video:bg-emerald-900/10 dark:bg-emerald-900/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Video - visible when expanded */}
            <video
              ref={videoRef}
              src={TEST_VIDEO_URL}
              className={`absolute inset-0 h-full w-full object-contain object-center ${
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
              <div className="absolute inset-x-0 bottom-0 z-20 p-2 sm:p-4">
                <VideoControls
                  videoRef={videoRef}
                  videoUrl={TEST_VIDEO_URL}
                  title="معرفی اسپاتی‌کد"
                  subtitle="شروع مسیر یادگیری"
                />
              </div>
            )}

            {/* Play button / Close when expanded */}
            <div
              className={`absolute z-20 pointer-events-none ${
                isVideoExpanded
                  ? "top-2 left-2 sm:top-4 sm:left-4"
                  : "inset-0 flex items-center justify-center"
              }`}
            >
              <button
                type="button"
                onClick={handleToggle}
                className="relative cursor-pointer focus:outline-none focus:ring-0 pointer-events-auto"
                aria-label={isVideoExpanded ? "بستن ویدیو" : "پخش ویدیو"}
              >
                {!isVideoExpanded ? (
                  <div className="relative group/btn">
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl sm:-inset-4" />
                    <div className="flex size-16 items-center justify-center rounded-full border border-white/50 bg-white/10 shadow-[0_0_40px_rgba(34,197,94,0.8)] backdrop-blur-lg transition-all duration-300 group-hover/btn:scale-110 sm:size-24">
                      <span className="material-symbols-outlined filled pl-0.5 text-3xl sm:pl-1 sm:text-4xl">
                        play_arrow
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/70 sm:size-12">
                    <span className="material-symbols-outlined text-xl text-white sm:text-2xl">
                      arrow_back
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 -z-10 hidden h-32 w-32 rotate-12 rounded-4xl bg-yellow-400 opacity-80 blur-sm sm:block" />
          <div className="absolute -top-8 -left-8 -z-10 hidden h-24 w-24 rounded-full bg-blue-500 opacity-40 blur-xl sm:block" />
        </div>
      </div>
    </header>
  );
}
