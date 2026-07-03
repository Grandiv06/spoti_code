"use client";

import { useState } from "react";
import { SHOW_DEV_OTP } from "@/lib/api-config";

type OtpCodeDisplayProps = {
  code: string;
};

export default function OtpCodeDisplay({ code }: OtpCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!SHOW_DEV_OTP || !code) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
        کد تایید (فعلاً به‌جای پیامک نمایش داده می‌شود)
      </p>
      <div className="mt-3 flex items-center justify-center gap-3" dir="ltr">
        <span className="text-3xl font-black tracking-[0.35em] text-emerald-700 dark:text-emerald-200">
          {code}
        </span>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        >
          {copied ? "کپی شد" : "کپی"}
        </button>
      </div>
    </div>
  );
}
