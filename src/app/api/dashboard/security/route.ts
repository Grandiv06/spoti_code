import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getSecurityStatus } from "@/server/services/user-security.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    return NextResponse.json({ data: getSecurityStatus(user) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/security]", error);
    return NextResponse.json({ message: "خطا در دریافت وضعیت امنیت" }, { status: 500 });
  }
}
