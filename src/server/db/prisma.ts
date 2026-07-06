import { PrismaClient } from "@prisma/client";

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

function createPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(databaseUrl
      ? {
          datasources: {
            db: { url: databaseUrl },
          },
        }
      : {}),
  });
}

function isPrismaClientCurrent(client: PrismaClient) {
  return (
    typeof client.discountCode?.findMany === "function" &&
    typeof client.userSession?.deleteMany === "function"
  );
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
