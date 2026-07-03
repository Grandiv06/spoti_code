import {
  buildInstructorStats,
  buildPublicInstructorUILabels,
  toPublicInstructorCourseCardDto,
  toPublicInstructorProfileDto,
  type PublicInstructorProfileResponseDto,
} from "@/server/dto/public-instructor.dto";
import {
  findInstructorById,
  findInstructorBySlug,
  listPublicInstructorIds,
  listPublicInstructorSlugs,
} from "@/server/repositories/instructor.repository";
import type { Course, Instructor } from "@prisma/client";

type InstructorWithCourses = Instructor & {
  courses: Array<Course & { instructor: Instructor }>;
};

function buildPublicInstructorProfile(
  instructor: InstructorWithCourses
): PublicInstructorProfileResponseDto {
  const courses = instructor.courses.map(toPublicInstructorCourseCardDto);
  const stats = buildInstructorStats(instructor.courses);

  return {
    data: {
      instructor: toPublicInstructorProfileDto(instructor),
      courses,
      stats,
      labels: buildPublicInstructorUILabels(),
    },
  };
}

export async function getPublicInstructorProfile(
  slug: string
): Promise<PublicInstructorProfileResponseDto | null> {
  const instructor = await findInstructorBySlug(slug.trim());
  if (!instructor) return null;

  return buildPublicInstructorProfile(instructor);
}

export async function getPublicInstructorProfileById(
  id: string
): Promise<PublicInstructorProfileResponseDto | null> {
  const instructor = await findInstructorById(id.trim());
  if (!instructor) return null;

  return buildPublicInstructorProfile(instructor);
}

export async function getPublicInstructorSlugs() {
  return listPublicInstructorSlugs();
}

export async function getPublicInstructorIds() {
  return listPublicInstructorIds();
}
