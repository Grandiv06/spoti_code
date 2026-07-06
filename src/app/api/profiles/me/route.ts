import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/server/auth/request-auth";
import type { UpsertPanelProfileInput } from "@/server/dto/panel-profile.dto";
import { handleApiRouteError } from "@/server/http/api-error";
import { getMyProfile, updateMyProfile } from "@/server/services/profile.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getMyProfile(user);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "GET /api/profiles/me", "خطا در دریافت پروفایل");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as UpsertPanelProfileInput;
    const data = await updateMyProfile(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, "PUT /api/profiles/me", "ذخیره پروفایل انجام نشد");
  }
}
