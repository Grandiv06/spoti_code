const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function parseCartPrice(price: string | number): number {
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }

  let normalized = String(price).trim();
  for (let index = 0; index < 10; index += 1) {
    normalized = normalized.replaceAll(PERSIAN_DIGITS[index]!, String(index));
    normalized = normalized.replaceAll(ARABIC_INDIC_DIGITS[index]!, String(index));
  }

  normalized = normalized.replace(/,/g, "").replace(/[^\d.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCartPrice(price: string | number): string {
  return String(parseCartPrice(price));
}

export function formatCartPriceLabel(price: string | number): string {
  const numeric = parseCartPrice(price);
  if (numeric <= 0) return "رایگان";
  return numeric.toLocaleString("fa-IR");
}

export function formatCoursePriceWithUnit(price: string | number): string {
  const label = formatCartPriceLabel(price);
  return label === "رایگان" ? label : `${label} تومان`;
}

export function isFreeCoursePrice(price: string | number): boolean {
  return parseCartPrice(price) <= 0;
}
