"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  /** Smaller chrome for tight cards like the course wizard preview. */
  compact?: boolean;
  /** Keep a 16:9 frame even when the source video is portrait. */
  forceLandscape?: boolean;
  /** Fires once metadata is available with the real video length in seconds. */
  onDurationChange?: (durationSeconds: number) => void;
}

export default function CustomVideoPlayer({
  src,
  poster,
  title,
  compact = false,
  forceLandscape = false,
  onDurationChange,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback to a reliable HTTPS URL if the provided URL is a placeholder or http (to avoid mixed content issues)
  const safeSrc = src === "#" || src.startsWith("http://") 
    ? "https://www.w3schools.com/html/mov_bbb.mp4" 
    : src;

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle Video Time Update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(formatTime(current));
      setProgress((current / total) * 100);
    }
  };

  // Handle Video Loaded Metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { duration: total, videoWidth, videoHeight } = videoRef.current;
      setDuration(formatTime(total));
      setIsPortrait(videoHeight > videoWidth);
      if (Number.isFinite(total) && total > 0) {
        onDurationChange?.(total);
      }
    }
  };

  // Handle Progress Bar Click/Drag
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle Fullscreen Change Event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Show/Hide Controls on Mouse Move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
      setShowSettings(false);
    }
  };

  // Fast forward / Rewind
  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  // Change Playback Speed
  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
      setShowSettings(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-black overflow-hidden group flex items-center justify-center",
        compact ? "rounded-xl" : "rounded-2xl",
        isFullscreen
          ? "rounded-none h-full w-full"
          : !forceLandscape && isPortrait
            ? compact
              ? "mx-auto aspect-[9/16] max-h-[320px]"
              : "mx-auto aspect-[9/16] max-h-[560px]"
            : "aspect-video",
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setShowSettings(false)}
    >
      <video
        ref={videoRef}
        src={safeSrc}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {title && !compact && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 z-10 pointer-events-none",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <h3 className="text-white font-bold text-lg drop-shadow-md truncate max-w-[80%]">
            {title}
          </h3>
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
          compact ? "pb-10" : "pb-16",
          !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className={cn(
            "rounded-full flex items-center justify-center text-white backdrop-blur-md bg-white/10 hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto border border-white/10 cursor-pointer",
            compact
              ? "size-12 shadow-[0_0_24px_rgba(34,197,94,0.25)]"
              : "size-20 shadow-[0_0_40px_rgba(34,197,94,0.3)]",
            !showControls && isPlaying && "opacity-0 scale-90"
          )}
        >
          <span className={cn("material-symbols-outlined", compact ? "text-3xl" : "text-5xl")}>
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 z-20",
          compact ? "px-2.5 pt-6 pb-2" : "px-4 py-4",
          showControls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
        dir="ltr"
      >
        <div className={cn("relative group/progress cursor-pointer flex items-center", compact ? "h-1.5 mb-2" : "h-2 mb-4")}>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={cn(
            "absolute inset-x-0 bg-white/20 rounded-full group-hover/progress:h-2.5 transition-all overflow-hidden",
            compact ? "h-1" : "h-1.5",
          )}>
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
            </div>
          </div>
          <div
            className={cn(
              "absolute bg-white rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] border-2 border-primary scale-0 group-hover/progress:scale-100 transition-transform z-0 -ml-2",
              compact ? "h-3 w-3" : "h-4 w-4",
            )}
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className={cn("flex items-center justify-between text-white", compact && "gap-2")}>
          <div className={cn("flex min-w-0 items-center", compact ? "gap-1.5" : "gap-4")}>
            <button onClick={togglePlay} className="hover:text-primary transition-colors flex items-center justify-center cursor-pointer shrink-0">
              <span className={cn("material-symbols-outlined", compact ? "text-xl" : "text-3xl")}>
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>

            <div className={cn("flex items-center group/volume relative", compact ? "gap-1" : "gap-2")}>
              <button onClick={toggleMute} className="hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                <span className={cn("material-symbols-outlined", compact ? "text-lg" : "text-2xl")}>
                  {isMuted || volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
                </span>
              </button>
              {!compact && (
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1.5 accent-primary cursor-pointer appearance-none bg-white/20 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              )}
            </div>

            <div className={cn(
              "font-medium opacity-90 tracking-wider tabular-nums shrink-0",
              compact ? "text-[10px]" : "text-sm",
            )}>
              {currentTime}
              <span className="opacity-50 mx-1">/</span>
              {duration}
            </div>
          </div>

          <div className={cn("flex items-center shrink-0", compact ? "gap-1" : "gap-3")}>
            {!compact && (
              <>
                <button onClick={() => skipTime(-10)} className="hover:text-primary transition-colors flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer" title="10 ثانیه به عقب">
                  <span className="material-symbols-outlined text-2xl">replay_10</span>
                </button>
                <button onClick={() => skipTime(10)} className="hover:text-primary transition-colors flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer" title="10 ثانیه به جلو">
                  <span className="material-symbols-outlined text-2xl">forward_10</span>
                </button>
                <div className="w-px h-5 bg-white/20 mx-1"></div>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                    className={cn("hover:text-primary transition-colors flex items-center justify-center cursor-pointer", showSettings && "text-primary animate-spin")}
                    title="تنظیمات"
                  >
                    <span className="material-symbols-outlined text-2xl">settings</span>
                  </button>

                  {showSettings && (
                    <div
                      className="absolute bottom-full right-0 mb-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 z-30 text-white min-w-[150px] shadow-2xl animate-slide-in-from-right origin-bottom-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-xs font-bold text-gray-400 mb-2 px-2">سرعت پخش</div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={cn(
                            "w-full text-right px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer",
                            playbackRate === speed ? "text-primary" : "text-white"
                          )}
                        >
                          <span>{speed === 1 ? 'عادی' : speed + 'x'}</span>
                          {playbackRate === speed && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <button onClick={toggleFullscreen} className="hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
              <span className={cn("material-symbols-outlined", compact ? "text-lg" : "text-2xl")}>
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
