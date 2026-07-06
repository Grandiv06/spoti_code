import { CourseCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getPublicCourses } from "@/server/services/course.service";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = new Set<string>(Object.values(CourseCategory));

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "50");
    const search = searchParams.get("search") ?? undefined;
    const rawCategory = searchParams.get("category") ?? undefined;
    const category =
      rawCategory && VALID_CATEGORIES.has(rawCategory)
        ? (rawCategory as CourseCategory)
        : undefined;

    const result = await getPublicCourses({ page, limit, search, category });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/courses/public]", error);
    return NextResponse.json({ message: "خطا در دریافت دوره‌ها" }, { status: 500 });
  }
}
