"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { normalizeAdminUserDetail } from "@/lib/admin-user-detail";

export const adminUserQueryKey = (id: string) => ["admin-user", id] as const;

export function useAdminUserQuery(id: string) {
  return useQuery({
    queryKey: adminUserQueryKey(id),
    queryFn: async () =>
      normalizeAdminUserDetail(
        await apiGetNoMock(`/api/admin-dashboard/users/${encodeURIComponent(id)}/overview`)
      ),
    enabled: Boolean(id),
    retry: 1,
    staleTime: 30_000,
  });
}
