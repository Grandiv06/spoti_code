import { NextRequest, NextResponse } from "next/server";
import { verifyPhoneLogin } from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      phoneNumber?: string;
      otp?: string;
      code?: string;
      fullName?: string;
    };
    const otp = body.otp ?? body.code;
    const data = await verifyPhoneLogin(body.phoneNumber ?? "", otp, body.fullName);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ورود انجام نشد";
    const status =
      message.includes("نامعتبر") || message.includes("معتبر") ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
