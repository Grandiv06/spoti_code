"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { label: string; value: number };

function BarValueBadge(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;
  const badgeWidth = 44;
  const badgeHeight = 24;
  const bx = x + width + 8;
  const by = y + height / 2 - badgeHeight / 2;

  return (
    <g>
      <rect x={bx} y={by} rx={10} ry={10} width={badgeWidth} height={badgeHeight} fill="#0c1728" stroke="#183a63" />
      <text
        x={bx + badgeWidth / 2}
        y={by + badgeHeight / 2 + 4}
        textAnchor="middle"
        fill="#f8fafc"
        style={{ fontSize: 12, fontWeight: 800 }}
      >
        {value}
      </text>
    </g>
  );
}

export function MiniAreaChart({ data }: { data: Point[] }) {
  const chartConfig = {
    revenue: { label: "درآمد", color: "#22c55e" },
  };

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:px-3 md:py-5">
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
  const chartConfig = {
    value: { label: "فروش", color: "#22c55e" },
  };
  const totalSales = data.reduce((sum, item) => sum + item.value, 0);
  const top = data[0];
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartData = data.map((item) => ({
    ...item,
    full: maxValue,
    share: Math.round((item.value / totalSales) * 100),
  }));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6">
      <div className="pointer-events-none absolute -left-12 top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="mb-3 flex items-start justify-between px-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">فروش به تفکیک دسته</h3>
        <div className="text-left">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">مجموع فروش</p>
          <p className="text-base font-black text-white">{totalSales}</p>
        </div>
      </div>
      <div className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
        پرفروش‌ترین دسته: <span className="font-bold text-emerald-200">{top?.label}</span>
      </div>
      <ChartContainer config={chartConfig} className="h-[340px] w-full !aspect-auto !items-stretch !justify-start" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 2 }} barCategoryGap={16}>
            <defs>
              <linearGradient id="admin-green-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" className="stroke-white/10 dark:stroke-white/10" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={74}
              tick={{ fill: "#e5e7eb", fontSize: 13, fontWeight: 700 }}
            />
            <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `${value}`} />} />
            <Bar dataKey="full" fill="#1a2740" radius={10} barSize={30} isAnimationActive={false} />
            <Bar
              dataKey="value"
              fill="url(#admin-green-bar)"
              radius={10}
              barSize={30}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey="share"
                position="insideRight"
                offset={10}
                className="fill-[#08331f]"
                style={{ fontSize: 10, fontWeight: 800 }}
                formatter={(v: number) => `%${v}`}
              />
              <LabelList dataKey="value" content={<BarValueBadge />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

export function DonutChannels({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
    acc[item.label] = { label: item.label, color: item.color };
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1c1e26] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">کانال جذب کاربر</h3>
        <div className="relative group">
          <AlertCircle className="h-4 w-4 text-gray-400 hover:text-primary transition-colors" />
          <div className="pointer-events-none absolute left-0 top-6 z-20 hidden w-64 rounded-xl border border-gray-200 bg-white p-2.5 text-[10px] font-bold leading-relaxed text-gray-600 shadow-xl group-hover:block dark:border-white/10 dark:bg-[#14161c] dark:text-gray-300">
            این شاخص را ما با استفاده از پاسخ‌هایی که از کاربران دریافت می‌کنیم محاسبه می‌کنیم.
          </div>
        </div>
      </div>
      <div className="flex min-h-[200px] items-center gap-4">
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
