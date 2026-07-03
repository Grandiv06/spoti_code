import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getMyTicketById } from "@/server/services/ticket.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser(request);
    const { id } = await context.params;
    const data = await getMyTicketById(user, id);

    if (!data) {
      return NextResponse.json({ message: "تیکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/tickets/my/:id]", error);
    return NextResponse.json({ message: "خطا در دریافت تیکت" }, { status: 500 });
  }
}
