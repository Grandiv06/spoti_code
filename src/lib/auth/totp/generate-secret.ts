import { authenticator } from "otplib";

export const TOTP_ISSUER = "SpotiCode";

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function buildOtpAuthUrl(params: { accountName: string; secret: string }): string {
  return authenticator.keyuri(params.accountName, TOTP_ISSUER, params.secret);
}
