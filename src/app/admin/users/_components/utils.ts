export function toPersianDigits(n: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[parseInt(w)]);
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  return `${formatted} تومان`;
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    const formatted = `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    return toPersianDigits(formatted);
  }
  return toPersianDigits(phone);
}

export function formatPersianDate(dateStr: string): string {
  return toPersianDigits(dateStr);
}
