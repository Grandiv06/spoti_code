const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String("٠١٢٣٤٥٦٧٨٩".indexOf(char)));
}

export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

/** نمایش شماره موبایل ایران به فرمت محلی ۰۹xxxxxxxxx */
export function formatIranPhoneForDisplay(phone: string): string {
  const digits = toAsciiDigits(phone).replace(/\D/g, "");
  if (!digits) return "";

  let local = digits;
  if (local.startsWith("98") && local.length >= 12) {
    local = `0${local.slice(2, 12)}`;
  } else if (local.length === 10 && local.startsWith("9")) {
    local = `0${local}`;
  }

  if (local.length === 11 && local.startsWith("09")) {
    return toPersianDigits(local);
  }

  return toPersianDigits(phone.trim());
}
