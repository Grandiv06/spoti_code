import { NextRequest, NextResponse } from "next/server";
import { getPublicCourseBySlug } from "@/server/services/course.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const result = await getPublicCourseBySlug(decodeURIComponent(slug));

    if (!result) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/courses/public/slug/:slug]", error);
    return NextResponse.json({ message: "خطا در دریافت جزئیات دوره" }, { status: 500 });
  }
}
