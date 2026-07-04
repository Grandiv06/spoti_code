import type { Course, Instructor } from "@prisma/client";

type CourseWithEnrollmentCount = Course & {
  enrollments?: Array<{ id: string }>;
};

export type InstructorProfilePageProfileDto = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  specialty: string;
  headline: string;
  bio: string;
  fullBiography: string;
  avatar: string;
  yearsOfExperience: string;
  skills: string[];
  socials: {
    linkedin: string;
    github: string;
    telegram: string;
    website: string;
  };
  email: string;
  phone: string;
  publicVisibility: {
    email: boolean;
    phone: boolean;
    socials: boolean;
  };
};

export type InstructorProfilePageCourseDto = {
  id: string;
  slug: string;
  title: string;
  cover: string;
  status: "published" | "draft" | "pending" | "inactive";
  level: "elementary" | "intermediate" | "advanced";
  shortDescription: string;
  studentsCount: number;
};

export type InstructorProfilePageStatsDto = {
  publishedCourses: number;
  totalStudents: number;
};

export type InstructorProfilePageResponseDto = {
  profile: InstructorProfilePageProfileDto | null;
  stats: InstructorProfilePageStatsDto;
  courses: InstructorProfilePageCourseDto[];
};

export type UpdateInstructorProfilePageDto = {
  name?: unknown;
  displayName?: unknown;
  headline?: unknown;
  specialty?: unknown;
  bio?: unknown;
  fullBiography?: unknown;
  avatar?: unknown;
  yearsOfExperience?: unknown;
  skills?: unknown;
  socials?: unknown;
  publicVisibility?: unknown;
};

export type InstructorProfileEditFormDto = {
  displayName: string;
  headline: string;
  bio: string;
  fullBiography: string;
  skills: string[];
  socials: {
    linkedin: string;
    github: string;
    telegram: string;
    website: string;
  };
};

export type InstructorProfileEditResponseDto = {
  form: InstructorProfileEditFormDto | null;
};

export type UpdateInstructorProfileEditDto = Partial<InstructorProfileEditFormDto>;

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) return parseStringArray(parsed);
      } catch {
        // Fall back to comma-separated parsing.
      }
    }

    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function parseSocials(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, typeof item === "string" ? item.trim() : ""])
      .filter(([, item]) => item)
  );
}

function parsePublicVisibility(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { email: false, phone: false, socials: true };
  }

  const row = value as Record<string, unknown>;
  return {
    email: row.email === true,
    phone: row.phone === true,
    socials: row.socials !== false,
  };
}

function resolveStudentsCount(course: CourseWithEnrollmentCount): number {
  if (course.studentsCount > 0) return course.studentsCount;
  return course.enrollments?.length ?? 0;
}

function mapCourseStatus(status: Course["status"]): InstructorProfilePageCourseDto["status"] {
  return status === "published" ? "published" : "draft";
}

export function toInstructorProfilePageDto(
  instructor: Instructor | null,
  courses: CourseWithEnrollmentCount[]
): InstructorProfilePageResponseDto {
  const publishedCourses = courses.filter((course) => course.status === "published");

  if (!instructor) {
    return {
      profile: null,
      stats: { publishedCourses: 0, totalStudents: 0 },
      courses: [],
    };
  }

  const socials = parseSocials(instructor.socials);
  const publicVisibility = parsePublicVisibility(instructor.publicVisibility);

  return {
    profile: {
      id: instructor.id,
      slug: instructor.slug,
      name: instructor.name,
      displayName: instructor.name,
      specialty: instructor.displayTitle ?? instructor.mainExpertise ?? "",
      headline: instructor.displayTitle ?? instructor.mainExpertise ?? "",
      bio: instructor.shortBio ?? "",
      fullBiography: instructor.fullBiography ?? "",
      avatar: instructor.avatar,
      yearsOfExperience: instructor.yearsOfExperience ? String(instructor.yearsOfExperience) : "",
      skills: parseStringArray(instructor.skills),
      socials: {
        linkedin: socials.linkedin ?? "",
        github: socials.github ?? "",
        telegram: socials.telegram ?? "",
        website: socials.website ?? "",
      },
      email: publicVisibility.email ? (socials.email ?? "") : "",
      phone: publicVisibility.phone ? (socials.phone ?? "") : "",
      publicVisibility,
    },
    stats: {
      publishedCourses: publishedCourses.length,
      totalStudents: publishedCourses.reduce((sum, course) => sum + resolveStudentsCount(course), 0),
    },
    courses: publishedCourses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      cover: course.cover,
      status: mapCourseStatus(course.status),
      level: course.level,
      shortDescription: course.shortDescription,
      studentsCount: resolveStudentsCount(course),
    })),
  };
}

export function toInstructorProfileEditDto(instructor: Instructor | null): InstructorProfileEditResponseDto {
  if (!instructor) {
    return { form: null };
  }

  const socials = parseSocials(instructor.socials);

  return {
    form: {
      displayName: instructor.name,
      headline: instructor.displayTitle ?? instructor.mainExpertise ?? "",
      bio: instructor.shortBio ?? "",
      fullBiography: instructor.fullBiography ?? "",
      skills: parseStringArray(instructor.skills),
      socials: {
        linkedin: socials.linkedin ?? "",
        github: socials.github ?? "",
        telegram: socials.telegram ?? "",
        website: socials.website ?? "",
      },
    },
  };
}

export function readInstructorProfileSocials(value: unknown): Record<string, string> {
  return parseSocials(value);
}

export function readInstructorProfileSkills(value: unknown): string[] {
  return parseStringArray(value);
}

export function readInstructorProfileVisibility(value: unknown) {
  return parsePublicVisibility(value);
}
