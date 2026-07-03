import { NextRequest, NextResponse } from "next/server";
import { getPublicCourseById } from "@/server/services/course.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await getPublicCourseById(decodeURIComponent(id));

    if (!result) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/courses/public/:id]", error);
    return NextResponse.json({ message: "خطا در دریافت جزئیات دوره" }, { status: 500 });
  }
}
