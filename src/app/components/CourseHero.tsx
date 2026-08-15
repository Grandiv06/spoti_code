"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import VideoControls from "./VideoControls";

// ویدیوی تستی برای جلسه اول دوره
const TEST_VIDEO_URL =
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4";

// ویدیوی جایگزین در صورت خطا
const FALLBACK_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export interface CourseHeroProps {
  title?: string;
  category?: string;
  level?: string;
  duration?: string;
  rating?: number;
  shortDescription?: string;
  specialWords?: {
    highlighted?: string[];
    underlined?: string[];
    color?: string;
  };
  coverImage?: string;
  introVideo?: string;
  introVideoDuration?: string;
  isPreviewActive?: boolean;
  activeVideoTitle?: string;
  activeVideoDuration?: string;
  onResetPreview?: () => void;
  playTrigger?: number;
  disableFallbackVideo?: boolean;
  missingVideoMessage?: string;
}

export default function CourseHero({
  title = "",
  category = "",
  level = "",
  duration = "",
  rating,
  shortDescription = "",
  specialWords = {
    highlighted: [],
    underlined: [],
    color: "green",
  },
  coverImage = "",
  introVideo = "",
  introVideoDuration = "",
  isPreviewActive = false,
  activeVideoTitle = "",
  activeVideoDuration = "",
  onResetPreview,
  playTrigger = 0,
  disableFallbackVideo = false,
  missingVideoMessage = "ویدیوی این بخش هنوز در دسترس نیست.",
}: CourseHeroProps) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use introVideo if provided, otherwise fallback to test video only when allowed
  const activeVideoUrl = introVideo || (disableFallbackVideo ? "" : TEST_VIDEO_URL);
  const [videoUrl, setVideoUrl] = useState(activeVideoUrl);
  const [videoError, setVideoError] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    clearHideTimer();
    if (!isPlaying) {
      setShowControls(true);
      return;
    }
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2800);
  }, [clearHideTimer, isPlaying]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  useEffect(() => clearHideTimer, [clearHideTimer]);

  // Sync videoUrl when introVideo prop changes
  useEffect(() => {
    const frame = window.setTimeout(() => {
      setVideoUrl(introVideo || (disableFallbackVideo ? "" : TEST_VIDEO_URL));
      setVideoError(false);
    }, 0);
    return () => window.clearTimeout(frame);
  }, [introVideo, disableFallbackVideo]);

  useEffect(() => {
    if (!playTrigger) return;
    if (!introVideo && disableFallbackVideo) return;
    const frame = window.setTimeout(() => {
      setIsVideoExpanded(true);
      setVideoError(false);
      setVideoUrl(introVideo || (disableFallbackVideo ? "" : TEST_VIDEO_URL));
      setShowControls(true);
    }, 0);
    const raf = window.requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        // Browsers can block autoplay with sound; keep the video loaded so the user can start it.
      });
    });
    return () => {
      window.clearTimeout(frame);
      window.cancelAnimationFrame(raf);
    };
  }, [playTrigger, introVideo, disableFallbackVideo]);

  const handleVideoError = () => {
    if (videoUrl === TEST_VIDEO_URL) {
      setVideoUrl(FALLBACK_VIDEO_URL);
    } else {
      setVideoError(true);
    }
  };

  const handleToggle = () => {
    const resolvedUrl = introVideo || (disableFallbackVideo ? "" : TEST_VIDEO_URL);
    if (!resolvedUrl) return;

    if (!isVideoExpanded && !videoError) {
      setVideoUrl(resolvedUrl);
      setIsVideoExpanded(true);
      setShowControls(true);
      window.requestAnimationFrame(() => {
        videoRef.current?.play().catch(() => {
          // Keep the player open if autoplay is blocked.
        });
      });
      return;
    }

    videoRef.current?.pause();
    setShowControls(true);
    setIsVideoExpanded(false);
  };

  // Helper to render title words with brand custom highlight & underline
  const renderTitle = () => {
    if (!title.trim()) return null;

    const highlightedWords = specialWords?.highlighted?.filter(Boolean) ?? [];
    const underlinedWords = specialWords?.underlined?.filter(Boolean) ?? [];
    const highlightColor = specialWords?.color || "green";

    if (!highlightedWords.length && !underlinedWords.length) {
      return title;
    }

    let colorClass = "text-primary dark:text-primary";
    let underlineSvgClass = "text-primary opacity-60";

    if (highlightColor === "white") {
      colorClass = "text-white dark:text-white";
      underlineSvgClass = "text-white opacity-60";
    } else if (highlightColor === "yellow") {
      colorClass = "text-amber-500 dark:text-amber-400";
      underlineSvgClass = "text-amber-500 opacity-60";
    } else if (highlightColor === "blue") {
      colorClass = "text-blue-500 dark:text-blue-400";
      underlineSvgClass = "text-blue-500 opacity-60";
    }

    type StyledTerm = { text: string; kind: "highlight" | "underline" };
    const terms: StyledTerm[] = [
      ...highlightedWords.map((text) => ({ text, kind: "highlight" as const })),
      ...underlinedWords.map((text) => ({ text, kind: "underline" as const })),
    ].sort((a, b) => b.text.length - a.text.length);

    const kindByTerm = new Map<string, "highlight" | "underline">();
    for (const term of terms) {
      const key = term.text.toLowerCase();
      if (term.kind === "highlight" || !kindByTerm.has(key)) {
        kindByTerm.set(key, term.kind);
      }
    }

    const pattern = terms
      .map((term) => term.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    if (!pattern) return title;

    const parts = title.split(new RegExp(`(${pattern})`, "gi"));

    return parts.map((part, index) => {
      const kind = kindByTerm.get(part.toLowerCase());
      if (kind === "highlight") {
        return (
          <span key={index} className={`font-black drop-shadow-sm transition-all duration-300 ${colorClass}`}>
            {part}
          </span>
        );
      }
      if (kind === "underline") {
        return (
          <span key={index} className="relative inline-block mt-2 sm:mt-0 font-black transition-all duration-300">
            {part}
            <svg
              className={`absolute w-full h-2 md:h-3 -bottom-1 right-0 transition-all duration-300 ${underlineSvgClass}`}
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
            >
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
          </span>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  const displayLevel = level === "elementary" || level === "beginner"
    ? "مقدماتی" 
    : level === "intermediate" 
    ? "متوسط" 
    : level === "advanced" 
    ? "پیشرفته" 
    : level;

  const displayDuration = introVideoDuration?.trim() || "";

  return (
    <div className={`glass-panel relative overflow-hidden group transition-all duration-700 mb-6 sm:mb-10 lg:mb-16 ${
      isVideoExpanded ? "p-0 rounded-3xl sm:rounded-5xl" : "p-1.5 sm:p-2 rounded-3xl sm:rounded-5xl"
    } shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)]`} dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
      <div
        ref={gridRef}
        className={`relative grid grid-cols-1 lg:grid-cols-[minmax(0,var(--hero-col1,1fr))_1fr] lg:grid-rows-1 rounded-[1.35rem] sm:rounded-4xl bg-white/20 dark:bg-white/[0.03] overflow-hidden backdrop-blur-sm transition-[grid-template-columns,height] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isVideoExpanded
            ? "min-h-0"
            : "min-h-0 lg:min-h-[480px]"
        }`}
        style={
          {
            "--hero-col1": isVideoExpanded ? "0fr" : "1fr",
          } as React.CSSProperties
        }
      >
        {/* Course Info - hidden on mobile while playing so the player keeps 16:9 */}
        <div
          className={`min-w-0 overflow-hidden p-4 sm:p-6 md:p-12 lg:p-16 flex-col justify-center relative z-10 lg:row-start-1 transition-opacity duration-500 ease-out ${
            isVideoExpanded ? "hidden lg:flex lg:opacity-0 lg:pointer-events-none" : "flex"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8 justify-start">
            <span className="bg-emerald-100/80 dark:bg-emerald-900/30 backdrop-blur-md text-emerald-700 dark:text-emerald-300 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-700">
              {category}
            </span>
            {typeof rating === "number" && rating > 0 ? (
            <span className="bg-amber-100/80 dark:bg-amber-900/30 backdrop-blur-md text-amber-700 dark:text-amber-300 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] md:text-[16px] filled">star</span>
              {rating}
            </span>
            ) : null}
          </div>
          <h1 className="text-[1.65rem] leading-snug sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white md:leading-[1.2] mb-3 sm:mb-4 md:mb-8 text-right break-words">
            {renderTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-[13px] sm:text-base md:text-xl font-medium leading-7 sm:leading-loose max-w-xl mb-5 sm:mb-8 md:mb-10 text-justify md:text-right">
            {shortDescription || null}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-12 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 w-full">
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="size-9 sm:size-10 md:size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700 shrink-0">
                <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">school</span>
              </div>
              <div className="flex flex-col text-right min-w-0">
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5 md:mb-1">
                  سطح دوره
                </span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 dark:text-white truncate">
                  {displayLevel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="size-9 sm:size-10 md:size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700 shrink-0">
                <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">schedule</span>
              </div>
              <div className="flex flex-col text-right min-w-0">
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5 md:mb-1">
                  مدت زمان
                </span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 dark:text-white truncate">
                  {duration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section - expands to full width on play */}
        <div
          className={`video-fullscreen-container relative cursor-pointer overflow-hidden row-start-1 group/video transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] w-full min-w-0 flex items-center justify-center bg-black aspect-video min-h-0 lg:min-h-0 lg:aspect-auto ${
            isVideoExpanded
              ? "is-playing rounded-3xl sm:rounded-4xl m-0 lg:aspect-video"
              : "rounded-2xl sm:rounded-4xl lg:rounded-l-none lg:rounded-r-4xl m-1 sm:m-2 lg:m-0 lg:ml-2 lg:h-full"
          }`}
          onMouseMove={revealControls}
          onMouseEnter={revealControls}
          onClick={() => {
            if (isVideoExpanded && isPlaying) {
              setShowControls((prev) => !prev);
            }
          }}
          onMouseLeave={() => {
            if (isPlaying) {
              clearHideTimer();
              setShowControls(false);
            }
          }}
        >
          {/* Thumbnail - hidden when video is playing (or always visible on error) */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isVideoExpanded && !videoError ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/video:scale-105"
              alt="Course Preview"
              src={coverImage || "/images/course3.jpg"}
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-emerald-900/20 dark:bg-emerald-900/40 mix-blend-multiply transition-colors group-hover/video:bg-emerald-900/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
          </div>

          {/* Video - visible and plays when expanded */}
          {!videoError && videoUrl ? (
            <video
              key={videoUrl}
              ref={videoRef}
              src={videoUrl}
              onError={handleVideoError}
              className={`absolute inset-0 w-full h-full object-contain object-center ${
                isVideoExpanded ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
              }`}
              playsInline
              preload="metadata"
              muted={false}
              controls={false}
              loop
            />
          ) : disableFallbackVideo ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4 sm:px-6">
              <div className="max-w-md rounded-2xl sm:rounded-3xl border border-white/10 bg-black/35 p-4 sm:p-6 text-center text-white shadow-2xl">
                <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary block mb-2 sm:mb-3">
                  play_circle
                </span>
                <p className="text-xs sm:text-sm font-black mb-1">{missingVideoMessage}</p>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  در صورت بارگذاری ویدیوی معرفی یا جلسه‌ی آزاد، پخش آن در همین بخش فعال می‌شود.
                </p>
              </div>
            </div>
          ) : null}

          {/* Custom controls - only when expanded */}
          {isVideoExpanded && !videoError && videoUrl && (
            <div
              className={`absolute inset-x-0 bottom-0 z-20 p-2 sm:p-4 transition-all duration-300 ease-out ${
                showControls ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
              }`}
            >
              <VideoControls
                videoRef={videoRef}
                videoUrl={videoUrl}
                title={isPreviewActive ? "در حال پخش" : "پیش‌نمایش ویدیوی معرفی"}
                subtitle={isPreviewActive ? activeVideoTitle || title : title}
                onPlaybackChange={(playing) => {
                  setIsPlaying(playing);
                  if (playing) {
                    revealControls();
                  } else {
                    clearHideTimer();
                    setShowControls(true);
                  }
                }}
              />
            </div>
          )}

          {isPreviewActive && (
            <div
              className={`absolute top-2 left-2 right-12 sm:top-4 sm:left-20 sm:right-4 z-20 flex items-center gap-2 transition-all duration-300 ease-out ${
                showControls ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
              }`}
            >
              <div className="inline-flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-black/45 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 border border-white/10 text-white shadow-lg">
                <span className="material-symbols-outlined text-base sm:text-lg text-primary shrink-0">play_circle</span>
                <div className="min-w-0 text-right">
                  <p className="text-[9px] sm:text-[10px] text-white/60 leading-none">در حال پخش</p>
                  <p className="text-[11px] sm:text-xs font-black truncate">{activeVideoTitle || title}</p>
                </div>
                {activeVideoDuration ? (
                  <span className="hidden text-[10px] font-bold px-2 py-1 rounded-lg bg-white/10 shrink-0 sm:inline">
                    {activeVideoDuration}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onResetPreview}
                className="inline-flex shrink-0 items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-black/45 backdrop-blur-md px-2 py-1.5 sm:px-3 sm:py-2 border border-white/10 text-white shadow-lg hover:bg-black/60 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base sm:text-lg">replay</span>
                <span className="hidden sm:inline text-[10px] font-black">بازگشت به ویدیوی معرفی دوره</span>
              </button>
            </div>
          )}

          {/* Play button / Close when expanded - pointer-events-none so controls below are clickable */}
          <div
            className={`absolute z-20 pointer-events-none transition-all duration-300 ease-out ${
              isVideoExpanded ? "top-2 left-2 sm:top-4 sm:left-4" : "inset-0 flex items-center justify-center"
            } ${
              showControls ? "opacity-100" : isPlaying ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="relative focus:outline-none focus:ring-0 pointer-events-auto cursor-pointer"
              aria-label={isVideoExpanded ? "بستن ویدیو" : "پخش ویدیو"}
            >
              {!isVideoExpanded ? (
                <div className="relative group/btn">
                  <div className="size-14 sm:size-[72px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:shadow-[0_8px_32px_rgba(34,197,94,0.4)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-8 sm:size-10 text-primary flex-shrink-0"
                      fill="currentColor"
                    >
                      <path d="M9 6v12l9-6z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="size-9 sm:size-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span className="material-symbols-outlined text-xl sm:text-2xl text-white">
                    arrow_back
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Video info overlay - only when collapsed */}
          {!isVideoExpanded && (
            <div
              className={`absolute bottom-2.5 right-2.5 left-2.5 sm:bottom-8 sm:right-8 sm:left-8 z-20 transition-all duration-300 ease-out ${
                showControls ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
              }`}
            >
              <div className="bg-black/45 backdrop-blur-md rounded-2xl sm:rounded-3xl px-3 py-2.5 sm:p-5 border border-white/10 flex items-center justify-between gap-2 text-white shadow-lg">
                <div className="flex min-w-0 flex-col text-right">
                  <span className="text-[10px] sm:text-xs text-white/70 mb-0.5 sm:mb-1">
                    {isPreviewActive ? "در حال پخش" : "جلسه اول رایگان"}
                  </span>
                  <span className="font-bold text-xs sm:text-base truncate">
                    {isPreviewActive ? activeVideoTitle || title : "ویدیو معرفی دوره"}
                  </span>
                </div>
                {(isPreviewActive && activeVideoDuration) || displayDuration ? (
                  <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-mono dir-ltr shrink-0">
                    {isPreviewActive && activeVideoDuration
                      ? activeVideoDuration
                      : displayDuration}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
