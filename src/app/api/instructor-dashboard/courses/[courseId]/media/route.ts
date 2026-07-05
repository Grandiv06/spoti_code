import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { saveCourseMediaFile } from "@/server/services/course-media.service";
import { resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const decodedId = decodeURIComponent(courseId);

    const instructor = await resolveInstructorForUser(user);
    if (!instructor) {
      throw new AuthError("پروفایل مدرس پیدا نشد", 404);
    }

    const owned = await prisma.course.findFirst({
      where: { id: decodedId, instructorId: instructor.id },
      select: { id: true },
    });
    if (!owned) {
      throw new AuthError("دوره پیدا نشد یا دسترسی ندارید", 404);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "intro");
    const lessonId = formData.get("lessonId");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "فایل ویدیو ارسال نشده است" }, { status: 400 });
    }

    const resolvedKind =
      kind === "lesson" ? "lesson" : kind === "attachment" ? "attachment" : "intro";

    const url = await saveCourseMediaFile({
      courseId: decodedId,
      file,
      kind: resolvedKind,
      lessonId: typeof lessonId === "string" ? lessonId : undefined,
    });

    return NextResponse.json({ data: { url } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/instructor-dashboard/courses/:courseId/media]", error);
    const message = error instanceof Error ? error.message : "خطا در آپلود ویدیو";
    return NextResponse.json({ message }, { status: 500 });
  }
}
