import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { answerInstructorQuestion } from "@/server/services/instructor-questions.service";
import type { AnswerInstructorQuestionDto } from "@/server/dto/instructor-questions.dto";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ questionId: string }> }
) {
  try {
    const user = await requireAuthUser(request);
    const { questionId } = await context.params;
    const body = (await request.json()) as AnswerInstructorQuestionDto;
    const data = await answerInstructorQuestion(user, questionId, body);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/instructor-dashboard/questions/:questionId/answer]", error);
    return NextResponse.json({ message: "خطا در ثبت پاسخ مدرس" }, { status: 500 });
  }
}
