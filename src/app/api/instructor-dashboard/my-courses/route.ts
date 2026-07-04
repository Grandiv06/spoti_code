import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getInstructorDashboardCourses } from "@/server/services/instructor-dashboard.service";

export const dynamic = "force-dynamic";

function readNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorDashboardCourses(
      user,
      readNumber(request.nextUrl.searchParams.get("limit"))
    );
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/my-courses]", error);
    return NextResponse.json({ message: "خطا در دریافت دوره‌های استاد" }, { status: 500 });
  }
}
