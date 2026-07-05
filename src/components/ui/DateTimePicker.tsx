"use client";

import { useMemo } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import "./date-time-picker.css";

type DateTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
};

function parseIsoValue(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ و ساعت",
  className,
  hasError = false,
  disabled = false,
}: DateTimePickerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pickerValue = useMemo(() => parseIsoValue(value), [value]);

  const handleChange = (next: DateObject | DateObject[] | null) => {
    if (Array.isArray(next)) return;
    if (!next) {
      onChange("");
      return;
    }
    const jsDate = next instanceof DateObject ? next.toDate() : new Date(next as unknown as string);
    if (Number.isNaN(jsDate.getTime())) {
      onChange("");
      return;
    }
    onChange(jsDate.toISOString());
  };

  return (
    <DatePicker
      value={pickerValue}
      onChange={handleChange}
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD HH:mm"
      calendarPosition="bottom-right"
      portal
      zIndex={120}
      disabled={disabled}
      plugins={[<TimePicker key="time" hideSeconds position="bottom" />]}
      containerClassName={cn("w-full spoti-date-picker", isDark && "rmdp-dark", className)}
      render={(displayValue, openCalendar) => (
        <button
          type="button"
          disabled={disabled}
          onClick={openCalendar}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-bold outline-none transition-colors",
            hasError
              ? "border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-300"
              : "border-gray-200/80 bg-gray-50 text-gray-900 hover:border-gray-300 focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
            <span className={cn("min-w-0 flex-1 truncate text-right", !displayValue && "text-gray-400 dark:text-gray-500")}>
              {displayValue ? String(displayValue) : placeholder}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              {value ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      onChange("");
                    }
                  }}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
                  title="پاک کردن"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              ) : null}
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
        </button>
      )}
    />
  );
}
