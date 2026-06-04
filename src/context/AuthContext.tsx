"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { OpenAPI } from "@/api";

const AUTH_STORAGE_KEY = "spoticode-auth";
const ACCESS_TOKEN_KEY = "accessToken";

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
  login: (user: AuthUser, token?: string) => void;
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
    const stored = loadFromStorage();
    const storedToken = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : "";

    OpenAPI.TOKEN = storedToken || "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback((u: AuthUser, token?: string) => {
    setUser(u);
    saveToStorage(u);

    if (typeof window !== "undefined") {
      const nextToken = token || localStorage.getItem(ACCESS_TOKEN_KEY) || "";
      if (nextToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
      }
      OpenAPI.TOKEN = nextToken;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveToStorage(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    OpenAPI.TOKEN = "";
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
