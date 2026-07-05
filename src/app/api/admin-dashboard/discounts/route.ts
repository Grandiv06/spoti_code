import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  createAdminDiscount,
  getAdminDiscountCourseOptions,
  getAdminDiscounts,
} from "@/server/services/discount.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const { searchParams } = new URL(request.url);

    if (searchParams.get("courses") === "1") {
      const courses = await getAdminDiscountCourseOptions(user);
      return NextResponse.json({ data: { courses } });
    }

    const discounts = await getAdminDiscounts(user);
    return NextResponse.json({ data: { discounts } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/discounts]", error);
    return NextResponse.json({ message: "خطا در دریافت کدهای تخفیف" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as unknown;
    const discount = await createAdminDiscount(user, body);
    return NextResponse.json({ data: { discount } }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/admin-dashboard/discounts]", error);
    return NextResponse.json({ message: "خطا در ثبت کد تخفیف" }, { status: 500 });
  }
}
