"use client";

import { InstructorDataProvider } from "@/context/InstructorDataContext";
import InstructorAuthGuard from "@/components/instructor/InstructorAuthGuard";
import InstructorShell from "@/components/instructor/InstructorShell";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <InstructorDataProvider>
      <InstructorAuthGuard>
        <InstructorShell>{children}</InstructorShell>
      </InstructorAuthGuard>
    </InstructorDataProvider>
  );
}
