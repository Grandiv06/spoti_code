"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchMyCourses, type PanelCourseItem } from "@/lib/panel-my-courses";
import { useAuth } from "@/context/AuthContext";

export const panelMyCoursesQueryKey = ["panel-my-courses"] as const;

export function usePanelMyCourses(enabled = true) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const canFetch =
    enabled && !authLoading && isAuthenticated && user?.role === "user";

  return useQuery<PanelCourseItem[], Error>({
    queryKey: panelMyCoursesQueryKey,
    queryFn: fetchMyCourses,
    enabled: canFetch,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}

/** Prefetch while the user is still on another panel page (e.g. hover/menu). */
export function usePrefetchPanelMyCourses() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  return useCallback(() => {
    if (authLoading || !isAuthenticated || user?.role !== "user") return;
    void queryClient.prefetchQuery({
      queryKey: panelMyCoursesQueryKey,
      queryFn: fetchMyCourses,
      staleTime: 60_000,
    });
  }, [authLoading, isAuthenticated, queryClient, user?.role]);
}
