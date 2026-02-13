"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputOTP, REGEXP_ONLY_DIGITS } from "@/components/ui/input-otp";

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const value = phoneInput?.value?.trim() || "";
    if (value) {
      setPhone(value);
      setStep("otp");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      // TODO: verify OTP
      router.push("/panel");
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
  };

  if (step === "otp") {
    return (
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          کد تایید
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          کد ۶ رقمی ارسال شده به {phone} را وارد کنید
        </p>

        <form
          onSubmit={handleOtpSubmit}
          className="space-y-6 mt-8"
        >
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              placeholder="•"
              textAlign="left"
              dir="ltr"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <span>تایید و ورود</span>
          </button>

          <button
            type="button"
            onClick={handleBackToPhone}
            className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#00c853] dark:hover:text-green-400 transition-colors"
          >
            تغییر شماره موبایل
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black hover:underline decoration-2 underline-offset-4 mr-1"
            >
              ایجاد حساب
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          ورود به حساب کاربری
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          برای استفاده از خدمات آکادمی، شماره موبایل خود را وارد کنید
        </p>
      </div>

      <form className="space-y-6" onSubmit={handlePhoneSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1"
          >
            شماره تلفن
          </label>
          <div className="relative group">
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              required
              className="w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-lg tracking-wider text-left"
              placeholder="0912 345 6789"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              smartphone
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
        >
          <span>دریافت کد تایید</span>
        </button>
      </form>

      <div className="mt-8 space-y-5 text-center">
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-[#1c1e26] text-gray-400 font-medium">
              یا
            </span>
          </div>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black hover:underline decoration-2 underline-offset-4 mr-1"
            >
              ایجاد حساب
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
