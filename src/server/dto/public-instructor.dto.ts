import type { Course, Instructor } from "@prisma/client";

export interface PublicInstructorCourseCardDto {
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
}

export interface PublicInstructorCertificateDto {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
}

export interface PublicInstructorProjectDto {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface PublicInstructorExperienceDto {
  type: "work" | "teaching";
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface PublicInstructorReviewDto {
  studentName: string;
  rating: number;
  reviewText: string;
  relatedCourse: string;
  date: string;
}

export interface PublicInstructorProfileDto {
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
  experiences: PublicInstructorExperienceDto[];
  certificates: PublicInstructorCertificateDto[];
  projects: PublicInstructorProjectDto[];
  reviews: PublicInstructorReviewDto[];
  socials?: Record<string, string>;
  publicVisibility?: { email?: boolean; phone?: boolean };
}

export interface PublicInstructorStatsDto {
  coursesCount: number;
  studentsCount: number;
  averageRating: number;
  totalTeachingHours: number;
}

export interface PublicInstructorStatLabelDto {
  label: string;
  description: string;
  value?: string;
}

export interface PublicInstructorSectionLabelDto {
  title: string;
  description: string;
}

export interface PublicInstructorUILabelsDto {
  hero: {
    profileBadge: string;
    verifiedBadge: string;
    unverifiedBadge: string;
  };
  stats: {
    teachingHours: PublicInstructorStatLabelDto;
    courses: PublicInstructorStatLabelDto;
    students: PublicInstructorStatLabelDto;
    member: PublicInstructorStatLabelDto;
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
    about: PublicInstructorSectionLabelDto & { biographyTitle: string };
    skills: PublicInstructorSectionLabelDto & { empty: string };
    courses: PublicInstructorSectionLabelDto & { empty: string };
    certificates: PublicInstructorSectionLabelDto & { badge: string; viewLink: string };
    projects: PublicInstructorSectionLabelDto & { github: string; live: string };
  };
}

export interface PublicInstructorProfileResponseDto {
  data: {
    instructor: PublicInstructorProfileDto;
    courses: PublicInstructorCourseCardDto[];
    stats: PublicInstructorStatsDto;
    labels: PublicInstructorUILabelsDto;
  };
}

type CourseRow = Course & { instructor: Instructor };

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function parseJsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as Record<string, string>;
}

function parseVisibility(value: unknown): { email?: boolean; phone?: boolean } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as { email?: boolean; phone?: boolean };
  return { email: row.email, phone: row.phone };
}

export function toPublicInstructorProfileDto(instructor: Instructor): PublicInstructorProfileDto {
  return {
    id: instructor.id,
    slug: instructor.slug,
    fullName: instructor.name,
    displayTitle: instructor.displayTitle ?? undefined,
    mainExpertise: instructor.mainExpertise ?? undefined,
    shortBio: instructor.shortBio ?? undefined,
    fullBiography: instructor.fullBiography ?? undefined,
    teachingStyle: instructor.teachingStyle ?? undefined,
    professionalBackground: instructor.professionalBackground ?? undefined,
    verified: instructor.verified,
    avatar: instructor.avatar,
    coverImage: instructor.coverImage ?? undefined,
    yearsOfExperience: instructor.yearsOfExperience ?? undefined,
    skills: parseStringArray(instructor.skills),
    experiences: parseJsonArray<PublicInstructorExperienceDto>(instructor.experiences),
    certificates: parseJsonArray<PublicInstructorCertificateDto>(instructor.certificates),
    projects: parseJsonArray<PublicInstructorProjectDto>(instructor.projects),
    reviews: parseJsonArray<PublicInstructorReviewDto>(instructor.reviews),
    socials: parseRecord(instructor.socials),
    publicVisibility: parseVisibility(instructor.publicVisibility),
  };
}

export function toPublicInstructorCourseCardDto(
  course: CourseRow
): PublicInstructorCourseCardDto {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    image: course.cover,
    level: course.difficulty,
    duration: `${course.durationHours.toLocaleString("fa-IR")} ساعت`,
    studentsCount: course.studentsCount,
    rating: course.rating,
    price: course.price,
    instructorSlug: course.instructor.slug,
  };
}

export function buildInstructorStats(courses: CourseRow[]): PublicInstructorStatsDto {
  const coursesCount = courses.length;
  const studentsCount = courses.reduce((sum, course) => sum + course.studentsCount, 0);
  const totalTeachingHours = courses.reduce((sum, course) => sum + course.durationHours, 0);
  const averageRating =
    coursesCount > 0
      ? Number((courses.reduce((sum, course) => sum + course.rating, 0) / coursesCount).toFixed(1))
      : 0;

  return {
    coursesCount,
    studentsCount,
    averageRating,
    totalTeachingHours,
  };
}

export function buildPublicInstructorUILabels(): PublicInstructorUILabelsDto {
  return {
    hero: {
      profileBadge: "پروفایل رسمی مدرس",
      verifiedBadge: "مدرس تاییدشده اسپاتی‌کد",
      unverifiedBadge: "مدرس اسپاتی‌کد",
    },
    stats: {
      teachingHours: {
        label: "ساعت آموزش",
        description: "ساعت محتوای آموزشی",
      },
      courses: {
        label: "دوره‌ها",
        description: "دوره فعال",
      },
      students: {
        label: "دانشجوها",
        description: "نفر",
      },
      member: {
        label: "مدرس اسپاتی‌کد",
        value: "تایید شده",
        description: "عضو تیم آموزشی",
      },
    },
    social: {
      github: "گیت‌هاب",
      linkedin: "لینکدین",
      telegram: "تلگرام",
      website: "وب‌سایت شخصی",
      email: "ایمیل عمومی",
      phone: "شماره تماس",
    },
    sections: {
      about: {
        title: "درباره استاد و مهارت‌ها",
        description: "نگاهی کامل‌تر به مسیر حرفه‌ای و تخصص‌های اصلی",
        biographyTitle: "بیوگرافی کامل",
      },
      skills: {
        title: "مهارت‌ها و تخصص‌ها",
        description: "فناوری‌ها و حوزه‌هایی که این استاد به‌صورت تخصصی روی آن‌ها کار کرده است",
        empty: "مهارتی برای نمایش ثبت نشده است.",
      },
      courses: {
        title: "دوره‌های این استاد",
        description: "همه دوره‌هایی که توسط این استاد منتشر یا تدریس شده‌اند",
        empty: "هنوز دوره‌ای برای نمایش ثبت نشده است.",
      },
      certificates: {
        title: "گواهی‌ها و دستاوردها",
        description:
          "اعتبارنامه‌ها، دوره‌های تخصصی و دستاوردهایی که مسیر حرفه‌ای استاد را پشتیبانی می‌کنند",
        badge: "گواهی تخصصی",
        viewLink: "مشاهده مرجع",
      },
      projects: {
        title: "پروژه‌ها و نمونه‌کارها",
        description: "چند نمونه از پروژه‌هایی که نگاه فنی و تجربه اجرایی این استاد را نشان می‌دهد",
        github: "گیت‌هاب",
        live: "نسخه آنلاین",
      },
    },
  };
}
