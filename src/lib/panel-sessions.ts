import { apiDeleteNoMock, apiGetNoMock } from "@/lib/api";
import { getAuthHeaders, getSessionId } from "@/lib/auth-tokens";
import type { ActiveSessionItem } from "@/lib/phone-auth";

type SessionsResponse = {
  data?: {
    sessions?: ActiveSessionItem[];
    maxSessions?: number;
  };
  sessions?: ActiveSessionItem[];
  maxSessions?: number;
};

function unwrapSessions(payload: unknown): { sessions: ActiveSessionItem[]; maxSessions: number } {
  const row = payload as SessionsResponse;
  const data = row.data ?? row;
  return {
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    maxSessions: Number(data.maxSessions ?? 2),
  };
}

export async function fetchActiveSessions(): Promise<{ sessions: ActiveSessionItem[]; maxSessions: number }> {
  const sessionId = getSessionId();
  const query = sessionId ? `?currentSessionId=${encodeURIComponent(sessionId)}` : "";
  const response = await apiGetNoMock<unknown>(`/api/dashboard/sessions${query}`, getAuthHeaders());
  return unwrapSessions(response);
}

export async function revokeActiveSession(sessionId: string): Promise<{ sessions: ActiveSessionItem[]; maxSessions: number }> {
  const currentSessionId = getSessionId();
  const params = new URLSearchParams({ sessionId });
  if (currentSessionId) params.set("currentSessionId", currentSessionId);
  const response = await apiDeleteNoMock<unknown>(
    `/api/dashboard/sessions?${params.toString()}`,
    getAuthHeaders()
  );
  return unwrapSessions(response);
}

export function formatSessionDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function deviceTypeIcon(deviceType: string) {
  if (deviceType === "mobile") return "smartphone";
  if (deviceType === "tablet") return "tablet";
  return "computer";
}
