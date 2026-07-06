import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/server/auth/request-auth";
import { handleApiRouteError } from "@/server/http/api-error";
import { getInstructorCourseDetail } from "@/server/services/instructor-course-detail.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const data = await getInstructorCourseDetail(user, courseId);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "GET /api/instructor-dashboard/courses/:courseId", "خطا در دریافت جزئیات دوره");
  }
}
