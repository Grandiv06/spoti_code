import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { inquireAndSyncPayment } from "@/server/services/checkout.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const trackId = body.trackId ? String(body.trackId).trim() : "";

    if (!trackId) {
      return NextResponse.json({ message: "شناسه پیگیری trackId الزامی است" }, { status: 400 });
    }

    const result = await inquireAndSyncPayment(trackId);
    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "خطا در استعلام تراکنش";
    console.error("[POST /api/payment/zibal/inquiry]", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
