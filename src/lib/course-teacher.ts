import { findPublicInstructorByName, getPublicInstructorById } from "./public-instructors";

export type ResolvedCourseTeacher = {
  id?: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
};

function readFileUrl(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.url === "string" && record.url.trim()) return record.url.trim();
  }
  return undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function resolveCourseTeacher(data: Record<string, unknown>): ResolvedCourseTeacher | null {
  const teacher = data.teacher;
  if (teacher && typeof teacher === "object") {
    const record = teacher as Record<string, unknown>;
    const resolved: ResolvedCourseTeacher = {
      id: readString(record.id),
      fullName: readString(record.fullName) ?? readString(record.name),
      bio: readString(record.bio) ?? readString(record.shortBio),
      avatar:
        readFileUrl(record.avatar) ??
        readFileUrl(record.avatarFile) ??
        readFileUrl(record.resumeFile),
    };

    if (resolved.id || resolved.fullName || resolved.bio || resolved.avatar) {
      return resolved;
    }
  }

  const flatName =
    readString(data.instructorName) ??
    readString(data.teacherName) ??
    readString(data.teacher) ??
    readString(data.authorName) ??
    readString(data.ownerName);
  const flatBio =
    readString(data.instructorBio) ?? readString(data.teacherBio) ?? readString(data.authorBio);
  const flatId = readString(data.teacherId) ?? readString(data.instructorId);
  const flatAvatar = readFileUrl(data.instructorAvatar) ?? readFileUrl(data.teacherAvatar);

  if (!flatName && !flatBio && !flatAvatar && !flatId) {
    return null;
  }

  return {
    id: flatId,
    fullName: flatName,
    bio: flatBio,
    avatar: flatAvatar,
  };
}

export function resolveTeacherProfileHref(
  teacher: ResolvedCourseTeacher | null,
  publicInstructorSlug?: string
): string | undefined {
  if (publicInstructorSlug) return `/instructors/${publicInstructorSlug}`;

  const instructorById = teacher?.id ? getPublicInstructorById(teacher.id) : undefined;
  if (instructorById?.slug) return `/instructors/${instructorById.slug}`;

  const instructorByName = teacher?.fullName ? findPublicInstructorByName(teacher.fullName) : undefined;
  if (instructorByName?.slug) return `/instructors/${instructorByName.slug}`;

  if (teacher?.id) return `/teachers/${teacher.id}`;
  return undefined;
}

export function readCourseMediaUrl(data: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const url = readFileUrl(data[key]);
    if (url) return url;
  }
  return undefined;
}
