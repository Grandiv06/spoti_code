import { NextResponse } from "next/server";
import { AuthError } from "@/server/auth/request-auth";
import { isPrismaConnectionError } from "@/server/db/prisma";

export function handleApiRouteError(error: unknown, context: string, fallbackMessage: string) {
  if (error instanceof AuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (isPrismaConnectionError(error)) {
    console.error(`[${context}] Database unavailable`, error);
    return NextResponse.json(
      { message: "اتصال به پایگاه داده برقرار نیست. لطفاً چند لحظه بعد دوباره تلاش کنید." },
      { status: 503 }
    );
  }

  console.error(`[${context}]`, error);
  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
