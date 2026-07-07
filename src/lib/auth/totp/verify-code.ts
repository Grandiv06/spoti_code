import { authenticator } from "otplib";

// Allow one step (±30s) of clock drift.
authenticator.options = { window: 1 };

export function normalizeTotpToken(token: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = token;
  for (let index = 0; index < 10; index += 1) {
    result = result.replace(new RegExp(persian[index], "g"), String(index));
    result = result.replace(new RegExp(arabic[index], "g"), String(index));
  }
  return result.replace(/[^0-9]/g, "");
}

export function verifyTotpCode(secret: string, token: string): boolean {
  const normalized = normalizeTotpToken(token);
  if (normalized.length !== 6) return false;
  try {
    return authenticator.verify({ token: normalized, secret });
  } catch {
    return false;
  }
}
