export function normalizeDigits(str: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = str;
  for (let index = 0; index < 10; index += 1) {
    result = result.replace(new RegExp(persian[index], "g"), String(index));
    result = result.replace(new RegExp(arabic[index], "g"), String(index));
  }
  return result.replace(/\s/g, "").replace(/-/g, "");
}

export function toIranIntlPhone(input: string): string {
  let value = normalizeDigits(input).replace(/[^0-9]/g, "");
  if (value.startsWith("98")) value = value.slice(2);
  if (value.startsWith("0")) value = value.slice(1);
  return `+98${value}`;
}

export const PHONE_ROLE_MAP: Record<string, "admin" | "user" | "instructor"> = {
  "+989104138412": "admin",
  "+989395063084": "instructor",
  "+989196979921": "instructor",
};

type AuthOtpPayload = {
  otp?: string;
  secondsToExpire?: number;
  phoneNumber?: string;
};

type AuthApiResponse = {
  data?: AuthOtpPayload;
  otp?: string;
  secondsToExpire?: number;
};

export function extractOtpFromAuthResponse(response: unknown): {
  otp: string;
  secondsToExpire: number;
} {
  const payload = response as AuthApiResponse;
  const data = payload?.data;

  return {
    otp: String(data?.otp ?? payload?.otp ?? ""),
    secondsToExpire: Number(data?.secondsToExpire ?? payload?.secondsToExpire ?? 180),
  };
}

export function extractAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    const message = error.message.trim();
    if (
      !message.startsWith("<!DOCTYPE") &&
      !message.startsWith("<html") &&
      message.length < 200
    ) {
      return message;
    }
  }
  return fallback;
}

export function isRequiresSessionChoiceResponse(response: unknown): response is {
  requiresSessionChoice: true;
  pendingLoginToken: string;
  sessions: ActiveSessionItem[];
  maxSessions: number;
  phoneNumber?: string;
} {
  const payload = response as {
    requiresSessionChoice?: boolean;
    pendingLoginToken?: string;
    sessions?: ActiveSessionItem[];
    maxSessions?: number;
    phoneNumber?: string;
    data?: {
      requiresSessionChoice?: boolean;
      pendingLoginToken?: string;
      sessions?: ActiveSessionItem[];
      maxSessions?: number;
      phoneNumber?: string;
    };
  };

  const data = payload.data ?? payload;
  return (
    data.requiresSessionChoice === true &&
    Boolean(data.pendingLoginToken) &&
    Array.isArray(data.sessions)
  );
}

export type ActiveSessionItem = {
  id: string;
  deviceLabel: string;
  deviceType: string;
  ipAddress: string | null;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
};

export function isRequiresFullNameResponse(response: unknown): boolean {
  const payload = response as { requiresFullName?: boolean; data?: { requiresFullName?: boolean } };
  return payload?.requiresFullName === true || payload?.data?.requiresFullName === true;
}

export function isRequiresTotpResponse(response: unknown): boolean {
  const payload = response as { requiresTotp?: boolean; data?: { requiresTotp?: boolean } };
  return payload?.requiresTotp === true || payload?.data?.requiresTotp === true;
}

export function parseSessionChoiceResponse(response: unknown) {
  const payload = response as {
    pendingLoginToken?: string;
    sessions?: ActiveSessionItem[];
    maxSessions?: number;
    phoneNumber?: string;
    data?: {
      pendingLoginToken?: string;
      sessions?: ActiveSessionItem[];
      maxSessions?: number;
      phoneNumber?: string;
    };
  };
  const data = payload.data ?? payload;
  return {
    pendingLoginToken: String(data.pendingLoginToken ?? ""),
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    maxSessions: Number(data.maxSessions ?? 2),
    phoneNumber: data.phoneNumber,
  };
}
