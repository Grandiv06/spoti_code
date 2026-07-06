"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  BadgeCheck,
  Clock3,
  Github,
  Globe,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  School,
  SquareArrowOutUpRight,
  Users,
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import InstructorPublishStatusBanner from "@/app/instructor/profile/_components/InstructorPublishStatusBanner";

const inputFallbackAvatar = "/images/inst1.jpg";

export default function InstructorProfilePage() {
  const { profile, profileCourses } = useInstructorData();
  const skills = profile.skills ?? [];
  const fullBiography = profile.fullBiography ?? "";

  const publishedCourses = useMemo(
    () => profileCourses.filter((course) => course.status === "published"),
    [profileCourses]
  );

  const stats = useMemo(() => {
    const totalStudents = publishedCourses.reduce((sum, course) => sum + Number(course.studentsCount ?? 0), 0);

    return { publishedCourses: publishedCourses.length, totalStudents };
  }, [publishedCourses]);

  const socialLinks = [
    profile.socials?.linkedin
      ? { href: profile.socials.linkedin, label: "لینکدین", icon: <Linkedin className="h-4 w-4" /> }
      : null,
    profile.socials?.github
      ? { href: profile.socials.github, label: "گیت‌هاب", icon: <Github className="h-4 w-4" /> }
      : null,
    profile.socials?.telegram
      ? { href: profile.socials.telegram, label: "تلگرام", icon: <MessageCircle className="h-4 w-4" /> }
      : null,
    profile.socials?.website
      ? { href: profile.socials.website, label: "وب‌سایت شخصی", icon: <Globe className="h-4 w-4" /> }
      : null,
    profile.email
      ? { href: `mailto:${profile.email}`, label: "ایمیل", icon: <Mail className="h-4 w-4" /> }
      : null,
    profile.phone
      ? { href: `tel:${profile.phone}`, label: "شماره تماس", icon: <Phone className="h-4 w-4" /> }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: React.ReactNode }>;

  const aboutSections = [
    fullBiography ? { title: "بیوگرافی کامل", text: fullBiography } : null,
  ].filter(Boolean) as Array<{ title: string; text: string }>;

  return (
    <div dir="rtl" className="min-h-screen bg-background-dark text-text-dark">
      <div className="mesh-bg" />
      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <InstructorPublishStatusBanner canPublishWithoutApproval={profile.canPublishWithoutApproval} />

        <div className="mb-6 flex items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-gray-300">
            <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-white">پروفایل مدرس</p>
              <p className="text-xs text-gray-400">نمایش دقیق همان اطلاعات عمومی صفحه مدرس</p>
            </div>
          </div>

          <Link
            href="/instructor/profile/edit"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
          >
            ویرایش پروفایل
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#10131a] shadow-[0_28px_90px_-28px_rgba(0,0,0,0.68)]">
          <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_40%)] opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute -inset-5 rounded-[2.6rem] bg-primary/20 blur-3xl" />
                  <div className="absolute -inset-1 rounded-[2.3rem] border border-primary/20 opacity-80" />
                  <div className="relative h-72 w-72 overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.05] shadow-[0_24px_70px_-24px_rgba(34,197,94,0.55)] md:h-[24rem] md:w-[24rem]">
                    <Image
                      src={profile.avatar || inputFallbackAvatar}
                      alt={profile.displayName || profile.name || "استاد"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 right-6 rounded-full border border-white/10 bg-[#0e1117]/95 px-4 py-2 text-[11px] font-black text-primary shadow-xl backdrop-blur">
                    مدرس اسپاتی‌کد
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  پروفایل رسمی مدرس
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                    {profile.displayName || profile.name || "پروفایل مدرس"}
                  </h1>
                  <p className="text-lg font-bold text-gray-300 md:text-2xl">
                    {profile.headline || profile.specialty}
                  </p>
                </div>

                <p className="mx-auto max-w-3xl text-sm leading-8 text-gray-400 md:text-base lg:mx-0">
                  {fullBiography || profile.bio || "این مدرس هنوز معرفی کوتاه ثبت نکرده است."}
                </p>

                {socialLinks.length > 0 && (
                  <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-0">
                    {socialLinks.slice(0, 4).map((item) => (
                      <SocialLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <HeroStat
                    icon={<Clock3 className="h-4 w-4" />}
                    label="سال تجربه"
                    value={profile.yearsOfExperience || "۱۰+"}
                    description="سال فعالیت آموزشی"
                  />
                  <HeroStat
                    icon={<School className="h-4 w-4" />}
                    label="دوره‌ها"
                    value={stats.publishedCourses.toLocaleString("fa-IR")}
                    description="دوره فعال"
                  />
                  <HeroStat
                    icon={<Users className="h-4 w-4" />}
                    label="دانشجوها"
                    value={stats.totalStudents.toLocaleString("fa-IR")}
                    description="نفر"
                  />
                  <HeroStat
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="وضعیت"
                    value={profile.canPublishWithoutApproval ? "تاییدشده" : "نیاز به بررسی"}
                    description={
                      profile.canPublishWithoutApproval ? "مدرس تاییدشده اسپاتی‌کد" : "انتشار با تایید ادمین"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {(aboutSections.length > 0 || skills.length > 0) && (
            <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
              <SectionHeader
                title="درباره استاد و مهارت‌ها"
                description="نگاهی کامل‌تر به مسیر حرفه‌ای، شیوه انتقال تجربه و تخصص‌های اصلی"
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  {aboutSections.map((section) => (
                    <InfoCard key={section.title} title={section.title} text={section.text} />
                  ))}
                </div>

                <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <h3 className="mb-3 text-sm font-black text-white">مهارت‌ها و تخصص‌ها</h3>
                  <p className="mb-5 text-xs leading-6 text-gray-400">
                    فناوری‌ها و حوزه‌هایی که این استاد به‌صورت تخصصی روی آن‌ها کار کرده است
                  </p>
                  <div className="flex min-h-[10rem] flex-wrap content-start gap-3">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="group inline-flex items-center rounded-full border border-primary/15 bg-gradient-to-b from-primary/12 to-primary/8 px-4 py-2.5 text-sm font-bold text-primary shadow-[0_10px_30px_-18px_rgba(34,197,94,0.6)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/15"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs font-bold text-gray-500">
                        مهارتی برای نمایش ثبت نشده است.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
            <SectionHeader
              title="دوره‌های این استاد"
              description="همه دوره‌هایی که توسط این استاد منتشر یا تدریس شده‌اند"
            />
            {publishedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {publishedCourses.map((course) => (
                  <div key={course.id} className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-4 aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/5">
                      <Image
                        src={course.cover}
                        alt={course.title}
                        width={640}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-base font-black text-white">{course.title}</h3>
                      <p className="text-sm leading-7 text-gray-400">{course.shortDescription}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{course.level}</span>
                        <span>{course.studentsCount.toLocaleString("fa-IR")} دانشجو</span>
                      </div>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-emerald-300"
                      >
                        مشاهده دوره
                        <SquareArrowOutUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs font-bold text-gray-500">
                هنوز دوره‌ای برای نمایش ثبت نشده است.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
    >
      <span className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <SquareArrowOutUpRight className="h-4 w-4" />
    </a>
  );
}

function HeroStat({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-black">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-400">{description}</p>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 space-y-2">
      <h2 className="text-xl font-black text-white md:text-2xl">{title}</h2>
      <p className="text-sm leading-7 text-gray-400">{description}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
      <h3 className="mb-3 text-sm font-black text-primary">{title}</h3>
      <p className="text-sm leading-8 text-gray-300">{text}</p>
    </div>
  );
}
