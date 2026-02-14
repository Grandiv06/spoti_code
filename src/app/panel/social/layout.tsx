import React from "react";
import { SocialProvider } from "@/context/SocialContext";

export default function PanelSocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocialProvider>{children}</SocialProvider>;
}
