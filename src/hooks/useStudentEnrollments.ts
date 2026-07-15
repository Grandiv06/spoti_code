"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePanelMyCourses } from "@/hooks/api/usePanelMyCourses";

export function useStudentEnrollments() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "instructor";
  const canPurchase = isAuthenticated && user?.role === "user";

  // Share the same React Query cache as /panel/courses so catalog pages and
  // the my-courses page don't each pay a full network round-trip.
  const coursesQuery = usePanelMyCourses(canPurchase);

  const enrolledKeys = useMemo(() => {
    const next = new Set<string>();
    for (const row of coursesQuery.data ?? []) {
      const courseId = String(row.id ?? "").trim();
      const slug = String(row.slug ?? "").trim();
      if (courseId) next.add(courseId);
      if (slug) next.add(slug);
    }
    return next;
  }, [coursesQuery.data]);

  const isEnrolled = useMemo(
    () => (courseId: string, slug?: string) => {
      const normalizedId = courseId.trim();
      const normalizedSlug = slug?.trim() ?? "";
      return (
        (normalizedId && enrolledKeys.has(normalizedId)) ||
        (normalizedSlug && enrolledKeys.has(normalizedSlug))
      );
    },
    [enrolledKeys]
  );

  return {
    authLoading,
    canPurchase,
    isStaff,
    isEnrolled,
    loading: coursesQuery.isPending,
  };
}
