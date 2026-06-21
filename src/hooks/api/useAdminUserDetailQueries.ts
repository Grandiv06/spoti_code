"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetNoMock, apiPutNoMock } from "@/lib/api";
import { normalizeAdminUserDetail } from "@/lib/admin-user-detail";
import {
  normalizeInternalNoteResponse,
  normalizePurchasedCoursesResponse,
  normalizeUserActivitiesResponse,
  normalizeUserTicketsResponse,
  normalizeUserTransactionsResponse,
} from "@/lib/admin-user-detail-resources";

export const adminUserOverviewQueryKey = (userId: string) => ["admin-user-overview", userId] as const;
export const adminUserCoursesQueryKey = (userId: string) => ["admin-user-courses", userId] as const;
export const adminUserTransactionsQueryKey = (userId: string) => ["admin-user-transactions", userId] as const;
export const adminUserTicketsQueryKey = (userId: string) => ["admin-user-tickets", userId] as const;
export const adminUserActivitiesQueryKey = (userId: string) => ["admin-user-activities", userId] as const;
export const adminUserInternalNoteQueryKey = (userId: string) => ["admin-user-internal-note", userId] as const;

function userDetailPath(userId: string, segment: string) {
  return `/api/admin-dashboard/users/${encodeURIComponent(userId)}/${segment}`;
}

export function useAdminUserOverviewQuery(userId: string) {
  return useQuery({
    queryKey: adminUserOverviewQueryKey(userId),
    queryFn: async () =>
      normalizeAdminUserDetail(await apiGetNoMock<unknown>(userDetailPath(userId, "overview"))),
    enabled: Boolean(userId),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAdminUserCoursesQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminUserCoursesQueryKey(userId),
    queryFn: async () =>
      normalizePurchasedCoursesResponse(await apiGetNoMock<unknown>(userDetailPath(userId, "courses"))),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAdminUserTransactionsQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminUserTransactionsQueryKey(userId),
    queryFn: async () =>
      normalizeUserTransactionsResponse(
        await apiGetNoMock<unknown>(userDetailPath(userId, "transactions"))
      ),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAdminUserTicketsQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminUserTicketsQueryKey(userId),
    queryFn: async () =>
      normalizeUserTicketsResponse(await apiGetNoMock<unknown>(userDetailPath(userId, "tickets"))),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAdminUserActivitiesQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminUserActivitiesQueryKey(userId),
    queryFn: async () =>
      normalizeUserActivitiesResponse(await apiGetNoMock<unknown>(userDetailPath(userId, "activities"))),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useAdminUserInternalNoteQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminUserInternalNoteQueryKey(userId),
    queryFn: async () =>
      normalizeInternalNoteResponse(await apiGetNoMock<unknown>(userDetailPath(userId, "internal-note"))),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useUpdateAdminUserInternalNoteMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: string) =>
      normalizeInternalNoteResponse(
        await apiPutNoMock<unknown>(userDetailPath(userId, "internal-note"), { note })
      ),
    onSuccess: async (note) => {
      queryClient.setQueryData(adminUserInternalNoteQueryKey(userId), note);
      queryClient.invalidateQueries({ queryKey: adminUserOverviewQueryKey(userId) });
    },
  });
}
