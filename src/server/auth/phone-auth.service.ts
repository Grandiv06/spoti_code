import { randomBytes } from "crypto";
import type { AppUserRole, User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import {
  OTP_EXPIRY_SECONDS,
  TEST_OTP_CODE,
  TEST_PHONE_ACCOUNTS,
  type AuthAppRole,
} from "@/server/auth/phone-auth.constants";

type OtpChallenge = {
  code: string;
  expiresAt: number;
  fullName?: string;
};

type SessionRecord = {
  userId: string;
  expiresAt: number;
};

const globalForAuth = globalThis as typeof globalThis & {
  __otpChallenges?: Map<string, OtpChallenge>;
  __refreshSessions?: Map<string, SessionRecord>;
};

const otpChallenges = globalForAuth.__otpChallenges ?? new Map<string, OtpChallenge>();
const refreshSessions = globalForAuth.__refreshSessions ?? new Map<string, SessionRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForAuth.__otpChallenges = otpChallenges;
  globalForAuth.__refreshSessions = refreshSessions;
}

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

function toPrismaRole(role: AuthAppRole): AppUserRole {
  return role;
}

function toApiRoleName(role: AppUserRole): AuthAppRole {
  return role;
}

function createToken(prefix: string): string {
  return `${prefix}_${randomBytes(24).toString("hex")}`;
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

function storeOtpChallenge(phone: string, fullName?: string) {
  otpChallenges.set(phone, {
    code: generateOtpCode(),
    expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000,
    fullName,
  });
}

function verifyOtpCode(phone: string, otp: string): boolean {
  const normalizedOtp = normalizeDigits(otp).replace(/[^0-9]/g, "");
  const challenge = otpChallenges.get(phone);
  if (!challenge) return false;
  if (Date.now() > challenge.expiresAt) return false;
  return challenge.code === normalizedOtp;
}

async function upsertUser(phone: string, fullName?: string): Promise<User> {
  const testAccount = TEST_PHONE_ACCOUNTS[phone];
  if (testAccount) {
    return prisma.user.upsert({
      where: { phone },
      update: {
        fullName: fullName?.trim() || testAccount.fullName,
        role: toPrismaRole(testAccount.role),
      },
      create: {
        id: testAccount.id,
        phone,
        fullName: fullName?.trim() || testAccount.fullName,
        role: toPrismaRole(testAccount.role),
      },
    });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    if (fullName?.trim()) {
      return prisma.user.update({
        where: { phone },
        data: { fullName: fullName.trim() },
      });
    }
    return existing;
  }

  return prisma.user.create({
    data: {
      id: `USR-${randomBytes(6).toString("hex")}`,
      phone,
      fullName: fullName?.trim() || "کاربر اسپاتی‌کد",
      role: "USER",
    },
  });
}

function buildAuthResponse(user: User) {
  const accessToken = createAccessToken(user.id);
  const refreshToken = createToken("refresh");

  refreshSessions.set(refreshToken, {
    userId: user.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return {
    id: user.id,
    accessToken,
    refreshToken,
    phoneNumber: user.phone,
    fullName: user.fullName,
    role: toApiRoleName(user.role).toLowerCase(),
    roles: [{ name: toApiRoleName(user.role) }],
  };
}

export async function sendVerificationCode(phoneInput: string, fullName?: string) {
  const phone = normalizeIranPhone(phoneInput);
  storeOtpChallenge(phone, fullName?.trim() || undefined);
  const challenge = otpChallenges.get(phone);

  return {
    otp: challenge?.code ?? TEST_OTP_CODE,
    phoneNumber: phone,
    secondsToExpire: OTP_EXPIRY_SECONDS,
  };
}

export async function registerByPhone(phoneInput: string, fullName?: string) {
  const phone = normalizeIranPhone(phoneInput);
  if (!fullName?.trim()) {
    throw new Error("نام و نام خانوادگی الزامی است");
  }

  return sendVerificationCode(phone, fullName.trim());
}

export async function verifyPhoneLogin(phoneInput: string, otp: string) {
  const phone = normalizeIranPhone(phoneInput);
  if (!verifyOtpCode(phone, otp)) {
    throw new Error("کد تایید نامعتبر است");
  }

  const challenge = otpChallenges.get(phone);
  const user = await upsertUser(phone, challenge?.fullName);
  otpChallenges.delete(phone);

  return buildAuthResponse(user);
}

export async function refreshAuthToken(refreshToken?: string) {
  if (!refreshToken) {
    throw new Error("توکن معتبر نیست");
  }

  const session = refreshSessions.get(refreshToken);
  if (!session || Date.now() > session.expiresAt) {
    refreshSessions.delete(refreshToken ?? "");
    throw new Error("نشست منقضی شده است");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    throw new Error("کاربر پیدا نشد");
  }

  refreshSessions.delete(refreshToken);
  const nextRefreshToken = createToken("refresh");
  refreshSessions.set(nextRefreshToken, session);

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: nextRefreshToken,
  };
}
