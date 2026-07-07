import { apiGetNoMock, apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

export type SecurityStatus = {
  authMethod: "sms" | "totp";
  totpEnabled: boolean;
  recoveryCodesRemaining: number;
};

export type TotpSetup = {
  otpauthUrl: string;
  qrDataUrl: string;
  secret: string;
};

function unwrap<T>(payload: unknown): T {
  const row = payload as { data?: T };
  return (row?.data ?? payload) as T;
}

export async function fetchSecurityStatus(): Promise<SecurityStatus> {
  const response = await apiGetNoMock<unknown>("/api/dashboard/security", getAuthHeaders());
  const data = unwrap<Partial<SecurityStatus>>(response);
  return {
    authMethod: data.authMethod === "totp" ? "totp" : "sms",
    totpEnabled: Boolean(data.totpEnabled),
    recoveryCodesRemaining: Number(data.recoveryCodesRemaining ?? 0),
  };
}

export async function startTotpSetup(): Promise<TotpSetup> {
  const response = await apiPostNoMock<unknown>(
    "/api/dashboard/security/totp/setup",
    {},
    getAuthHeaders()
  );
  return unwrap<TotpSetup>(response);
}

export async function verifyTotpSetup(
  code: string
): Promise<{ recoveryCodes: string[]; status: SecurityStatus | null }> {
  const response = await apiPostNoMock<unknown>(
    "/api/dashboard/security/totp/verify",
    { code },
    getAuthHeaders()
  );
  const data = unwrap<{ recoveryCodes?: string[]; status?: Partial<SecurityStatus> }>(response);
  const status = data.status
    ? {
        authMethod: data.status.authMethod === "totp" ? "totp" : "sms",
        totpEnabled: Boolean(data.status.totpEnabled),
        recoveryCodesRemaining: Number(data.status.recoveryCodesRemaining ?? 0),
      }
    : null;
  return {
    recoveryCodes: Array.isArray(data.recoveryCodes) ? data.recoveryCodes : [],
    status: status as SecurityStatus | null,
  };
}

export async function disableTotp(code: string): Promise<SecurityStatus> {
  const response = await apiPostNoMock<unknown>(
    "/api/dashboard/security/totp/disable",
    { code },
    getAuthHeaders()
  );
  const data = unwrap<Partial<SecurityStatus>>(response);
  return {
    authMethod: data.authMethod === "totp" ? "totp" : "sms",
    totpEnabled: Boolean(data.totpEnabled),
    recoveryCodesRemaining: Number(data.recoveryCodesRemaining ?? 0),
  };
}
