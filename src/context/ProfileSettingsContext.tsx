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
  websiteUrl: string;
  mbti: string;
  skills: string[];
  avatarImage?: string;
  bannerImage?: string;
};

export const EMPTY_PROFILE_SETTINGS: ProfileSettings = {
  bannerColor: "#22c55e",
  useDefaultBanner: true,
  displayName: "",
  bio: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  telegramUrl: "",
  websiteUrl: "",
  mbti: "",
  skills: [],
  avatarImage: "",
  bannerImage: "",
};

const DEFAULT = EMPTY_PROFILE_SETTINGS;

type ProfileSettingsContextType = {
  settings: ProfileSettings;
  updateSettings: (updates: Partial<ProfileSettings>) => void;
  hydrateSettings: (updates: Partial<ProfileSettings>) => void;
};

const Context = createContext<ProfileSettingsContextType | undefined>(undefined);

function loadFromStorage(): ProfileSettings {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE_SETTINGS };
  try {
    const raw = localStorage.getItem(PROFILE_SETTINGS_KEY);
    if (!raw) return { ...EMPTY_PROFILE_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<ProfileSettings>;
    const merged = { ...EMPTY_PROFILE_SETTINGS, ...parsed };
    if (parsed && !("useDefaultBanner" in parsed) && parsed.bannerColor) {
      merged.useDefaultBanner = false;
    }
    return merged;
  } catch {
    return { ...EMPTY_PROFILE_SETTINGS };
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

  const hydrateSettings = useCallback((updates: Partial<ProfileSettings>) => {
    setSettings(() => {
      const next = { ...EMPTY_PROFILE_SETTINGS, ...updates };
      saveToStorage(next);
      return next;
    });
  }, []);

  return (
    <Context.Provider value={{ settings, updateSettings, hydrateSettings }}>
      {children}
    </Context.Provider>
  );
}

export function useProfileSettings() {
  const ctx = useContext(Context);
  if (!ctx) {
    return {
      settings: EMPTY_PROFILE_SETTINGS,
      updateSettings: () => {},
      hydrateSettings: () => {},
    };
  }
  return ctx;
}
