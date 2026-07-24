import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { handleApiRouteError } from "@/server/http/api-error";
import { getInstructorCourseDetail } from "@/server/services/instructor-course-detail.service";
import { deleteInstructorDraftCourse } from "@/server/services/instructor-course-delete.service";

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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const data = await deleteInstructorDraftCourse(user, courseId);
    return NextResponse.json({ data, message: "پیش‌نویس دوره حذف شد." });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return handleApiRouteError(
      error,
      "DELETE /api/instructor-dashboard/courses/:courseId",
      "خطا در حذف پیش‌نویس دوره"
    );
  }
}
