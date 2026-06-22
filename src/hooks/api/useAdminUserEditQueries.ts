"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetNoMock, apiPatchNoMock } from "@/lib/api";
import {
  buildAdminUserUpdatePayload,
  normalizeAdminUser,
  type AdminUserUpdateInput,
} from "@/lib/admin-users";

export const adminUserByIdQueryKey = (userId: string) => ["admin-user", userId] as const;

function adminUserPath(userId: string) {
  return `/api/users/${encodeURIComponent(userId)}`;
}

export function useAdminUserByIdQuery(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: adminUserByIdQueryKey(userId ?? ""),
    queryFn: async () => normalizeAdminUser(await apiGetNoMock<unknown>(adminUserPath(userId!))),
    enabled: Boolean(userId) && enabled,
    retry: 1,
    staleTime: 0,
  });
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, input }: { userId: string; input: AdminUserUpdateInput }) => {
      const response = await apiPatchNoMock<unknown>(
        adminUserPath(userId),
        buildAdminUserUpdatePayload(input)
      );
      return normalizeAdminUser(response);
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(adminUserByIdQueryKey(user.id), user);
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
