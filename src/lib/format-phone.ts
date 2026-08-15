const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String("٠١٢٣٤٥٦٧٨٩".indexOf(char)));
}

export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

/** شماره موبایل ایران را به فرمت ورودی محلی ۰۹xxxxxxxxx (ارقام لاتین) تبدیل می‌کند */
export function toIranLocalPhoneInput(phone: string): string {
  let digits = toAsciiDigits(phone).replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("09")) {
    return digits.slice(0, 11);
  }

  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (digits.startsWith("9")) {
    return `0${digits.slice(0, 10)}`;
  }

  return digits.slice(0, 11);
}

/** نمایش شماره موبایل ایران به فرمت محلی ۰۹xxxxxxxxx */
export function formatIranPhoneForDisplay(phone: string): string {
  const local = toIranLocalPhoneInput(phone);
  if (local.length === 11 && local.startsWith("09")) {
    return toPersianDigits(local);
  }

  return toPersianDigits(phone.trim());
}
