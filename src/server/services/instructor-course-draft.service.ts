import { Prisma, type User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { assertInstructor, resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";
import { ensureCourseApprovalSchema } from "@/server/services/course-approval-schema.service";
import {
  normalizeInstructorCourseDraftDto,
  type CourseApprovalStatus,
  type InstructorCourseDraftDto,
} from "@/server/dto/instructor-course-draft.dto";

type CourseApprovalRow = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  aboutDescription: string | null;
  category: string;
  categoryTitle: string;
  instructorId: string;
  instructorName: string;
  cover: string;
  thumbnail: string;
  difficulty: string;
  level: string;
  durationHours: number;
  price: number;
  status: string;
  approvalStatus: string | null;
  draftStep: number | null;
  draftData: unknown;
  introVideo: string | null;
  chapters: unknown;
  faqs: unknown;
  specialWord: string | null;
  submittedAt: Date | string | null;
  approvedAt: Date | string | null;
  rejectedAt: Date | string | null;
  approvalNote: string | null;
  updatedAt: Date | string;
  createdAt: Date | string;
};

const DEFAULT_COVER = "/images/course1.jpg";

function resolvePersistableCover(nextCover: string, existingCover?: string | null) {
  const trimmed = nextCover.trim();
  if (trimmed && !trimmed.startsWith("blob:")) {
    return trimmed;
  }

  const existing = (existingCover || "").trim();
  if (existing && !existing.startsWith("blob:")) {
    return existing;
  }

  return DEFAULT_COVER;
}

function titleToSlug(value: string) {
  const ascii = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || `course-${Date.now()}`;
}

async function uniqueCourseSlug(base: string, currentCourseId?: string) {
  let slug = base;
  let suffix = 2;

  while (true) {
    const rows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id" FROM "Course" WHERE "slug" = ${slug} LIMIT 1
    `;
    const existingId = rows[0]?.id;
    if (!existingId || existingId === currentCourseId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

function categoryTitle(category: InstructorCourseDraftDto["category"]) {
  if (category === "backend") return "بک‌اند";
  if (category === "ai") return "هوش مصنوعی";
  if (category === "base") return "مبانی";
  if (category === "mobile") return "موبایل";
  if (category === "devops") return "دواپس";
  return "فرانت‌اند";
}

function difficultyLabel(level: InstructorCourseDraftDto["level"]) {
  if (level === "elementary") return "beginner";
  if (level === "advanced") return "advanced";
  return "intermediate";
}

function durationHours(duration: string) {
  const parsed = Number(String(duration).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 1;
}

function publicChapters(input: InstructorCourseDraftDto) {
  return input.chapters.map((chapter, chapterIndex) => ({
    id: chapter.id,
    title: chapter.title,
    subtitle: chapter.subtitle,
    number: chapter.number || String(chapterIndex + 1).padStart(2, "0"),
    lessons: chapter.lessons.map((lesson) => {
      const isFree = input.isPaid === "free" || lesson.access === "free";
      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type || "video",
        duration: lesson.duration,
        isFree,
        isFreePreview: isFree,
        isLocked: !isFree,
        isUnlocked: isFree,
        ...(lesson.videoUrl ? { videoUrl: lesson.videoUrl } : {}),
        ...(lesson.description ? { description: lesson.description } : {}),
        ...(lesson.attachments?.length ? { attachments: lesson.attachments } : {}),
        status: "published",
      };
    }),
  }));
}

function draftDataValue(input: InstructorCourseDraftDto): Prisma.InputJsonValue {
  return input as unknown as Prisma.InputJsonValue;
}

function parseDraftData(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function mapApprovalListRow(row: CourseApprovalRow & { studentsCount?: number; revenue?: bigint | number | null; rating?: number | null }) {
  const approvalStatus = normalizeApprovalStatus(row.approvalStatus);
  return {
    id: row.id,
    courseId: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    aboutDescription: row.aboutDescription ?? row.description,
    category: row.category,
    categoryTitle: row.categoryTitle,
    instructorId: row.instructorId,
    instructorName: row.instructorName,
    instructor: row.instructorName,
    cover: resolvePersistableCover(row.cover),
    thumbnail: resolvePersistableCover(row.thumbnail, row.cover),
    difficulty: row.difficulty,
    level: row.level,
    durationHours: row.durationHours,
    price: row.price,
    studentsCount: Number(row.studentsCount ?? 0),
    revenue: Number(row.revenue ?? 0),
    rating: Number(row.rating ?? 0),
    status: row.status === "published" && approvalStatus === "approved" ? "published" : approvalStatus,
    approvalStatus,
    approvalStatusLabel:
      approvalStatus === "approved"
        ? "تایید شده"
        : approvalStatus === "pending"
          ? "در انتظار بررسی"
          : approvalStatus === "rejected"
            ? "رد شده"
            : "پیش‌نویس",
    draftStep: row.draftStep ?? 1,
    specialWord: row.specialWord ?? "",
    submittedAt: row.submittedAt,
    approvedAt: row.approvedAt,
    rejectedAt: row.rejectedAt,
    approvalNote: row.approvalNote ?? "",
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  };
}

function mapApprovalRow(row: CourseApprovalRow) {
  const approvalStatus = normalizeApprovalStatus(row.approvalStatus);
  return {
    id: row.id,
    courseId: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    aboutDescription: row.aboutDescription ?? row.description,
    category: row.category,
    categoryTitle: row.categoryTitle,
    instructorId: row.instructorId,
    instructorName: row.instructorName,
    cover: resolvePersistableCover(row.cover),
    thumbnail: resolvePersistableCover(row.thumbnail, row.cover),
    difficulty: row.difficulty,
    level: row.level,
    durationHours: row.durationHours,
    price: row.price,
    status: row.status === "published" && approvalStatus === "approved" ? "published" : approvalStatus,
    approvalStatus,
    approvalStatusLabel:
      approvalStatus === "approved"
        ? "تایید شده"
        : approvalStatus === "pending"
          ? "در انتظار بررسی"
          : approvalStatus === "rejected"
            ? "رد شده"
            : "پیش‌نویس",
    draftStep: row.draftStep ?? 1,
    draftData: parseDraftData(row.draftData),
    introVideo: row.introVideo ?? "",
    chapters: parseDraftData(row.chapters),
    faqs: parseDraftData(row.faqs),
    specialWord: row.specialWord ?? "",
    submittedAt: row.submittedAt,
    approvedAt: row.approvedAt,
    rejectedAt: row.rejectedAt,
    approvalNote: row.approvalNote ?? "",
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  };
}

function normalizeApprovalStatus(value: unknown): CourseApprovalStatus {
  if (value === "pending" || value === "approved" || value === "rejected") return value;
  return "draft";
}

async function requireInstructor(user: User) {
  assertInstructor(user);
  const instructor = await resolveInstructorForUser(user);
  if (!instructor) throw new AuthError("پروفایل مدرس پیدا نشد", 404);
  return instructor;
}

async function findOwnedCourse(courseId: string, instructorId: string) {
  const rows = await prisma.$queryRaw<Array<{ id: string; cover: string; introVideo: string | null }>>`
    SELECT "id", "cover", "introVideo"
    FROM "Course"
    WHERE "id" = ${decodeURIComponent(courseId)} AND "instructorId" = ${instructorId}
    LIMIT 1
  `;
  const course = rows[0];
  if (!course) throw new AuthError("دوره پیدا نشد یا دسترسی ندارید", 404);
  return course;
}

async function readCourseRow(courseId: string) {
  await ensureCourseApprovalSchema();
  const [row] = await prisma.$queryRaw<CourseApprovalRow[]>`
    SELECT
      c."id",
      c."slug",
      c."title",
      c."shortDescription",
      c."description",
      c."aboutDescription",
      c."category",
      c."categoryTitle",
      c."instructorId",
      i."name" as "instructorName",
      c."cover",
      c."thumbnail",
      c."difficulty",
      c."level",
      c."durationHours",
      c."price",
      c."status",
      c."approvalStatus",
      c."draftStep",
      CAST(c."draftData" AS TEXT) as "draftData",
      c."introVideo",
      CAST(c."chapters" AS TEXT) as "chapters",
      CAST(c."faqs" AS TEXT) as "faqs",
      c."specialWord",
      c."submittedAt",
      c."approvedAt",
      c."rejectedAt",
      c."approvalNote",
      c."updatedAt",
      c."createdAt"
    FROM "Course" c
    INNER JOIN "Instructor" i ON i."id" = c."instructorId"
    WHERE c."id" = ${courseId}
    LIMIT 1
  `;
  return row ? mapApprovalRow(row) : null;
}

function resolvePersistableIntroVideo(nextVideo: string, existingVideo?: string | null) {
  const trimmed = nextVideo.trim();
  if (trimmed && !trimmed.startsWith("blob:")) {
    return trimmed;
  }

  const existing = (existingVideo || "").trim();
  if (existing && !existing.startsWith("blob:")) {
    return existing;
  }

  return null;
}

export async function upsertInstructorCourseDraft(user: User, rawInput: unknown) {
  await ensureCourseApprovalSchema();
  const instructor = await requireInstructor(user);
  const input = normalizeInstructorCourseDraftDto(rawInput);

  if (!input.title) {
    throw new AuthError("عنوان دوره الزامی است", 400);
  }

  const slug = await uniqueCourseSlug(titleToSlug(input.title), input.courseId);
  const description = input.aboutDescription || input.shortDescription || input.title;

  let courseId = input.courseId ? decodeURIComponent(input.courseId) : "";
  let cover = resolvePersistableCover(input.cover);
  let introVideo = resolvePersistableIntroVideo(input.introVideo);

  if (courseId) {
    const course = await findOwnedCourse(courseId, instructor.id);
    cover = resolvePersistableCover(input.cover, course.cover);
    introVideo = resolvePersistableIntroVideo(input.introVideo, course.introVideo);
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: input.title,
        slug,
        shortDescription: input.shortDescription || input.title,
        description,
        aboutDescription: input.aboutDescription || null,
        category: input.category,
        categoryTitle: categoryTitle(input.category),
        cover,
        thumbnail: cover,
        difficulty: difficultyLabel(input.level),
        level: input.level,
        durationHours: durationHours(input.duration),
        price: input.price,
        introVideo: introVideo || null,
        chapters: publicChapters(input) as Prisma.InputJsonValue,
        faqs: input.faqs as Prisma.InputJsonValue,
        specialWord: JSON.stringify(input.specialWords),
        draftData: draftDataValue(input),
      },
    });
  } else {
    courseId = `CRS-${Date.now()}`;
    await prisma.course.create({
      data: {
        id: courseId,
        title: input.title,
        slug,
        shortDescription: input.shortDescription || input.title,
        description,
        aboutDescription: input.aboutDescription || null,
        category: input.category,
        categoryTitle: categoryTitle(input.category),
        instructorId: instructor.id,
        cover,
        thumbnail: cover,
        difficulty: difficultyLabel(input.level),
        level: input.level,
        durationHours: durationHours(input.duration),
        price: input.price,
        introVideo: introVideo || null,
        chapters: publicChapters(input) as Prisma.InputJsonValue,
        faqs: input.faqs as Prisma.InputJsonValue,
        specialWord: JSON.stringify(input.specialWords),
        draftData: draftDataValue(input),
        status: "draft",
        approvalStatus: "draft",
        draftStep: input.step,
      },
    });
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      approvalStatus: "draft",
      draftStep: input.step,
      draftData: draftDataValue(input),
      approvalNote: null,
    },
  });

  return readCourseRow(courseId);
}

export async function getInstructorCourseDraft(user: User, courseId: string) {
  const instructor = await requireInstructor(user);
  const course = await findOwnedCourse(courseId, instructor.id);
  return readCourseRow(course.id);
}

export async function submitInstructorCourseForPublish(user: User, courseId: string) {
  await ensureCourseApprovalSchema();
  const instructor = await requireInstructor(user);
  const course = await findOwnedCourse(courseId, instructor.id);
  const [permission] = await prisma.$queryRaw<Array<{ canPublishWithoutApproval: boolean | number | null }>>`
    SELECT "canPublishWithoutApproval"
    FROM "Instructor"
    WHERE "id" = ${instructor.id}
    LIMIT 1
  `;
  const canPublishWithoutApproval = permission?.canPublishWithoutApproval === true || permission?.canPublishWithoutApproval === 1;
  const now = new Date();

  if (canPublishWithoutApproval) {
    await prisma.$executeRaw`
      UPDATE "Course"
      SET "status" = 'published',
          "approvalStatus" = 'approved',
          "submittedAt" = ${now},
          "approvedAt" = ${now},
          "rejectedAt" = NULL,
          "approvalNote" = NULL,
          "updatedAt" = ${now}
      WHERE "id" = ${course.id}
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE "Course"
      SET "status" = 'draft',
          "approvalStatus" = 'pending',
          "submittedAt" = ${now},
          "approvedAt" = NULL,
          "rejectedAt" = NULL,
          "approvalNote" = NULL,
          "updatedAt" = ${now}
      WHERE "id" = ${course.id}
    `;
  }

  return readCourseRow(course.id);
}

export async function getAdminCourseRequests(
  user: User,
  filters: { status?: string; search?: string; sort?: string; includeDraftPayload?: boolean } = {}
) {
  await ensureCourseApprovalSchema();
  if (user.role !== "ADMIN") throw new AuthError("دسترسی ادمین لازم است", 403);

  const status = filters.status === "approved" || filters.status === "rejected" || filters.status === "draft" ? filters.status : "pending";
  const orderBy = filters.sort === "oldest" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
  const includeDraftPayload = filters.includeDraftPayload === true;
  const rows = includeDraftPayload
    ? await prisma.$queryRaw<CourseApprovalRow[]>`
        SELECT
          c."id",
          c."slug",
          c."title",
          c."shortDescription",
          c."description",
          c."aboutDescription",
          c."category",
          c."categoryTitle",
          c."instructorId",
          i."name" as "instructorName",
          c."cover",
          c."thumbnail",
          c."difficulty",
          c."level",
          c."durationHours",
          c."price",
          c."status",
          c."approvalStatus",
          c."draftStep",
          CAST(c."draftData" AS TEXT) as "draftData",
          c."introVideo",
          CAST(c."chapters" AS TEXT) as "chapters",
          CAST(c."faqs" AS TEXT) as "faqs",
          c."specialWord",
          c."submittedAt",
          c."approvedAt",
          c."rejectedAt",
          c."approvalNote",
          c."updatedAt",
          c."createdAt"
        FROM "Course" c
        INNER JOIN "Instructor" i ON i."id" = c."instructorId"
        WHERE c."approvalStatus" = ${status}
        ORDER BY c."submittedAt" ${orderBy}, c."updatedAt" ${orderBy}
      `
    : await prisma.$queryRaw<Array<CourseApprovalRow & { studentsCount?: number; revenue?: bigint | number | null; rating?: number | null }>>`
        SELECT
          c."id",
          c."slug",
          c."title",
          c."shortDescription",
          c."description",
          c."aboutDescription",
          c."category",
          c."categoryTitle",
          c."instructorId",
          i."name" as "instructorName",
          c."cover",
          c."thumbnail",
          c."difficulty",
          c."level",
          c."durationHours",
          c."price",
          c."studentsCount",
          c."revenue",
          c."rating",
          c."status",
          c."approvalStatus",
          c."draftStep",
          c."specialWord",
          c."submittedAt",
          c."approvedAt",
          c."rejectedAt",
          c."approvalNote",
          c."updatedAt",
          c."createdAt"
        FROM "Course" c
        INNER JOIN "Instructor" i ON i."id" = c."instructorId"
        WHERE c."approvalStatus" = ${status}
        ORDER BY c."submittedAt" ${orderBy}, c."updatedAt" ${orderBy}
      `;

  const query = filters.search?.trim().toLowerCase();
  const items = rows
    .map((row) => (includeDraftPayload ? mapApprovalRow(row) : mapApprovalListRow(row)))
    .filter((item) => !query || item.title.toLowerCase().includes(query) || item.instructorName.toLowerCase().includes(query));

  const statsRows = await prisma.$queryRaw<Array<{ approvalStatus: string | null; count: number | bigint | string }>>`
    SELECT "approvalStatus", COUNT(*) as "count"
    FROM "Course"
    GROUP BY "approvalStatus"
  `;
  const stats = { total: 0, pending: 0, approved: 0, rejected: 0, draft: 0 };
  for (const row of statsRows) {
    const key = normalizeApprovalStatus(row.approvalStatus);
    const count = Number(row.count ?? 0);
    stats.total += count;
    stats[key] += count;
  }

  return { items, stats };
}

export async function updateAdminCourseRequestStatus(
  user: User,
  courseId: string,
  nextStatus: "approved" | "rejected",
  note?: unknown
) {
  await ensureCourseApprovalSchema();
  if (user.role !== "ADMIN") throw new AuthError("دسترسی ادمین لازم است", 403);

  const decodedId = decodeURIComponent(courseId);
  const now = new Date();
  const approvalNote = typeof note === "string" && note.trim() ? note.trim() : null;

  if (nextStatus === "approved") {
    await prisma.$executeRaw`
      UPDATE "Course"
      SET "status" = 'published',
          "approvalStatus" = 'approved',
          "approvedAt" = ${now},
          "rejectedAt" = NULL,
          "approvalNote" = ${approvalNote},
          "updatedAt" = ${now}
      WHERE "id" = ${decodedId}
        AND "approvalStatus" = 'pending'
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE "Course"
      SET "status" = 'draft',
          "approvalStatus" = 'rejected',
          "rejectedAt" = ${now},
          "approvedAt" = NULL,
          "approvalNote" = ${approvalNote},
          "updatedAt" = ${now}
      WHERE "id" = ${decodedId}
        AND "approvalStatus" = 'pending'
    `;
  }

  const updated = await readCourseRow(decodedId);
  if (!updated) throw new AuthError("درخواست دوره پیدا نشد", 404);
  return updated;
}

export async function countPendingCourseRequests() {
  await ensureCourseApprovalSchema();
  const [row] = await prisma.$queryRaw<Array<{ count: number | bigint | string }>>`
    SELECT COUNT(*) as "count"
    FROM "Course"
    WHERE "approvalStatus" = 'pending'
  `;
  return Number(row?.count ?? 0);
}
