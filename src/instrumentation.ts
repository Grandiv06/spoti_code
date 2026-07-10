// Runs once when the server process starts. We use it to migrate previously
// uploaded media onto the persistent disk (UPLOAD_DIR, e.g. /files) the first
// time the app boots after the disk is attached. It is idempotent and never
// throws, so it cannot block or crash startup.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { MEDIA_ROOT } = await import("@/server/services/course-media.service");
    const usingDisk = Boolean(process.env.UPLOAD_DIR?.trim());
    console.log(
      `[uploads] MEDIA_ROOT=${MEDIA_ROOT} (UPLOAD_DIR ${usingDisk ? "set — persistent disk" : "not set — public/uploads"})`
    );

    const { migrateUploadsToDisk } = await import("@/server/services/migrate-uploads");
    const result = await migrateUploadsToDisk({
      log: (message) => console.log(`[uploads-migrate] ${message}`),
    });
    if (result.migrated) {
      console.log(`[uploads-migrate] done (${result.source} -> ${result.dest})`);
    }
  } catch (error) {
    console.error(
      "[uploads-migrate] failed:",
      error instanceof Error ? error.message : error
    );
  }
}
