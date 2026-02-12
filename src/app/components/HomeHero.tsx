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
    <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
      <div
        ref={gridRef}
        className="grid grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-[var(--hero-col1,1fr)_1fr] lg:grid-rows-1 gap-16 lg:gap-0 items-center min-h-[400px] lg:min-h-[480px] transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={
          {
            "--hero-col1": isVideoExpanded ? "0fr" : "1fr",
            ...(fixedHeight ? { height: fixedHeight } : {}),
          } as React.CSSProperties
        }
      >
        {/* Text Content - collapses when video expands */}
        <div
          className={`min-w-0 overflow-hidden order-2 lg:order-1 space-y-8 text-center lg:text-right relative z-10 row-start-2 lg:row-start-1 transition-opacity duration-500 ease-out ${
            isVideoExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-full shadow-sm text-xs font-bold text-primary border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            دوره جدید Full-Stack شروع شد
          </div>
          <h1 className="text-4xl lg:text-7xl font-black leading-[1.2] text-gray-900 dark:text-white">
            مسیر{" "}
            <span className="text-primary relative inline-block">
              حرفه‌ای
              <svg
                className="absolute -bottom-2 left-0 w-full"
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
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark leading-loose max-w-2xl mx-auto lg:mx-0">
            با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید
            که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما
            هستیم.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <a
              className="bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 group"
              href="#"
            >
              شروع یادگیری
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                arrow_right_alt
              </span>
            </a>
            <a
              className="bg-white/70 dark:bg-[#14161c]/10 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-[#14161c]/20 text-text-light dark:text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-3 border border-white/30 dark:border-white/10"
              href="/courses"
            >
              <span className="material-symbols-outlined text-primary">
                category
              </span>
              مشاهده دوره‌ها
            </a>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
            <div className="flex -space-x-3 space-x-reverse">
              <Image
                alt="User"
                className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                src="/images/user1.jpg"
                width={48}
                height={48}
              />
              <Image
                alt="User"
                className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                src="/images/user2.jpg"
                width={48}
                height={48}
              />
              <Image
                alt="User"
                className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                src="/images/user3.jpg"
                width={48}
                height={48}
              />
              <div className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark bg-primary/20 flex items-center justify-center text-sm font-black text-primary backdrop-blur-sm">
                +۲۵۰
              </div>
            </div>
            <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark">
              دانشجوی فعال در این ترم
            </p>
          </div>
        </div>

        {/* Video Section - expands to full width on play */}
        <div
          className={`order-1 lg:order-2 relative cursor-pointer overflow-hidden row-start-1 group/video transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] self-stretch ${
            isVideoExpanded
              ? "rounded-4xl m-0"
              : "rounded-4xl lg:rounded-l-none lg:rounded-r-4xl border-8 border-white dark:border-surface-dark/50"
          }`}
        >
          <div
            className={`w-full bg-black overflow-hidden relative ${
              isVideoExpanded ? "h-full rounded-4xl" : "aspect-video"
            }`}
          >
            {/* Thumbnail - hidden when video is playing */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isVideoExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-black/90 z-10" />
              <Image
                alt="Coding workspace"
                className="absolute inset-0 w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-1000"
                src="/images/hero_image.jpg"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-emerald-900/20 dark:bg-emerald-900/40 mix-blend-multiply transition-colors group-hover/video:bg-emerald-900/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Video - visible when expanded */}
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
                  title="معرفی اسپاتی‌کد"
                  subtitle="شروع مسیر یادگیری"
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
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-yellow-400 rounded-4xl -z-10 rotate-12 opacity-80 blur-sm" />
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-500 rounded-full -z-10 opacity-40 blur-xl" />
        </div>
      </div>
    </header>
  );
}
