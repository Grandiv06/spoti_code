export type CreateQaDto = {
  lessonId: string;
  question: string;
  questionFileIds?: string[];
};

export type UpsertProfileDto = {
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
  mbtiType?: string;
  personalWebsiteLink?: string;
  occupation?: string;
  about?: string;
  capabilities?: string;
  contacts?: string;
  skills?: string;
  image?: string;
  birthDate?: string;
  fatherName?: string;
  homeNumber?: string;
  emergencyNumber?: string;
};

export type CreateCommentDto = {
  content: string;
  commentableType: "course";
  commentableId: string;
  parentId?: string;
  rating?: number;
};

export type CreateCourseDto = {
  title: string;
  price: number;
  slug?: string;
  category?: CreateCourseCategory;
  difficulty?: CreateCourseDifficulty;
  time?: string;
  mockStudentsCount?: number;
  priceType?: CreateCoursePriceType;
  thumbnailFileId?: string;
};

export const CreateCourseCategory = {
  FRONTEND: "frontend",
  BACKEND: "backend",
  AI: "ai",
  BASE: "base",
  MOBILE: "mobile",
  DEVOPS: "devops",
} as const;

export type CreateCourseCategory =
  (typeof CreateCourseCategory)[keyof typeof CreateCourseCategory];

export const CreateCourseDifficulty = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type CreateCourseDifficulty =
  (typeof CreateCourseDifficulty)[keyof typeof CreateCourseDifficulty];

export const CreateCoursePriceType = {
  FREE: "free",
  CASH: "cash",
} as const;

export type CreateCoursePriceType =
  (typeof CreateCoursePriceType)[keyof typeof CreateCoursePriceType];
