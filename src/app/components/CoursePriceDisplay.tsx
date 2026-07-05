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
      <span
        className={`bg-primary/10 text-primary-dark dark:text-primary rounded-2xl font-black whitespace-nowrap ${
          compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
        }`}
      >
        {formattedPrice}{" "}
        <span className="text-[10px] opacity-80 font-bold mr-1">تومان</span>
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 shrink-0">
      <div className="flex items-center gap-2">
        <span
          className={`bg-primary/10 text-primary-dark dark:text-primary rounded-2xl font-black whitespace-nowrap ${
            compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
          }`}
        >
          {formattedPrice}{" "}
          <span className="text-[10px] opacity-80 font-bold mr-1">تومان</span>
        </span>
        <span className="rounded-xl bg-rose-500/15 px-2 py-1 text-[10px] font-black text-rose-500 dark:text-rose-400">
          {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
        </span>
      </div>
      <span className="text-[11px] font-bold text-gray-400 line-through decoration-rose-400/70">
        {formattedOriginal} تومان
      </span>
    </div>
  );
}

export function CourseDiscountBadge({ discountPercent }: { discountPercent: number }) {
  return (
    <span className="rounded-2xl bg-rose-500/90 px-3 py-1.5 text-[11px] font-black text-white shadow-lg">
      {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
    </span>
  );
}
