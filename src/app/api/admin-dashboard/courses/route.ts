import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getAdminCourseRequests } from "@/server/services/instructor-course-draft.service";
import { ensureCourseApprovalSchema } from "@/server/services/course-approval-schema.service";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    if (user.role !== "ADMIN") {
      throw new AuthError("دسترسی ادمین لازم است", 403);
    }

    await ensureCourseApprovalSchema();
    const pending = await getAdminCourseRequests(user, { status: "pending" });
    const approved = await getAdminCourseRequests(user, { status: "approved" });
    const rejected = await getAdminCourseRequests(user, { status: "rejected" });
    const draftRows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT
        c."id",
        c."slug",
        c."title",
        c."shortDescription",
        c."description",
        c."category",
        c."categoryTitle",
        i."name" as "instructor",
        c."cover",
        c."thumbnail",
        c."difficulty",
        c."level",
        c."durationHours",
        c."price",
        c."status",
        c."approvalStatus",
        c."studentsCount",
        c."revenue",
        c."rating",
        c."updatedAt",
        c."createdAt"
      FROM "Course" c
      INNER JOIN "Instructor" i ON i."id" = c."instructorId"
      WHERE c."approvalStatus" = 'draft'
      ORDER BY c."updatedAt" DESC
    `;

    return NextResponse.json({
      data: {
        items: [...pending.items, ...approved.items, ...rejected.items, ...draftRows],
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
