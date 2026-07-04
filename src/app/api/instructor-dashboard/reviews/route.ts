import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getInstructorReviews } from "@/server/services/instructor-reviews.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const { searchParams } = request.nextUrl;
    const data = await getInstructorReviews(user, {
      status: searchParams.get("status") ?? undefined,
      rating: searchParams.get("rating") ?? undefined,
      courseId: searchParams.get("courseId") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/reviews]", error);
    return NextResponse.json({ message: "خطا در دریافت نظرات دانشجویان" }, { status: 500 });
  }
}
