import { prisma } from "@/server/db/prisma";

let courseApprovalColumnsReady = false;

async function addColumnIfMissing(statement: string) {
  try {
    await prisma.$executeRawUnsafe(statement);
  } catch {
    // The column may already exist. We intentionally keep this idempotent for dev DBs.
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

async function addColumn(tableName: string, columnName: string, statement: string) {
  if (await hasSqliteColumn(tableName, columnName)) return;
  await addColumnIfMissing(statement);
}

export async function ensureCourseApprovalSchema() {
  if (courseApprovalColumnsReady) return;

  await addColumn("Course", "approvalStatus", `ALTER TABLE "Course" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'draft'`);
  await addColumn("Course", "draftStep", `ALTER TABLE "Course" ADD COLUMN "draftStep" INTEGER NOT NULL DEFAULT 1`);
  await addColumn("Course", "draftData", `ALTER TABLE "Course" ADD COLUMN "draftData" TEXT`);
  await addColumn("Course", "submittedAt", `ALTER TABLE "Course" ADD COLUMN "submittedAt" DATETIME`);
  await addColumn("Course", "approvedAt", `ALTER TABLE "Course" ADD COLUMN "approvedAt" DATETIME`);
  await addColumn("Course", "rejectedAt", `ALTER TABLE "Course" ADD COLUMN "rejectedAt" DATETIME`);
  await addColumn("Course", "approvalNote", `ALTER TABLE "Course" ADD COLUMN "approvalNote" TEXT`);
  await addColumn(
    "Instructor",
    "canPublishWithoutApproval",
    `ALTER TABLE "Instructor" ADD COLUMN "canPublishWithoutApproval" BOOLEAN NOT NULL DEFAULT 0`
  );

  courseApprovalColumnsReady = true;
}
