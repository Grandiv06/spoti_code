import { API_BASE_URL } from "@/lib/api-config";
import { getAccessToken } from "@/lib/auth-tokens";

type UploadKind = "intro" | "lesson" | "attachment" | "cover";

export type UploadProgressHandler = (percent: number) => void;

function unwrapUploadUrl(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as Record<string, unknown>;
  const data = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : root;
  const url = data.url;
  return typeof url === "string" && url.trim() ? url.trim() : "";
}

export async function uploadCourseMediaFile(
  courseId: string,
  file: File,
  kind: UploadKind,
  lessonId?: string,
  onProgress?: UploadProgressHandler
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  if (lessonId) formData.append("lessonId", lessonId);

  const token = getAccessToken();
  const endpoint = `${API_BASE_URL}/api/instructor-dashboard/courses/${encodeURIComponent(courseId)}/media`;

  if (typeof XMLHttpRequest === "undefined") {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "آپلود ویدیو انجام نشد");
    }

    onProgress?.(100);
    const url = unwrapUploadUrl(await response.json());
    if (!url) {
      throw new Error("آدرس ویدیو از سرور دریافت نشد");
    }
    return url;
  }

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const percent = Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100)));
      onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(xhr.responseText || "آپلود ویدیو انجام نشد"));
        return;
      }

      try {
        const payload = JSON.parse(xhr.responseText) as unknown;
        const url = unwrapUploadUrl(payload);
        if (!url) {
          reject(new Error("آدرس ویدیو از سرور دریافت نشد"));
          return;
        }
        onProgress?.(100);
        resolve(url);
      } catch {
        reject(new Error("پاسخ آپلود ویدیو نامعتبر بود"));
      }
    };

    xhr.onerror = () => reject(new Error("آپلود ویدیو انجام نشد"));
    xhr.onabort = () => reject(new Error("آپلود ویدیو لغو شد"));
    xhr.send(formData);
  });
}
