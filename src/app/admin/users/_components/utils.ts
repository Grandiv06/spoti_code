import { formatJalaliDate } from "@/lib/dates";

export function toPersianDigits(n: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[parseInt(w)]);
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  return `${formatted}\u00A0تومان`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("09")) {
    const formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return toPersianDigits(formatted);
  }
  if (digits.length === 12 && digits.startsWith("98")) {
    const formatted = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    return toPersianDigits(formatted);
  }
  return toPersianDigits(phone);
}

export function formatPersianDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";
  return formatJalaliDate(dateStr);
}
