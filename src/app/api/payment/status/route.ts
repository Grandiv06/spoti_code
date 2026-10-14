import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/server/services/checkout.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const trackId = url.searchParams.get("trackId") || url.searchParams.get("orderId");

  if (!trackId) {
    return NextResponse.json({ message: "شناسه تراکنش مشخص نشده است" }, { status: 400 });
  }

  try {
    const payment = await getPaymentStatus(trackId);
    if (!payment) {
      return NextResponse.json({ message: "تراکنش یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    console.error("[GET /api/payment/status]", error);
    return NextResponse.json({ message: "خطا در دریافت وضعیت تراکنش" }, { status: 500 });
  }
}
