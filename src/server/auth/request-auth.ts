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

const USER_CACHE_TTL_MS = 60_000;

const userCache = new Map<string, { user: User; expiresAt: number }>();
const inflightUserLookups = new Map<string, Promise<User | null>>();

/**
 * Drops the cached user record so the next {@link requireAuthUser} reads fresh
 * state from the database. Call this after mutating user fields (e.g. TOTP
 * enable/disable) to avoid serving stale auth data for up to the cache TTL.
 */
export function invalidateAuthUser(userId: string): void {
  userCache.delete(userId);
  inflightUserLookups.delete(userId);
}

function extractBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

async function loadAuthUserById(userId: string): Promise<User | null> {
  const cached = userCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user;
  }

  const inflight = inflightUserLookups.get(userId);
  if (inflight) {
    return inflight;
  }

  const lookup = prisma.user
    .findUnique({ where: { id: userId } })
    .then((user) => {
      if (user) {
        userCache.set(userId, { user, expiresAt: Date.now() + USER_CACHE_TTL_MS });
      }
      return user;
    })
    .finally(() => {
      inflightUserLookups.delete(userId);
    });

  inflightUserLookups.set(userId, lookup);
  return lookup;
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

  const user = await loadAuthUserById(userId);
  if (!user) {
    throw new AuthError("کاربر پیدا نشد");
  }

  return user;
}
