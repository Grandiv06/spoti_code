const ZIBAL_GATEWAY_URL = "https://gateway.zibal.ir";
export const DEFAULT_ZIBAL_MERCHANT = "6acb776e74439ffe0c5d90a2";
export const SPOTICODE_BASE_URL = "https://spoticode.com";

export function getZibalMerchant(): string {
  const merchant = process.env.ZIBAL_MERCHANT?.trim();
  return merchant || DEFAULT_ZIBAL_MERCHANT;
}

export function resolvePublicBaseUrl(): string {
  const envUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/$/, "");
  if (envUrl && envUrl.startsWith("https://")) {
    return envUrl;
  }
  return SPOTICODE_BASE_URL;
}

export const ZIBAL_REQUEST_RESULTS: Record<number, string> = {
  100: "درخواست با موفقیت تایید و ثبت شد.",
  102: "مرچنت (کد پذیرنده) در سیستم زیبال یافت نشد.",
  103: "درگاه پذیرنده غیرفعال است یا قرارداد درگاه امضا نشده است.",
  104: "مرچنت نامعتبر است.",
  105: "مبلغ سفارش بایستی حداقل ۱,۰۰۰ ریال باشد.",
  106: "آدرس بازگشت (callbackUrl) نامعتبر است و باید با http یا https آغاز شود.",
  107: "حالت درصد تسهیم نامعتبر است.",
  108: "یک یا چند ذی‌نفع در تسهیم نامعتبر هستند.",
  109: "یک یا چند ذی‌نفع در تسهیم غیرفعال هستند.",
  110: "شناسه self در تسهیم وجود ندارد.",
  111: "مبلغ کل با مجموع سهم‌ها در تسهیم برابر نیست.",
  112: "موجودی کیف پول کارمزد کافی نیست.",
  113: "مبلغ تراکنش بیش از سقف مجاز پرداخت اینترنتی است.",
  114: "کد ملی ارسالی نامعتبر است.",
  115: "آدرس IP سرور در پنل کاربری زیبال ثبت نشده است.",
  116: "حالت کسر کارمزد نامعتبر است.",
};

export const ZIBAL_VERIFY_RESULTS: Record<number, string> = {
  100: "تراکنش با موفقیت تایید شد.",
  102: "مرچنت (کد پذیرنده) در زیبال یافت نشد.",
  103: "درگاه پذیرنده غیرفعال است.",
  104: "مرچنت نامعتبر است.",
  201: "این تراکنش قبلاً با موفقیت تایید شده است.",
  202: "سفارش پرداخت نشده یا پرداخت آن ناموفق بوده است.",
  203: "شناسه پیگیری (trackId) نامعتبر است.",
};

export const ZIBAL_STATUS_CODES: Record<number, string> = {
  "-1": "در انتظار پرداخت",
  "-2": "خطای داخلی درگاه",
  1: "پرداخت شده و تایید شده",
  2: "پرداخت شده - در انتظار تایید",
  3: "پرداخت توسط کاربر لغو شد",
  4: "شماره کارت نامعتبر است",
  5: "موجودی حساب کافی نیست",
  6: "رمز کارت اشتباه است",
  7: "تعداد درخواست‌ها بیش از حد مجاز است",
  8: "تعداد پرداخت اینترنتی روزانه بیش از حد مجاز است",
  9: "مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز است",
  10: "صادرکننده کارت نامعتبر است",
  11: "خطای سوئیچ بانکی",
  12: "کارت قابل دسترسی نیست",
  15: "تراکنش استرداد شده است",
  16: "تراکنش در حال استرداد است",
  18: "تراکنش ریورس شده است",
  21: "پذیرنده نامعتبر است",
};

export function getZibalRequestResultMessage(result?: number | null): string {
  if (result == null) return "خطای نامشخص در ارتباط با زیبال";
  return ZIBAL_REQUEST_RESULTS[result] ?? `کد نتیجه نامشخص از درگاه: ${result}`;
}

export function getZibalVerifyResultMessage(result?: number | null): string {
  if (result == null) return "خطای نامشخص در تایید تراکنش";
  return ZIBAL_VERIFY_RESULTS[result] ?? `کد نتیجه تایید نامشخص: ${result}`;
}

export function getZibalStatusMessage(status?: number | null): string {
  if (status == null) return "وضعیت نامشخص";
  return ZIBAL_STATUS_CODES[status] ?? `وضعیت پرداخت ناشناخته (${status})`;
}

export type ZibalRequestInput = {
  amountRials: number | bigint;
  callbackUrl: string;
  description?: string;
  orderId?: string;
  mobile?: string;
  nationalCode?: string;
  allowedCards?: string[];
  checkMobileWithCard?: boolean;
};

export type ZibalRequestOutput = {
  trackId: number;
  result: number;
  message: string;
  paymentUrl: string;
};

export type ZibalVerifyOutput = {
  result: number;
  message: string;
  status?: number;
  amount?: number;
  refNumber?: string;
  paidAt?: string;
  cardNumber?: string;
  orderId?: string;
  description?: string;
  multiplexingInfos?: unknown[];
};

export type ZibalInquiryOutput = {
  result: number;
  message: string;
  status?: number;
  amount?: number;
  refNumber?: string;
  paidAt?: string;
  verifiedAt?: string;
  cardNumber?: string;
  orderId?: string;
  description?: string;
  createdAt?: string;
};

/**
 * ایجاد درخواست پرداخت در درگاه زیبال
 */
export async function requestZibalPayment(input: ZibalRequestInput): Promise<ZibalRequestOutput> {
  const merchant = getZibalMerchant();
  const amountInt = typeof input.amountRials === "bigint" ? Number(input.amountRials) : Math.round(input.amountRials);

  const payload: Record<string, unknown> = {
    merchant,
    amount: amountInt,
    callbackUrl: input.callbackUrl,
  };

  if (input.description) payload.description = input.description;
  if (input.orderId) payload.orderId = input.orderId;
  if (input.mobile) payload.mobile = input.mobile;
  if (input.nationalCode) payload.nationalCode = input.nationalCode;
  if (input.allowedCards?.length) payload.allowedCards = input.allowedCards;
  if (typeof input.checkMobileWithCard === "boolean") payload.checkMobileWithCard = input.checkMobileWithCard;

  const response = await fetch(`${ZIBAL_GATEWAY_URL}/v1/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok || !body) {
    throw new Error(
      `خطای شبکه هنگام ارتباط با زیبال (کد وضعیت: ${response.status})`
    );
  }

  const result = typeof body.result === "number" ? body.result : -1;
  const message = typeof body.message === "string" ? body.message : "";
  const trackId = typeof body.trackId === "number" ? body.trackId : Number(body.trackId);

  if (result !== 100 || !Number.isFinite(trackId) || trackId <= 0) {
    const errorText = getZibalRequestResultMessage(result);
    throw new Error(`خطا در ایجاد تراکنش زیبال: ${errorText} (${message || result})`);
  }

  return {
    trackId,
    result,
    message,
    paymentUrl: `${ZIBAL_GATEWAY_URL}/start/${trackId}`,
  };
}

/**
 * تایید پرداخت (Verify) درگاه زیبال
 */
export async function verifyZibalPayment(trackId: number | string): Promise<ZibalVerifyOutput> {
  const merchant = getZibalMerchant();
  const numericTrackId = Number(trackId);

  const response = await fetch(`${ZIBAL_GATEWAY_URL}/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      merchant,
      trackId: numericTrackId,
    }),
  });

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok || !body) {
    throw new Error(`خطای ارتباط با زیبال در مرحله تایید (کد وضعیت: ${response.status})`);
  }

  const result = typeof body.result === "number" ? body.result : -1;
  const message = typeof body.message === "string" ? body.message : "";
  const status = typeof body.status === "number" ? body.status : undefined;
  const amount =
    typeof body.amount === "number"
      ? body.amount
      : body.amount != null && !Number.isNaN(Number(body.amount))
        ? Number(body.amount)
        : undefined;
  const refNumber = body.refNumber != null ? String(body.refNumber) : undefined;
  const paidAt = typeof body.paidAt === "string" ? body.paidAt : undefined;
  const cardNumber = typeof body.cardNumber === "string" ? body.cardNumber : undefined;
  const orderId = typeof body.orderId === "string" ? body.orderId : undefined;
  const description = typeof body.description === "string" ? body.description : undefined;
  const multiplexingInfos = Array.isArray(body.multiplexingInfos) ? body.multiplexingInfos : undefined;

  return {
    result,
    message,
    status,
    amount,
    refNumber,
    paidAt,
    cardNumber,
    orderId,
    description,
    multiplexingInfos,
  };
}

/**
 * استعلام پرداخت (Inquiry) درگاه زیبال
 */
export async function inquiryZibalPayment(trackId: number | string): Promise<ZibalInquiryOutput> {
  const merchant = getZibalMerchant();
  const numericTrackId = Number(trackId);

  const response = await fetch(`${ZIBAL_GATEWAY_URL}/v1/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      merchant,
      trackId: numericTrackId,
    }),
  });

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok || !body) {
    throw new Error(`خطای ارتباط با زیبال در مرحله استعلام (کد وضعیت: ${response.status})`);
  }

  return {
    result: typeof body.result === "number" ? body.result : -1,
    message: typeof body.message === "string" ? body.message : "",
    status: typeof body.status === "number" ? body.status : undefined,
    amount: typeof body.amount === "number" ? body.amount : undefined,
    refNumber: body.refNumber != null ? String(body.refNumber) : undefined,
    paidAt: typeof body.paidAt === "string" ? body.paidAt : undefined,
    verifiedAt: typeof body.verifiedAt === "string" ? body.verifiedAt : undefined,
    cardNumber: typeof body.cardNumber === "string" ? body.cardNumber : undefined,
    orderId: typeof body.orderId === "string" ? body.orderId : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    createdAt: typeof body.createdAt === "string" ? body.createdAt : undefined,
  };
}
