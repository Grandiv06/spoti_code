import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthGuard>
  );
}
