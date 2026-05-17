import { initialCoursesData } from "../_components/types";
import CourseDetailView from "./CourseDetailView";

export function generateStaticParams() {
  return initialCoursesData.map((c) => ({
    courseId: c.id,
  }));
}

interface PageProps {
  params: Promise<{ courseId: string }> | { courseId: string };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CourseDetailView courseId={resolvedParams.courseId} />;
}
