import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getAdminCoursePreview } from "@/server/services/course.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(_request);
    const { courseId } = await context.params;
    const data = await getAdminCoursePreview(user, courseId);

    if (!data) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/requests/courses/:courseId/preview]", error);
    return NextResponse.json({ message: "خطا در دریافت پیش‌نمایش دوره" }, { status: 500 });
  }
}
