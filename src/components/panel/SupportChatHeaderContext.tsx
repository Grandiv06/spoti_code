"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type SupportChatHeaderInfo = {
  subject: string;
  status: string;
  updatedAt: string;
};

type SupportChatHeaderContextValue = {
  info: SupportChatHeaderInfo | null;
  setInfo: (info: SupportChatHeaderInfo | null) => void;
};

const SupportChatHeaderContext = createContext<SupportChatHeaderContextValue>({
  info: null,
  setInfo: () => {},
});

export function isSupportChatRoute(pathname: string | null) {
  return pathname === "/panel/support/details" || Boolean(pathname?.startsWith("/panel/support/details"));
}

export function SupportChatHeaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [info, setInfo] = useState<SupportChatHeaderInfo | null>(null);
  const value = useMemo(() => ({ info, setInfo }), [info]);

  return (
    <SupportChatHeaderContext.Provider value={value}>
      {children}
    </SupportChatHeaderContext.Provider>
  );
}

export function useSupportChatHeader() {
  return useContext(SupportChatHeaderContext);
}
