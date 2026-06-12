import CourseDetailPageClient from "./CourseDetailPageClient";

const STATIC_COURSE_SLUGS = [
  "amiriar-developing",
  "html",
  "css",
  "javascript",
  "react",
  "nextjs",
  "typescript",
];

export function generateStaticParams() {
  return STATIC_COURSE_SLUGS.map((slug) => ({ slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CourseDetailPageClient key={slug} slug={slug} />;
}
