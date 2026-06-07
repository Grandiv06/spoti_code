"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Globe, Github, Linkedin, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";

const EMPTY_PROFILE = {
  displayName: "",
  fullBiography: "",
  skills: [] as string[],
  socials: {
    linkedin: "",
    website: "",
    github: "",
    telegram: "",
  },
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(normalizeUrl(value));
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

export default function InstructorProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile, showToast } = useInstructorData();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState(EMPTY_PROFILE);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setForm({
      displayName: profile.displayName || profile.name || "",
      fullBiography: profile.fullBiography || "",
      skills: [...(profile.skills || [])],
      socials: {
        linkedin: profile.socials?.linkedin || "",
        website: profile.socials?.website || "",
        github: profile.socials?.github || "",
        telegram: profile.socials?.telegram || "",
      },
    });
  }, [profile]);

  const counts = useMemo(
    () => ({
      fullBiography: form.fullBiography.length,
      skills: form.skills.length,
    }),
    [form.fullBiography, form.skills]
  );

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    const next = form.skills.some((skill) => skill.toLowerCase() === value.toLowerCase()) ? form.skills : [...form.skills, value];
    setForm((prev) => ({ ...prev, skills: next }));
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill !== skillToRemove) }));
  };

  const updateSocial = (key: keyof typeof form.socials, value: string) => {
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
  };

  const handleSave = async () => {
    setError("");

    if (!form.displayName.trim() || !form.fullBiography.trim()) {
      setError("لطفاً فیلدهای اصلی پروفایل را کامل کنید.");
      return;
    }

    const socialErrors = [
      form.socials.linkedin && !isValidUrl(form.socials.linkedin) ? "لینک لینکدین معتبر نیست." : "",
      form.socials.website && !isValidUrl(form.socials.website) ? "لینک وب‌سایت معتبر نیست." : "",
      form.socials.github && !isValidUrl(form.socials.github) ? "لینک گیت‌هاب معتبر نیست." : "",
      form.socials.telegram && !isValidUrl(form.socials.telegram) ? "لینک تلگرام معتبر نیست." : "",
    ].filter(Boolean);

    if (socialErrors.length > 0) {
      setError(socialErrors[0]);
      return;
    }

    setSaving(true);
    try {
      updateProfile({
        ...profile,
        name: form.displayName.trim(),
        displayName: form.displayName.trim(),
        fullBiography: form.fullBiography.trim(),
        skills: Array.from(new Set(form.skills.map((skill) => skill.trim()).filter(Boolean))),
        socials: {
          linkedin: normalizeUrl(form.socials.linkedin),
          website: normalizeUrl(form.socials.website),
          github: normalizeUrl(form.socials.github),
          telegram: normalizeUrl(form.socials.telegram),
        },
      });
      router.push("/instructor/profile");
    } catch {
      setError("ذخیره تغییرات انجام نشد. دوباره تلاش کنید.");
      showToast("ذخیره پروفایل ناموفق بود.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-[calc(100vh-120px)] text-gray-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <button
            onClick={() => router.push("/instructor/profile")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </button>
          <div className="text-right">
            <p className="text-sm font-black text-white">تنظیمات پروفایل مدرس</p>
            <p className="text-xs text-gray-400">فقط اطلاعات عمومی نمایش داده‌شده در صفحه پروفایل عمومی</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-[2.25rem] border border-white/10 bg-[#10131a] p-5 md:p-8">
            <CardTitle title="اطلاعات اصلی" description="نام نمایشی، عنوان تخصصی و معرفی کوتاه" />

            <Field label="نام نمایشی استاد">
              <input
                value={form.displayName}
                onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                placeholder="مثلاً استاد رضایی"
              />
            </Field>

            <Field label="بیوگرافی کامل">
              <textarea
                value={form.fullBiography}
                onChange={(e) => setForm((prev) => ({ ...prev, fullBiography: e.target.value }))}
                rows={12}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-right text-sm leading-8 text-white outline-none transition-all placeholder:text-gray-500 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-y"
                placeholder="بیوگرافی کامل و طولانی مدرس را اینجا بنویسید..."
              />
              <div className="mt-2 text-left text-[11px] font-bold text-gray-400">{counts.fullBiography} کاراکتر</div>
            </Field>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <CardTitle title="مهارت‌ها و تخصص‌ها" description="افزودن و حذف مهارت‌ها به‌صورت چیپ" />
              <div className="mb-4 flex flex-wrap gap-2">
                {form.skills.length > 0 ? (
                  form.skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:border-primary/40 hover:bg-primary/15"
                    >
                      {skill}
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">هنوز مهارتی ثبت نشده است.</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  placeholder="مثلاً CSS، Flexbox، Figma"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white transition-colors hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-[11px] font-bold text-gray-400">{counts.skills} مهارت ثبت شده است</p>
            </section>

            <section className="rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <CardTitle title="لینک‌های اجتماعی" description="فقط لینک‌های معتبر و عمومی را ذخیره کنید" />
              <div className="space-y-4">
                <SocialField
                  icon={<Linkedin className="h-4 w-4" />}
                  label="لینک لینکدین"
                  value={form.socials.linkedin}
                  onChange={(value) => updateSocial("linkedin", value)}
                  placeholder="https://linkedin.com/in/username"
                />
                <SocialField
                  icon={<Globe className="h-4 w-4" />}
                  label="لینک وب‌سایت شخصی"
                  value={form.socials.website}
                  onChange={(value) => updateSocial("website", value)}
                  placeholder="https://example.com"
                />
                <SocialField
                  icon={<Github className="h-4 w-4" />}
                  label="لینک گیت‌هاب"
                  value={form.socials.github}
                  onChange={(value) => updateSocial("github", value)}
                  placeholder="https://github.com/username"
                />
                <SocialField
                  icon={<Send className="h-4 w-4" />}
                  label="لینک تلگرام"
                  value={form.socials.telegram}
                  onChange={(value) => updateSocial("telegram", value)}
                  placeholder="https://t.me/username"
                />
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-emerald-500/20 bg-emerald-500/5 p-5 md:p-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                پیش‌نمایش رفتار صفحه عمومی
              </div>
              <ul className="space-y-2 text-sm leading-7 text-gray-300">
                <li>نام، عنوان، معرفی کوتاه و بیوگرافی کامل در صفحه عمومی بروزرسانی می‌شود.</li>
                <li>لینک‌های خالی نمایش داده نمی‌شوند.</li>
                <li>چیپ‌های مهارت با همان استایل تیره صفحه عمومی نمایش داده می‌شوند.</li>
              </ul>
            </section>

            <div className="space-y-3">
              {error && <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">{error}</p>}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-[1.4rem] px-5 py-4 text-sm font-black text-white transition-colors",
                  saving ? "bg-primary/70" : "bg-primary hover:bg-primary-hover"
                )}
              >
                <Check className="h-4 w-4" />
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/instructor/profile")}
                className="w-full rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-gray-200 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                انصراف
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CardTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <p className="mt-1 text-xs leading-6 text-gray-400">{description}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-gray-200">{label}</span>
      {children}
    </label>
  );
}

function SocialField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-200">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span>
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}
