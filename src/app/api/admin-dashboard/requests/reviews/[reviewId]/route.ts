import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  updateAdminReviewRequestStatus,
} from "@/server/services/admin-review-requests.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { reviewId } = await context.params;
    const body = (await request.json()) as { status?: unknown; action?: unknown };
    const rawStatus = typeof body.status === "string" ? body.status : typeof body.action === "string" ? body.action : "";

    if (rawStatus !== "approved" && rawStatus !== "rejected") {
      return NextResponse.json({ message: "برای عملیات تایید یا رد، وضعیت معتبر ارسال کنید" }, { status: 400 });
    }

    const data = await updateAdminReviewRequestStatus(user, reviewId, rawStatus);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/admin-dashboard/requests/reviews/:reviewId]", error);
    return NextResponse.json({ message: "خطا در بروزرسانی وضعیت نظر" }, { status: 500 });
  }
}
