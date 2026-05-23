"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

export function ChartContainer({
  id,
  className,
  children,
  config,
}: React.ComponentProps<"div"> & { config: ChartConfig }) {
  const style = React.useMemo(() => {
    const vars: Record<string, string> = {};
    Object.entries(config).forEach(([key, item]) => {
      if (item.color) vars[`--color-${key}`] = item.color;
    });
    return vars as React.CSSProperties;
  }, [config]);

  return (
    <div
      id={id}
      className={cn(
        "flex aspect-video w-full items-center justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string; payload?: Record<string, unknown> }>;
  label?: string;
  formatter?: (value: number | string, name: string) => React.ReactNode;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-[#161a22]/95">
      {label ? <div className="mb-1 text-[11px] font-bold text-gray-500 dark:text-gray-300">{label}</div> : null}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const name = item.name || "";
          const value = item.value ?? "";
          return (
            <div key={`${name}-${index}`} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{name}</span>
              <span className="font-bold">
                {formatter ? formatter(value, name) : value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
