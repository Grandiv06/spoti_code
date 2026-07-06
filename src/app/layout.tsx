import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeWrapper from "./components/ThemeWrapper";
import AppShell from "./components/AppShell";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import CartSidebar from "./components/CartSidebar";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "آکادمی کد - آموزش برنامه‌نویسی",
  description: "مسیر حرفه‌ای شدن در دنیای برنامه‌نویسی",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/material-icons-round.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/material-icons.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('spoticode-theme');
                  const root = document.documentElement;
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var root = document.documentElement;
                root.classList.add('material-icons-loading');
                function markReady() {
                  root.classList.remove('material-icons-loading');
                  root.classList.add('material-icons-ready');
                }
                if (!document.fonts || !document.fonts.load) {
                  markReady();
                  return;
                }
                Promise.all([
                  document.fonts.load('400 24px "Material Symbols Outlined Variable"'),
                  document.fonts.load('400 24px "Material Icons Round"'),
                ]).then(markReady).catch(markReady);
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="spoticode-theme"
        >
          <ThemeWrapper>
            <QueryProvider>
              <AuthProvider>
                <CartProvider>
                  <AppShell>{children}</AppShell>
                  <CartSidebar />
                </CartProvider>
              </AuthProvider>
            </QueryProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
