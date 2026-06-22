"use client";

import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/app/admin/courses/_components/types";
import { apiGetNoMock } from "@/lib/api";
import { normalizeAdminCoursesResponse } from "@/lib/admin-courses";

export const adminCoursesQueryKey = ["admin-courses"] as const;

export function useAdminCoursesQuery() {
  return useQuery({
    queryKey: adminCoursesQueryKey,
    queryFn: async (): Promise<Course[]> =>
      normalizeAdminCoursesResponse(await apiGetNoMock<unknown>("/api/admin-dashboard/courses")),
    staleTime: 30_000,
    retry: 1,
  });
}
