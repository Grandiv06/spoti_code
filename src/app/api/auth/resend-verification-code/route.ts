import { NextRequest, NextResponse } from "next/server";
import {
  sendVerificationCode,
  toPublicAuthErrorMessage,
} from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phoneNumber?: string };
    const data = await sendVerificationCode(body.phoneNumber ?? "");
    return NextResponse.json({ data });
  } catch (error) {
    const message = toPublicAuthErrorMessage(error, "ارسال کد تایید انجام نشد. دوباره تلاش کنید.");
    const status = message.includes("معتبر") ? 400 : 500;
    console.error("[POST /api/auth/resend-verification-code]", error);
    return NextResponse.json({ message }, { status });
  }
}
