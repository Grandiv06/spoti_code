"use client";

import {
  GraduationCap,
  Headphones,
  Home,
  ReceiptText,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import {
  PanelNavItem,
  type PanelNavItemConfig,
} from "@/components/panel/PanelNavItem";
import { cn } from "@/lib/utils";

const CENTER_BUTTON_SIZE = 58.4;
const NOTCH_GAP = 4;
const NOTCH_PADDING = 6;
const NOTCH_RADIUS = Number((CENTER_BUTTON_SIZE / 2 + NOTCH_GAP).toFixed(1));
const NOTCH_DEPTH = NOTCH_RADIUS;
const NOTCH_JOIN_OFFSET = Number((NOTCH_RADIUS * 0.56).toFixed(1));
const NOTCH_JOIN_Y = Number(
  Math.sqrt(
    NOTCH_RADIUS * NOTCH_RADIUS - NOTCH_JOIN_OFFSET * NOTCH_JOIN_OFFSET,
  ).toFixed(1),
);
const NOTCH_SHOULDER_EXT = 12;
const NOTCH_VISIBLE_WIDTH = Number(
  ((NOTCH_RADIUS + NOTCH_SHOULDER_EXT) * 2).toFixed(1),
);
const NOTCH_WIDTH = Number(
  (NOTCH_VISIBLE_WIDTH + NOTCH_PADDING * 2).toFixed(1),
);
const NOTCH_CENTER_X = NOTCH_WIDTH / 2;
const NOTCH_LEFT = NOTCH_PADDING;
const NOTCH_RIGHT = Number((NOTCH_LEFT + NOTCH_VISIBLE_WIDTH).toFixed(1));
const NOTCH_LEFT_JOIN_X = Number(
  (NOTCH_CENTER_X - NOTCH_JOIN_OFFSET).toFixed(1),
);
const NOTCH_RIGHT_JOIN_X = Number(
  (NOTCH_CENTER_X + NOTCH_JOIN_OFFSET).toFixed(1),
);
const NOTCH_TANGENT_X = Number((NOTCH_JOIN_Y / NOTCH_RADIUS).toFixed(4));
const NOTCH_TANGENT_Y = Number((NOTCH_JOIN_OFFSET / NOTCH_RADIUS).toFixed(4));
const NOTCH_SHOULDER_LENGTH = Number(
  (NOTCH_LEFT_JOIN_X - NOTCH_LEFT).toFixed(1),
);
const NOTCH_SHOULDER_PULL = Number(
  Math.min(16, NOTCH_SHOULDER_LENGTH * 0.58).toFixed(1),
);
const NOTCH_LEFT_CP1_X = Number((NOTCH_LEFT + NOTCH_SHOULDER_PULL).toFixed(1));
const NOTCH_LEFT_CP2_X = Number(
  (NOTCH_LEFT_JOIN_X - NOTCH_TANGENT_X * NOTCH_SHOULDER_PULL).toFixed(1),
);
const NOTCH_LEFT_CP2_Y = Number(
  (NOTCH_JOIN_Y - NOTCH_TANGENT_Y * NOTCH_SHOULDER_PULL).toFixed(1),
);
const NOTCH_RIGHT_CP1_X = Number(
  (NOTCH_RIGHT_JOIN_X + NOTCH_TANGENT_X * NOTCH_SHOULDER_PULL).toFixed(1),
);
const NOTCH_RIGHT_CP1_Y = Number(
  (NOTCH_JOIN_Y - NOTCH_TANGENT_Y * NOTCH_SHOULDER_PULL).toFixed(1),
);
const NOTCH_RIGHT_CP2_X = Number(
  (NOTCH_RIGHT - NOTCH_SHOULDER_PULL).toFixed(1),
);
const NOTCH_PATH = [
  `M${NOTCH_LEFT} 0`,
  `C${NOTCH_LEFT_CP1_X} 0 ${NOTCH_LEFT_CP2_X} ${NOTCH_LEFT_CP2_Y} ${NOTCH_LEFT_JOIN_X} ${NOTCH_JOIN_Y}`,
  `A${NOTCH_RADIUS} ${NOTCH_RADIUS} 0 0 0 ${NOTCH_RIGHT_JOIN_X} ${NOTCH_JOIN_Y}`,
  `C${NOTCH_RIGHT_CP1_X} ${NOTCH_RIGHT_CP1_Y} ${NOTCH_RIGHT_CP2_X} 0 ${NOTCH_RIGHT} 0`,
  `L${NOTCH_LEFT} 0 Z`,
].join(" ");
const BAR_TOP_CORNER_RADIUS_PX = 22.4;

function fullBarOutlinePath(barWidth: number, barHeight: number): string {
  const w = Math.max(barWidth, NOTCH_WIDTH + 8);
  const H = Math.max(barHeight, NOTCH_DEPTH + 8);
  const r = Math.min(BAR_TOP_CORNER_RADIUS_PX, w / 2 - 1);
  const cx = w / 2;
  const sx = cx - NOTCH_WIDTH / 2;
  const leftIn = sx + NOTCH_LEFT;
  const rightOut = sx + NOTCH_RIGHT;
  return [
    `M0 ${H}`,
    `L0 ${r}`,
    `A${r} ${r} 0 0 1 ${r} 0`,
    `L${leftIn} 0`,
    `C${sx + NOTCH_LEFT_CP1_X} 0 ${sx + NOTCH_LEFT_CP2_X} ${NOTCH_LEFT_CP2_Y} ${sx + NOTCH_LEFT_JOIN_X} ${NOTCH_JOIN_Y}`,
    `A${NOTCH_RADIUS} ${NOTCH_RADIUS} 0 0 0 ${sx + NOTCH_RIGHT_JOIN_X} ${NOTCH_JOIN_Y}`,
    `C${sx + NOTCH_RIGHT_CP1_X} ${NOTCH_RIGHT_CP1_Y} ${sx + NOTCH_RIGHT_CP2_X} 0 ${rightOut} 0`,
    `L${w - r} 0`,
    `A${r} ${r} 0 0 1 ${w} ${r}`,
    `L${w} ${H}`,
  ].join("");
}

const CUTOUT_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${NOTCH_WIDTH} ${NOTCH_DEPTH}"><path fill="black" d="${NOTCH_PATH}"/></svg>`,
)}`;

const CUTOUT_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: `url("${CUTOUT_SVG}"), linear-gradient(black, black)`,
  maskImage: `url("${CUTOUT_SVG}"), linear-gradient(black, black)`,
  WebkitMaskPosition: "top center, center",
  maskPosition: "top center, center",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskSize: `${NOTCH_WIDTH}px ${NOTCH_DEPTH}px, 100% 100%`,
  maskSize: `${NOTCH_WIDTH}px ${NOTCH_DEPTH}px, 100% 100%`,
  WebkitMaskComposite: "destination-out",
  maskComposite: "exclude",
};

const navItems: PanelNavItemConfig[] = [
  { href: "/panel/profile", label: "پروفایل", icon: User },
  { href: "/panel/support", label: "پشتیبانی", icon: Headphones },
  { href: "/panel", label: "داشبورد", icon: Home, isCenter: true },
  { href: "/panel/courses", label: "دوره‌ها", icon: GraduationCap },
  { href: "/panel/transactions", label: "تراکنش‌ها", icon: ReceiptText },
];

function isActive(pathname: string, href: string) {
  if (href === "/panel") {
    return pathname === "/panel";
  }
  if (href === "/panel/profile") {
    return (
      pathname === "/panel/profile" ||
      pathname.startsWith("/panel/profile/") ||
      pathname === "/panel/settings" ||
      pathname.startsWith("/panel/settings/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type PanelBottomNavProps = {
  className?: string;
};

export default function PanelBottomNav({ className }: PanelBottomNavProps) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [barSize, setBarSize] = useState({ w: 400, h: 72 });

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      dir="ltr"
      data-panel-bottom-nav=""
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 isolate overflow-visible lg:hidden",
        className,
      )}
      aria-label="ناوبری اصلی"
    >
      <div
        ref={barRef}
        className="relative mx-auto w-full max-w-2xl h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] mt-[1.25rem] overflow-visible"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-t-[1.4rem] bg-[color-mix(in_oklab,#ffffff_86%,transparent)] shadow-[0_-18px_48px_rgba(15,23,42,0.16)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,#ffffff_72%,transparent)] dark:bg-[color-mix(in_oklab,#14161c_82%,transparent)] dark:shadow-[0_-18px_48px_rgba(0,0,0,0.55)] dark:supports-[backdrop-filter]:bg-[color-mix(in_oklab,#14161c_66%,transparent)]"
          style={CUTOUT_MASK_STYLE}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-t-[1.4rem] [box-shadow:inset_0_-1px_0_color-mix(in_oklab,#22c55e_12%,transparent)]"
          style={CUTOUT_MASK_STYLE}
          aria-hidden
        />

        <svg
          className="pointer-events-none absolute inset-0 z-0 block size-full overflow-visible text-[color-mix(in_oklab,#22c55e_34%,transparent)] dark:text-[color-mix(in_oklab,#22c55e_28%,transparent)]"
          viewBox={`0 0 ${barSize.w} ${barSize.h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path
            d={fullBarOutlinePath(barSize.w, barSize.h)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </svg>

        <ul className="absolute inset-x-0 top-0 z-10 grid h-[3.5rem] grid-cols-5 items-end gap-0 overflow-visible px-2 pb-0">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li
                key={item.href}
                className="flex h-[3.5rem] w-full items-end justify-center overflow-visible"
              >
                <PanelNavItem item={item} active={active} />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
