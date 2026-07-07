import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Server-side optimization is ON so covers/avatars are resized and served as
    // modern formats at the size actually rendered (much smaller payloads).
    formats: ["image/avif", "image/webp"],
    // Local SVG logos (e.g. favicon.svg) still need to pass through the optimizer.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
