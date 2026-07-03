import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getMyTicketMessages, sendMyTicketReply } from "@/server/services/ticket.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { id } = await context.params;
    const data = await getMyTicketMessages(user, id);

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/tickets/my/:id/messages]", error);
    return NextResponse.json({ message: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { id } = await context.params;
    const body = (await request.json()) as { body?: string; message?: string; text?: string };
    const text = body.body ?? body.message ?? body.text ?? "";
    const data = await sendMyTicketReply(user, id, text);

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "ارسال پیام انجام نشد";
    const status = message.includes("الزامی") || message.includes("بسته") ? 400 : 500;
    if (status === 500) console.error("[POST /api/tickets/my/:id/messages]", error);
    return NextResponse.json({ message }, { status });
  }
}
