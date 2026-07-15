import { prisma } from "@/server/db/prisma";

export async function findUserProfileByUserId(userId: string) {
  return prisma.userProfile.findUnique({ where: { userId } });
}

export async function findUserProfileByUsername(username: string) {
  return prisma.userProfile.findUnique({ where: { username } });
}

export async function upsertUserProfile(
  userId: string,
  data: {
    username?: string | null;
    occupation?: string | null;
    about?: string | null;
    location?: string | null;
    githubLink?: string | null;
    linkedinLink?: string | null;
    mbtiType?: string | null;
    personalWebsiteLink?: string | null;
    contacts?: string | null;
    skills?: string | null;
    image?: string | null;
    bannerImage?: string | null;
  }
) {
  return prisma.userProfile.upsert({
    where: { userId },
    update: data,
    create: {
      id: `PRF-${userId}`,
      userId,
      ...data,
    },
  });
}
