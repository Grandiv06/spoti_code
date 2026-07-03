import { NextRequest, NextResponse } from "next/server";
import { getPublicInstructorProfile } from "@/server/services/instructor.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const result = await getPublicInstructorProfile(decodeURIComponent(slug));

    if (!result) {
      return NextResponse.json({ message: "پروفایل استاد پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/instructors/public/:slug]", error);
    return NextResponse.json({ message: "خطا در دریافت پروفایل استاد" }, { status: 500 });
  }
}
