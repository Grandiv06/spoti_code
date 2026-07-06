import { randomBytes } from "crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { OTP_EXPIRY_SECONDS } from "@/server/auth/phone-auth.constants";
import type { DeviceInfo } from "@/server/auth/device-info";
import {
  buildAuthResponseForUser,
  consumePendingLogin,
  countActiveUserSessions,
  createPendingLogin,
  findSessionByRefreshToken,
  listUserSessionDtos,
  MAX_USER_SESSIONS,
  revokeUserSession,
  rotateSessionRefreshToken,
  shouldEnforceSessionLimit,
} from "@/server/auth/session.service";
import {
  isMelipayamakConfigured,
  sendMelipayamakOtp,
  toLocalIranMobile,
} from "@/server/sms/melipayamak-otp.service";

type OtpChallenge = {
  code: string;
  expiresAt: number;
  fullName?: string;
  verifiedAt?: number;
};

const SIGNUP_COMPLETION_WINDOW_MS = 10 * 60 * 1000;

export type PhoneAuthResult =
  | Awaited<ReturnType<typeof buildAuthResponseForUser>>
  | {
      requiresFullName: true;
      phoneNumber: string;
    }
  | {
      requiresSessionChoice: true;
      phoneNumber: string;
      pendingLoginToken: string;
      sessions: Awaited<ReturnType<typeof listUserSessionDtos>>;
      maxSessions: number;
    };

const globalForAuth = globalThis as typeof globalThis & {
  __otpChallenges?: Map<string, OtpChallenge>;
};

const otpChallenges = globalForAuth.__otpChallenges ?? new Map<string, OtpChallenge>();
globalForAuth.__otpChallenges = otpChallenges;

function normalizeDigits(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = value;
  for (let index = 0; index < 10; index += 1) {
    result = result.replace(new RegExp(persian[index], "g"), String(index));
    result = result.replace(new RegExp(arabic[index], "g"), String(index));
  }
  return result.replace(/\s/g, "").replace(/-/g, "");
}

export function normalizeIranPhone(input: string): string {
  let value = normalizeDigits(input).replace(/[^0-9]/g, "");
  if (value.startsWith("98")) value = value.slice(2);
  if (value.startsWith("0")) value = value.slice(1);
  if (value.length !== 10) {
    throw new Error("شماره موبایل معتبر نیست");
  }
  return `+98${value}`;
}

export function createAccessToken(userId: string): string {
  return `access_${userId}_${randomBytes(16).toString("hex")}`;
}

export function parseUserIdFromAccessToken(token: string): string | null {
  if (!token.startsWith("access_")) return null;

  const body = token.slice("access_".length);
  const separator = body.lastIndexOf("_");
  if (separator <= 0) return null;

  const userId = body.slice(0, separator).trim();
  return userId || null;
}

function generateOtpCode(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

function shouldExposeDevOtp(): boolean {
  if (isMelipayamakConfigured()) return false;
  return (
    process.env.SHOW_DEV_OTP === "true" ||
    process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true"
  );
}

async function createOtpCode(phone: string): Promise<string> {
  if (isMelipayamakConfigured()) {
    return sendMelipayamakOtp(toLocalIranMobile(phone));
  }
  return generateOtpCode();
}

function storeOtpChallenge(phone: string, code: string, fullName?: string) {
  otpChallenges.set(phone, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000,
    fullName,
  });
}

function verifyOtpCode(phone: string, otp: string): boolean {
  const normalizedOtp = normalizeDigits(otp).replace(/[^0-9]/g, "");
  const challenge = otpChallenges.get(phone);
  if (!challenge) return false;
  if (Date.now() > challenge.expiresAt) return false;

  const expected = normalizeDigits(challenge.code).replace(/[^0-9]/g, "");
  return expected === normalizedOtp;
}

async function upsertUser(phone: string, fullName?: string): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { phone } });
  const now = new Date();

  if (existing) {
    const nextFullName = fullName?.trim();
    return prisma.user.update({
      where: { phone },
      data: {
        ...(nextFullName && existing.role === "USER" ? { fullName: nextFullName } : {}),
        lastLoginAt: now,
      },
    });
  }

  return prisma.user.create({
    data: {
      id: `USR-${randomBytes(6).toString("hex")}`,
      phone,
      fullName: fullName?.trim() || "کاربر اسپاتی‌کد",
      role: "USER",
      lastLoginAt: now,
    },
  });
}

type LoginDeviceContext = {
  device: DeviceInfo;
  userAgent?: string | null;
  ipAddress?: string | null;
};

async function issueLoginForUser(user: User, context: LoginDeviceContext): Promise<PhoneAuthResult> {
  if (shouldEnforceSessionLimit(user)) {
    const activeCount = await countActiveUserSessions(user.id);
    if (activeCount >= MAX_USER_SESSIONS) {
      const pendingLoginToken = createPendingLogin(
        user.id,
        user.phone,
        context.device,
        context.userAgent,
        context.ipAddress
      );

      return {
        requiresSessionChoice: true,
        phoneNumber: user.phone,
        pendingLoginToken,
        sessions: await listUserSessionDtos(user.id),
        maxSessions: MAX_USER_SESSIONS,
      };
    }
  }

  return buildAuthResponseForUser(user, {
    deviceLabel: context.device.label,
    deviceType: context.device.deviceType,
    userAgent: context.userAgent ?? null,
    ipAddress: context.ipAddress ?? null,
  });
}

export async function sendVerificationCode(phoneInput: string, fullName?: string) {
  const phone = normalizeIranPhone(phoneInput);
  const code = await createOtpCode(phone);
  storeOtpChallenge(phone, code, fullName?.trim() || undefined);

  return {
    phoneNumber: phone,
    secondsToExpire: OTP_EXPIRY_SECONDS,
    ...(shouldExposeDevOtp() ? { otp: code } : {}),
  };
}

export async function registerByPhone(phoneInput: string, fullName?: string) {
  const phone = normalizeIranPhone(phoneInput);
  if (!fullName?.trim()) {
    throw new Error("نام و نام خانوادگی الزامی است");
  }

  return sendVerificationCode(phone, fullName.trim());
}

export async function verifyPhoneLogin(
  phoneInput: string,
  otp?: string,
  fullName?: string,
  context?: LoginDeviceContext
): Promise<PhoneAuthResult> {
  const phone = normalizeIranPhone(phoneInput);
  const challenge = otpChallenges.get(phone);
  const trimmedName = fullName?.trim();
  const deviceContext = context ?? {
    device: { label: "مرورگر — سیستم‌عامل", deviceType: "desktop" as const },
  };

  if (trimmedName && challenge?.verifiedAt) {
    if (Date.now() - challenge.verifiedAt > SIGNUP_COMPLETION_WINDOW_MS) {
      otpChallenges.delete(phone);
      throw new Error("زمان تکمیل ثبت‌نام منقضی شده است. دوباره وارد شوید.");
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      const result = await issueLoginForUser(existing, deviceContext);
      otpChallenges.delete(phone);
      return result;
    }

    const user = await upsertUser(phone, trimmedName);
    const result = await issueLoginForUser(user, deviceContext);
    otpChallenges.delete(phone);
    return result;
  }

  if (!otp || !verifyOtpCode(phone, otp)) {
    throw new Error("کد تایید نامعتبر است");
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (!existing) {
    otpChallenges.set(phone, {
      code: challenge!.code,
      expiresAt: challenge!.expiresAt,
      fullName: challenge?.fullName,
      verifiedAt: Date.now(),
    });

    return {
      requiresFullName: true,
      phoneNumber: phone,
    };
  }

  const user = await upsertUser(phone, challenge?.fullName);
  const result = await issueLoginForUser(user, deviceContext);
  otpChallenges.delete(phone);
  return result;
}

export async function revokeSessionAndLogin(
  pendingLoginToken: string,
  revokeSessionId: string
): Promise<Awaited<ReturnType<typeof buildAuthResponseForUser>>> {
  const pending = consumePendingLogin(pendingLoginToken);
  if (!pending) {
    throw new Error("زمان انتخاب دستگاه منقضی شده است. دوباره وارد شوید.");
  }

  const revoked = await revokeUserSession(revokeSessionId, pending.userId);
  if (!revoked) {
    throw new Error("دستگاه انتخاب‌شده پیدا نشد.");
  }

  const user = await prisma.user.findUnique({ where: { id: pending.userId } });
  if (!user) {
    throw new Error("کاربر پیدا نشد");
  }

  return buildAuthResponseForUser(user, pending.meta);
}

export async function refreshAuthToken(refreshToken?: string) {
  if (!refreshToken) {
    throw new Error("توکن معتبر نیست");
  }

  const session = await findSessionByRefreshToken(refreshToken);
  if (!session) {
    throw new Error("نشست منقضی شده است");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    throw new Error("کاربر پیدا نشد");
  }

  const nextRefreshToken = await rotateSessionRefreshToken(session.id);

  return {
    sessionId: session.id,
    accessToken: createAccessToken(user.id),
    refreshToken: nextRefreshToken,
  };
}
