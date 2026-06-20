import TeacherProfilePageClient from "./TeacherProfilePageClient";
import { API_BASE_URL } from "@/lib/api-config";
import { MOCK_API_TEACHER_ID } from "@/lib/public-instructors";

const FALLBACK_TEACHER_IDS = [MOCK_API_TEACHER_ID];

async function fetchTeacherIdsFromApi(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/public?limit=100`, {
      cache: "no-store",
    });

    if (!response.ok) return FALLBACK_TEACHER_IDS;

    const payload = (await response.json()) as {
      data?: { items?: Array<{ teacher?: { id?: string } }> };
    };

    const ids = [
      ...new Set(
        (payload.data?.items ?? [])
          .map((course) => course.teacher?.id)
          .filter((id): id is string => typeof id === "string" && id.length > 0)
      ),
    ];

    return ids.length > 0 ? ids : FALLBACK_TEACHER_IDS;
  } catch {
    return FALLBACK_TEACHER_IDS;
  }
}

export async function generateStaticParams() {
  const teacherIds = await fetchTeacherIdsFromApi();
  return teacherIds.map((id) => ({ id }));
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TeacherProfilePageClient key={id} teacherId={id} />;
}
