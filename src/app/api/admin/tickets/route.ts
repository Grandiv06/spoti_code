import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getAdminTickets } from "@/server/services/admin-ticket.service";

export const dynamic = "force-dynamic";

function readNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAuthUser(request);
    const searchParams = request.nextUrl.searchParams;
    const data = await getAdminTickets(adminUser, {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: readNumber(searchParams.get("page")),
      limit: readNumber(searchParams.get("limit")),
    });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin/tickets]", error);
    return NextResponse.json({ message: "خطا در دریافت تیکت‌ها" }, { status: 500 });
  }
}
