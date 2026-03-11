"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

type WindowWithAuthTimer = Window & {
  __authRouteTimer?: number;
};

type AuthTransitionLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export default function AuthTransitionLink({
  href,
  children,
  className,
  ...rest
}: AuthTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }

    e.preventDefault();

    const root = document.documentElement;
    const win = window as WindowWithAuthTimer;
    root.classList.add("auth-route-transitioning");

    if (win.__authRouteTimer) {
      window.clearTimeout(win.__authRouteTimer);
    }

    window.setTimeout(() => {
      router.push(String(href));
    }, 110);

    win.__authRouteTimer = window.setTimeout(() => {
      root.classList.remove("auth-route-transitioning");
    }, 420);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
