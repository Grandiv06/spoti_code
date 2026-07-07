import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { disableTotp, SecurityError } from "@/server/services/user-security.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    const code = body?.code?.trim();
    if (!code) {
      return NextResponse.json({ message: "برای غیرفعال‌سازی، کد احراز هویت الزامی است" }, { status: 400 });
    }

    const data = await disableTotp(user, code);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError || error instanceof SecurityError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/dashboard/security/totp/disable]", error);
    return NextResponse.json({ message: "غیرفعال‌سازی انجام نشد" }, { status: 500 });
  }
}
