import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/server/auth/request-auth";
import { handleApiRouteError } from "@/server/http/api-error";
import {
  getInstructorProfile,
  updateInstructorProfile,
  type UpdateInstructorProfileInput,
} from "@/server/services/instructor-dashboard.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorProfile(user);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "GET /api/instructor-dashboard/profile", "خطا در دریافت پروفایل مدرس");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as UpdateInstructorProfileInput;
    const data = await updateInstructorProfile(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "PUT /api/instructor-dashboard/profile", "خطا در ذخیره پروفایل مدرس");
  }
}
