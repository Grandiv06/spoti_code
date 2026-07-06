import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  listUserSessionDtos,
  purgeExpiredSessions,
  revokeUserSession,
} from "@/server/auth/session.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const currentSessionId = request.nextUrl.searchParams.get("currentSessionId");
    const sessions = await listUserSessionDtos(user.id, currentSessionId);
    return NextResponse.json({ data: { sessions, maxSessions: 2 } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/sessions]", error);
    return NextResponse.json({ message: "خطا در دریافت نشست‌ها" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const sessionId =
      request.nextUrl.searchParams.get("sessionId")?.trim() ||
      ((await request.json().catch(() => null)) as { sessionId?: string } | null)?.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ message: "شناسه نشست الزامی است" }, { status: 400 });
    }

    const revoked = await revokeUserSession(sessionId, user.id);
    if (!revoked) {
      return NextResponse.json({ message: "نشست پیدا نشد" }, { status: 404 });
    }

    await purgeExpiredSessions(user.id);
    const currentSessionId = request.nextUrl.searchParams.get("currentSessionId");
    const sessions = await listUserSessionDtos(user.id, currentSessionId);
    return NextResponse.json({ data: { sessions, maxSessions: 2 } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[DELETE /api/dashboard/sessions]", error);
    return NextResponse.json({ message: "حذف نشست انجام نشد" }, { status: 500 });
  }
}
