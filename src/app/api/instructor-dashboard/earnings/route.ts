import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/server/auth/request-auth";
import { handleApiRouteError } from "@/server/http/api-error";
import { getInstructorEarningsData } from "@/server/services/instructor-earnings.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorEarningsData(user);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(
      error,
      "GET /api/instructor-dashboard/earnings",
      "خطا در دریافت گزارش درآمد و تراکنش‌های استاد"
    );
  }
}
