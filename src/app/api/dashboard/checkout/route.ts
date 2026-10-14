import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { initiateCheckout } from "@/server/services/checkout.service";
import { resolvePublicBaseUrl } from "@/server/services/zibal.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as unknown;
    const origin = resolvePublicBaseUrl();
    const data = await initiateCheckout(user, body, origin);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "خطا در پردازش پرداخت";
    console.error("[POST /api/dashboard/checkout]", error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
