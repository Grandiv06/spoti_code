import type { UpsertProfileDto } from "@/types/api-dtos";
import type { ProfileSettings } from "@/context/ProfileSettingsContext";
import { unwrapResponse } from "@/lib/admin-tickets";
import { apiGetNoMock, apiPutNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

function parseSkills(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // fall through to comma-separated parsing
      }
    }
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function pickString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function normalizeProfileUrl(value: string): string {
  const trimmed = value.trim().replace(/^\/+/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(normalizeProfileUrl(value));
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

export type ProfileSocialField = "githubUrl" | "linkedinUrl" | "telegramUrl" | "websiteUrl";

const SOCIAL_HINTS: Record<ProfileSocialField, string> = {
  githubUrl: "لینک گیت‌هاب باید با https://github.com/ شروع شود.",
  linkedinUrl: "لینک لینکدین باید شامل linkedin.com باشد.",
  telegramUrl: "لینک تلگرام باید شامل t.me یا telegram.me باشد.",
  websiteUrl: "آدرس وب‌سایت باید یک URL معتبر باشد (مثلاً https://example.com).",
};

export function validateSocialLink(
  field: ProfileSocialField,
  value: string
): { valid: boolean; hint: string; normalized: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: true, hint: "", normalized: "" };
  }

  if (!isValidHttpUrl(trimmed)) {
    return { valid: false, hint: SOCIAL_HINTS[field], normalized: "" };
  }

  const normalized = normalizeProfileUrl(trimmed);
  const host = new URL(normalized).hostname.toLowerCase();

  if (field === "githubUrl" && !host.includes("github.com")) {
    return { valid: false, hint: SOCIAL_HINTS.githubUrl, normalized: "" };
  }
  if (field === "linkedinUrl" && !host.includes("linkedin.com")) {
    return { valid: false, hint: SOCIAL_HINTS.linkedinUrl, normalized: "" };
  }
  if (field === "telegramUrl" && !/(^|\.)t\.me$|telegram\.(me|org)/.test(host)) {
    return { valid: false, hint: SOCIAL_HINTS.telegramUrl, normalized: "" };
  }

  return { valid: true, hint: "", normalized };
}

export function validateProfileSocials(settings: ProfileSettings): Partial<Record<ProfileSocialField, string>> {
  const errors: Partial<Record<ProfileSocialField, string>> = {};
  const fields: ProfileSocialField[] = ["githubUrl", "linkedinUrl", "telegramUrl", "websiteUrl"];

  for (const field of fields) {
    const result = validateSocialLink(field, settings[field]);
    if (!result.valid) {
      errors[field] = result.hint;
    }
  }

  return errors;
}

export function normalizeProfileSocials(settings: ProfileSettings): ProfileSettings {
  return {
    ...settings,
    githubUrl: validateSocialLink("githubUrl", settings.githubUrl).normalized,
    linkedinUrl: validateSocialLink("linkedinUrl", settings.linkedinUrl).normalized,
    telegramUrl: validateSocialLink("telegramUrl", settings.telegramUrl).normalized,
    websiteUrl: validateSocialLink("websiteUrl", settings.websiteUrl).normalized,
  };
}

export function getProfileSocialLinks(settings: Partial<ProfileSettings>) {
  const github = validateSocialLink("githubUrl", settings.githubUrl ?? "").normalized;
  const linkedin = validateSocialLink("linkedinUrl", settings.linkedinUrl ?? "").normalized;
  const telegram = validateSocialLink("telegramUrl", settings.telegramUrl ?? "").normalized;
  const website = validateSocialLink("websiteUrl", settings.websiteUrl ?? "").normalized;

  return { github, linkedin, telegram, website };
}

export function mapProfileResponseToSettings(value: unknown): Partial<ProfileSettings> {
  const payload = unwrapResponse(value);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const row = payload as Record<string, unknown>;
  const skills = parseSkills(row.skills ?? row.capabilities);

  return {
    displayName: pickString(row, ["displayName", "occupation", "fullName", "name"]),
    bio: pickString(row, ["about", "bio"]),
    location: pickString(row, ["location"]),
    githubUrl: pickString(row, ["githubLink", "githubUrl"]),
    linkedinUrl: pickString(row, ["linkedinLink", "linkedinUrl"]),
    telegramUrl: pickString(row, ["contacts", "telegramUrl", "telegramLink"]),
    websiteUrl: pickString(row, ["personalWebsiteLink", "websiteUrl", "websiteLink"]),
    mbti: pickString(row, ["mbtiType", "mbti"]),
    skills,
    avatarImage: pickString(row, ["image", "avatar", "avatarImage"]),
    role: pickString(row, ["role", "roleLabel"]),
    joinDate: pickString(row, ["joinDate", "memberSince"]),
  } as Partial<ProfileSettings> & { role?: string; joinDate?: string };
}

export function buildUpsertProfilePayload(settings: ProfileSettings): UpsertProfileDto {
  const normalized = normalizeProfileSocials(settings);

  const optionalFields: UpsertProfileDto = {
    occupation: settings.displayName.trim() || undefined,
    about: settings.bio.trim() || undefined,
    skills: settings.skills.length ? settings.skills.join(", ") : undefined,
    location: settings.location.trim() || undefined,
    image: settings.avatarImage?.trim() || undefined,
  };

  const filteredOptional = Object.fromEntries(
    Object.entries(optionalFields).filter(([, value]) => value !== undefined && value !== "")
  ) as UpsertProfileDto;

  return {
    ...filteredOptional,
    githubLink: normalized.githubUrl,
    linkedinLink: normalized.linkedinUrl,
    personalWebsiteLink: normalized.websiteUrl,
    contacts: normalized.telegramUrl,
  };
}

export async function fetchMyProfile(): Promise<Partial<ProfileSettings>> {
  const response = await apiGetNoMock<unknown>("/api/profiles/me", getAuthHeaders());
  return mapProfileResponseToSettings(response);
}

export async function updateMyProfile(settings: ProfileSettings): Promise<Partial<ProfileSettings>> {
  const normalizedSettings = normalizeProfileSocials(settings);
  const response = await apiPutNoMock<unknown>(
    "/api/profiles/me",
    buildUpsertProfilePayload(normalizedSettings),
    getAuthHeaders()
  );
  const mapped = mapProfileResponseToSettings(response);
  return {
    ...mapped,
    displayName: normalizedSettings.displayName.trim() || mapped.displayName,
    githubUrl: normalizedSettings.githubUrl,
    linkedinUrl: normalizedSettings.linkedinUrl,
    telegramUrl: normalizedSettings.telegramUrl,
    websiteUrl: normalizedSettings.websiteUrl,
  };
}
