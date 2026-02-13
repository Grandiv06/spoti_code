import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelHeader from "@/components/panel/PanelHeader";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#14161c] overflow-hidden">
      <PanelSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader />
        <main className="flex-1 overflow-auto p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
