import CourseDetailPageClient from "@/app/courses/[slug]/CourseDetailPageClient";

export default async function AdminCoursePreviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <CourseDetailPageClient key={courseId} adminPreviewCourseId={courseId} />;
}
