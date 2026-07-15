import { CourseCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getPublicCourses } from "@/server/services/course.service";

// Public catalog is cached in-process; allow CDN/browser short reuse as well.
export const revalidate = 60;

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
    const response = NextResponse.json(result);
    // Search stays uncached; category/catalog pages reuse for a minute.
    if (!search) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );
    } else {
      response.headers.set("Cache-Control", "private, no-store");
    }
    return response;
  } catch (error) {
    console.error("[GET /api/courses/public]", error);
    return NextResponse.json({ message: "خطا در دریافت دوره‌ها" }, { status: 500 });
  }
}
