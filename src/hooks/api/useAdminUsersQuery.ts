"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminDashboardService } from "@/api";
import {
  normalizeAdminUsersResponse,
  type AdminUsersQueryParams,
} from "@/lib/admin-users";

export const adminUsersQueryKey = (params: AdminUsersQueryParams) => ["admin-users", params] as const;

const DEFAULT_LIMIT = 500;

export function useAdminUsersQuery(params: AdminUsersQueryParams = {}) {
  const search = params.search?.trim() || undefined;
  const email = params.email?.trim() || undefined;
  const phoneNumber = params.phoneNumber?.trim() || undefined;
  const nationalCode = params.nationalCode?.trim() || undefined;
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_LIMIT;

  return useQuery({
    queryKey: adminUsersQueryKey({ search, email, phoneNumber, nationalCode, page, limit }),
    queryFn: async () =>
      normalizeAdminUsersResponse(
        await AdminDashboardService.adminDashboardControllerFindUsers(
          search,
          email,
          phoneNumber,
          nationalCode,
          page,
          limit
        )
      ),
    staleTime: 30_000,
    retry: 1,
  });
}
