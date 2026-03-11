"use client";

import { cn } from "@/lib/utils";

type Point = { label: string; value: number };

export function MiniAreaChart({ data }: { data: Point[] }) {
  const width = 520;
  const height = 220;
  const padding = 18;
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = data
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((item.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>روند ۱۲ ماهه درآمد (میلیون)</span>
        <span className="font-semibold text-primary dark:text-primary">+28.6%</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="admin-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#admin-area)" />
        <polyline points={points} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="mt-4 grid grid-cols-6 gap-2 text-[11px] text-gray-500 dark:text-gray-400 md:text-xs">
        {data.filter((_, index) => index % 2 === 0).map((item) => (
          <span key={item.label} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">فروش به تفکیک دسته</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary-hover"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChannels({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const gradient = `conic-gradient(${data
    .map((item, index) => {
      const start = data.slice(0, index).reduce((sum, current) => sum + current.value, 0);
      return `${item.color} ${start}% ${start + item.value}%`;
    })
    .join(",")})`;

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">کانال جذب کاربر</h3>
      <div className="flex items-center gap-4">
        <div className="relative h-36 w-36 rounded-full" style={{ background: gradient }}>
          <div className="absolute inset-[18%] rounded-full bg-white dark:bg-[#1c1e26]" />
        </div>
        <div className="space-y-2 text-sm">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "پرداخت شده" && "bg-emerald-100 text-emerald-700 dark:bg-primary/20 dark:text-emerald-300",
        status === "در انتظار" && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        status === "لغو شده" && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        status === "فعال" && "bg-emerald-100 text-emerald-700 dark:bg-primary/20 dark:text-emerald-300",
        status === "غیرفعال" && "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
        status === "معلق" && "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
        status === "منتشر شده" && "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
        status === "پیش‌نویس" && "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
        status === "باز" && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
        status === "حل شده" && "bg-emerald-100 text-emerald-700 dark:bg-primary/20 dark:text-emerald-300",
        status === "در حال بررسی" && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
      )}
    >
      {status}
    </span>
  );
}
