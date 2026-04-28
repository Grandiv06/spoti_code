"use client";

import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelHeader from "@/components/panel/PanelHeader";
import PanelAuthGuard from "@/components/panel/PanelAuthGuard";
import { PanelSidebarProvider, usePanelSidebar } from "@/context/PanelSidebarContext";
import { SocialProvider } from "@/context/SocialContext";
import { cn } from "@/lib/utils";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelAuthGuard>
      <SocialProvider>
        <PanelSidebarProvider>
          <PanelLayoutContent>{children}</PanelLayoutContent>
        </PanelSidebarProvider>
      </SocialProvider>
    </PanelAuthGuard>
  );
}

function PanelLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = usePanelSidebar();
  
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-[#14161c]">
      <PanelSidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col min-w-0 transition-all duration-500 ease-in-out",
          isCollapsed ? "lg:mr-[100px]" : "lg:mr-[294px]"
        )}
      >
        <PanelHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
