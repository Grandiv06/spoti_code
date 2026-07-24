import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { assertInstructor, resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";
import { ensureCourseApprovalSchema } from "@/server/services/course-approval-schema.service";
import { removeCourseMediaDirectory } from "@/server/services/course-media.service";

function normalizeApprovalStatus(value: unknown): "draft" | "pending" | "approved" | "rejected" {
  if (value === "pending" || value === "approved" || value === "rejected") return value;
  return "draft";
}

/** Instructor may permanently delete draft/rejected courses they own (not pending/published). */
export async function deleteInstructorDraftCourse(user: User, courseId: string) {
  assertInstructor(user);
  const instructor = await resolveInstructorForUser(user);
  if (!instructor) throw new AuthError("پروفایل مدرس پیدا نشد", 404);

  await ensureCourseApprovalSchema();
  const decodedId = decodeURIComponent(courseId);

  const [row] = await prisma.$queryRaw<
    Array<{
      id: string;
      status: string;
      approvalStatus: string | null;
      title: string;
      instructorId: string;
    }>
  >`
    SELECT "id", "status", "approvalStatus", "title", "instructorId"
    FROM "Course"
    WHERE "id" = ${decodedId}
    LIMIT 1
  `;

  if (!row || row.instructorId !== instructor.id) {
    throw new AuthError("دوره پیدا نشد یا دسترسی ندارید", 404);
  }

  const approval = normalizeApprovalStatus(row.approvalStatus);
  if (approval === "pending") {
    throw new AuthError("دوره در انتظار بررسی است و قابل حذف نیست", 400);
  }
  if (approval === "approved" || row.status === "published") {
    throw new AuthError("دوره منتشرشده قابل حذف از پنل مدرس نیست", 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.userOrder.deleteMany({ where: { courseId: row.id } });
    await tx.course.delete({ where: { id: row.id } });
  });

  await removeCourseMediaDirectory(row.id);

  return { id: row.id, title: row.title };
}
