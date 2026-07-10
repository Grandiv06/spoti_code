import { cp, mkdir, readdir, stat, writeFile } from "fs/promises";
import path from "path";
import { MEDIA_ROOT, PUBLIC_UPLOADS_DIR } from "./course-media.service";

const SENTINEL_NAME = ".uploads-migrated";

export type MigrateUploadsResult = {
  migrated: boolean;
  reason?: string;
  source: string;
  dest: string;
};

/**
 * Copies media from the bundled `public/uploads` into the persistent disk
 * (MEDIA_ROOT, e.g. /files). Idempotent: a sentinel file marks completion so it
 * is a no-op on later boots. Existing files on the disk are never overwritten,
 * so anything uploaded directly to the disk wins.
 */
export async function migrateUploadsToDisk(options?: {
  force?: boolean;
  log?: (message: string) => void;
}): Promise<MigrateUploadsResult> {
  const log = options?.log ?? (() => {});
  const source = PUBLIC_UPLOADS_DIR;
  const dest = MEDIA_ROOT;

  if (dest === source) {
    return { migrated: false, reason: "UPLOAD_DIR not set — using public/uploads", source, dest };
  }

  const sentinel = path.join(dest, SENTINEL_NAME);
  if (!options?.force) {
    try {
      await stat(sentinel);
      return { migrated: false, reason: "already migrated", source, dest };
    } catch {
      // sentinel missing → proceed
    }
  }

  let entries: string[] = [];
  try {
    entries = await readdir(source);
  } catch {
    entries = [];
  }

  await mkdir(dest, { recursive: true });

  if (entries.length > 0) {
    log(`Copying ${source} -> ${dest} ...`);
    await cp(source, dest, { recursive: true, force: false, errorOnExist: false });
    log(`Copied: ${entries.join(", ")}`);
  } else {
    log(`No files in ${source}; nothing to copy.`);
  }

  await writeFile(sentinel, `${new Date().toISOString()}\n`, "utf8");
  return { migrated: true, source, dest };
}
