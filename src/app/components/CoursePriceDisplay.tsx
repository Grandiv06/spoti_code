type CoursePriceDisplayProps = {
  price: string | number;
  originalPrice?: string | number | null;
  discountPercent?: number | null;
  compact?: boolean;
};

function formatPrice(value: string | number) {
  return typeof value === "number" ? value.toLocaleString("fa-IR") : value;
}

export default function CoursePriceDisplay({
  price,
  originalPrice,
  discountPercent,
  compact = false,
}: CoursePriceDisplayProps) {
  const formattedPrice = formatPrice(price);
  const formattedOriginal =
    originalPrice != null && originalPrice !== "" ? formatPrice(originalPrice) : null;
  const hasDiscount =
    discountPercent != null &&
    discountPercent > 0 &&
    formattedOriginal != null &&
    formattedOriginal !== formattedPrice;

  if (!hasDiscount) {
    return (
      <div
        className={`inline-flex items-baseline gap-1 rounded-2xl bg-primary/10 font-black text-primary ring-1 ring-primary/15 whitespace-nowrap ${
          compact ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-sm"
        }`}
      >
        <span>{formattedPrice}</span>
        <span className="text-[10px] font-bold opacity-75">تومان</span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-start gap-1.5">
      <span className="rounded-lg bg-white/60 px-2 py-0.5 text-[11px] font-bold text-gray-500 line-through decoration-gray-400/80 dark:bg-white/[0.04] dark:text-gray-400">
        {formattedOriginal} تومان
      </span>

      <div
        className={`inline-flex items-baseline gap-1 rounded-2xl bg-gradient-to-l from-primary/20 via-primary/10 to-primary/5 font-black text-primary shadow-[0_0_20px_rgba(34,197,94,0.12)] ring-1 ring-primary/25 ${
          compact ? "px-3.5 py-2" : "px-4 py-2.5"
        }`}
      >
        <span className={compact ? "text-sm leading-none" : "text-base leading-none"}>{formattedPrice}</span>
        <span className="text-[10px] font-bold text-primary/80">تومان</span>
      </div>
    </div>
  );
}

export function CourseDiscountBadge({ discountPercent }: { discountPercent: number }) {
  return (
    <span className="rounded-2xl bg-gradient-to-l from-rose-500 to-rose-600 px-3 py-1.5 text-[11px] font-black text-white shadow-[0_4px_14px_rgba(244,63,94,0.35)]">
      {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
    </span>
  );
}
