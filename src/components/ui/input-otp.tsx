"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

function OTPSlot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-12 h-14 text-2xl font-bold",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border border-gray-200 dark:border-gray-600 rounded-2xl",
        "bg-gray-50 dark:bg-gray-700/50",
        "group-hover:border-[#00c853]/40 dark:group-hover:border-green-500/40",
        "group-focus-within:border-[#00c853] dark:group-focus-within:border-green-400",
        "group-focus-within:ring-2 group-focus-within:ring-[#00c853]/20 dark:group-focus-within:ring-green-500/20",
        "outline-none",
        props.isActive &&
          "border-[#00c853] dark:border-green-400 ring-2 ring-[#00c853]/20 dark:ring-green-500/20",
      )}
    >
      <div
        className={cn(
          "tabular-nums text-gray-900 dark:text-white",
          "group-has-[input[data-input-otp-placeholder-shown]]:opacity-30",
        )}
      >
        {props.char ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
          <div className="animate-caret-blink w-px h-6 bg-[#00c853] dark:bg-green-400" />
        </div>
      )}
    </div>
  );
}

export interface InputOTPProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof OTPInput>,
    "render" | "children"
  > {}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  InputOTPProps
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "group flex items-center gap-2 justify-center has-[:disabled]:opacity-30",
      containerClassName,
    )}
    className={cn("focus-visible:ring-0 focus-visible:ring-offset-0", className)}
    render={({ slots }) => (
      <div className="flex gap-2 flex-row" dir="ltr">
        {slots.map((slot, idx) => (
          <OTPSlot key={idx} {...slot} />
        ))}
      </div>
    )}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

export { InputOTP, REGEXP_ONLY_DIGITS };
