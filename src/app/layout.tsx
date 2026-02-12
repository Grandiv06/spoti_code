import "@fontsource/material-icons-round";
import "@fontsource-variable/material-symbols-outlined";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeWrapper from "./components/ThemeWrapper";
import AppShell from "./components/AppShell";
import { CartProvider } from "../context/CartContext";
import CartSidebar from "./components/CartSidebar";

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
            <CartProvider>
              <AppShell>{children}</AppShell>
              <CartSidebar />
            </CartProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
