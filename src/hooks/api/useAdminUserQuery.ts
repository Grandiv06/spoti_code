"use client";

import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api";
import { normalizeAdminUserDetail } from "@/lib/admin-user-detail";

export const adminUserQueryKey = (id: string) => ["admin-user", id] as const;

export function useAdminUserQuery(id: string) {
  return useQuery({
    queryKey: adminUserQueryKey(id),
    queryFn: async () => normalizeAdminUserDetail(await UserService.userControllerFindOne(id)),
    enabled: Boolean(id),
    retry: 1,
    staleTime: 30_000,
  });
}
