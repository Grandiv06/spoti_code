import { NextRequest, NextResponse } from "next/server";
import { revokeSessionAndLogin } from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      pendingLoginToken?: string;
      revokeSessionId?: string;
    };

    if (!body.pendingLoginToken?.trim() || !body.revokeSessionId?.trim()) {
      return NextResponse.json({ message: "درخواست نامعتبر است" }, { status: 400 });
    }

    const data = await revokeSessionAndLogin(body.pendingLoginToken.trim(), body.revokeSessionId.trim());
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ورود انجام نشد";
    const status = message.includes("منقضی") || message.includes("پیدا نشد") ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
