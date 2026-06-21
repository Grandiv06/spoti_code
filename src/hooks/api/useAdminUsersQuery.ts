"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import {
  normalizeAdminUsersResponse,
  type AdminUsersQueryParams,
} from "@/lib/admin-users";

export const adminUsersQueryKey = (params: AdminUsersQueryParams) => ["admin-users", params] as const;

function buildAdminUsersPath(params: AdminUsersQueryParams) {
  const query = new URLSearchParams();

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.email?.trim()) query.set("email", params.email.trim());
  if (params.phoneNumber?.trim()) query.set("phoneNumber", params.phoneNumber.trim());
  if (params.nationalCode?.trim()) query.set("nationalCode", params.nationalCode.trim());
  if (params.page != null) query.set("page", String(params.page));
  if (params.limit != null) query.set("limit", String(params.limit));

  const suffix = query.toString();
  return suffix ? `/api/admin-dashboard/users?${suffix}` : "/api/admin-dashboard/users";
}

export function useAdminUsersQuery(params: AdminUsersQueryParams = {}) {
  const search = params.search?.trim() || undefined;
  const email = params.email?.trim() || undefined;
  const phoneNumber = params.phoneNumber?.trim() || undefined;
  const nationalCode = params.nationalCode?.trim() || undefined;
  const page = params.page;
  const limit = params.limit;
  const queryParams = { search, email, phoneNumber, nationalCode, page, limit };

  return useQuery({
    queryKey: adminUsersQueryKey(queryParams),
    queryFn: async () =>
      normalizeAdminUsersResponse(await apiGetNoMock<unknown>(buildAdminUsersPath(queryParams))),
    staleTime: 30_000,
    retry: 1,
  });
}
