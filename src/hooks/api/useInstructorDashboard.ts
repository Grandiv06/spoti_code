"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { fetchMyProfile } from "@/lib/panel-profile";
import type { ProfileSettings } from "@/context/ProfileSettingsContext";
import {
  extractApiList,
  normalizeCourseRow,
  normalizeOverview,
  unwrapApiPayload,
  type DashboardCourseRow,
  type DashboardOverview,
} from "@/app/instructor/dashboard/_lib/instructor-dashboard-data";
import {
  extractInstructorCourses,
  normalizeInstructorCoursesProfile,
  type InstructorCourseRow,
  type InstructorCoursesProfile,
} from "@/app/instructor/courses/_lib/instructor-courses-data";

export const myProfileQueryKey = ["profiles", "me"] as const;

// Shared account profile (`/api/profiles/me`). Using one React Query key means
// every consumer (shells, sidebars) dedupes to a single request even under
// React StrictMode's double-invoked effects, instead of firing it repeatedly.
export function useMyProfile(enabled = true) {
  return useQuery<ProfileSettings, Error>({
    queryKey: myProfileQueryKey,
    queryFn: fetchMyProfile,
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export const instructorOverviewQueryKey = ["instructor-dashboard", "overview"] as const;
export const instructorCoursesQueryKey = ["instructor-dashboard", "my-courses"] as const;
export const instructorCoursesListQueryKey = ["instructor-dashboard", "courses-list"] as const;
export const instructorProfileSummaryQueryKey = ["instructor-dashboard", "profile-summary"] as const;

export function useInstructorOverview() {
  return useQuery<DashboardOverview, Error>({
    queryKey: instructorOverviewQueryKey,
    queryFn: async () => {
      const res = await apiGetNoMock<unknown>("/api/instructor-dashboard/overview", getAuthHeaders());
      const raw = unwrapApiPayload(res);
      return normalizeOverview(
        raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null
      );
    },
    staleTime: 30_000,
    retry: 1,
  });
}

export function useInstructorCourses() {
  return useQuery<DashboardCourseRow[], Error>({
    queryKey: instructorCoursesQueryKey,
    queryFn: async () => {
      const res = await apiGetNoMock<unknown>(
        "/api/instructor-dashboard/my-courses?limit=100",
        getAuthHeaders()
      );
      return extractApiList(res).map(normalizeCourseRow);
    },
    staleTime: 30_000,
    retry: 1,
  });
}

export function useInstructorCoursesList() {
  return useQuery<InstructorCourseRow[], Error>({
    queryKey: instructorCoursesListQueryKey,
    queryFn: async () => {
      const res = await apiGetNoMock<unknown>("/api/instructor-dashboard/my-courses", getAuthHeaders());
      return extractInstructorCourses(res);
    },
    staleTime: 30_000,
    retry: 1,
  });
}

export function useInstructorProfileSummary() {
  return useQuery<InstructorCoursesProfile, Error>({
    queryKey: instructorProfileSummaryQueryKey,
    queryFn: async () => {
      const res = await apiGetNoMock<unknown>("/api/instructor-dashboard/profile", getAuthHeaders());
      const payload =
        typeof res === "object" && res !== null && "data" in res
          ? (res as { data?: unknown }).data
          : res;
      return normalizeInstructorCoursesProfile(payload);
    },
    staleTime: 30_000,
    retry: 1,
  });
}
