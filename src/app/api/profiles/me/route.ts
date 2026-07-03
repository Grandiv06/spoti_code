import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import type { UpsertPanelProfileInput } from "@/server/dto/panel-profile.dto";
import { getMyProfile, updateMyProfile } from "@/server/services/profile.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getMyProfile(user);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/profiles/me]", error);
    return NextResponse.json({ message: "خطا در دریافت پروفایل" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as UpsertPanelProfileInput;
    const data = await updateMyProfile(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PUT /api/profiles/me]", error);
    return NextResponse.json({ message: "ذخیره پروفایل انجام نشد" }, { status: 500 });
  }
}
