"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { normalizeAdminOrdersResponse } from "@/lib/admin-orders";

export type AdminOrderApiStatus = "pending" | "redirected" | "expired" | "paid" | "failed" | "canceled";

export type AdminOrdersQueryParams = {
  search?: string;
  status?: AdminOrderApiStatus;
  userId?: string;
  courseId?: string;
  page?: number;
  limit?: number;
};

export const adminOrdersQueryKey = (params: AdminOrdersQueryParams) => ["admin-orders", params] as const;

function buildAdminOrdersPath(params: AdminOrdersQueryParams) {
  const query = new URLSearchParams();

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.userId?.trim()) query.set("userId", params.userId.trim());
  if (params.courseId?.trim()) query.set("courseId", params.courseId.trim());
  if (params.page != null) query.set("page", String(params.page));
  if (params.limit != null) query.set("limit", String(params.limit));

  const suffix = query.toString();
  return suffix ? `/api/admin-dashboard/orders?${suffix}` : "/api/admin-dashboard/orders";
}

export function mapAdminOrderStatusFilter(value: string): AdminOrderApiStatus | undefined {
  if (value === "all") return undefined;
  if (value === "paid") return "paid";
  if (value === "pending") return "pending";
  if (value === "canceled") return "canceled";
  return undefined;
}

export function useAdminOrdersQuery(params: AdminOrdersQueryParams = {}) {
  const search = params.search?.trim() || undefined;
  const status = params.status;
  const userId = params.userId?.trim() || undefined;
  const courseId = params.courseId?.trim() || undefined;
  const page = params.page;
  const limit = params.limit;
  const queryParams = { search, status, userId, courseId, page, limit };

  return useQuery({
    queryKey: adminOrdersQueryKey(queryParams),
    queryFn: async () =>
      normalizeAdminOrdersResponse(await apiGetNoMock<unknown>(buildAdminOrdersPath(queryParams))),
    staleTime: 30_000,
    retry: 1,
  });
}
