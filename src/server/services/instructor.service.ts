import {
  buildInstructorStats,
  toPublicInstructorCourseCardDto,
  toPublicInstructorProfileDto,
  type PublicInstructorProfileResponseDto,
} from "@/server/dto/public-instructor.dto";
import {
  findInstructorBySlug,
  listPublicInstructorSlugs,
} from "@/server/repositories/instructor.repository";

export async function getPublicInstructorProfile(
  slug: string
): Promise<PublicInstructorProfileResponseDto | null> {
  const instructor = await findInstructorBySlug(slug.trim());
  if (!instructor) return null;

  const courses = instructor.courses.map(toPublicInstructorCourseCardDto);
  const stats = buildInstructorStats(instructor.courses);

  return {
    data: {
      instructor: toPublicInstructorProfileDto(instructor),
      courses,
      stats,
    },
  };
}

export async function getPublicInstructorSlugs() {
  return listPublicInstructorSlugs();
}
