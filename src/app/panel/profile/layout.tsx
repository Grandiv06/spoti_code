import { ProfileSettingsProvider } from "@/context/ProfileSettingsContext";

export default function PanelProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileSettingsProvider>{children}</ProfileSettingsProvider>;
}
