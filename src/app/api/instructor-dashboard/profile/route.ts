import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
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
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/profile]", error);
    return NextResponse.json({ message: "خطا در دریافت پروفایل مدرس" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as UpdateInstructorProfileInput;
    const data = await updateInstructorProfile(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PUT /api/instructor-dashboard/profile]", error);
    return NextResponse.json({ message: "خطا در ذخیره پروفایل مدرس" }, { status: 500 });
  }
}
