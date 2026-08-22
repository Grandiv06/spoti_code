"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import VideoControls from "./VideoControls";

// ویدیوی تستی برای پخش تیزر معرفی
const TEST_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export default function HomeHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play().catch(() => {
      // Autoplay can be blocked; keep state open.
    });
  };

  const handleClose = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <header className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
      {/* Ambient background glow - soft and unclipped */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[350px] sm:h-[450px] bg-primary/[0.07] dark:bg-primary/[0.09] rounded-full blur-[140px] -z-10" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Text Column (Right side in RTL) */}
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-right">
          {/* Top Tag Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-black text-primary-dark dark:text-primary backdrop-blur-md shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span>دوره جدید Full-Stack شروع شد</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-black leading-[1.3] text-gray-900 dark:text-white sm:text-5xl sm:leading-[1.25] lg:text-6xl xl:text-[4rem]">
            مسیر{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-green-500">
              حرفه‌ای
              <svg
                className="absolute -bottom-1 left-0 w-full sm:-bottom-2 text-primary"
                height="10"
                viewBox="0 0 100 10"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7C25 3 50 3 75 5C85 6 92 6 98 3"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </span>{" "}
            شدن <br className="hidden sm:inline" />
            در دنیای برنامه‌نویسی
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-loose lg:mx-0">
            با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید
            که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما
            هستیم.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary to-emerald-600 px-8 py-4 sm:px-9 sm:py-4.5 text-base sm:text-lg font-black text-white shadow-[0_10px_30px_-5px_rgba(34,197,94,0.45)] transition-all duration-300 hover:from-primary-hover hover:to-emerald-700 hover:shadow-[0_16px_36px_-5px_rgba(34,197,94,0.6)] hover:-translate-y-0.5 active:translate-y-0 group"
              href="/courses"
            >
              شروع یادگیری
              <span className="material-symbols-outlined transition-transform duration-300 rtl:rotate-180 group-hover:-translate-x-1">
                arrow_right_alt
              </span>
            </a>

            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-8 py-4 sm:px-9 sm:py-4.5 text-base sm:text-lg font-bold text-gray-800 dark:text-white shadow-xs backdrop-blur-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:-translate-y-0.5 active:translate-y-0 group"
              href="/courses"
            >
              <span className="material-symbols-outlined text-primary text-2xl transition-transform duration-300 group-hover:scale-110">
                category
              </span>
              مشاهده دوره‌ها
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 sm:pt-6 lg:justify-start">
            <div className="flex -space-x-3.5 space-x-reverse">
              <div className="relative size-10 sm:size-12 rounded-full ring-2 ring-white dark:ring-[#14161c] overflow-hidden shadow-md">
                <Image
                  alt="دانشجوی اسپاتی‌کد"
                  className="object-cover"
                  src="/images/user1.jpg"
                  fill
                  sizes="48px"
                />
              </div>
              <div className="relative size-10 sm:size-12 rounded-full ring-2 ring-white dark:ring-[#14161c] overflow-hidden shadow-md">
                <Image
                  alt="دانشجوی اسپاتی‌کد"
                  className="object-cover"
                  src="/images/user2.jpg"
                  fill
                  sizes="48px"
                />
              </div>
              <div className="relative size-10 sm:size-12 rounded-full ring-2 ring-white dark:ring-[#14161c] overflow-hidden shadow-md">
                <Image
                  alt="دانشجوی اسپاتی‌کد"
                  className="object-cover"
                  src="/images/user3.jpg"
                  fill
                  sizes="48px"
                />
              </div>
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-full ring-2 ring-white dark:ring-[#14161c] bg-primary/15 text-xs sm:text-sm font-black text-primary backdrop-blur-md shadow-md">
                +۲.۵k
              </div>
            </div>

            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm font-black">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="text-gray-900 dark:text-white font-bold mr-1">۴.۹</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                بیش از ۲,۵۰۰ دانشجوی فعال
              </p>
            </div>
          </div>
        </div>

        {/* Video / Visual Showcase Card (Left side in RTL) */}
        <div className="order-1 lg:order-2 relative group/video lg:col-span-6 xl:col-span-6">
          {/* Main Card Shell with Smooth Shadow Glow */}
          <div className="relative w-full rounded-3xl sm:rounded-4xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-[#0f1117] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(34,197,94,0.3)] transition-all duration-500">
            {/* Video Container with Fixed Aspect Ratio */}
            <div className="relative w-full aspect-[16/10] sm:aspect-video bg-black overflow-hidden flex items-center justify-center">
              {/* Thumbnail View (When not playing) */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <Image
                  alt="محیط آموزش برنامه‌نویسی اسپاتی‌کد"
                  className="object-cover transition-transform duration-1000 ease-out group-hover/video:scale-105"
                  src="/images/hero_image.jpg"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Gradient Overlays for contrast & richness */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-black/40 to-black/20" />
                <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
              </div>

              {/* HTML Video Element (Always in place) */}
              <video
                ref={videoRef}
                src={TEST_VIDEO_URL}
                className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300 ${
                  isPlaying ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                }`}
                playsInline
                preload="metadata"
                controls={false}
                loop
              />

              {/* Floating Close Button (When Playing) */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="بستن ویدیو"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
                </button>
              )}

              {/* Custom Controls (When Playing) */}
              {isPlaying && (
                <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                  <VideoControls
                    videoRef={videoRef}
                    videoUrl={TEST_VIDEO_URL}
                    title="معرفی اسپاتی‌کد"
                    subtitle="مسیر جامع برنامه‌نویسی"
                  />
                </div>
              )}

              {/* Play Button (When not playing) */}
              {!isPlaying && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
                  <button
                    type="button"
                    onClick={handlePlay}
                    className="relative cursor-pointer focus:outline-none group/playbtn transition-transform duration-300 hover:scale-110 active:scale-95"
                    aria-label="پخش ویدیو"
                  >
                    {/* Glowing outer rings */}
                    <span className="absolute -inset-3 sm:-inset-4 rounded-full bg-primary/25 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -inset-5 sm:-inset-6 rounded-full bg-primary/20 blur-xl pointer-events-none" />

                    {/* Main play button disk */}
                    <div className="relative flex size-16 sm:size-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_35px_rgba(34,197,94,0.7)] ring-4 ring-white/20 transition-all duration-300 group-hover/playbtn:shadow-[0_0_50px_rgba(34,197,94,0.9)] group-hover/playbtn:ring-white/40">
                      {/* Perfectly centered play triangle */}
                      <svg
                        className="size-7 sm:size-8 fill-white"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.5 5.5v13l10-6.5-10-6.5z" />
                      </svg>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
