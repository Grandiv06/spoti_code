import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import {
  getAdminUserInternalNote,
  updateAdminUserInternalNote,
} from "@/server/services/admin-user.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const data = await getAdminUserInternalNote(adminUser, decodeURIComponent(id));

    if (!data) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/users/:id/internal-note]", error);
    return NextResponse.json({ message: "خطا در دریافت یادداشت داخلی" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const adminUser = await requireAuthUser(request);
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { note?: unknown };
    const data = await updateAdminUserInternalNote(adminUser, decodeURIComponent(id), body.note);

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[PATCH /api/admin-dashboard/users/:id/internal-note]", error);
    return NextResponse.json({ message: "خطا در ذخیره یادداشت داخلی" }, { status: 500 });
  }
}
