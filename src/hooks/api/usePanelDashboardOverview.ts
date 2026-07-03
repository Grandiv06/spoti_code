"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import {
  normalizePanelDashboardOverview,
  type PanelDashboardViewModel,
} from "@/lib/panel-dashboard";

export const panelDashboardOverviewQueryKey = ["panel-dashboard-overview"] as const;

export function usePanelDashboardOverview() {
  return useQuery<PanelDashboardViewModel, Error>({
    queryKey: panelDashboardOverviewQueryKey,
    queryFn: async () =>
      normalizePanelDashboardOverview(
        await apiGetNoMock<unknown>("/api/dashboard/overview", getAuthHeaders())
      ),
    staleTime: 30_000,
    retry: 1,
  });
}
