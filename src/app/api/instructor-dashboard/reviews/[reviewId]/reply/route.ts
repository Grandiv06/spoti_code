import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  deleteInstructorReviewReply,
  replyToInstructorReview,
} from "@/server/services/instructor-reviews.service";
import type { ReplyInstructorReviewDto } from "@/server/dto/instructor-reviews.dto";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { reviewId } = await context.params;
    const body = (await request.json()) as ReplyInstructorReviewDto;
    const data = await replyToInstructorReview(user, reviewId, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/instructor-dashboard/reviews/:reviewId/reply]", error);
    return NextResponse.json({ message: "خطا در ثبت پاسخ نظر" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { reviewId } = await context.params;
    const data = await deleteInstructorReviewReply(user, reviewId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[DELETE /api/instructor-dashboard/reviews/:reviewId/reply]", error);
    return NextResponse.json({ message: "خطا در حذف پاسخ نظر" }, { status: 500 });
  }
}
