import { prisma } from "@/server/db/prisma";

const publicInstructorInclude = {
  courses: {
    where: { status: "published" as const },
    include: { instructor: true },
    orderBy: { createdAt: "desc" as const },
  },
};

export async function findInstructorBySlug(slug: string) {
  return prisma.instructor.findUnique({
    where: { slug },
    include: publicInstructorInclude,
  });
}

export async function findInstructorById(id: string) {
  return prisma.instructor.findUnique({
    where: { id },
    include: publicInstructorInclude,
  });
}

export async function listPublicInstructorSlugs() {
  const instructors = await prisma.instructor.findMany({
    select: { slug: true },
    orderBy: { name: "asc" },
  });

  return instructors.map((item) => item.slug);
}

export async function listPublicInstructorIds() {
  const instructors = await prisma.instructor.findMany({
    select: { id: true },
    orderBy: { name: "asc" },
  });

  return instructors.map((item) => item.id);
}
