import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { completeCheckout } from "@/server/services/checkout.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as unknown;
    const data = await completeCheckout(user, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/dashboard/checkout]", error);
    return NextResponse.json({ message: "خطا در تکمیل خرید" }, { status: 500 });
  }
}
