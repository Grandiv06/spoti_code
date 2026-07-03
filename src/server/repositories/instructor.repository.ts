import { prisma } from "@/server/db/prisma";

export async function findInstructorBySlug(slug: string) {
  return prisma.instructor.findUnique({
    where: { slug },
    include: {
      courses: {
        where: { status: "published" },
        include: { instructor: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function listPublicInstructorSlugs() {
  const instructors = await prisma.instructor.findMany({
    select: { slug: true },
    orderBy: { name: "asc" },
  });

  return instructors.map((item) => item.slug);
}
