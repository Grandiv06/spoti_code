"use client";

import dynamic from "next/dynamic";
import { CreateCourseWizardPageSkeleton } from "@/app/instructor/courses/create/_components/CreateCourseWizardSkeleton";

const CreateCourseWizardClient = dynamic(() => import("./CreateCourseWizardClient"), {
  ssr: false,
  loading: () => <CreateCourseWizardPageSkeleton />,
});

export default function CreateCoursePage() {
  return <CreateCourseWizardClient />;
}
