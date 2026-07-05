"use client";

import AddToCartButton from "@/app/components/AddToCartButton";
import EnrolledCourseButton from "@/app/components/EnrolledCourseButton";
import { useStudentEnrollments } from "@/hooks/useStudentEnrollments";

type CoursePurchaseActionProps = {
  course: {
    id: string;
    slug?: string;
    title: string;
    price: string;
    image: string;
    instructor: string;
  };
};

export default function CoursePurchaseAction({ course }: CoursePurchaseActionProps) {
  const { authLoading, canPurchase, isStaff, isEnrolled, loading } = useStudentEnrollments();

  if (authLoading || loading) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-14 animate-pulse rounded-2xl bg-gray-200/80 dark:bg-white/10 md:h-16 md:rounded-[2rem]" />
      </div>
    );
  }

  if (isStaff) {
    return null;
  }

  if (canPurchase && isEnrolled(course.id, course.slug)) {
    return <EnrolledCourseButton courseId={course.id} />;
  }

  return <AddToCartButton course={course} />;
}
