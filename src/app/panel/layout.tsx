import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelHeader from "@/components/panel/PanelHeader";
import PanelAuthGuard from "@/components/panel/PanelAuthGuard";
import { PanelSidebarProvider } from "@/context/PanelSidebarContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelAuthGuard>
      <PanelSidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-[#14161c]">
          <PanelSidebar />
          <div className="flex flex-1 flex-col min-w-0 transition-all duration-500 ease-in-out lg:mr-[294px]">
            <PanelHeader />
            <main className="flex-1 overflow-auto p-4 md:p-6 scrollbar-hide">
              {children}
            </main>
          </div>
        </div>
      </PanelSidebarProvider>
    </PanelAuthGuard>
  );
}
