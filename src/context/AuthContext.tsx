"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  ACCESS_TOKEN_KEY,
  clearAuthTokens,
  getAccessToken,
  onAuthSessionExpired,
  setAuthTokens,
} from "@/lib/auth-tokens";
import { setupApiClient } from "@/lib/setup-api-client";

const AUTH_STORAGE_KEY = "spoticode-auth";

export type AuthUser = {
  id: string;
  phone: string;
  displayName: string;
  avatarUrl?: string;
  role: "admin" | "user" | "instructor";
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token?: string, refreshToken?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.phone) return null;
    const role =
      parsed?.role === "admin"
        ? "admin"
        : parsed?.role === "instructor"
          ? "instructor"
          : "user";
    return {
      ...parsed,
      role,
    };
  } catch {
    return null;
  }
}

function saveToStorage(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupApiClient();

    const stored = loadFromStorage();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored);
    setIsLoading(false);

    return onAuthSessionExpired(() => {
      setUser(null);
      saveToStorage(null);
    });
  }, []);

  const login = useCallback((u: AuthUser, token?: string, refreshToken?: string) => {
    setUser(u);
    saveToStorage(u);

    if (typeof window !== "undefined") {
      const nextToken = token || getAccessToken() || "";
      if (nextToken) {
        setAuthTokens(nextToken, refreshToken);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveToStorage(null);
    clearAuthTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export { ACCESS_TOKEN_KEY };
