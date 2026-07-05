import { NextRequest, NextResponse } from "next/server";
import { getPublicUserProfile } from "@/server/services/profile.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const profile = await getPublicUserProfile(userId);

    if (!profile) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("[GET /api/profiles/:userId]", error);
    return NextResponse.json({ message: "خطا در دریافت پروفایل کاربر" }, { status: 500 });
  }
}
