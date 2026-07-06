import SocialRouteBlocker from "@/components/social/SocialRouteBlocker";

export default function PanelNotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocialRouteBlocker>{children}</SocialRouteBlocker>;
}
