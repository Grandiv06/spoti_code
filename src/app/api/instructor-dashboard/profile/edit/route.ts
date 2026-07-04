import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  getInstructorProfileEditForm,
  updateInstructorProfileEditForm,
} from "@/server/services/instructor-dashboard.service";
import type { UpdateInstructorProfileEditDto } from "@/server/dto/instructor-profile-page.dto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorProfileEditForm(user);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/profile/edit]", error);
    return NextResponse.json({ message: "خطا در دریافت فرم ویرایش پروفایل مدرس" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as UpdateInstructorProfileEditDto;
    const data = await updateInstructorProfileEditForm(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PUT /api/instructor-dashboard/profile/edit]", error);
    return NextResponse.json({ message: "خطا در ذخیره فرم ویرایش پروفایل مدرس" }, { status: 500 });
  }
}
