"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type VideoPreviewModalProps = {
  open: boolean;
  title: string;
  videoUrl: string;
  onClose: () => void;
};

export default function VideoPreviewModal({ open, title, videoUrl, onClose }: VideoPreviewModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#1c1e26] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <p className="truncate text-sm font-black text-white">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label="بستن پیش‌نمایش ویدیو"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="bg-black">
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
