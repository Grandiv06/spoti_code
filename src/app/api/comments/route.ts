import { NextRequest, NextResponse } from "next/server";
import type { CreateCourseCommentInputDto } from "@/server/dto/course-comment.dto";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { createPublicCourseCommentForUser } from "@/server/services/comment.service";

export const dynamic = "force-dynamic";

async function getOptionalAuthUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return requireAuthUser(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCourseCommentInputDto;

    if (!body?.content?.trim() || !body.commentableId || body.commentableType !== "course") {
      return NextResponse.json({ message: "اطلاعات نظر نامعتبر است" }, { status: 400 });
    }

    const user = await getOptionalAuthUser(request);
    const result = await createPublicCourseCommentForUser(body, user);

    if (!result) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/comments]", error);
    return NextResponse.json({ message: "خطا در ثبت نظر" }, { status: 500 });
  }
}
