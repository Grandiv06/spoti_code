const GENERIC_USER_NAMES = new Set([
  "کاربر تست",
  "کاربر اسپاتی‌کد",
  "مدرس تست",
  "ادمین تست",
]);

type ResolveUserDisplayNameInput = {
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  profile?: {
    occupation?: string | null;
  } | null;
};

function readText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function isGenericUserDisplayName(value: string | null | undefined) {
  const trimmed = readText(value);
  return !trimmed || GENERIC_USER_NAMES.has(trimmed);
}

export function resolveUserDisplayName(input: ResolveUserDisplayNameInput): string {
  const occupation = readText(input.profile?.occupation);
  if (occupation && !isGenericUserDisplayName(occupation)) {
    return occupation;
  }

  const fullName = readText(input.fullName);
  if (fullName && !isGenericUserDisplayName(fullName)) {
    return fullName;
  }

  const email = readText(input.email);
  if (email) {
    const localPart = email.split("@")[0]?.trim();
    if (localPart) return localPart;
  }

  const phone = readText(input.phone);
  if (phone) return phone;

  return "کاربر اسپاتی‌کد";
}
