import { prisma } from "@/server/db/prisma";

let courseApprovalColumnsReady = false;

function isPostgresDatabase() {
  return (process.env.DATABASE_URL ?? "").startsWith("postgresql");
}

async function addColumnIfMissing(statement: string) {
  try {
    await prisma.$executeRawUnsafe(statement);
  } catch {
    // The column may already exist. We intentionally keep this idempotent for dev DBs.
  }
}

async function hasPostgresColumn(tableName: string, columnName: string) {
  try {
    const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
        AND column_name = ${columnName}
      LIMIT 1
    `;
    return rows.length > 0;
  } catch {
    return false;
  }
}

async function hasSqliteColumn(tableName: string, columnName: string) {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`PRAGMA table_info("${tableName}")`);
    return rows.some((row) => row.name === columnName);
  } catch {
    return false;
  }
}

async function hasColumn(tableName: string, columnName: string) {
  if (isPostgresDatabase()) {
    return hasPostgresColumn(tableName, columnName);
  }
  return hasSqliteColumn(tableName, columnName);
}

async function addColumn(tableName: string, columnName: string, statement: string) {
  if (await hasColumn(tableName, columnName)) return;
  await addColumnIfMissing(statement);
}

export async function ensureCourseApprovalSchema() {
  if (courseApprovalColumnsReady) return;

  const draftDataType = isPostgresDatabase() ? "JSONB" : "TEXT";

  await addColumn("Course", "approvalStatus", `ALTER TABLE "Course" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'draft'`);
  await addColumn("Course", "draftStep", `ALTER TABLE "Course" ADD COLUMN "draftStep" INTEGER NOT NULL DEFAULT 1`);
  await addColumn("Course", "draftData", `ALTER TABLE "Course" ADD COLUMN "draftData" ${draftDataType}`);
  await addColumn("Course", "submittedAt", `ALTER TABLE "Course" ADD COLUMN "submittedAt" TIMESTAMP(3)`);
  await addColumn("Course", "approvedAt", `ALTER TABLE "Course" ADD COLUMN "approvedAt" TIMESTAMP(3)`);
  await addColumn("Course", "rejectedAt", `ALTER TABLE "Course" ADD COLUMN "rejectedAt" TIMESTAMP(3)`);
  await addColumn("Course", "approvalNote", `ALTER TABLE "Course" ADD COLUMN "approvalNote" TEXT`);
  await addColumn(
    "Instructor",
    "canPublishWithoutApproval",
    isPostgresDatabase()
      ? `ALTER TABLE "Instructor" ADD COLUMN "canPublishWithoutApproval" BOOLEAN NOT NULL DEFAULT false`
      : `ALTER TABLE "Instructor" ADD COLUMN "canPublishWithoutApproval" BOOLEAN NOT NULL DEFAULT 0`
  );

  if (isPostgresDatabase()) {
    await prisma.$executeRaw`
      UPDATE "Course" SET "draftData" = '{}'::jsonb WHERE "draftData" IS NULL
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE "Course" SET "draftData" = '{}' WHERE "draftData" IS NULL
    `;
  }

  courseApprovalColumnsReady = true;
}
