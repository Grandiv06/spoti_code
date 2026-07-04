import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getCourseLearningLesson } from "@/server/services/course-learning.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { courseId, lessonId } = await context.params;
    const data = await getCourseLearningLesson(user, courseId, lessonId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/my-courses/:courseId/learning/lessons/:lessonId]", error);
    return NextResponse.json({ message: "خطا در دریافت درس" }, { status: 500 });
  }
}
