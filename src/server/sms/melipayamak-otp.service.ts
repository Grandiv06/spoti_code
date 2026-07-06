type MelipayamakOtpResponse = {
  code?: string | number;
  status?: string;
};

function resolveOtpEndpoint(): string {
  const fullUrl = process.env.MELIPAYAMAK_OTP_URL?.trim();
  if (fullUrl) return fullUrl;

  const path =
    process.env.MELIPAYAMAK_OTP_PATH?.trim() ||
    "/api/send/otp/17792cae51df43229727721a94fa64a9";

  return `https://console.melipayamak.com${path.startsWith("/") ? path : `/${path}`}`;
}

export function toLocalIranMobile(intlPhone: string): string {
  const digits = intlPhone.replace(/[^0-9]/g, "");
  if (digits.startsWith("98") && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }
  if (digits.startsWith("9") && digits.length === 10) {
    return `0${digits}`;
  }
  if (digits.startsWith("09") && digits.length === 11) {
    return digits;
  }
  throw new Error("شماره موبایل معتبر نیست");
}

export function isMelipayamakConfigured(): boolean {
  return Boolean(
    process.env.MELIPAYAMAK_OTP_URL?.trim() || process.env.MELIPAYAMAK_OTP_PATH?.trim()
  );
}

export async function sendMelipayamakOtp(localMobile: string): Promise<string> {
  const endpoint = resolveOtpEndpoint();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: localMobile }),
  });

  let payload: MelipayamakOtpResponse | null = null;
  try {
    payload = (await response.json()) as MelipayamakOtpResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      typeof payload?.status === "string" && payload.status.trim()
        ? payload.status.trim()
        : `ارسال پیامک ناموفق بود (${response.status})`;
    throw new Error(message);
  }

  const code = payload?.code != null ? String(payload.code).trim() : "";
  if (!code) {
    const message =
      typeof payload?.status === "string" && payload.status.trim()
        ? payload.status.trim()
        : "کد تایید از سرویس پیامک دریافت نشد";
    throw new Error(message);
  }

  return code;
}
