"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PanelSidebarContextType {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const Context = createContext<PanelSidebarContextType | undefined>(undefined);

export function PanelSidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobile = () => setMobileOpen((p) => !p);
  const toggleCollapsed = () => setIsCollapsed((p) => !p);

  return (
    <Context.Provider
      value={{
        isMobileOpen,
        setMobileOpen,
        toggleMobile,
        isCollapsed,
        setIsCollapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function usePanelSidebar() {
  const ctx = useContext(Context);
  if (!ctx)
    return {
      isMobileOpen: false,
      setMobileOpen: () => {},
      toggleMobile: () => {},
      isCollapsed: false,
      setIsCollapsed: () => {},
      toggleCollapsed: () => {},
    };
  return ctx;
}
