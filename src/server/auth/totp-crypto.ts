import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_SALT = "spoticode-totp-v1";
const RECOVERY_CODE_COUNT = 10;

function getEncryptionKey(): Buffer {
  const secret =
    process.env.TOTP_ENCRYPTION_KEY?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "spoticode-totp-fallback-key";
  return scryptSync(secret, KEY_SALT, 32);
}

export function encryptSecret(plainText: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptSecret(payload: string): string {
  const [ivPart, tagPart, dataPart] = payload.split(":");
  if (!ivPart || !tagPart || !dataPart) {
    throw new Error("داده رمزنگاری‌شده نامعتبر است");
  }
  const key = getEncryptionKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivPart, "base64"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

function normalizeRecoveryCode(code: string): string {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

function hashRecoveryCode(code: string): string {
  return createHash("sha256").update(normalizeRecoveryCode(code)).digest("hex");
}

export function generateRecoveryCodes(): { plain: string[]; hashed: string[] } {
  const plain: string[] = [];
  const hashed: string[] = [];

  for (let index = 0; index < RECOVERY_CODE_COUNT; index += 1) {
    const raw = randomBytes(5).toString("hex").toUpperCase();
    const formatted = `${raw.slice(0, 5)}-${raw.slice(5, 10)}`;
    plain.push(formatted);
    hashed.push(hashRecoveryCode(formatted));
  }

  return { plain, hashed };
}

export function serializeRecoveryCodes(hashed: string[]): string {
  return JSON.stringify(hashed);
}

export function parseRecoveryCodes(serialized: string | null | undefined): string[] {
  if (!serialized) return [];
  try {
    const parsed = JSON.parse(serialized) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Returns the remaining recovery-code hashes if the provided code matched one of
 * them (with that code consumed), or null when no recovery code matched.
 */
export function consumeRecoveryCode(
  code: string,
  serialized: string | null | undefined
): string[] | null {
  const hashes = parseRecoveryCodes(serialized);
  if (hashes.length === 0) return null;

  const candidate = hashRecoveryCode(code);
  const candidateBuffer = Buffer.from(candidate, "hex");

  const matchIndex = hashes.findIndex((stored) => {
    const storedBuffer = Buffer.from(stored, "hex");
    return (
      storedBuffer.length === candidateBuffer.length &&
      timingSafeEqual(storedBuffer, candidateBuffer)
    );
  });

  if (matchIndex === -1) return null;
  return hashes.filter((_, index) => index !== matchIndex);
}
