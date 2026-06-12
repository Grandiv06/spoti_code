"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRegisterByPhoneMutation } from "@/hooks/api/useAuthMutations";
import { useRouter } from "next/navigation";

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

function toIranIntlPhone(input: string): string {
  let value = normalizeDigits(input).replace(/[^0-9]/g, "");
  if (value.startsWith("98")) value = value.slice(2);
  if (value.startsWith("0")) value = value.slice(1);
  return `+98${value}`;
}

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const registerMutation = useRegisterByPhoneMutation();

  useEffect(() => {
    document.documentElement.classList.remove("auth-route-transitioning");
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDigits(e.target.value).replace(/[^0-9]/g, "");
    setPhoneInput(normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const rawPhone = normalizeDigits(phoneInput).replace(/[^0-9]/g, "");
    if (rawPhone.length < 10) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }
    const phone = toIranIntlPhone(rawPhone);

    try {
      await registerMutation.mutateAsync({
        phone,
      });
      router.push(`/login?phone=${encodeURIComponent(rawPhone)}`);
    } catch {
      setError("ثبت‌نام ناموفق بود. دوباره تلاش کنید.");
    }
  };

  const inputClassName =
    "w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-300 dark:border-slate-700/85 bg-gray-50 dark:bg-[#171922] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-[#14161d] outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base placeholder:tracking-normal font-medium text-base tracking-normal";

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          ثبت‌نام در آکادمی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          با پر کردن فرم زیر، حساب کاربری خود را ایجاد کنید
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
        )}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1"
          >
            نام و نام خانوادگی
          </label>
          <div className="relative group">
            <input
              id="name"
              name="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClassName}
              placeholder="علی محمدی"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              person
            </span>
          </div>
        </div>

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
              className={`${inputClassName} text-left`}
              placeholder="0912 345 6789"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              smartphone
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span>{registerMutation.isPending ? "در حال ثبت‌نام..." : "ثبت‌نام"}</span>
        </button>
      </form>

      <div className="mt-8 space-y-5 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-[#00c853] dark:text-green-400 font-black mr-1"
            >
              ورود
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
