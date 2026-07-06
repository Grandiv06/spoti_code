import type { User } from "@prisma/client";
import type { PanelProfileDto, UpsertPanelProfileInput } from "@/server/dto/panel-profile.dto";
import { prisma } from "@/server/db/prisma";
import {
  findUserProfileByUserId,
  upsertUserProfile,
} from "@/server/repositories/profile.repository";
import { resolveUserDisplayName } from "@/server/utils/user-display-name";

function asOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function mapUserRoleLabel(role: User["role"]): string {
  if (role === "ADMIN") return "ادمین";
  if (role === "INSTRUCTOR") return "مدرس";
  return "یادگیرنده";
}

function formatJoinDate(value: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(value);
  } catch {
    return "—";
  }
}

function mapProfile(user: User, profile: Awaited<ReturnType<typeof findUserProfileByUserId>>): PanelProfileDto {
  const displayName = resolveUserDisplayName({
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    profile,
  });

  return {
    id: profile?.id ?? `PRF-${user.id}`,
    userId: user.id,
    fullName: displayName,
    displayName,
    phone: user.phone,
    occupation: profile?.occupation?.trim() || "",
    about: profile?.about?.trim() || "",
    location: profile?.location?.trim() || "",
    githubLink: profile?.githubLink?.trim() || "",
    linkedinLink: profile?.linkedinLink?.trim() || "",
    personalWebsiteLink: profile?.personalWebsiteLink?.trim() || "",
    contacts: profile?.contacts?.trim() || "",
    skills: profile?.skills?.trim() || "",
    image: profile?.image?.trim() || "",
    bannerImage: profile?.bannerImage?.trim() || "",
    role: mapUserRoleLabel(user.role),
    joinDate: formatJoinDate(user.createdAt),
  };
}

export async function getPublicUserProfile(userId: string): Promise<PanelProfileDto | null> {
  const normalizedId = decodeURIComponent(userId).trim();
  if (!normalizedId) return null;

  const user = await prisma.user.findUnique({
    where: { id: normalizedId },
  });
  if (!user) return null;

  const profile = await findUserProfileByUserId(user.id);
  return mapProfile(user, profile);
}

export async function getMyProfile(user: User): Promise<PanelProfileDto> {
  const profile = await findUserProfileByUserId(user.id);
  return mapProfile(user, profile);
}

export async function updateMyProfile(
  user: User,
  input: UpsertPanelProfileInput
): Promise<PanelProfileDto> {
  const occupation = asOptionalString(input.occupation);
  const about = asOptionalString(input.about);
  const location = asOptionalString(input.location);
  const githubLink = asOptionalString(input.githubLink);
  const linkedinLink = asOptionalString(input.linkedinLink);
  const personalWebsiteLink = asOptionalString(input.personalWebsiteLink);
  const contacts = asOptionalString(input.contacts);
  const skills = asOptionalString(input.skills);
  const image = asOptionalString(input.image);
  const bannerImage = asOptionalString(input.bannerImage);

  const profile = await upsertUserProfile(user.id, {
    occupation,
    about,
    location,
    githubLink,
    linkedinLink,
    personalWebsiteLink,
    contacts,
    skills,
    image,
    bannerImage,
  });

  let nextUser = user;
  if (occupation) {
    nextUser = await prisma.user.update({
      where: { id: user.id },
      data: { fullName: occupation },
    });
  }

  return mapProfile(nextUser, profile);
}
