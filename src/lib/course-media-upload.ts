import { API_BASE_URL } from "@/lib/api-config";
import { getAccessToken } from "@/lib/auth-tokens";

type UploadKind = "intro" | "lesson";

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
  lessonId?: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  if (lessonId) formData.append("lessonId", lessonId);

  const token = getAccessToken();
  const response = await fetch(
    `${API_BASE_URL}/api/instructor-dashboard/courses/${encodeURIComponent(courseId)}/media`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "آپلود ویدیو انجام نشد");
  }

  const url = unwrapUploadUrl(await response.json());
  if (!url) {
    throw new Error("آدرس ویدیو از سرور دریافت نشد");
  }

  return url;
}
