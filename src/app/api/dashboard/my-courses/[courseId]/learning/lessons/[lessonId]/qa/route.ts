import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  createCourseLearningLessonQa,
  getCourseLearningLessonQa,
} from "@/server/services/course-learning.service";
import type { CreateCourseLearningQaDto } from "@/server/dto/course-learning.dto";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { courseId, lessonId } = await context.params;
    const data = await getCourseLearningLessonQa(user, courseId, lessonId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/my-courses/:courseId/learning/lessons/:lessonId/qa]", error);
    return NextResponse.json({ message: "خطا در دریافت پرسش و پاسخ درس" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { courseId, lessonId } = await context.params;
    const body = (await request.json()) as CreateCourseLearningQaDto;
    const data = await createCourseLearningLessonQa(user, courseId, lessonId, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/dashboard/my-courses/:courseId/learning/lessons/:lessonId/qa]", error);
    return NextResponse.json({ message: "خطا در ثبت پرسش درس" }, { status: 500 });
  }
}
