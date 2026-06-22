"use client";

import { useQuery } from "@tanstack/react-query";
import type { Ticket } from "@/app/panel/support/data";
import { apiGetNoMock } from "@/lib/api";
import { normalizeAdminTicketsResponse } from "@/lib/admin-tickets";

export type AdminTicketsQueryParams = {
  search?: string;
  status?: "open" | "underReview" | "answered" | "closed";
  urgency?: "high" | "medium" | "low";
  page?: number;
  limit?: number;
};

export const adminTicketsQueryKey = (params: AdminTicketsQueryParams) => ["admin-tickets", params] as const;

function buildAdminTicketsPath(params: AdminTicketsQueryParams) {
  const query = new URLSearchParams();

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.urgency) query.set("urgency", params.urgency);
  if (params.page != null) query.set("page", String(params.page));
  if (params.limit != null) query.set("limit", String(params.limit));

  const suffix = query.toString();
  return suffix ? `/api/admin-dashboard/tickets?${suffix}` : "/api/admin-dashboard/tickets";
}

export function useAdminTicketsQuery(params: AdminTicketsQueryParams = {}) {
  const search = params.search?.trim() || undefined;
  const status = params.status;
  const urgency = params.urgency;
  const page = params.page;
  const limit = params.limit;
  const queryParams = { search, status, urgency, page, limit };

  return useQuery({
    queryKey: adminTicketsQueryKey(queryParams),
    queryFn: async (): Promise<Ticket[]> =>
      normalizeAdminTicketsResponse(await apiGetNoMock<unknown>(buildAdminTicketsPath(queryParams))),
    staleTime: 30_000,
    retry: 1,
  });
}

export function mapAdminTicketStatusFilter(
  value: string
): AdminTicketsQueryParams["status"] | undefined {
  if (value === "all") return undefined;
  if (value === "investigating") return "underReview";
  if (value === "open" || value === "answered" || value === "closed") return value;
  return undefined;
}

export function mapAdminTicketPriorityFilter(
  value: string
): AdminTicketsQueryParams["urgency"] | undefined {
  if (value === "all") return undefined;
  if (value === "low" || value === "medium" || value === "high") return value;
  return undefined;
}
