import { NextRequest, NextResponse } from "next/server";
import { refreshAuthToken } from "@/server/auth/phone-auth.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { refreshToken?: string };
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;
    const data = await refreshAuthToken(body.refreshToken ?? bearerToken);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تازه‌سازی توکن انجام نشد";
    return NextResponse.json({ message }, { status: 401 });
  }
}
