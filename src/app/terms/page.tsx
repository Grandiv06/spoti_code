import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "قوانین و مقررات | اسپاتی‌کد",
  description:
    "قوانین و مقررات پلتفرم آموزش برنامه‌نویسی اسپاتی‌کد (SpotiCode)، شرایط استفاده از دوره‌ها، نرم‌افزار اسپات‌پلیر، پشتیبانی و حفظ حریم خصوصی.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
