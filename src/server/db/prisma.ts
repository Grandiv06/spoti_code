import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_COURSE_IMAGES,
  DEFAULT_INSTRUCTOR_AVATARS,
  DEFAULT_USER_AVATARS,
  containsInlineMedia,
  persistInlineMediaDeep,
  pickDefault,
  sanitizeMediaUrl,
  stripInlineMediaDeep,
} from "@/server/utils/media-guard";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const MAX_CONNECTION_RETRIES = 4;
const RETRY_DELAYS_MS = [300, 800, 1500, 2500];

function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return raw;

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "8");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "15");
    }
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "5");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const WRITE_OPERATIONS = new Set([
  "create",
  "createMany",
  "createManyAndReturn",
  "update",
  "updateMany",
  "updateManyAndReturn",
  "upsert",
]);

/**
 * Media guard (see src/server/utils/media-guard.ts):
 * - Write: any base64 `data:image` in a write payload (incl. nested writes / JSON columns)
 *   is saved as a file under /uploads/media and only its URL is stored.
 * - Read: image columns never return inline media, even if some slipped into the DB.
 */
function withMediaGuard(client: PrismaClient) {
  return client.$extends({
    name: "media-guard",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (WRITE_OPERATIONS.has(operation) && args && containsInlineMedia(args)) {
            const folder = String(model ?? "misc").toLowerCase();
            const safeArgs = await persistInlineMediaDeep(args, folder);
            return query(safeArgs);
          }
          return query(args);
        },
      },
    },
    result: {
      course: {
        cover: {
          needs: { id: true, cover: true },
          compute: (c) => sanitizeMediaUrl(c.cover, pickDefault(DEFAULT_COURSE_IMAGES, c.id)),
        },
        thumbnail: {
          needs: { id: true, thumbnail: true },
          compute: (c) => sanitizeMediaUrl(c.thumbnail, pickDefault(DEFAULT_COURSE_IMAGES, c.id)),
        },
        draftData: {
          needs: { draftData: true },
          compute: (c) => stripInlineMediaDeep(c.draftData),
        },
      },
      userProfile: {
        image: {
          needs: { userId: true, image: true },
          compute: (p) => sanitizeMediaUrl(p.image, pickDefault(DEFAULT_USER_AVATARS, p.userId)),
        },
        bannerImage: {
          needs: { bannerImage: true },
          compute: (p) => sanitizeMediaUrl(p.bannerImage, ""),
        },
      },
      instructor: {
        avatar: {
          needs: { id: true, avatar: true },
          compute: (i) => sanitizeMediaUrl(i.avatar, pickDefault(DEFAULT_INSTRUCTOR_AVATARS, i.id)),
        },
        coverImage: {
          needs: { coverImage: true },
          compute: (i) => sanitizeMediaUrl(i.coverImage, ""),
        },
      },
      comment: {
        authorAvatar: {
          needs: { authorId: true, authorAvatar: true },
          compute: (c) =>
            sanitizeMediaUrl(c.authorAvatar, pickDefault(DEFAULT_USER_AVATARS, c.authorId)),
        },
      },
    },
  });
}

function createPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(databaseUrl
      ? {
          datasources: {
            db: { url: databaseUrl },
          },
        }
      : {}),
  });

  // Extended client keeps the same runtime API; cast so existing call sites stay typed.
  return withMediaGuard(client) as unknown as PrismaClient;
}

function isPrismaClientCurrent(client: PrismaClient) {
  if (!client) return false;
  // Reject stale clients that still carry leftover Telegram-auth models/fields.
  if ("authRequest" in client) return false;
  return true;
}

function resetPrismaClient() {
  const cached = globalForPrisma.prisma;
  globalForPrisma.prisma = undefined;
  if (cached) {
    void cached.$disconnect().catch(() => undefined);
  }
}

export function isPrismaConnectionError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const record = error as { code?: unknown; errorCode?: unknown; name?: unknown };
  const code = String(record.code ?? record.errorCode ?? "");
  if (code === "P1001" || code === "P1017" || code === "P1008" || code === "P2024") {
    return true;
  }

  if (record.name === "PrismaClientInitializationError") return true;

  const message = error instanceof Error ? error.message : "";
  return (
    message.includes("Server has closed the connection") ||
    message.includes("Can't reach database server") ||
    message.includes("Connection terminated") ||
    message.includes("bytes remaining on stream") ||
    message.includes("database system is starting up") ||
    message.includes("Error querying the database")
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runWithConnectionRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_CONNECTION_RETRIES; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isPrismaConnectionError(error) || attempt === MAX_CONNECTION_RETRIES) {
        throw error;
      }

      resetPrismaClient();
      await sleep(RETRY_DELAYS_MS[attempt] ?? 2500);
    }
  }

  throw lastError;
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;
  if (cached && isPrismaClientCurrent(cached)) {
    return cached;
  }

  if (cached) {
    void cached.$disconnect().catch(() => undefined);
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

function wrapDelegate(delegate: object, modelKey: string | symbol) {
  return new Proxy(delegate, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;

      return (...args: unknown[]) =>
        runWithConnectionRetry(async () => {
          const client = getPrismaClient();
          const activeDelegate = Reflect.get(client, modelKey) as object;
          const fn = Reflect.get(activeDelegate, prop) as (...args: unknown[]) => Promise<unknown>;
          return fn.apply(activeDelegate, args);
        });
    },
  });
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);

    if (typeof value === "function") {
      return (...args: unknown[]) =>
        runWithConnectionRetry(async () => {
          const active = getPrismaClient();
          const fn = Reflect.get(active, prop, receiver) as (...args: unknown[]) => Promise<unknown>;
          return fn.apply(active, args);
        });
    }

    if (value && typeof value === "object") {
      return wrapDelegate(value as object, prop);
    }

    return value;
  },
});
