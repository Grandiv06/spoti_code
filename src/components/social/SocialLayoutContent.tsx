"use client";

export default function SocialLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen pb-8">
      {children}
    </main>
  );
}
