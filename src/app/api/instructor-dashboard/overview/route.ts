import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/server/auth/request-auth";
import { handleApiRouteError } from "@/server/http/api-error";
import { getInstructorDashboardOverview } from "@/server/services/instructor-dashboard.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorDashboardOverview(user);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "GET /api/instructor-dashboard/overview", "خطا در دریافت داشبورد استاد");
  }
}
