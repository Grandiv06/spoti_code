import { notFound, redirect } from "next/navigation";
import { findInstructorById } from "@/server/repositories/instructor.repository";
import { getPublicInstructorIds } from "@/server/services/instructor.service";

export async function generateStaticParams() {
  const ids = await getPublicInstructorIds();
  return ids.map((id) => ({ id }));
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instructor = await findInstructorById(decodeURIComponent(id));

  if (!instructor) notFound();

  redirect(`/instructors/${instructor.slug}`);
}
