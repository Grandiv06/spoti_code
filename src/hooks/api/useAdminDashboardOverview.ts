"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminDashboardService } from "@/api";
import {
  normalizeAdminDashboardOverview,
  type AdminDashboardViewModel,
} from "@/lib/admin-dashboard";

export const adminDashboardOverviewQueryKey = ["admin-dashboard-overview"] as const;

export function useAdminDashboardOverview() {
  return useQuery<AdminDashboardViewModel, Error>({
    queryKey: adminDashboardOverviewQueryKey,
    queryFn: async () =>
      normalizeAdminDashboardOverview(
        await AdminDashboardService.adminDashboardControllerGetOverview()
      ),
    staleTime: 60_000,
    retry: 1,
  });
}
