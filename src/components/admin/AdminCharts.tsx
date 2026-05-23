"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type Point = { label: string; value: number };

export function MiniAreaChart({ data }: { data: Point[] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const chartConfig = {
    revenue: { label: "درآمد", color: "#22c55e" },
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6 transition-all duration-1000",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>روند ۱۲ ماهه درآمد (میلیون)</span>
        <span className="font-semibold text-primary dark:text-primary">+28.6%</span>
      </div>
      <ChartContainer config={chartConfig} className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 6 }}>
            <defs>
              <linearGradient id="admin-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-white/5 dark:stroke-white/5" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              tickMargin={12}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}M`} />} />
            <Area
              type="monotone"
              dataKey="value"
              name="درآمد"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#admin-area-gradient)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

export function HorizontalBars({ data }: { data: Point[] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6 transition-all duration-1000",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 160);
    return () => clearTimeout(t);
  }, []);

  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
    acc[item.label] = { label: item.label, color: item.color };
    return acc;
  }, {});

  return (
    <div
      className={cn(
        "rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6 transition-all duration-1000",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">کانال جذب کاربر</h3>
        <div className="relative group">
          <AlertCircle className="h-4 w-4 text-gray-400 hover:text-primary transition-colors" />
          <div className="pointer-events-none absolute left-0 top-6 z-20 hidden w-64 rounded-xl border border-gray-200 bg-white p-2.5 text-[10px] font-bold leading-relaxed text-gray-600 shadow-xl group-hover:block dark:border-white/10 dark:bg-[#14161c] dark:text-gray-300">
            این شاخص را ما با استفاده از پاسخ‌هایی که از کاربران دریافت می‌کنیم محاسبه می‌کنیم.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ChartContainer config={chartConfig} className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={42}
                outerRadius={64}
                strokeWidth={0}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
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
