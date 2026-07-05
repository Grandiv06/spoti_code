import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { deleteAdminDiscount, updateAdminDiscount } from "@/server/services/discount.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as unknown;
    const discount = await updateAdminDiscount(user, id, body);
    return NextResponse.json({ data: { discount } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PUT /api/admin-dashboard/discounts/:id]", error);
    return NextResponse.json({ message: "خطا در ویرایش کد تخفیف" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(_request);
    const { id } = await context.params;
    await deleteAdminDiscount(user, id);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[DELETE /api/admin-dashboard/discounts/:id]", error);
    return NextResponse.json({ message: "خطا در حذف کد تخفیف" }, { status: 500 });
  }
}
