import { notFound, redirect } from "next/navigation";
import { findInstructorById } from "@/server/repositories/instructor.repository";

export const dynamic = "force-dynamic";

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
