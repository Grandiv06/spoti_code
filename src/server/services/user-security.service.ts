import type { User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { invalidateAuthUser } from "@/server/auth/request-auth";
import { buildOtpAuthUrl, generateTotpSecret } from "@/lib/auth/totp/generate-secret";
import { generateQrDataUrl } from "@/lib/auth/totp/generate-qr";
import { verifyTotpCode } from "@/lib/auth/totp/verify-code";
import {
  consumeRecoveryCode,
  decryptSecret,
  encryptSecret,
  generateRecoveryCodes,
  parseRecoveryCodes,
  serializeRecoveryCodes,
} from "@/server/auth/totp-crypto";

export type SecurityStatus = {
  authMethod: "sms" | "totp";
  totpEnabled: boolean;
  recoveryCodesRemaining: number;
};

export class SecurityError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function normalizeAuthMethod(value: string | null | undefined): "sms" | "totp" {
  return value === "totp" ? "totp" : "sms";
}

/**
 * Re-reads the user directly from the database. `requireAuthUser` returns a
 * short-lived cached record, so mutations must load fresh state to avoid acting
 * on a stale `totpSecret`/`totpEnabled`.
 */
async function loadFreshUser(userId: string): Promise<User> {
  const fresh = await prisma.user.findUnique({ where: { id: userId } });
  if (!fresh) {
    throw new SecurityError("کاربر پیدا نشد", 404);
  }
  return fresh;
}

export function getSecurityStatus(user: User): SecurityStatus {
  return {
    authMethod: normalizeAuthMethod(user.authMethod),
    totpEnabled: user.totpEnabled,
    recoveryCodesRemaining: parseRecoveryCodes(user.totpRecoveryCodes).length,
  };
}

export function isTotpLogin(user: Pick<User, "authMethod" | "totpEnabled" | "totpSecret">): boolean {
  return user.authMethod === "totp" && user.totpEnabled && Boolean(user.totpSecret);
}

/**
 * Starts (or restarts) TOTP enrollment: creates a fresh secret, stores it
 * encrypted while keeping totpEnabled=false so it cannot be used to log in
 * until the user proves ownership by verifying a code.
 */
export async function startTotpSetup(authUser: User): Promise<{
  otpauthUrl: string;
  qrDataUrl: string;
  secret: string;
}> {
  const user = await loadFreshUser(authUser.id);
  if (user.totpEnabled) {
    throw new SecurityError("احراز هویت دومرحله‌ای از قبل فعال است", 409);
  }

  const secret = generateTotpSecret();
  const otpauthUrl = buildOtpAuthUrl({ accountName: user.phone, secret });
  const qrDataUrl = await generateQrDataUrl(otpauthUrl);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      totpSecret: encryptSecret(secret),
      totpEnabled: false,
    },
  });

  invalidateAuthUser(user.id);
  return { otpauthUrl, qrDataUrl, secret };
}

/**
 * Confirms enrollment: verifies the code against the pending secret, then
 * enables TOTP, switches the login method to "totp", and issues fresh
 * one-time recovery codes (returned in plaintext exactly once).
 */
export async function confirmTotpSetup(
  authUser: User,
  code: string
): Promise<{ recoveryCodes: string[]; status: SecurityStatus }> {
  const user = await loadFreshUser(authUser.id);
  if (user.totpEnabled) {
    throw new SecurityError("احراز هویت دومرحله‌ای از قبل فعال است", 409);
  }
  if (!user.totpSecret) {
    throw new SecurityError("ابتدا فرآیند فعال‌سازی را آغاز کنید", 400);
  }

  let secret: string;
  try {
    secret = decryptSecret(user.totpSecret);
  } catch {
    throw new SecurityError("کلید مخفی نامعتبر است. دوباره تلاش کنید", 400);
  }

  if (!verifyTotpCode(secret, code)) {
    throw new SecurityError("کد وارد شده صحیح نیست", 401);
  }

  const { plain, hashed } = generateRecoveryCodes();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      totpEnabled: true,
      authMethod: "totp",
      totpRecoveryCodes: serializeRecoveryCodes(hashed),
    },
  });

  invalidateAuthUser(user.id);
  return { recoveryCodes: plain, status: getSecurityStatus(updated) };
}

/**
 * Disables TOTP after verifying either a valid authenticator code or one of the
 * recovery codes, then reverts the account to SMS OTP login.
 */
export async function disableTotp(authUser: User, code: string): Promise<SecurityStatus> {
  const user = await loadFreshUser(authUser.id);
  if (!user.totpEnabled || !user.totpSecret) {
    throw new SecurityError("احراز هویت دومرحله‌ای فعال نیست", 400);
  }

  const verification = verifyLoginCode(user, code);
  if (!verification.ok) {
    throw new SecurityError("کد وارد شده صحیح نیست", 401);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      totpEnabled: false,
      authMethod: "sms",
      totpSecret: null,
      totpRecoveryCodes: null,
    },
  });

  invalidateAuthUser(user.id);
  return getSecurityStatus(updated);
}

type LoginCodeResult = {
  ok: boolean;
  usedRecoveryCode: boolean;
  remainingRecoveryCodes?: string[];
};

/**
 * Verifies a login-time code (authenticator token or recovery code) without
 * mutating the database. Recovery-code consumption is handled by the caller
 * via {@link verifyAndConsumeLoginCode}.
 */
function verifyLoginCode(
  user: Pick<User, "totpSecret" | "totpRecoveryCodes">,
  code: string
): LoginCodeResult {
  if (!user.totpSecret) return { ok: false, usedRecoveryCode: false };

  let secret: string;
  try {
    secret = decryptSecret(user.totpSecret);
  } catch {
    return { ok: false, usedRecoveryCode: false };
  }

  if (verifyTotpCode(secret, code)) {
    return { ok: true, usedRecoveryCode: false };
  }

  const remaining = consumeRecoveryCode(code, user.totpRecoveryCodes);
  if (remaining) {
    return { ok: true, usedRecoveryCode: true, remainingRecoveryCodes: remaining };
  }

  return { ok: false, usedRecoveryCode: false };
}

/**
 * Login-time verification that also consumes a recovery code when one is used.
 */
export async function verifyAndConsumeLoginCode(user: User, code: string): Promise<boolean> {
  const result = verifyLoginCode(user, code);
  if (!result.ok) return false;

  if (result.usedRecoveryCode && result.remainingRecoveryCodes) {
    await prisma.user.update({
      where: { id: user.id },
      data: { totpRecoveryCodes: serializeRecoveryCodes(result.remainingRecoveryCodes) },
    });
  }

  return true;
}
