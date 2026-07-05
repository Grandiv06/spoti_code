import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getAdminCourseRequests } from "@/server/services/instructor-course-draft.service";
import { ensureCourseApprovalSchema } from "@/server/services/course-approval-schema.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    if (user.role !== "ADMIN") {
      throw new AuthError("دسترسی ادمین لازم است", 403);
    }

    await ensureCourseApprovalSchema();
    const [pending, approved, rejected, draft] = await Promise.all([
      getAdminCourseRequests(user, { status: "pending" }),
      getAdminCourseRequests(user, { status: "approved" }),
      getAdminCourseRequests(user, { status: "rejected" }),
      getAdminCourseRequests(user, { status: "draft" }),
    ]);

    return NextResponse.json({
      data: {
        items: [...pending.items, ...approved.items, ...rejected.items, ...draft.items],
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/courses]", error);
    return NextResponse.json({ message: "خطا در دریافت دوره‌های ادمین" }, { status: 500 });
  }
}
