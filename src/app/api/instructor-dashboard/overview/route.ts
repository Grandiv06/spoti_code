import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getInstructorDashboardOverview } from "@/server/services/instructor-dashboard.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorDashboardOverview(user);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/overview]", error);
    return NextResponse.json({ message: "خطا در دریافت داشبورد استاد" }, { status: 500 });
  }
}
