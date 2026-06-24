"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ticket } from "@/app/panel/support/data";
import { formatTicketDate } from "@/app/panel/support/data";
import { apiGetNoMock, apiPatchNoMock, apiPostNoMock } from "@/lib/api";
import {
  normalizeAdminTicketMessage,
  normalizeAdminTicketResponse,
  normalizeAdminTicketsResponse,
} from "@/lib/admin-tickets";

export type AdminTicketsQueryParams = {
  search?: string;
  status?: "open" | "underReview" | "answered" | "closed";
  urgency?: "high" | "medium" | "low";
  page?: number;
  limit?: number;
};

export const adminTicketsQueryKey = (params: AdminTicketsQueryParams) => ["admin-tickets", params] as const;
export const adminTicketDetailQueryKey = (ticketId: string) => ["admin-ticket", ticketId] as const;

function beautifyAdminTicketDates(ticket: Ticket): Ticket {
  return {
    ...ticket,
    createdAt: formatTicketDate(ticket.createdAt),
    updatedAt: formatTicketDate(ticket.updatedAt),
    messages: ticket.messages.map((message) => ({
      ...message,
      timestamp: formatTicketDate(message.timestamp),
    })),
  };
}

function adminTicketDetailPath(ticketId: string) {
  return `/api/tickets/admin/${encodeURIComponent(ticketId)}`;
}

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

export function useAdminTicketDetailQuery(ticketId: string, enabled: boolean) {
  return useQuery({
    queryKey: adminTicketDetailQueryKey(ticketId),
    queryFn: async () =>
      beautifyAdminTicketDates(
        normalizeAdminTicketResponse(await apiGetNoMock<unknown>(adminTicketDetailPath(ticketId)))
      ),
    enabled: Boolean(ticketId) && enabled,
    staleTime: 0,
    retry: 1,
  });
}

export function mapAdminTicketStatusFilter(
  value: string
): AdminTicketsQueryParams["status"] | undefined {
  if (value === "all") return undefined;
  if (value === "investigating") return "open";
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

function adminTicketClosePath(ticketId: string) {
  return `/api/tickets/admin/${encodeURIComponent(ticketId)}/close`;
}

function adminTicketMessagePath(ticketId: string) {
  return `/api/tickets/admin/${encodeURIComponent(ticketId)}/messages`;
}

export function useCloseAdminTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: string) =>
      normalizeAdminTicketResponse(await apiPatchNoMock<unknown>(adminTicketClosePath(ticketId))),
    onSuccess: async (_ticket, ticketId) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      await queryClient.invalidateQueries({ queryKey: adminTicketDetailQueryKey(ticketId) });
    },
  });
}

export function useSendAdminTicketMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, body }: { ticketId: string; body: string }) => {
      const message = normalizeAdminTicketMessage(
        await apiPostNoMock<unknown>(adminTicketMessagePath(ticketId), { body })
      );

      return {
        ...message,
        timestamp: formatTicketDate(
          message.timestamp === "—" ? new Date().toISOString() : message.timestamp
        ),
      };
    },
    onSuccess: async (message, { ticketId }) => {
      queryClient.setQueryData<Ticket | undefined>(adminTicketDetailQueryKey(ticketId), (current) => {
        if (!current) return current;
        if (current.messages.some((item) => item.id === message.id)) return current;
        return {
          ...current,
          status: "answered",
          updatedAt: message.timestamp,
          messages: [...current.messages, message],
        };
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      void queryClient.invalidateQueries({ queryKey: adminTicketDetailQueryKey(ticketId) });
    },
  });
}
