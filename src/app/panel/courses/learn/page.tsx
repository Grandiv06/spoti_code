import { Suspense } from "react";
import CourseLearningClient from "./CourseLearningClient";
import CourseLearningSkeleton from "./CourseLearningSkeleton";

export default function CourseLearningPage() {
  return (
    <Suspense fallback={<CourseLearningSkeleton />}>
      <CourseLearningClient />
    </Suspense>
  );
}
