"use client";

import { useEffect } from "react";
import PanelShell from "@/components/panel/PanelShell";
import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelHeader from "@/components/panel/PanelHeader";
import PanelBottomNav from "@/components/panel/PanelBottomNav";
import PanelAuthGuard from "@/components/panel/PanelAuthGuard";
import { SocialProvider } from "@/context/SocialContext";
import { usePrefetchPanelMyCourses } from "@/hooks/api/usePanelMyCourses";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelAuthGuard>
      <SocialProvider>
        <PanelLayoutContent>{children}</PanelLayoutContent>
      </SocialProvider>
    </PanelAuthGuard>
  );
}

function PanelLayoutContent({ children }: { children: React.ReactNode }) {
  const prefetchMyCourses = usePrefetchPanelMyCourses();

  // Warm the my-courses cache as soon as the panel shell mounts so
  // /panel/courses is usually already populated when the user opens it.
  useEffect(() => {
    prefetchMyCourses();
  }, [prefetchMyCourses]);

  return (
    <PanelShell
      sidebar={<PanelSidebar />}
      header={<PanelHeader />}
      bottomNav={<PanelBottomNav />}
    >
      {children}
    </PanelShell>
  );
}
