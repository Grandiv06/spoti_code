import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { upsertInstructorCourseDraft } from "@/server/services/instructor-course-draft.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as unknown;
    const data = await upsertInstructorCourseDraft(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/instructor-dashboard/courses/drafts]", error);
    return NextResponse.json({ message: "خطا در ذخیره پیش‌نویس دوره" }, { status: 500 });
  }
}
