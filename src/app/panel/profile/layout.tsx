import { SocialProvider } from "@/context/SocialContext";
import { ProfileSettingsProvider } from "@/context/ProfileSettingsContext";

export default function PanelProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocialProvider>
      <ProfileSettingsProvider>
        {children}
      </ProfileSettingsProvider>
    </SocialProvider>
  );
}
