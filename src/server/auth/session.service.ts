import { randomBytes } from "crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { createAccessToken } from "@/server/auth/phone-auth.service";
import type { DeviceInfo } from "@/server/auth/device-info";

export const MAX_USER_SESSIONS = 2;
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PENDING_LOGIN_TTL_MS = 10 * 60 * 1000;

export type UserSessionDto = {
  id: string;
  deviceLabel: string;
  deviceType: string;
  ipAddress: string | null;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
};

type SessionMeta = {
  deviceLabel: string;
  deviceType: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

type PendingLogin = {
  userId: string;
  phone: string;
  meta: SessionMeta;
  expiresAt: number;
};

const globalForSessions = globalThis as typeof globalThis & {
  __pendingLogins?: Map<string, PendingLogin>;
};

const pendingLogins = globalForSessions.__pendingLogins ?? new Map<string, PendingLogin>();
globalForSessions.__pendingLogins = pendingLogins;

function createRefreshToken() {
  return `refresh_${randomBytes(24).toString("hex")}`;
}

function createSessionId() {
  return `SES-${randomBytes(8).toString("hex")}`;
}

function createPendingLoginToken() {
  return `pending_${randomBytes(16).toString("hex")}`;
}

function sessionMetaFromDevice(device: DeviceInfo, userAgent?: string | null, ipAddress?: string | null): SessionMeta {
  return {
    deviceLabel: device.label,
    deviceType: device.deviceType,
    userAgent: userAgent ?? null,
    ipAddress: ipAddress ?? null,
  };
}

export function shouldEnforceSessionLimit(user: User) {
  return user.role === "USER";
}

export async function purgeExpiredSessions(userId?: string) {
  await prisma.userSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
      ...(userId ? { userId } : {}),
    },
  });
}

export async function countActiveUserSessions(userId: string) {
  await purgeExpiredSessions(userId);
  return prisma.userSession.count({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function listUserSessionDtos(userId: string, currentSessionId?: string | null): Promise<UserSessionDto[]> {
  await purgeExpiredSessions(userId);
  const sessions = await prisma.userSession.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { lastActiveAt: "desc" },
  });

  return sessions.map((session) => ({
    id: session.id,
    deviceLabel: session.deviceLabel,
    deviceType: session.deviceType,
    ipAddress: session.ipAddress,
    lastActiveAt: session.lastActiveAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
    isCurrent: Boolean(currentSessionId && session.id === currentSessionId),
  }));
}

export async function createUserSession(userId: string, meta: SessionMeta) {
  const id = createSessionId();
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.userSession.create({
    data: {
      id,
      userId,
      refreshToken,
      deviceLabel: meta.deviceLabel,
      deviceType: meta.deviceType,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    },
  });

  return { sessionId: id, refreshToken, expiresAt };
}

export async function buildAuthResponseForUser(
  user: User,
  meta: SessionMeta
) {
  const { sessionId, refreshToken } = await createUserSession(user.id, meta);
  const accessToken = createAccessToken(user.id);

  return {
    id: user.id,
    sessionId,
    accessToken,
    refreshToken,
    phoneNumber: user.phone,
    fullName: user.fullName,
    role: user.role.toLowerCase(),
    roles: [{ name: user.role }],
  };
}

export function createPendingLogin(userId: string, phone: string, device: DeviceInfo, userAgent?: string | null, ipAddress?: string | null) {
  const token = createPendingLoginToken();
  pendingLogins.set(token, {
    userId,
    phone,
    meta: sessionMetaFromDevice(device, userAgent, ipAddress),
    expiresAt: Date.now() + PENDING_LOGIN_TTL_MS,
  });
  return token;
}

export function consumePendingLogin(token: string) {
  const pending = pendingLogins.get(token);
  if (!pending) return null;
  if (Date.now() > pending.expiresAt) {
    pendingLogins.delete(token);
    return null;
  }
  pendingLogins.delete(token);
  return pending;
}

export async function revokeUserSession(sessionId: string, userId: string) {
  const session = await prisma.userSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return false;
  await prisma.userSession.delete({ where: { id: session.id } });
  return true;
}

export async function findSessionByRefreshToken(refreshToken: string) {
  const session = await prisma.userSession.findUnique({
    where: { refreshToken },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.userSession.delete({ where: { id: session.id } });
    return null;
  }
  return session;
}

export async function rotateSessionRefreshToken(sessionId: string) {
  const nextRefreshToken = createRefreshToken();
  await prisma.userSession.update({
    where: { id: sessionId },
    data: {
      refreshToken: nextRefreshToken,
      lastActiveAt: new Date(),
    },
  });
  return nextRefreshToken;
}

export async function touchSession(sessionId: string) {
  await prisma.userSession.update({
    where: { id: sessionId },
    data: { lastActiveAt: new Date() },
  });
}
