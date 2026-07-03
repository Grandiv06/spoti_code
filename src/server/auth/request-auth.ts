import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { parseUserIdFromAccessToken } from "@/server/auth/phone-auth.service";
import { prisma } from "@/server/db/prisma";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function extractBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export async function requireAuthUser(request: NextRequest): Promise<User> {
  const token = extractBearerToken(request);
  if (!token) {
    throw new AuthError("لطفاً وارد حساب کاربری شوید");
  }

  const userId = parseUserIdFromAccessToken(token);
  if (!userId) {
    throw new AuthError("نشست شما منقضی شده است. دوباره وارد شوید");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthError("کاربر پیدا نشد");
  }

  return user;
}
