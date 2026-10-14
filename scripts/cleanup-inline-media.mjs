/**
 * One-off cleanup: replace inline base64 images (data:...) stored in the DB with
 * varied default images, so list/panel queries stop pulling megabytes per row.
 *
 *   node --env-file=.env scripts/cleanup-inline-media.mjs          # dry run (no writes)
 *   node --env-file=.env scripts/cleanup-inline-media.mjs --apply  # perform updates
 */
import { PrismaClient } from "@prisma/client";

const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient();

const COURSE_IMAGES = [1, 2, 3, 4, 5].map((n) => `/images/course${n}.jpg`);
const USER_AVATARS = [
  "/images/user1.jpg",
  "/images/user2.jpg",
  "/images/user3.jpg",
  "/images/student1.jpg",
  "/images/student2.jpg",
  "/images/student3.jpg",
];
const INSTRUCTOR_AVATARS = [1, 2, 3, 4, 5, 6].map((n) => `/images/inst${n}.jpg`);

/** Shuffled round-robin picker: random, but spreads images evenly before repeating. */
function createPicker(pool) {
  let bag = [];
  return () => {
    if (bag.length === 0) bag = [...pool].sort(() => Math.random() - 0.5);
    return bag.pop();
  };
}
const pickCourse = createPicker(COURSE_IMAGES);
const pickAvatar = createPicker(USER_AVATARS);
const pickInstructor = createPicker(INSTRUCTOR_AVATARS);

const isInline = (v) => typeof v === "string" && (v.startsWith("data:") || v.startsWith("blob:"));

/** Recursively replace inline media strings inside a JSON value. */
function stripDeep(value, replacement) {
  if (isInline(value)) return replacement;
  if (Array.isArray(value)) return value.map((item) => stripDeep(item, replacement));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripDeep(v, replacement)]));
  }
  return value;
}

async function run(label, fn) {
  if (APPLY) await fn();
  console.log(`${APPLY ? "UPDATED" : "WOULD UPDATE"} ${label}`);
}

const INLINE = `LIKE 'data:%' OR "$COL" LIKE 'blob:%'`;
const where = (col) => `("${col}" ${INLINE.replace("$COL", col)})`;

async function main() {
  console.log(APPLY ? "== APPLY MODE ==" : "== DRY RUN (pass --apply to write) ==");

  // ---- Courses: cover / thumbnail / draftData ----
  const courses = await prisma.$queryRawUnsafe(
    `SELECT "id" FROM "Course" WHERE ${where("cover")} OR ${where("thumbnail")}
       OR CAST("draftData" AS TEXT) LIKE '%"data:%' OR CAST("draftData" AS TEXT) LIKE '%"blob:%'`
  );
  for (const { id } of courses) {
    const row = await prisma.course.findUnique({
      where: { id },
      select: { cover: true, thumbnail: true, draftData: true },
    });
    if (!row) continue;
    const image = !isInline(row.cover) ? row.cover : !isInline(row.thumbnail) ? row.thumbnail : pickCourse();
    const data = {};
    if (isInline(row.cover)) data.cover = image;
    if (isInline(row.thumbnail)) data.thumbnail = image;
    if (row.draftData != null) {
      const cleaned = stripDeep(row.draftData, image);
      if (JSON.stringify(cleaned) !== JSON.stringify(row.draftData)) data.draftData = cleaned;
    }
    if (Object.keys(data).length === 0) continue;
    await run(`Course ${id} -> ${image} [${Object.keys(data).join(", ")}]`, () =>
      prisma.course.update({ where: { id }, data })
    );
  }

  // ---- User profiles: image / bannerImage ----
  const avatarByUser = new Map();
  const profiles = await prisma.$queryRawUnsafe(
    `SELECT "id", "userId", (${where("image")}) AS "badImage", (${where("bannerImage")}) AS "badBanner"
       FROM "UserProfile" WHERE ${where("image")} OR ${where("bannerImage")}`
  );
  for (const { id, userId, badImage, badBanner } of profiles) {
    const data = {};
    if (badImage) {
      data.image = pickAvatar();
      avatarByUser.set(userId, data.image);
    }
    if (badBanner) data.bannerImage = null;
    await run(`UserProfile ${id} -> ${JSON.stringify(data)}`, () =>
      prisma.userProfile.update({ where: { id }, data })
    );
  }

  // ---- Comments: authorAvatar (reuse the author's new profile avatar when possible) ----
  const comments = await prisma.$queryRawUnsafe(
    `SELECT "id", "authorId" FROM "Comment" WHERE ${where("authorAvatar")}`
  );
  for (const { id, authorId } of comments) {
    let avatar = authorId ? avatarByUser.get(authorId) : undefined;
    if (!avatar && authorId) {
      const profile = await prisma.userProfile.findUnique({ where: { userId: authorId }, select: { image: true } });
      if (profile?.image && !isInline(profile.image)) avatar = profile.image;
    }
    avatar ??= pickAvatar();
    if (authorId) avatarByUser.set(authorId, avatar);
    await run(`Comment ${id} -> ${avatar}`, () =>
      prisma.comment.update({ where: { id }, data: { authorAvatar: avatar } })
    );
  }

  // ---- Instructors: avatar / coverImage ----
  const instructors = await prisma.$queryRawUnsafe(
    `SELECT "id", (${where("avatar")}) AS "badAvatar", (${where("coverImage")}) AS "badCover"
       FROM "Instructor" WHERE ${where("avatar")} OR ${where("coverImage")}`
  );
  for (const { id, badAvatar, badCover } of instructors) {
    const data = {};
    if (badAvatar) data.avatar = pickInstructor();
    if (badCover) data.coverImage = null;
    await run(`Instructor ${id} -> ${JSON.stringify(data)}`, () =>
      prisma.instructor.update({ where: { id }, data })
    );
  }

  console.log(
    `Done. courses=${courses.length} profiles=${profiles.length} comments=${comments.length} instructors=${instructors.length}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
