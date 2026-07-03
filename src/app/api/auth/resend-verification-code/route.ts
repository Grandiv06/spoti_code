import { NextRequest, NextResponse } from "next/server";
import { sendVerificationCode } from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phoneNumber?: string };
    const data = await sendVerificationCode(body.phoneNumber ?? "");
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ارسال کد تایید انجام نشد";
    const status = message.includes("معتبر") ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
