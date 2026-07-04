import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { updateAdminCourseRequestStatus } from "@/server/services/instructor-course-draft.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { status?: unknown; note?: unknown };

    if (body.status !== "approved" && body.status !== "rejected") {
      return NextResponse.json({ message: "وضعیت درخواست دوره معتبر نیست" }, { status: 400 });
    }

    const data = await updateAdminCourseRequestStatus(user, courseId, body.status, body.note);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/admin-dashboard/requests/courses/:courseId]", error);
    return NextResponse.json({ message: "خطا در بروزرسانی درخواست دوره" }, { status: 500 });
  }
}
