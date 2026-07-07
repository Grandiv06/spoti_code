import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { SecurityError, startTotpSetup } from "@/server/services/user-security.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await startTotpSetup(user);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError || error instanceof SecurityError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/dashboard/security/totp/setup]", error);
    return NextResponse.json({ message: "شروع فعال‌سازی انجام نشد" }, { status: 500 });
  }
}
