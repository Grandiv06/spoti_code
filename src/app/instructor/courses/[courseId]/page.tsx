import { Suspense } from "react";
import CourseDetailsClient from "./CourseDetailsClient";

export function generateStaticParams() {
  return [
    { courseId: "CRS-410" },
    { courseId: "CRS-398" },
    { courseId: "CRS-407" },
  ];
}

export default function CourseDetailsPage() {
  return (
    <Suspense fallback={null}>
      <CourseDetailsClient />
    </Suspense>
  );
}
