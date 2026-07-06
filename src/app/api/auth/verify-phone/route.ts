import { NextRequest, NextResponse } from "next/server";
import { getClientIp, parseDeviceInfo } from "@/server/auth/device-info";
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
    const userAgent = request.headers.get("user-agent");
    const data = await verifyPhoneLogin(body.phoneNumber ?? "", otp, body.fullName, {
      device: parseDeviceInfo(userAgent),
      userAgent,
      ipAddress: getClientIp(request),
    });
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ورود انجام نشد";
    const status =
      message.includes("نامعتبر") || message.includes("معتبر") ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
