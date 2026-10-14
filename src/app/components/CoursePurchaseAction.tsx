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
  const { canPurchase, isEnrolled } = useStudentEnrollments();

  if (canPurchase && isEnrolled(course.id, course.slug)) {
    return <EnrolledCourseButton courseId={course.id} />;
  }

  return <AddToCartButton course={course} />;
}
