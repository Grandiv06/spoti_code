"use client";

import { useEffect, useState } from "react";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoUrl: string;
  title?: string;
  subtitle?: string;
  onPlaybackChange?: (isPlaying: boolean) => void;
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-gray-900" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.14-6.86c.63-.39.63-1.29 0-1.68L9.54 4.3C8.87 3.87 8 4.35 8 5.14z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-gray-900" aria-hidden="true">
      <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z" />
    </svg>
  );
}

export default function VideoControls({
  videoRef,
  videoUrl,
  title = "جلسه اول رایگان",
  subtitle = "آشنایی با اکوسیستم React",
  onPlaybackChange,
}: VideoControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleTimeUpdate = () => setCurrentTime(v.currentTime);
    const handleLoadedMetadata = () => setDuration(v.duration);
    const handlePlay = () => {
      setIsPlaying(true);
      onPlaybackChange?.(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPlaybackChange?.(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onPlaybackChange?.(false);
    };

    v.addEventListener("timeupdate", handleTimeUpdate);
    v.addEventListener("loadedmetadata", handleLoadedMetadata);
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnded);

    if (v.duration) setDuration(v.duration);

    return () => {
      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.removeEventListener("loadedmetadata", handleLoadedMetadata);
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnded);
    };
  }, [videoRef, onPlaybackChange]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.volume = volume || 1;
      setIsMuted(false);
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    v.currentTime = percent * duration;
    setCurrentTime(v.currentTime);
  };

  return (
    <div className="absolute bottom-4 right-4 left-4 z-30 flex flex-col gap-2.5" dir="ltr">
      <div
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
        onClick={handleProgressClick}
        className="flex h-1.5 w-full cursor-pointer flex-row overflow-hidden rounded-full bg-white/20"
      >
        <div
          className="h-full min-w-0 rounded-full bg-primary transition-all duration-100"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/45 p-2.5 shadow-lg backdrop-blur-md sm:gap-4 sm:rounded-3xl sm:p-3">
        {/* Left: play + time */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white shadow-md transition-colors hover:bg-white/95"
            aria-label={isPlaying ? "توقف" : "پخش"}
          >
            {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
          </button>

          <span className="shrink-0 font-mono text-xs tabular-nums text-white/90 sm:text-sm">
            {formatTime(currentTime)}
            <span className="text-white/45"> / </span>
            {formatTime(duration)}
          </span>
        </div>

        {/* Center: title */}
        <div className="min-w-0 flex-1 text-right" dir="rtl">
          <p className="truncate text-[11px] text-white/55 sm:text-xs">{title}</p>
          <p className="truncate text-sm font-bold text-white sm:text-[15px]">{subtitle}</p>
        </div>

        {/* Right: volume, download, fullscreen */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={toggleMute}
              className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={isMuted ? "صدای بلند" : "بی‌صدا"}
            >
              <span className="material-symbols-outlined text-xl">
                {isMuted || volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
              </span>
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/25 [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 sm:hidden"
            aria-label={isMuted ? "صدای بلند" : "بی‌صدا"}
          >
            <span className="material-symbols-outlined text-xl">
              {isMuted || volume === 0 ? "volume_off" : "volume_up"}
            </span>
          </button>

          <a
            href={videoUrl}
            download="video.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="دانلود ویدیو"
          >
            <span className="material-symbols-outlined text-xl">download</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
          >
            <span className="material-symbols-outlined text-xl">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
