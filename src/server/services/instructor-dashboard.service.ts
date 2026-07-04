import type { Course, Instructor, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import {
  readInstructorProfileSkills,
  readInstructorProfileSocials,
  readInstructorProfileVisibility,
  toInstructorProfileEditDto,
  toInstructorProfilePageDto,
  type UpdateInstructorProfileEditDto,
  type UpdateInstructorProfilePageDto,
} from "@/server/dto/instructor-profile-page.dto";
import { prisma } from "@/server/db/prisma";

const INSTRUCTOR_REVENUE_SHARE = 0.7;

type InstructorCourse = Course & {
  enrollments: Array<{ id: string }>;
  comments: Array<{
    id: string;
    parentId: string | null;
    isInstructorReply: boolean;
    replies: Array<{ id: string; isInstructorReply: boolean }>;
  }>;
};

export type UpdateInstructorProfileInput = UpdateInstructorProfilePageDto & {
  profile?: Record<string, unknown>;
  teacher?: Record<string, unknown>;
};

export function assertInstructor(user: User) {
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    throw new AuthError("دسترسی مدرس لازم است", 403);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return undefined;
}

function slugifyInstructor(value: string) {
  const ascii = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return ascii || `instructor-${Date.now()}`;
}

async function ensureUniqueSlug(base: string) {
  let slug = base;
  let suffix = 2;

  while (await prisma.instructor.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function resolveInstructorForUser(user: User): Promise<Instructor | null> {
  // Seeded instructor auth user is not explicitly related to Instructor yet.
  if (user.id === "USR-INST-001" || user.phone === "+989000000002") {
    const seeded = await prisma.instructor.findUnique({ where: { id: "INS-101" } });
    if (seeded) return seeded;
  }

  const fullName = user.fullName?.trim();
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    select: { occupation: true },
  });
  const candidateNames = [fullName, profile?.occupation?.trim()].filter(
    (name): name is string => Boolean(name)
  );

  if (candidateNames.length > 0) {
    const exact = await prisma.instructor.findFirst({
      where: { name: { in: candidateNames } },
    });
    if (exact) return exact;
  }

  const idMatch = await prisma.instructor.findUnique({
    where: { id: user.id },
  });
  if (idMatch) return idMatch;

  if (user.role === "INSTRUCTOR") {
    const fullName = user.fullName?.trim() || "مدرس اسپاتی‌کد";
    const slug = await ensureUniqueSlug(slugifyInstructor(user.id));

    return prisma.instructor.create({
      data: {
        id: user.id,
        slug,
        name: fullName,
        avatar: "/images/inst1.jpg",
        displayTitle: "مدرس اسپاتی‌کد",
        shortBio: "",
        fullBiography: "",
        mainExpertise: "",
        skills: [],
        socials: {},
        publicVisibility: { email: false, phone: false, socials: true },
      },
    });
  }

  return null;
}

function resolveStudentsCount(course: Pick<Course, "studentsCount"> & { enrollments?: Array<{ id: string }> }): number {
  if (course.studentsCount > 0) {
    return course.studentsCount;
  }

  return course.enrollments?.length ?? 0;
}

function toNumber(value: bigint | number | null | undefined): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return 0;
}

function toInstructorIncome(value: bigint | number | null | undefined): number {
  return Math.round(toNumber(value) * INSTRUCTOR_REVENUE_SHARE);
}

function mapCourseStatus(status: Course["status"]) {
  return status === "published" ? "published" : "draft";
}

function courseToDashboardRow(course: InstructorCourse) {
  return {
    id: course.id,
    courseId: course.id,
    slug: course.slug,
    title: course.title,
    name: course.title,
    cover: course.cover,
    thumbnail: course.thumbnail,
    status: mapCourseStatus(course.status),
    isPublished: course.status === "published",
    category: course.categoryTitle,
    categoryTitle: course.categoryTitle,
    studentsCount: resolveStudentsCount(course),
    students: resolveStudentsCount(course),
    revenue: toInstructorIncome(course.revenue),
    totalRevenue: toNumber(course.revenue),
    rating: course.rating,
    price: course.price,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };
}

async function findInstructorCourses(instructorId: string): Promise<InstructorCourse[]> {
  return prisma.course.findMany({
    where: { instructorId },
    include: {
      enrollments: {
        select: { id: true },
      },
      comments: {
        where: {
          parentId: null,
          isInstructorReply: false,
        },
        select: {
          id: true,
          parentId: true,
          isInstructorReply: true,
          replies: {
            select: {
              id: true,
              isInstructorReply: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

function calculateAverageRating(courses: Array<Pick<Course, "rating">>): number {
  const courseRatings = courses
    .map((course) => course.rating)
    .filter((rating) => rating > 0);

  if (courseRatings.length === 0) return 0;

  return Number(
    (courseRatings.reduce((sum, rating) => sum + rating, 0) / courseRatings.length).toFixed(1)
  );
}

function mergeProfileInput(input: UpdateInstructorProfileInput) {
  return {
    ...(isRecord(input.profile) ? input.profile : {}),
    ...(isRecord(input.teacher) ? input.teacher : {}),
    ...input,
  } as Record<string, unknown>;
}

function parseYearsOfExperience(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export async function getInstructorProfile(user: User) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    return toInstructorProfilePageDto(null, []);
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: {
      enrollments: {
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return toInstructorProfilePageDto(instructor, courses);
}

export async function getInstructorProfileEditForm(user: User) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  return toInstructorProfileEditDto(instructor);
}

export async function updateInstructorProfile(user: User, input: UpdateInstructorProfileInput) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    throw new AuthError("پروفایل مدرس یافت نشد", 404);
  }

  const merged = mergeProfileInput(input);
  const socials = readInstructorProfileSocials(merged.socials);
  const currentSocials = readInstructorProfileSocials(instructor.socials);
  const name = pickString(merged.displayName, merged.name, merged.fullName) ?? instructor.name;
  const displayTitle = pickString(merged.headline, merged.specialty, merged.displayTitle, merged.mainExpertise);
  const yearsOfExperience = parseYearsOfExperience(merged.yearsOfExperience);

  await prisma.instructor.update({
    where: { id: instructor.id },
    data: {
      name,
      displayTitle: displayTitle ?? null,
      mainExpertise: displayTitle ?? null,
      shortBio: pickString(merged.bio, merged.shortBio) ?? null,
      fullBiography: pickString(merged.fullBiography) ?? null,
      teachingStyle: pickString(merged.teachingStyle) ?? null,
      professionalBackground: pickString(merged.professionalBackground) ?? null,
      avatar: pickString(merged.avatar) ?? instructor.avatar,
      coverImage: pickString(merged.coverImage) ?? null,
      yearsOfExperience: yearsOfExperience ?? null,
      skills: readInstructorProfileSkills(merged.skills),
      socials: {
        ...currentSocials,
        ...socials,
      },
      publicVisibility: readInstructorProfileVisibility(merged.publicVisibility),
    },
  });

  if (user.role === "INSTRUCTOR") {
    await prisma.user.update({
      where: { id: user.id },
      data: { fullName: name },
    });
  }

  return getInstructorProfile({ ...user, fullName: name });
}

export async function updateInstructorProfileEditForm(user: User, input: UpdateInstructorProfileEditDto) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    throw new AuthError("پروفایل مدرس یافت نشد", 404);
  }

  const socials = readInstructorProfileSocials(input.socials);
  const currentSocials = readInstructorProfileSocials(instructor.socials);
  const name = pickString(input.displayName) ?? instructor.name;
  const headline = pickString(input.headline);

  const updatedInstructor = await prisma.instructor.update({
    where: { id: instructor.id },
    data: {
      name,
      displayTitle: headline ?? null,
      mainExpertise: headline ?? null,
      shortBio: pickString(input.bio) ?? null,
      fullBiography: pickString(input.fullBiography) ?? null,
      skills: readInstructorProfileSkills(input.skills),
      socials: {
        ...currentSocials,
        ...socials,
      },
    },
  });

  if (user.role === "INSTRUCTOR") {
    await prisma.user.update({
      where: { id: user.id },
      data: { fullName: name },
    });
  }

  return toInstructorProfileEditDto(updatedInstructor);
}

export async function getInstructorDashboardOverview(user: User) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    return {
      instructor: null,
      coursesCount: 0,
      totalCourses: 0,
      studentsCount: 0,
      totalStudents: 0,
      totalIncome: 0,
      totalRevenue: 0,
      avgCourseStars: 0,
      avgRating: 0,
      unreadCommentsCount: 0,
      unreadQasCount: 0,
      newQuestions: 0,
    };
  }

  const courses = await findInstructorCourses(instructor.id);
  const publishedCourses = courses.filter((course) => course.status === "published");
  const studentsCount = publishedCourses.reduce(
    (sum, course) => sum + resolveStudentsCount(course),
    0
  );
  const totalIncome = publishedCourses.reduce(
    (sum, course) => sum + toInstructorIncome(course.revenue),
    0
  );
  const totalRevenue = publishedCourses.reduce((sum, course) => sum + toNumber(course.revenue), 0);
  const avgCourseStars = calculateAverageRating(publishedCourses);
  const unreadCommentsCount = courses.reduce(
    (sum, course) =>
      sum +
      course.comments.filter(
        (comment) => !comment.replies.some((reply) => reply.isInstructorReply)
      ).length,
    0
  );

  return {
    instructor: {
      id: instructor.id,
      name: instructor.name,
      fullName: instructor.name,
      avatar: instructor.avatar,
      slug: instructor.slug,
    },
    coursesCount: courses.length,
    totalCourses: courses.length,
    studentsCount,
    totalStudents: studentsCount,
    totalIncome,
    totalRevenue,
    avgCourseStars,
    avgRating: avgCourseStars,
    unreadCommentsCount,
    unreadQasCount: 0,
    newQuestions: 0,
  };
}

export async function getInstructorDashboardCourses(user: User, limit?: number) {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    return {
      items: [],
      courses: [],
      total: 0,
    };
  }

  const courses = await findInstructorCourses(instructor.id);
  const rows = courses.map(courseToDashboardRow);
  const limitedRows = limit && limit > 0 ? rows.slice(0, limit) : rows;

  return {
    items: limitedRows,
    courses: limitedRows,
    total: rows.length,
    instructor: {
      id: instructor.id,
      name: instructor.name,
      fullName: instructor.name,
    },
  };
}
