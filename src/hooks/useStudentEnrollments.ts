"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

type PanelMyCourseRow = {
  courseId?: string;
  course?: {
    id?: string;
    slug?: string;
  };
};

function extractMyCourses(payload: unknown): PanelMyCourseRow[] {
  if (Array.isArray(payload)) return payload as PanelMyCourseRow[];
  if (payload && typeof payload === "object") {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as PanelMyCourseRow[];
  }
  return [];
}

export function useStudentEnrollments() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [enrolledKeys, setEnrolledKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const isStaff = user?.role === "admin" || user?.role === "instructor";
  const canPurchase = isAuthenticated && user?.role === "user";

  useEffect(() => {
    if (authLoading || !canPurchase) {
      setEnrolledKeys(new Set());
      return;
    }

    let active = true;

    const loadEnrollments = async () => {
      setLoading(true);
      try {
        const response = await apiGetNoMock<unknown>("/api/dashboard/my-courses", getAuthHeaders());
        if (!active) return;

        const rows = extractMyCourses(response);
        const next = new Set<string>();

        for (const row of rows) {
          const courseId = String(row.courseId ?? row.course?.id ?? "").trim();
          const slug = String(row.course?.slug ?? "").trim();
          if (courseId) next.add(courseId);
          if (slug) next.add(slug);
        }

        setEnrolledKeys(next);
      } catch {
        if (active) setEnrolledKeys(new Set());
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEnrollments();

    return () => {
      active = false;
    };
  }, [authLoading, canPurchase]);

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
    loading,
  };
}
