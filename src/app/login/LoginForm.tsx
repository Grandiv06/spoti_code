"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import AuthTransitionLink from "@/app/components/AuthTransitionLink";

const DEV_OTP = "123456";

/** اعداد فارسی/عربی را به انگلیسی تبدیل می‌کند */
function normalizeDigits(str: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persian[i], "g"), String(i));
    result = result.replace(new RegExp(arabic[i], "g"), String(i));
  }
  return result.replace(/\s/g, "").replace(/-/g, "");
}

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/panel";

  useEffect(() => {
    document.documentElement.classList.remove("auth-route-transitioning");
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const value = normalizeDigits(phoneInput).replace(/[^0-9]/g, "");
    if (value.length >= 10) {
      setPhone(value);
      setStep("otp");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDigits(e.target.value).replace(/[^0-9]/g, "");
    setPhoneInput(normalized);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return;
    const normalizedOtp = normalizeDigits(otp);
    // برای تست: هر شماره + کد 123456
    if (normalizedOtp === DEV_OTP) {
      const normalizedPhone = normalizeDigits(phone) || "09123456789";
      login({
        id: "user-dev-1",
        phone: normalizedPhone,
        displayName: "کاربر تست",
        avatarUrl: "https://i.pravatar.cc/150?u=dev-user",
      });
      router.push(returnUrl);
      return;
    }
    setError("کد تایید نامعتبر است. برای تست کد ۱۲۳۴۵۶ را وارد کنید.");
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
        <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2">
            برای تست: کد <code className="bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">123456</code> را وارد کنید
          </p>

        <form
          onSubmit={handleOtpSubmit}
          className="space-y-6 mt-8"
        >
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
          )}
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={6}
              pattern="^[0-9۰-۹٠-٩]+$"
              value={otp}
              onChange={(v) => setOtp(normalizeDigits(v))}
              placeholder="•"
              textAlign="left"
              dir="ltr"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>تایید و ورود</span>
          </button>

          <button
            type="button"
            onClick={handleBackToPhone}
            className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#00c853] dark:hover:text-green-400 transition-colors cursor-pointer"
          >
            تغییر شماره موبایل
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <AuthTransitionLink
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black mr-1"
            >
              ایجاد حساب
            </AuthTransitionLink>
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
              value={phoneInput}
              onChange={handlePhoneChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              className="w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-300 dark:border-slate-700/85 bg-gray-50 dark:bg-[#171922] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-[#14161d] outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base placeholder:tracking-normal font-medium text-base tracking-normal text-left"
              placeholder="0912 345 6789"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              smartphone
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span>دریافت کد تایید</span>
        </button>
      </form>

      <div className="mt-8 space-y-5 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <AuthTransitionLink
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black mr-1"
            >
              ایجاد حساب
            </AuthTransitionLink>
          </p>
        </div>
      </div>
    </>
  );
}
