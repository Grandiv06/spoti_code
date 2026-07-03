"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import {
  buildPublicInstructorProfilePath,
  normalizePublicInstructorProfile,
  type PublicInstructorProfileViewModel,
} from "@/lib/public-instructor";

export function publicInstructorProfileQueryKey(slugOrId: string, by: "slug" | "id" = "slug") {
  return ["public-instructor-profile", by, slugOrId] as const;
}

export function usePublicInstructorProfile(slugOrId: string, by: "slug" | "id" = "slug") {
  return useQuery<PublicInstructorProfileViewModel, Error>({
    queryKey: publicInstructorProfileQueryKey(slugOrId, by),
    queryFn: async () => {
      const payload = await apiGetNoMock<unknown>(buildPublicInstructorProfilePath(slugOrId, by));
      const normalized = normalizePublicInstructorProfile(payload);
      if (!normalized) {
        throw new Error("404: Instructor profile not found");
      }
      return normalized;
    },
    enabled: Boolean(slugOrId.trim()),
    staleTime: 60_000,
    retry: 1,
  });
}
