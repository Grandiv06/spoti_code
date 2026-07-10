/**
 * Manual one-time migration: copy existing media from the bundled
 * `public/uploads` directory onto the persistent disk pointed to by UPLOAD_DIR.
 *
 * Normally this runs automatically at server startup (see src/instrumentation.ts),
 * but you can also trigger it explicitly on the server:
 *   UPLOAD_DIR=/files npm run migrate:uploads
 *
 * Use --force to re-copy even if the migration sentinel already exists.
 */
import { migrateUploadsToDisk } from "../src/server/services/migrate-uploads";

async function main() {
  if (!process.env.UPLOAD_DIR?.trim()) {
    console.error("UPLOAD_DIR is not set. Example: UPLOAD_DIR=/files npm run migrate:uploads");
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  const result = await migrateUploadsToDisk({
    force,
    log: (message) => console.log(message),
  });

  if (result.migrated) {
    console.log(`Migration complete: ${result.source} -> ${result.dest}`);
  } else {
    console.log(`Skipped: ${result.reason}`);
  }
}

main().catch((error) => {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
