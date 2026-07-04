import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { createAdminUser, getAdminUsers } from "@/server/services/admin-user.service";

export const dynamic = "force-dynamic";

function readNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAuthUser(request);
    const searchParams = request.nextUrl.searchParams;
    const data = await getAdminUsers(adminUser, {
      search: searchParams.get("search") ?? undefined,
      email: searchParams.get("email") ?? undefined,
      phoneNumber: searchParams.get("phoneNumber") ?? undefined,
      nationalCode: searchParams.get("nationalCode") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      page: readNumber(searchParams.get("page")),
      limit: readNumber(searchParams.get("limit")),
    });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[GET /api/admin-dashboard/users]", error);
    return NextResponse.json({ message: "خطا در دریافت کاربران" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAuthUser(request);
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const data = await createAdminUser(adminUser, body);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/admin-dashboard/users]", error);
    return NextResponse.json({ message: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}
