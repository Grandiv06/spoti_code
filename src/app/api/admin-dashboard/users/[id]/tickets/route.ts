import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getAdminUserTickets } from "@/server/services/admin-user.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const tickets = await getAdminUserTickets(adminUser, decodeURIComponent(id));

    if (!tickets) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data: { tickets } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/users/:id/tickets]", error);
    return NextResponse.json({ message: "خطا در دریافت تیکت‌های کاربر" }, { status: 500 });
  }
}
