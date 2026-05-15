export interface Transaction {
  id: string;
  type: "payment" | "refund" | "deposit";
  description: string;
  amount: number;
  status: "success" | "failed" | "pending" | "refunded";
  date: string;
  time: string;
  paymentMethod: string;
  trackingCode: string;
  productTitle: string;
  refundedAmount?: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: "TRX-3821",
    type: "payment",
    description: "خرید مسترکلاس Next.js",
    amount: 2900000,
    status: "success",
    date: "۱۴۰۲/۱۲/۱۸",
    time: "۱۴:۳۰",
    paymentMethod: "درگاه بانکی - ملت",
    trackingCode: "84293105",
    productTitle: "مسترکلاس جامع Next.js 14",
  },
  {
    id: "TRX-3817",
    type: "payment",
    description: "خرید دوره TypeScript",
    amount: 1980000,
    status: "success",
    date: "۱۴۰۲/۱۱/۲۸",
    time: "۱۰:۱۵",
    paymentMethod: "درگاه بانکی - سامان",
    trackingCode: "77210542",
    productTitle: "تایپ‌اسکریپت برای حرفه‌ای‌ها",
  },
  {
    id: "TRX-3805",
    type: "payment",
    description: "خرید اشتراک ویژه ۳ ماهه",
    amount: 550000,
    status: "failed",
    date: "۱۴۰۲/۱۰/۱۲",
    time: "۰۹:۴۵",
    paymentMethod: "درگاه بانکی - ملت",
    trackingCode: "---",
    productTitle: "اشتراک ویژه اسپاتی‌کد",
  },
  {
    id: "TRX-3798",
    type: "payment",
    description: "خرید دوره Node.js",
    amount: 2400000,
    status: "pending",
    date: "۱۴۰۲/۰۹/۲۵",
    time: "۲۱:۱۰",
    paymentMethod: "درگاه بانکی - سامان",
    trackingCode: "55210941",
    productTitle: "دوره جامع بک‌اند با Node.js",
  },
  {
    id: "TRX-3782",
    type: "payment",
    description: "خرید دوره React",
    amount: 3200000,
    status: "success",
    date: "۱۴۰۲/۰۸/۱۵",
    time: "۱۲:۰۰",
    paymentMethod: "درگاه بانکی - ملت",
    trackingCode: "22091421",
    productTitle: "ری‌اکت در دنیای واقعی",
  },
];
