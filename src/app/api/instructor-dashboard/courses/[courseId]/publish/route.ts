import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { submitInstructorCourseForPublish } from "@/server/services/instructor-course-draft.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const data = await submitInstructorCourseForPublish(user, courseId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/instructor-dashboard/courses/:courseId/publish]", error);
    return NextResponse.json({ message: "خطا در ارسال دوره برای انتشار" }, { status: 500 });
  }
}
