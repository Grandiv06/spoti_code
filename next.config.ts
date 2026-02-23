import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ برای خروجی کاملاً استاتیک (سازگار با Capacitor)
  output: "export",

  // ✅ چون Image Optimization سرور می‌خواهد، برای export باید غیر فعالش کنیم
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
