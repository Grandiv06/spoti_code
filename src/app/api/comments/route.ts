import { NextRequest, NextResponse } from "next/server";
import type { CreateCourseCommentInputDto } from "@/server/dto/course-comment.dto";
import { createPublicCourseComment } from "@/server/services/comment.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCourseCommentInputDto;

    if (!body?.content?.trim() || !body.commentableId || body.commentableType !== "course") {
      return NextResponse.json({ message: "اطلاعات نظر نامعتبر است" }, { status: 400 });
    }

    const result = await createPublicCourseComment(body);

    if (!result) {
      return NextResponse.json({ message: "دوره پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/comments]", error);
    return NextResponse.json({ message: "خطا در ثبت نظر" }, { status: 500 });
  }
}
