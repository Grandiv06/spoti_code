import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { sendAdminTicketMessage } from "@/server/services/admin-ticket.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { body?: unknown; message?: unknown };
    const data = await sendAdminTicketMessage(
      adminUser,
      decodeURIComponent(id),
      body.body ?? body.message
    );

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/tickets/admin/:id/messages]", error);
    return NextResponse.json({ message: "خطا در ارسال پاسخ" }, { status: 500 });
  }
}
