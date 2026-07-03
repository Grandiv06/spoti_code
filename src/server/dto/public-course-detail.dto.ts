import type { Course, Instructor, Prisma } from "@prisma/client";
import {
  toPublicCourseListItemDto,
  type PublicCourseListItemDto,
} from "@/server/dto/public-course.dto";

export interface PublicCourseLessonDto {
  id: string;
  title: string;
  duration: string;
  isLocked?: boolean;
  isFree?: boolean;
  isFreePreview?: boolean;
  isUnlocked?: boolean;
  videoUrl?: string;
}

export interface PublicCourseChapterDto {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: PublicCourseLessonDto[];
}

export interface PublicCourseFaqDto {
  question: string;
  answer: string;
}

export interface PublicCourseInstructorDetailDto {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  avatar: string;
  displayTitle?: string;
  shortBio?: string;
  fullBiography?: string;
  bio?: string;
}

export interface PublicCourseDetailDto extends Omit<PublicCourseListItemDto, "level" | "duration" | "hours"> {
  level: string;
  duration: string;
  hours: string;
  about: string;
  aboutDescription: string;
  time: string;
  specialWord?: string;
  specialWords?: string;
  introVideo?: string;
  introVideoDuration?: string;
  chapters: PublicCourseChapterDto[];
  faqs: PublicCourseFaqDto[];
  faq: PublicCourseFaqDto[];
  instructor: PublicCourseInstructorDetailDto;
  teacher: PublicCourseInstructorDetailDto;
}

export interface PublicCourseDetailResponseDto {
  data: PublicCourseDetailDto;
}

type CourseWithInstructor = Course & { instructor: Instructor };

type RawChapter = {
  id?: string;
  title?: string;
  subtitle?: string;
  lessons?: RawLesson[];
};

type RawLesson = {
  id?: string;
  title?: string;
  duration?: string;
  isLocked?: boolean;
  isFree?: boolean;
  isFreePreview?: boolean;
  isUnlocked?: boolean;
  videoUrl?: string;
};

function formatDurationLabel(hours: number) {
  return `${hours.toLocaleString("fa-IR")} ساعت`;
}

function normalizeChapters(raw: Prisma.JsonValue | null | undefined): PublicCourseChapterDto[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((chapter, chapterIndex) => {
    const row = (chapter ?? {}) as RawChapter;
    const lessons = Array.isArray(row.lessons) ? row.lessons : [];

    return {
      id: String(row.id ?? `chapter-${chapterIndex + 1}`),
      number: String(chapterIndex + 1).padStart(2, "0"),
      title: typeof row.title === "string" ? row.title : "",
      subtitle: typeof row.subtitle === "string" ? row.subtitle : "",
      lessons: lessons.map((lesson, lessonIndex) => {
        const lessonRow = (lesson ?? {}) as RawLesson;
        const isFreePreview = lessonRow.isFreePreview === true || lessonRow.isFree === true;
        const isLocked = lessonRow.isLocked ?? !isFreePreview;

        return {
          id: String(lessonRow.id ?? `lesson-${chapterIndex + 1}-${lessonIndex + 1}`),
          title: typeof lessonRow.title === "string" ? lessonRow.title : "",
          duration: typeof lessonRow.duration === "string" ? lessonRow.duration : "",
          isLocked,
          isFree: lessonRow.isFree,
          isFreePreview,
          isUnlocked: lessonRow.isUnlocked ?? isFreePreview,
          videoUrl: typeof lessonRow.videoUrl === "string" ? lessonRow.videoUrl : undefined,
        };
      }),
    };
  });
}

function normalizeFaqs(raw: Prisma.JsonValue | null | undefined): PublicCourseFaqDto[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const row = (item ?? {}) as { question?: string; answer?: string };
      if (typeof row.question !== "string" || typeof row.answer !== "string") return null;
      return { question: row.question, answer: row.answer };
    })
    .filter((item): item is PublicCourseFaqDto => item !== null);
}

function toInstructorDetailDto(instructor: Instructor): PublicCourseInstructorDetailDto {
  return {
    id: instructor.id,
    slug: instructor.slug,
    name: instructor.name,
    fullName: instructor.name,
    avatar: instructor.avatar,
    displayTitle: instructor.displayTitle ?? undefined,
    shortBio: instructor.shortBio ?? undefined,
    fullBiography: instructor.fullBiography ?? undefined,
    bio: instructor.shortBio ?? instructor.fullBiography ?? undefined,
  };
}

export function toPublicCourseDetailDto(course: CourseWithInstructor): PublicCourseDetailDto {
  const base = toPublicCourseListItemDto(course);
  const instructor = toInstructorDetailDto(course.instructor);
  const durationLabel = formatDurationLabel(course.durationHours);
  const aboutDescription = course.aboutDescription ?? course.description;
  const chapters = normalizeChapters(course.chapters);
  const faqs = normalizeFaqs(course.faqs);

  return {
    ...base,
    about: aboutDescription,
    aboutDescription,
    time: durationLabel,
    duration: durationLabel,
    hours: durationLabel,
    difficulty: course.difficulty,
    level: course.difficulty,
    specialWord: course.specialWord ?? undefined,
    specialWords: course.specialWord ?? undefined,
    introVideo: course.introVideo ?? undefined,
    introVideoDuration: course.introVideoDuration ?? undefined,
    chapters,
    faqs,
    faq: faqs,
    instructor,
    teacher: instructor,
    instructorName: instructor.name,
    teacherName: instructor.name,
    instructorAvatar: instructor.avatar,
    teacherAvatar: instructor.avatar,
    instructorSlug: instructor.slug,
    instructorId: instructor.id,
  };
}
