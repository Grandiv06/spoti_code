"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { normalizeDigits } from "@/lib/phone-auth";
import {
  disableTotp,
  fetchSecurityStatus,
  startTotpSetup,
  verifyTotpSetup,
  type SecurityStatus,
  type TotpSetup,
} from "@/lib/panel-security";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

type PanelMode = "idle" | "enrolling" | "showRecovery" | "disabling";

function MethodOption({
  active,
  selected,
  disabled,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  selected: boolean;
  disabled?: boolean;
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl border p-4 text-right transition-all disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-primary/40 bg-primary/[0.06] ring-1 ring-primary/15"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
          selected
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
        )}
      >
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-gray-900 dark:text-white">{title}</p>
          {active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
              روش فعلی
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected ? "border-primary" : "border-gray-300 dark:border-white/20"
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-primary" />}
      </span>
    </button>
  );
}

export default function SecuritySettingsPanel() {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<PanelMode>("idle");
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStatus(await fetchSecurityStatus());
    } catch {
      setError("دریافت وضعیت امنیت انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const resetFlow = useCallback(() => {
    setMode("idle");
    setSetup(null);
    setCode("");
    setDisableCode("");
    setError("");
  }, []);

  const handleStartEnroll = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = await startTotpSetup();
      setSetup(data);
      setCode("");
      setMode("enrolling");
    } catch (err) {
      setError(err instanceof Error ? err.message : "شروع فعال‌سازی انجام نشد.");
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const handleConfirmEnroll = useCallback(async () => {
    if (busy || code.length !== CODE_LENGTH) return;
    setBusy(true);
    setError("");
    try {
      const { recoveryCodes: codes, status: nextStatus } = await verifyTotpSetup(code);
      setRecoveryCodes(codes);
      setMode("showRecovery");
      setSetup(null);
      setCode("");
      if (nextStatus) {
        setStatus(nextStatus);
      } else {
        await loadStatus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "کد وارد شده صحیح نیست.");
    } finally {
      setBusy(false);
    }
  }, [busy, code, loadStatus]);

  const handleDisable = useCallback(async () => {
    if (busy || disableCode.trim().length < CODE_LENGTH) return;
    setBusy(true);
    setError("");
    try {
      const next = await disableTotp(disableCode.trim());
      setStatus(next);
      resetFlow();
    } catch (err) {
      setError(err instanceof Error ? err.message : "غیرفعال‌سازی انجام نشد.");
    } finally {
      setBusy(false);
    }
  }, [busy, disableCode, resetFlow]);

  const totpEnabled = status?.totpEnabled ?? false;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#171922] dark:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)] md:p-7">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mb-7 flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
          <span className="material-symbols-outlined text-[22px]">encrypted</span>
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">امنیت و ورود دو مرحله‌ای</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            روش تایید هویت هنگام ورود به حساب خود را انتخاب کنید.
          </p>
        </div>
      </div>

      {error && (
        <div className="relative mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="relative animate-pulse space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="relative space-y-3">
          <MethodOption
            active={!totpEnabled}
            selected={!totpEnabled}
            icon="sms"
            title="پیامک (SMS)"
            description="کد تایید یک‌بار مصرف به شماره موبایل شما ارسال می‌شود."
            onClick={() => {
              if (totpEnabled) {
                setDisableCode("");
                setMode("disabling");
                setError("");
              }
            }}
          />

          <MethodOption
            active={totpEnabled}
            selected={totpEnabled}
            disabled={busy}
            icon="shield_lock"
            title="Google Authenticator"
            description="کد ۶ رقمی از اپلیکیشن Authenticator هنگام ورود دریافت می‌شود."
            onClick={() => {
              if (!totpEnabled && mode !== "enrolling") {
                void handleStartEnroll();
              }
            }}
          />

          {totpEnabled && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>احراز هویت دو مرحله‌ای فعال است.</span>
              <span className="text-emerald-600/80 dark:text-emerald-300/70">
                {status?.recoveryCodesRemaining ?? 0} کد بازیابی باقی‌مانده
              </span>
            </div>
          )}

          {mode === "enrolling" && setup && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                ۱. کد QR زیر را با اپلیکیشن Google Authenticator اسکن کنید:
              </p>
              <div className="mb-4 flex justify-center">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <Image
                    src={setup.qrDataUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    unoptimized
                    className="size-[200px]"
                  />
                </div>
              </div>

              <p className="mb-2 text-center text-xs text-gray-500 dark:text-gray-400">
                در صورت عدم امکان اسکن، این کلید را دستی وارد کنید:
              </p>
              <p
                dir="ltr"
                className="mb-5 select-all break-all rounded-xl border border-dashed border-gray-300 bg-white px-3 py-2 text-center font-mono text-sm font-bold tracking-wider text-gray-700 dark:border-white/15 dark:bg-white/5 dark:text-gray-200"
              >
                {setup.secret}
              </p>

              <p className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                ۲. کد ۶ رقمی نمایش داده‌شده در اپلیکیشن را وارد کنید:
              </p>
              <div className="mb-4 flex justify-center" dir="ltr">
                <InputOTP
                  maxLength={CODE_LENGTH}
                  pattern="^[0-9۰-۹٠-٩]+$"
                  value={code}
                  onChange={(v) => {
                    setError("");
                    setCode(normalizeDigits(v).replace(/[^0-9]/g, "").slice(0, CODE_LENGTH));
                  }}
                  textAlign="left"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => void handleConfirmEnroll()}
                  disabled={code.length !== CODE_LENGTH || busy}
                  className="h-12 flex-1 rounded-2xl bg-primary text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#009624] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "در حال تایید..." : "تایید و فعال‌سازی"}
                </button>
                <button
                  type="button"
                  onClick={resetFlow}
                  disabled={busy}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}

          {mode === "showRecovery" && (
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-300">
                  key
                </span>
                <p className="text-sm font-black text-amber-800 dark:text-amber-200">کدهای بازیابی</p>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-amber-700 dark:text-amber-300/90">
                این کدها را در جای امنی ذخیره کنید. در صورت از دست دادن دسترسی به اپلیکیشن، با هر کد می‌توانید
                یک‌بار وارد شوید. این کدها دوباره نمایش داده نمی‌شوند.
              </p>
              <div className="mb-4 grid grid-cols-2 gap-2" dir="ltr">
                {recoveryCodes.map((rc) => (
                  <span
                    key={rc}
                    className="select-all rounded-xl border border-amber-200 bg-white px-3 py-2 text-center font-mono text-sm font-bold tracking-wider text-gray-800 dark:border-amber-500/20 dark:bg-white/5 dark:text-gray-100"
                  >
                    {rc}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setRecoveryCodes([]);
                  resetFlow();
                }}
                className="h-12 w-full rounded-2xl bg-primary text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#009624] active:scale-[0.98]"
              >
                کدها را ذخیره کردم
              </button>
            </div>
          )}

          {mode === "disabling" && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                برای غیرفعال‌سازی، کد فعلی اپلیکیشن Authenticator یا یک کد بازیابی را وارد کنید:
              </p>
              <input
                type="text"
                dir="ltr"
                value={disableCode}
                onChange={(event) => {
                  setError("");
                  setDisableCode(event.target.value.toUpperCase());
                }}
                placeholder="کد ۶ رقمی یا کد بازیابی"
                className="mb-4 h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-center font-mono tracking-widest text-gray-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-[#14161d] dark:text-gray-100"
              />
              <div className="flex flex-col gap-2 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => void handleDisable()}
                  disabled={disableCode.trim().length < CODE_LENGTH || busy}
                  className="h-12 flex-1 rounded-2xl bg-red-500 text-sm font-black text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "در حال غیرفعال‌سازی..." : "غیرفعال‌سازی احراز دو مرحله‌ای"}
                </button>
                <button
                  type="button"
                  onClick={resetFlow}
                  disabled={busy}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative mt-6 flex items-center gap-2.5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="material-symbols-outlined shrink-0 text-[18px] leading-none text-gray-400">info</span>
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          با فعال‌سازی Google Authenticator، هنگام ورود به‌جای پیامک، کد اپلیکیشن از شما خواسته می‌شود.
        </p>
      </div>
    </div>
  );
}
