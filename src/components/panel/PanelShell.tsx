"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isSupportChatRoute } from "@/components/panel/SupportChatHeaderContext";

interface PanelShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  bottomNav?: React.ReactNode;
}

export default function PanelShell({
  sidebar,
  header,
  bottomNav,
  children,
}: PanelShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const hideBottomNav = isSupportChatRoute(pathname);
  const showBottomNav = Boolean(bottomNav) && !hideBottomNav;

  useEffect(() => {
    document.body.classList.add("panel-layout");

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };
    const preventMultiTouchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture, {
      passive: false,
    });
    document.addEventListener("gesturechange", preventGesture, {
      passive: false,
    });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    document.addEventListener("touchmove", preventMultiTouchZoom, {
      passive: false,
    });

    return () => {
      document.body.classList.remove("panel-layout");
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchmove", preventMultiTouchZoom);
    };
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      ref={shellRef}
      className="panel-shell fixed inset-x-0 top-0 bottom-0 bg-gray-50 text-gray-900 dark:bg-[#14161c] dark:text-[#e2e8f0] flex overflow-hidden"
    >
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {header}
        <main
          ref={mainRef}
          className={
            showBottomNav
              ? "panel-main flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-3 py-4 sm:px-6 sm:py-6 pb-[calc(6.95rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(7.3rem+env(safe-area-inset-bottom,0px))] lg:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              : hideBottomNav
                ? "panel-main flex-1 min-h-0 overflow-hidden overscroll-none touch-pan-y px-0 py-0"
                : "panel-main flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-3 py-4 sm:px-6 sm:py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          }
        >
          <div className={hideBottomNav ? "panel-page-content h-full min-h-0" : "panel-page-content min-h-full"}>
            {children}
          </div>
        </main>
        {showBottomNav ? bottomNav : null}
      </div>
    </div>
  );
}
