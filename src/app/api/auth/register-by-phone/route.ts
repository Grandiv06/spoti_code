import { NextRequest, NextResponse } from "next/server";
import {
  registerByPhone,
  toPublicAuthErrorMessage,
} from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phoneNumber?: string; fullName?: string };
    const data = await registerByPhone(body.phoneNumber ?? "", body.fullName);
    return NextResponse.json({ data });
  } catch (error) {
    const message = toPublicAuthErrorMessage(error, "ثبت‌نام انجام نشد. دوباره تلاش کنید.");
    const status = message.includes("الزامی") || message.includes("معتبر") ? 400 : 500;
    console.error("[POST /api/auth/register-by-phone]", error);
    return NextResponse.json({ message }, { status });
  }
}
