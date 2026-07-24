"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { fetchMyProfile, fetchMyProfileUsername, updateMyProfile, validateProfileSocials, type ProfileSocialField } from "@/lib/panel-profile";
import { cn } from "@/lib/utils";
import { SocialButton } from "@/components/social/SocialButton";
import { ArrowRight, User, Camera, AtSign } from "lucide-react";
import Image from "next/image";

import { SkillSelect } from "@/components/social/SkillSelect";

const FRONTEND_SKILLS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React.js", "Next.js", 
  "Vue.js", "Nuxt.js", "Angular", "Redux", "Zustand", "Tailwind CSS", 
  "Bootstrap", "SASS", "Framer Motion", "Three.js", "React Native", 
  "Flutter", "Svelte", "Figma"
];

const BACKEND_SKILLS = [
  "Node.js", "Express.js", "NestJS", "Python", "Django", "FastAPI", 
  "Flask", "PHP", "Laravel", "Java", "Spring Boot", "C#", ".NET", 
  "Go", "Ruby on Rails", "PostgreSQL", "MySQL", "MongoDB", "Redis", 
  "GraphQL", "REST API", "Docker", "Kubernetes", "Microservices"
];

function ProfileEditContent() {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const { settings, updateSettings, hydrateSettings } = useProfileSettings();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [socialErrors, setSocialErrors] = useState<Partial<Record<ProfileSocialField, string>>>({});
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  /** Snapshot of persisted values after last successful load/save — used for dirty check. */
  const savedSnapshotRef = useRef<{ settings: typeof settings; username: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const [profile, existingUsername] = await Promise.all([
          fetchMyProfile(),
          fetchMyProfileUsername(),
        ]);
        if (!cancelled) {
          hydrateSettings(profile);
          const initialUsername = existingUsername ?? "";
          setUsername(initialUsername);
          savedSnapshotRef.current = {
            settings: { ...settings, ...profile },
            username: initialUsername,
          };
        }
      } catch {
        if (!cancelled) {
          hydrateSettings({
            displayName: authUser?.displayName?.trim() || "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authUser?.displayName, hydrateSettings, isAuthenticated]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      updateSettings({ avatarImage: result });
    };
    reader.readAsDataURL(file);
  };

  const updateSkillsByCategory = (categorySkills: string[], newSelected: string[]) => {
    // Keep skills that are NOT in this category, and add the new selection
    const otherSkills = settings.skills.filter(s => !categorySkills.includes(s));
    updateSettings({ skills: [...otherSkills, ...newSelected] });
  };

  const validateUsername = (value: string): string => {
    if (!value.trim()) return ""; // optional
    if (value.length < 3) return "آیدی باید حداقل ۳ کاراکتر باشد.";
    if (value.length > 30) return "آیدی نمیتواند بیشتر از ۳۰ کاراکتر باشد.";
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "فقط حروف انگلیسی، اعداد، _ و - مجاز است.";
    return "";
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  if (!isAuthenticated) return null;

  const handleSaveProfile = async () => {
    setSaveError("");

    // Validate username
    const uError = validateUsername(username);
    if (uError) {
      setUsernameError(uError);
      setSaveError("لطفاً آیدی پروفایل را اصلاح کنید.");
      return;
    }

    const socialValidationErrors = validateProfileSocials(settings);
    if (Object.keys(socialValidationErrors).length > 0) {
      setSocialErrors(socialValidationErrors);
      setSaveError("لطفاً لینک‌های شبکه‌های اجتماعی را اصلاح کنید.");
      return;
    }

    setSocialErrors({});
    setSaving(true);
    try {
      const savedProfile = await updateMyProfile({ ...settings, username: username.trim() || undefined });
      hydrateSettings(savedProfile);
      savedSnapshotRef.current = { settings: { ...settings, ...savedProfile }, username: username.trim() };
      router.push("/panel/profile");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("آیدی") || message.includes("username")) {
        setUsernameError(message);
        setSaveError(message);
      } else {
        setSaveError(message || "ذخیره تغییرات انجام نشد. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isDirty = (() => {
    const snap = savedSnapshotRef.current;
    if (!snap || loading) return false;
    if (username.trim() !== snap.username) return true;
    const s = settings;
    const p = snap.settings;
    return (
      s.displayName !== p.displayName ||
      s.bio !== p.bio ||
      s.location !== p.location ||
      s.githubUrl !== p.githubUrl ||
      s.linkedinUrl !== p.linkedinUrl ||
      s.telegramUrl !== p.telegramUrl ||
      s.websiteUrl !== p.websiteUrl ||
      s.mbti !== p.mbti ||
      s.avatarImage !== p.avatarImage ||
      s.bannerImage !== p.bannerImage ||
      s.bannerColor !== p.bannerColor ||
      s.useDefaultBanner !== p.useDefaultBanner ||
      JSON.stringify(s.skills) !== JSON.stringify(p.skills)
    );
  })();

  const updateSocialField = (field: ProfileSocialField, value: string) => {
    setSocialErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    updateSettings({ [field]: value });
  };

  const socialInputClass = (field: ProfileSocialField) =>
    cn(
      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
      socialErrors[field]
        ? "border-red-400 dark:border-red-500/50 focus:border-red-400 focus:ring-red-500/20"
        : "border-gray-200 dark:border-white/[0.08]"
    );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-primary transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">بازگشت</span>
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">تنظیمات پروفایل</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نام نمایشی</label>
                <input
                  id="displayName"
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => updateSettings({ displayName: e.target.value })}
                  placeholder="نام شما"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <AtSign className="w-4 h-4 text-green-500" />
                    آیدی پروفایل
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    dir="ltr"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="مثال: ali_dev"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                      usernameError
                        ? "border-red-400 dark:border-red-500/50 focus:border-red-400 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-white/[0.08]"
                    )}
                  />
                </div>
                {usernameError ? (
                  <p className="mt-2 text-xs font-bold text-red-500">{usernameError}</p>
                ) : (
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    این آیدی در لینک عمومی پروفایل شما استفاده میشه. فقط حروف انگلیسی، اعداد، _ و - مجاز است.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">درباره من</label>
                <textarea
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => updateSettings({ bio: e.target.value })}
                  placeholder="چند خط درباره خودتان بنویسید..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                <h3 className="text-sm font-black text-gray-900 dark:text-white">مهارت‌های تخصصی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SkillSelect
                    label="مهارت‌های فرانت‌-اند"
                    options={FRONTEND_SKILLS}
                    selectedSkills={settings.skills.filter(s => FRONTEND_SKILLS.includes(s))}
                    onChange={(newSkills) => updateSkillsByCategory(FRONTEND_SKILLS, newSkills)}
                    placeholder="جستجو در فرانت‌-اند..."
                    iconColor="bg-blue-500"
                  />
                  <SkillSelect
                    label="مهارت‌های بک‌-اند"
                    options={BACKEND_SKILLS}
                    selectedSkills={settings.skills.filter(s => BACKEND_SKILLS.includes(s))}
                    onChange={(newSkills) => updateSkillsByCategory(BACKEND_SKILLS, newSkills)}
                    placeholder="جستجو در بک‌-اند..."
                    iconColor="bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm">
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">شبکه‌های اجتماعی</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">لینک گیت‌هاب</label>
                  <input
                    id="githubUrl"
                    type="url"
                    value={settings.githubUrl}
                    onChange={(e) => updateSocialField("githubUrl", e.target.value)}
                    placeholder="https://github.com/username"
                    className={socialInputClass("githubUrl")}
                  />
                  {socialErrors.githubUrl && (
                    <p className="mt-2 text-xs font-bold text-red-500">{socialErrors.githubUrl}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">لینک لینکدین</label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    value={settings.linkedinUrl}
                    onChange={(e) => updateSocialField("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className={socialInputClass("linkedinUrl")}
                  />
                  {socialErrors.linkedinUrl && (
                    <p className="mt-2 text-xs font-bold text-red-500">{socialErrors.linkedinUrl}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="telegramUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">لینک تلگرام</label>
                  <input
                    id="telegramUrl"
                    type="url"
                    value={settings.telegramUrl}
                    onChange={(e) => updateSocialField("telegramUrl", e.target.value)}
                    placeholder="https://t.me/username"
                    className={socialInputClass("telegramUrl")}
                  />
                  {socialErrors.telegramUrl && (
                    <p className="mt-2 text-xs font-bold text-red-500">{socialErrors.telegramUrl}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">وب‌سایت شخصی</label>
                  <input
                    id="websiteUrl"
                    type="url"
                    value={settings.websiteUrl}
                    onChange={(e) => updateSocialField("websiteUrl", e.target.value)}
                    placeholder="https://example.com"
                    className={socialInputClass("websiteUrl")}
                  />
                  {socialErrors.websiteUrl && (
                    <p className="mt-2 text-xs font-bold text-red-500">{socialErrors.websiteUrl}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm p-6 text-center">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">تصویر پروفایل</label>
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#14161c] overflow-hidden shadow-xl bg-gray-100 dark:bg-white/5 mx-auto">
                {settings.avatarImage ? (
                  <Image src={settings.avatarImage} alt="آواتار" width={128} height={128} className="object-cover w-full h-full" />
                ) : (
                  <User className="w-full h-full p-6 text-gray-300" />
                )}
              </div>
              <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full border-4 border-white dark:border-[#1c1e26] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            <p className="text-xs text-gray-500 mt-4">تصویر با فرمت JPG، PNG یا WEBP</p>
          </div>

          <div className="space-y-3 pt-4">
            {saveError && <p className="text-sm font-bold text-red-500 text-center">{saveError}</p>}
            {(isDirty || saving) && (
              <SocialButton
                variant="primary"
                className="w-full py-4 text-base font-black shadow-lg shadow-green-500/20"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </SocialButton>
            )}
            <button onClick={() => router.back()} className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">انصراف و بازگشت</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PanelProfileEditPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-12 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileEditContent />
    </Suspense>
  );
}
