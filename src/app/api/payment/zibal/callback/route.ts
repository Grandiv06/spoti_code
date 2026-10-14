import { NextRequest, NextResponse } from "next/server";
import { handleZibalCallback } from "@/server/services/checkout.service";
import { resolvePublicBaseUrl } from "@/server/services/zibal.service";

export const dynamic = "force-dynamic";

async function processCallback(request: NextRequest) {
  const url = new URL(request.url);
  let trackId = url.searchParams.get("trackId");
  let success = url.searchParams.get("success");
  let status = url.searchParams.get("status");
  let orderId = url.searchParams.get("orderId");

  // اگر متد POST بود (مانند Lazy یا ارسال بدنه فرم)
  if (request.method === "POST") {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        trackId = trackId || (body.trackId != null ? String(body.trackId) : null);
        success = success || (body.success != null ? String(body.success) : null);
        status = status || (body.status != null ? String(body.status) : null);
        orderId = orderId || (body.orderId != null ? String(body.orderId) : null);
      } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        const formData = await request.formData().catch(() => null);
        if (formData) {
          trackId = trackId || (formData.get("trackId")?.toString() ?? null);
          success = success || (formData.get("success")?.toString() ?? null);
          status = status || (formData.get("status")?.toString() ?? null);
          orderId = orderId || (formData.get("orderId")?.toString() ?? null);
        }
      }
    } catch (err) {
      console.warn("[Zibal Callback Body Parse Error]", err);
    }
  }

  try {
    const result = await handleZibalCallback({
      trackId,
      success,
      status,
      orderId,
    });

    const baseUrl = resolvePublicBaseUrl();
    const redirectUrl = new URL("/checkout/result", baseUrl);
    redirectUrl.searchParams.set("status", result.status);
    if (result.trackId) redirectUrl.searchParams.set("trackId", result.trackId);
    if (result.refNumber) redirectUrl.searchParams.set("refNumber", result.refNumber);
    if (result.orderId) redirectUrl.searchParams.set("orderId", result.orderId);
    if (result.amount) redirectUrl.searchParams.set("amount", String(result.amount));
    if (result.message) redirectUrl.searchParams.set("message", result.message);

    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  } catch (err) {
    console.error("[Zibal Callback Error]", err);
    const baseUrl = resolvePublicBaseUrl();
    const redirectUrl = new URL("/checkout/result", baseUrl);
    redirectUrl.searchParams.set("status", "failed");
    if (trackId) redirectUrl.searchParams.set("trackId", trackId);
    if (orderId) redirectUrl.searchParams.set("orderId", orderId);
    redirectUrl.searchParams.set(
      "message",
      err instanceof Error ? err.message : "خطای غیرمنتظره در پردازش نتیجه تراکنش رخ داده است."
    );
    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  }
}

export async function GET(request: NextRequest) {
  return processCallback(request);
}

export async function POST(request: NextRequest) {
  return processCallback(request);
}
