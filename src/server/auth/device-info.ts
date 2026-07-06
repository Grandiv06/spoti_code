export type DeviceInfo = {
  label: string;
  deviceType: "desktop" | "mobile" | "tablet";
};

export function parseDeviceInfo(userAgent: string | null | undefined): DeviceInfo {
  const ua = userAgent?.trim() || "";

  const isTablet = /ipad|tablet|playbook|silk/i.test(ua);
  const isMobile = !isTablet && /mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua);

  let browser = "مرورگر";
  if (/edg\//i.test(ua) || /edga\//i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = "Opera";
  else if (/chrome\//i.test(ua) || /crios\//i.test(ua)) browser = "Chrome";
  else if (/firefox\//i.test(ua) || /fxios\//i.test(ua)) browser = "Firefox";
  else if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) browser = "Safari";

  let os = "سیستم‌عامل";
  if (/windows nt/i.test(ua)) os = "Windows";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return {
    label: `${browser} — ${os}`,
    deviceType: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
  };
}

export function getClientIp(request: { headers: Headers }): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || null;
}
