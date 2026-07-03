import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { createMyTicket } from "@/server/services/ticket.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json()) as {
      subject?: string;
      title?: string;
      description?: string;
      firstMessage?: string;
      category?: string;
      priority?: string;
    };

    const data = await createMyTicket(user, body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "ثبت تیکت انجام نشد";
    const status = message.includes("الزامی") ? 400 : 500;
    if (status === 500) console.error("[POST /api/tickets/my]", error);
    return NextResponse.json({ message }, { status });
  }
}
