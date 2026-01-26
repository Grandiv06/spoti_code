import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeWrapper from "./components/ThemeWrapper";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "آکادمی کد - آموزش برنامه‌نویسی",
  description: "مسیر حرفه‌ای شدن در دنیای برنامه‌نویسی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
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
      <body className={`${vazirmatn.variable} antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="spoticode-theme"
        >
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
