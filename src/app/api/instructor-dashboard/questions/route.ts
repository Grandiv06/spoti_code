import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getInstructorQuestions } from "@/server/services/instructor-questions.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const data = await getInstructorQuestions(user);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/instructor-dashboard/questions]", error);
    return NextResponse.json({ message: "خطا در دریافت سوالات دانشجویان" }, { status: 500 });
  }
}
