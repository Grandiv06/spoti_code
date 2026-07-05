import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { mapCourseQaList, type CourseLearningQuestion } from "@/lib/course-qa";

export type { CourseLearningQuestion };

export async function fetchMyRecentQuestions(limit = 5): Promise<CourseLearningQuestion[]> {
  const response = await apiGetNoMock<unknown>(
    `/api/qas/my?page=1&limit=${limit}`,
    getAuthHeaders()
  );
  return mapCourseQaList(response);
}
