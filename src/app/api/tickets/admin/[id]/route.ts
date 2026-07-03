import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  getAdminTicketById,
  updateAdminTicketStatus,
} from "@/server/services/admin-ticket.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const data = await getAdminTicketById(adminUser, decodeURIComponent(id));

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/tickets/admin/:id]", error);
    return NextResponse.json({ message: "خطا در دریافت تیکت" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { status?: unknown };
    const data = await updateAdminTicketStatus(adminUser, decodeURIComponent(id), body.status);

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/tickets/admin/:id]", error);
    return NextResponse.json({ message: "خطا در بروزرسانی تیکت" }, { status: 500 });
  }
}
