"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const PROFILE_SETTINGS_KEY = "spoticode-profile-settings";

export type ProfileSettings = {
  bannerColor: string;
  useDefaultBanner: boolean;
  displayName: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  avatarImage?: string;
  bannerImage?: string;
};

const DEFAULT: ProfileSettings = {
  bannerColor: "#22c55e",
  useDefaultBanner: true,
  displayName: "",
  bio: "",
  location: "تهران، ایران",
  githubUrl: "",
  linkedinUrl: "",
  telegramUrl: "",
  avatarImage: "",
  bannerImage: "",
};

type ProfileSettingsContextType = {
  settings: ProfileSettings;
  updateSettings: (updates: Partial<ProfileSettings>) => void;
};

const Context = createContext<ProfileSettingsContextType | undefined>(undefined);

function loadFromStorage(): ProfileSettings {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(PROFILE_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as Partial<ProfileSettings>;
    const merged = { ...DEFAULT, ...parsed };
    // Migration: existing users had custom banner, keep it
    if (parsed && !("useDefaultBanner" in parsed) && parsed.bannerColor) {
      merged.useDefaultBanner = false;
    }
    return merged;
  } catch {
    return { ...DEFAULT };
  }
}

function saveToStorage(settings: ProfileSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function ProfileSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ProfileSettings>(DEFAULT);

  useEffect(() => {
    setSettings(loadFromStorage());
  }, []);

  const updateSettings = useCallback((updates: Partial<ProfileSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage(next);
      return next;
    });
  }, []);

  return (
    <Context.Provider value={{ settings, updateSettings }}>
      {children}
    </Context.Provider>
  );
}

export function useProfileSettings() {
  const ctx = useContext(Context);
  if (!ctx) return { settings: DEFAULT, updateSettings: () => {} };
  return ctx;
}
