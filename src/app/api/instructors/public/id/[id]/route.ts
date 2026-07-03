import { NextRequest, NextResponse } from "next/server";
import { getPublicInstructorProfileById } from "@/server/services/instructor.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await getPublicInstructorProfileById(decodeURIComponent(id));

    if (!result) {
      return NextResponse.json({ message: "پروفایل استاد پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/instructors/public/id/:id]", error);
    return NextResponse.json({ message: "خطا در دریافت پروفایل استاد" }, { status: 500 });
  }
}
