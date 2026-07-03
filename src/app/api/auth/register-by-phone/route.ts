import { NextRequest, NextResponse } from "next/server";
import { registerByPhone } from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phoneNumber?: string; fullName?: string };
    const data = await registerByPhone(body.phoneNumber ?? "", body.fullName);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ثبت‌نام انجام نشد";
    const status = message.includes("الزامی") || message.includes("معتبر") ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
