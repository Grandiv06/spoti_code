/** Format seconds as MM:SS (or H:MM:SS when ≥ 1 hour). */
export function formatVideoDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00";
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function readDurationFromObjectUrl(objectUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      video.onloadedmetadata = null;
      video.onerror = null;
    };

    video.onloadedmetadata = () => {
      const duration = video.duration;
      cleanup();
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("مدت ویدیو قابل خواندن نیست."));
        return;
      }
      resolve(duration);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("خواندن متادیتای ویدیو انجام نشد."));
    };

    video.src = objectUrl;
  });
}

/** Read duration (seconds) from a local video File via browser metadata. */
export async function readVideoDurationFromFile(file: File): Promise<number> {
  const objectUrl = URL.createObjectURL(file);
  try {
    return await readDurationFromObjectUrl(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Read duration (seconds) from an existing video URL (blob or remote). */
export async function readVideoDurationFromUrl(url: string): Promise<number> {
  return readDurationFromObjectUrl(url);
}
