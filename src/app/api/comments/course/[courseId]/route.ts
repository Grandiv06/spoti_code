import { NextRequest, NextResponse } from "next/server";
import { getCourseComments } from "@/server/services/comment.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");

    const result = await getCourseComments(decodeURIComponent(courseId), page, limit);

    if (!result) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/comments/course/:courseId]", error);
    return NextResponse.json({ message: "خطا در دریافت نظرات" }, { status: 500 });
  }
}
