import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  createCourseLearningCourseQa,
  getCourseLearningCourseQa,
} from "@/server/services/course-learning.service";
import type { CreateCourseLearningQaDto } from "@/server/dto/course-learning.dto";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const data = await getCourseLearningCourseQa(user, courseId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/my-courses/:courseId/learning/qa]", error);
    return NextResponse.json({ message: "خطا در دریافت پرسش و پاسخ دوره" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { courseId } = await context.params;
    const body = (await request.json()) as CreateCourseLearningQaDto;
    const data = await createCourseLearningCourseQa(user, courseId, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/dashboard/my-courses/:courseId/learning/qa]", error);
    return NextResponse.json({ message: "خطا در ثبت پرسش دوره" }, { status: 500 });
  }
}
