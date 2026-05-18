"use client";

import { InstructorDataProvider } from "@/context/InstructorDataContext";
import InstructorShell from "@/components/instructor/InstructorShell";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <InstructorDataProvider>
      <InstructorShell>{children}</InstructorShell>
    </InstructorDataProvider>
  );
}
