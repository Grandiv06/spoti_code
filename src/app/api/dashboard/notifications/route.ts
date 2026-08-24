import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { getUserNotifications } from "@/server/services/notification.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const notifications = await getUserNotifications(user);
    return NextResponse.json({ notifications });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/dashboard/notifications]", error);
    return NextResponse.json({ message: "خطا در دریافت اعلان‌ها" }, { status: 500 });
  }
}
