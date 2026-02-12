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
}

export default function VideoControls({
  videoRef,
  videoUrl,
  title = "جلسه اول رایگان",
  subtitle = "آشنایی با اکوسیستم React",
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
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

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
  }, [videoRef]);

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
    const container = videoRef.current?.parentElement?.parentElement;
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
    <div className="absolute bottom-4 right-4 left-4 z-30 flex flex-col gap-3 dir-ltr">
      {/* Progress bar - left to right: left = start, right = end */}
      <div
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
        onClick={handleProgressClick}
        dir="ltr"
        style={{ direction: "ltr" }}
        className="h-2 w-full cursor-pointer rounded-full bg-white/20 overflow-hidden border border-white/10 flex flex-row"
      >
        <div
          className="h-full bg-primary/80 rounded-full min-w-0 transition-all duration-100"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, flex: "none" }}
        />
      </div>

      {/* Controls bar - same style as title overlay */}
      <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            className="size-10 shrink-0 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/10"
            aria-label={isPlaying ? "توقف" : "پخش"}
          >
            <span className="material-symbols-outlined text-2xl">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs text-white/70 truncate">{title}</span>
            <span className="text-sm font-bold text-white truncate">{subtitle}</span>
          </div>

          <span className="text-xs bg-white/20 px-3 py-1.5 rounded-xl font-mono dir-ltr shrink-0 text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Volume */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              className="size-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
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
              dir="ltr"
              className="w-16 h-1.5 cursor-pointer appearance-none rounded-full bg-white/20 [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-0"
            />
          </div>

          {/* Download */}
          <a
            href={videoUrl}
            download="video.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="size-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10 hover:bg-white/25"
            aria-label="دانلود ویدیو"
          >
            <span className="material-symbols-outlined text-xl">download</span>
          </a>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="size-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
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
