export type PublicInstructorCourseCard = {
  id: string;
  slug: string;
  title: string;
  image: string;
  level: string;
  duration: string;
  studentsCount: number;
  rating: number;
  price: number;
  discountPrice?: number;
  instructorSlug: string;
};

export type PublicInstructorCertificate = {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
};

export type PublicInstructorProject = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
};

export type PublicInstructorExperience = {
  type: "work" | "teaching";
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type PublicInstructorReview = {
  studentName: string;
  rating: number;
  reviewText: string;
  relatedCourse: string;
  date: string;
};

export type PublicInstructorProfile = {
  id: string;
  slug: string;
  fullName: string;
  displayTitle?: string;
  mainExpertise?: string;
  shortBio?: string;
  fullBiography?: string;
  teachingStyle?: string;
  professionalBackground?: string;
  verified: boolean;
  avatar: string;
  coverImage?: string;
  yearsOfExperience?: number;
  skills: string[];
  experiences: PublicInstructorExperience[];
  certificates: PublicInstructorCertificate[];
  projects: PublicInstructorProject[];
  reviews: PublicInstructorReview[];
  socials?: Record<string, string>;
  publicVisibility?: { email?: boolean; phone?: boolean };
};

export type PublicInstructorStats = {
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  totalTeachingHours: number;
};

export type PublicInstructorStatLabel = {
  label: string;
  description: string;
  value?: string;
};

export type PublicInstructorSectionLabel = {
  title: string;
  description: string;
};

export type PublicInstructorUILabels = {
  hero: {
    profileBadge: string;
    verifiedBadge: string;
    unverifiedBadge: string;
  };
  stats: {
    teachingHours: PublicInstructorStatLabel;
    courses: PublicInstructorStatLabel;
    students: PublicInstructorStatLabel;
    member: PublicInstructorStatLabel;
  };
  social: {
    github: string;
    linkedin: string;
    telegram: string;
    website: string;
    email: string;
    phone: string;
  };
  sections: {
    about: PublicInstructorSectionLabel & { biographyTitle: string };
    skills: PublicInstructorSectionLabel & { empty: string };
    courses: PublicInstructorSectionLabel & { empty: string };
    certificates: PublicInstructorSectionLabel & { badge: string; viewLink: string };
    projects: PublicInstructorSectionLabel & { github: string; live: string };
  };
};

export type PublicInstructorProfileViewModel = {
  instructor: PublicInstructorProfile;
  courses: PublicInstructorCourseCard[];
  stats: PublicInstructorStats;
  labels: PublicInstructorUILabels;
};

type UnknownRecord = Record<string, unknown>;

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function readRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as Record<string, string>;
}

function readVisibility(value: unknown): { email?: boolean; phone?: boolean } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as { email?: boolean; phone?: boolean };
  return { email: row.email, phone: row.phone };
}

function readJsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function readCourseCard(value: unknown): PublicInstructorCourseCard | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const id = readString(row.id);
  const slug = readString(row.slug);
  const title = readString(row.title);
  const image = readString(row.image);
  const level = readString(row.level);
  const duration = readString(row.duration);
  const studentsCount = readNumber(row.studentsCount);
  const rating = readNumber(row.rating);
  const price = readNumber(row.price);
  const instructorSlug = readString(row.instructorSlug);

  if (!id || !slug || !title || !image || !level || !duration || studentsCount === undefined || rating === undefined || price === undefined || !instructorSlug) {
    return null;
  }

  const discountPrice = readNumber(row.discountPrice);

  return {
    id,
    slug,
    title,
    image,
    level,
    duration,
    studentsCount,
    rating,
    price,
    discountPrice,
    instructorSlug,
  };
}

function readInstructor(value: unknown): PublicInstructorProfile | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const id = readString(row.id);
  const slug = readString(row.slug);
  const fullName = readString(row.fullName);
  const avatar = readString(row.avatar);

  if (!id || !slug || !fullName || !avatar) return null;

  return {
    id,
    slug,
    fullName,
    displayTitle: readString(row.displayTitle),
    mainExpertise: readString(row.mainExpertise),
    shortBio: readString(row.shortBio),
    fullBiography: readString(row.fullBiography),
    teachingStyle: readString(row.teachingStyle),
    professionalBackground: readString(row.professionalBackground),
    verified: readBoolean(row.verified, true),
    avatar,
    coverImage: readString(row.coverImage),
    yearsOfExperience: readNumber(row.yearsOfExperience),
    skills: readStringArray(row.skills),
    experiences: readJsonArray<PublicInstructorExperience>(row.experiences),
    certificates: readJsonArray<PublicInstructorCertificate>(row.certificates),
    projects: readJsonArray<PublicInstructorProject>(row.projects),
    reviews: readJsonArray<PublicInstructorReview>(row.reviews),
    socials: readRecord(row.socials),
    publicVisibility: readVisibility(row.publicVisibility),
  };
}

function readStats(value: unknown): PublicInstructorStats | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const coursesCount = readNumber(row.coursesCount);
  const studentsCount = readNumber(row.studentsCount);
  const averageRating = readNumber(row.averageRating);
  const totalTeachingHours = readNumber(row.totalTeachingHours);

  if (
    coursesCount === undefined ||
    studentsCount === undefined ||
    averageRating === undefined ||
    totalTeachingHours === undefined
  ) {
    return null;
  }

  return { coursesCount, studentsCount, averageRating, totalTeachingHours };
}

function readStatLabel(value: unknown): PublicInstructorStatLabel | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const label = readString(row.label);
  const description = readString(row.description);
  if (!label || !description) return null;
  return { label, description, value: readString(row.value) };
}

function readSectionLabel(value: unknown): PublicInstructorSectionLabel | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const title = readString(row.title);
  const description = readString(row.description);
  if (!title || !description) return null;
  return { title, description };
}

function readUILabels(value: unknown): PublicInstructorUILabels | null {
  if (!value || typeof value !== "object") return null;
  const row = value as UnknownRecord;
  const heroRow = row.hero as UnknownRecord | undefined;
  const statsRow = row.stats as UnknownRecord | undefined;
  const socialRow = row.social as UnknownRecord | undefined;
  const sectionsRow = row.sections as UnknownRecord | undefined;

  if (!heroRow || !statsRow || !socialRow || !sectionsRow) return null;

  const profileBadge = readString(heroRow.profileBadge);
  const verifiedBadge = readString(heroRow.verifiedBadge);
  const unverifiedBadge = readString(heroRow.unverifiedBadge);

  const teachingHours = readStatLabel(statsRow.teachingHours);
  const courses = readStatLabel(statsRow.courses);
  const students = readStatLabel(statsRow.students);
  const member = readStatLabel(statsRow.member);

  const github = readString(socialRow.github);
  const linkedin = readString(socialRow.linkedin);
  const telegram = readString(socialRow.telegram);
  const website = readString(socialRow.website);
  const email = readString(socialRow.email);
  const phone = readString(socialRow.phone);

  const aboutSection = readSectionLabel(sectionsRow.about);
  const skillsSection = readSectionLabel(sectionsRow.skills);
  const coursesSection = readSectionLabel(sectionsRow.courses);
  const certificatesSection = readSectionLabel(sectionsRow.certificates);
  const projectsSection = readSectionLabel(sectionsRow.projects);

  const biographyTitle = readString((sectionsRow.about as UnknownRecord | undefined)?.biographyTitle);
  const skillsEmpty = readString((sectionsRow.skills as UnknownRecord | undefined)?.empty);
  const coursesEmpty = readString((sectionsRow.courses as UnknownRecord | undefined)?.empty);
  const certificateBadge = readString((sectionsRow.certificates as UnknownRecord | undefined)?.badge);
  const certificateViewLink = readString((sectionsRow.certificates as UnknownRecord | undefined)?.viewLink);
  const projectGithub = readString((sectionsRow.projects as UnknownRecord | undefined)?.github);
  const projectLive = readString((sectionsRow.projects as UnknownRecord | undefined)?.live);

  if (
    !profileBadge ||
    !verifiedBadge ||
    !unverifiedBadge ||
    !teachingHours ||
    !courses ||
    !students ||
    !member ||
    !github ||
    !linkedin ||
    !telegram ||
    !website ||
    !email ||
    !phone ||
    !aboutSection ||
    !skillsSection ||
    !coursesSection ||
    !certificatesSection ||
    !projectsSection ||
    !biographyTitle ||
    !skillsEmpty ||
    !coursesEmpty ||
    !certificateBadge ||
    !certificateViewLink ||
    !projectGithub ||
    !projectLive
  ) {
    return null;
  }

  return {
    hero: { profileBadge, verifiedBadge, unverifiedBadge },
    stats: { teachingHours, courses, students, member },
    social: { github, linkedin, telegram, website, email, phone },
    sections: {
      about: { ...aboutSection, biographyTitle },
      skills: { ...skillsSection, empty: skillsEmpty },
      courses: { ...coursesSection, empty: coursesEmpty },
      certificates: { ...certificatesSection, badge: certificateBadge, viewLink: certificateViewLink },
      projects: { ...projectsSection, github: projectGithub, live: projectLive },
    },
  };
}

export function normalizePublicInstructorProfile(payload: unknown): PublicInstructorProfileViewModel | null {
  const root =
    payload && typeof payload === "object"
      ? ((payload as { data?: unknown }).data ?? payload)
      : null;

  if (!root || typeof root !== "object") return null;

  const row = root as UnknownRecord;
  const instructor = readInstructor(row.instructor);
  const stats = readStats(row.stats);
  const labels = readUILabels(row.labels);
  const courses = Array.isArray(row.courses)
    ? row.courses.map(readCourseCard).filter((item): item is PublicInstructorCourseCard => item !== null)
    : [];

  if (!instructor || !stats || !labels) return null;

  return { instructor, courses, stats, labels };
}

export function buildPublicInstructorProfilePath(slugOrId: string, by: "slug" | "id" = "slug") {
  const encoded = encodeURIComponent(slugOrId);
  return by === "id"
    ? `/api/instructors/public/id/${encoded}`
    : `/api/instructors/public/${encoded}`;
}
