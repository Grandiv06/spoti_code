import type { Course, CourseCategory, CourseLevel, Instructor } from "@prisma/client";

/** Nested instructor shape used by landing & courses pages */
export interface PublicCourseInstructorDto {
  id: string;
  slug: string;
  name: string;
  avatar: string;
}

/**
 * Public course list item — fields the frontend already reads
 * (see `src/app/page.tsx` and `src/app/courses/page.tsx`).
 */
export interface PublicCourseListItemDto {
  id: string;
  slug: string;
  title: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CourseCategory;
  categoryTitle: string;
  categorySlug: string;
  categoryName: string;
  instructorId: string;
  instructorSlug: string;
  instructorName: string;
  teacherName: string;
  instructorAvatar: string;
  teacherAvatar: string;
  instructor: PublicCourseInstructorDto;
  cover: string;
  thumbnail: string;
  image: string;
  difficulty: string;
  level: CourseLevel;
  durationHours: number;
  hours: number;
  duration: number;
  studentsCount: number;
  students: number;
  enrolledCount: number;
  price: number;
  amount: number;
  finalPrice: number;
  originalPrice: number;
  displayPrice: number;
  discountPercent: number | null;
  rating: number;
  status: string;
}

export interface PublicCourseListMetaDto {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PublicCourseListResponseDto {
  data: PublicCourseListItemDto[];
  meta: PublicCourseListMetaDto;
}

export interface PublicCourseListQueryDto {
  page?: number;
  limit?: number;
  category?: CourseCategory;
  search?: string;
}

type CourseWithInstructor = Course & { instructor: Instructor };

export function toPublicCourseListItemDto(course: CourseWithInstructor): PublicCourseListItemDto {
  const instructor = course.instructor;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    name: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    category: course.category,
    categoryTitle: course.categoryTitle,
    categorySlug: course.category,
    categoryName: course.categoryTitle,
    instructorId: instructor.id,
    instructorSlug: instructor.slug,
    instructorName: instructor.name,
    teacherName: instructor.name,
    instructorAvatar: instructor.avatar,
    teacherAvatar: instructor.avatar,
    instructor: {
      id: instructor.id,
      slug: instructor.slug,
      name: instructor.name,
      avatar: instructor.avatar,
    },
    cover: course.cover,
    thumbnail: course.thumbnail,
    image: course.cover,
    difficulty: course.difficulty,
    level: course.level,
    durationHours: course.durationHours,
    hours: course.durationHours,
    duration: course.durationHours,
    studentsCount: course.studentsCount,
    students: course.studentsCount,
    enrolledCount: course.studentsCount,
    price: course.price,
    amount: course.price,
    finalPrice: course.price,
    originalPrice: course.price,
    displayPrice: course.price,
    discountPercent: null,
    rating: course.rating,
    status: course.status,
  };
}
