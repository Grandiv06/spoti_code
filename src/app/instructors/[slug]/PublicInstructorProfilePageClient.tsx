"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import CourseCard from "@/app/components/CourseCard";
import { SkeletonBox } from "@/components/ui/Skeleton";
import { usePublicInstructorProfile } from "@/hooks/api/usePublicInstructorProfile";
import {
  Award,
  BadgeCheck,
  Clock3,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MessageCircle,
  School,
  Users,
} from "lucide-react";

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:shadow-none"
    >
      <span className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1.5 rounded-full bg-primary shadow-[0_0_18px_rgba(34,197,94,0.5)]" />
        <h2 className="text-xl font-black text-text-main md:text-2xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-text-muted">{description}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="h-full rounded-[1.75rem] border border-gray-200/70 bg-white/95 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white md:p-7 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_18px_50px_-34px_rgba(0,0,0,0.45)] dark:hover:bg-white/[0.05]">
      <h3 className="mb-3 text-sm font-black text-primary">{title}</h3>
      <p className="text-sm leading-8 text-text-main text-justify md:text-right">{text}</p>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.28a2 2 0 0 1 2.11-.45c.85.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function HeroStat({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-gray-200/80 bg-gray-50/90 p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)] dark:hover:bg-white/[0.055]">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-black">{label}</span>
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

function InstructorProfileSkeleton() {
  return (
    <div
      className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-hidden"
      dir="rtl"
    >
      <div className="mesh-bg" />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <section className="overflow-hidden rounded-[2.75rem] border border-gray-200/80 bg-white p-8 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.12)] md:p-12 dark:border-white/10 dark:bg-[#10131a] dark:shadow-[0_28px_90px_-28px_rgba(0,0,0,0.68)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SkeletonBox className="mx-auto h-72 w-72 md:h-[24rem] md:w-[24rem]" rounded="rounded-[2.3rem]" />
            <div className="space-y-6">
              <SkeletonBox className="h-8 w-40" rounded="rounded-full" />
              <SkeletonBox className="h-14 w-full max-w-lg" rounded="rounded-2xl" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBox key={index} className="h-28" rounded="rounded-[1.75rem]" />
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="mt-8 space-y-8">
          <SkeletonBox className="h-72" rounded="rounded-[2.25rem]" />
          <SkeletonBox className="h-96" rounded="rounded-[2.25rem]" />
        </div>
      </main>
    </div>
  );
}

export default function PublicInstructorProfilePageClient({ slug }: { slug: string }) {
  const { data: profile, isLoading, isError, error } = usePublicInstructorProfile(slug);

  if (isLoading) {
    return <InstructorProfileSkeleton />;
  }

  if (isError) {
    const isNotFound =
      error.message.includes("404") || error.message.toLowerCase().includes("not found");

    if (isNotFound) {
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center px-6">
          <div className="max-w-xl rounded-[2rem] border border-gray-200/80 bg-white/90 backdrop-blur-xl p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">پروفایل استاد پیدا نشد</h1>
            <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium">
              برای اسلاگ <span className="font-black text-primary">{slug}</span> استادی در API پیدا نشد.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] border border-gray-200/80 bg-white/90 backdrop-blur-xl p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">خطا در دریافت پروفایل</h1>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium">
            دریافت اطلاعات استاد از بکند با خطا مواجه شد. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <InstructorProfileSkeleton />;
  }

  const { instructor, courses, stats, labels } = profile;
  const socialLinks = [
    instructor.socials?.github
      ? { href: instructor.socials.github, label: labels.social.github, icon: <Github className="h-4 w-4" /> }
      : null,
    instructor.socials?.linkedin
      ? { href: instructor.socials.linkedin, label: labels.social.linkedin, icon: <Linkedin className="h-4 w-4" /> }
      : null,
    instructor.socials?.telegram
      ? { href: instructor.socials.telegram, label: labels.social.telegram, icon: <MessageCircle className="h-4 w-4" /> }
      : null,
    instructor.socials?.website
      ? { href: instructor.socials.website, label: labels.social.website, icon: <Globe className="h-4 w-4" /> }
      : null,
    instructor.socials?.email && instructor.publicVisibility?.email
      ? { href: `mailto:${instructor.socials.email}`, label: labels.social.email, icon: <Mail className="h-4 w-4" /> }
      : null,
    instructor.socials?.phone && instructor.publicVisibility?.phone
      ? { href: `tel:${instructor.socials.phone}`, label: labels.social.phone, icon: <PhoneIcon /> }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: ReactNode }>;

  return (
    <div
      className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-hidden"
      dir="rtl"
    >
      <div className="mesh-bg" />
      <div className="fixed top-24 right-12 h-72 w-72 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
      <div className="fixed bottom-24 left-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <section className="overflow-hidden rounded-[2.75rem] border border-gray-200/80 bg-white shadow-[0_28px_90px_-28px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#10131a] dark:shadow-[0_28px_90px_-28px_rgba(0,0,0,0.68)]">
          <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.06),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.65),_transparent_40%)] opacity-100 dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_40%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute -inset-5 rounded-[2.6rem] bg-primary/20 blur-3xl" />
                  <div className="absolute -inset-1 rounded-[2.3rem] border border-primary/20 opacity-80" />
                  <div className="relative h-72 w-72 overflow-hidden rounded-[2.3rem] border border-gray-200/80 bg-gray-50 shadow-[0_24px_70px_-24px_rgba(34,197,94,0.35)] md:h-[24rem] md:w-[24rem] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_24px_70px_-24px_rgba(34,197,94,0.55)]">
                    <Image
                      src={instructor.avatar}
                      alt={instructor.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 right-6 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-[11px] font-black text-primary shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0e1117]/95">
                    {instructor.verified ? labels.hero.verifiedBadge : labels.hero.unverifiedBadge}
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  {labels.hero.profileBadge}
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-black leading-tight text-gray-900 md:text-5xl dark:text-white">
                    {instructor.fullName}
                  </h1>
                  {instructor.displayTitle ? (
                    <p className="text-sm font-bold text-primary md:text-base">{instructor.displayTitle}</p>
                  ) : null}
                </div>

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
                    label={labels.stats.teachingHours.label}
                    value={stats.totalTeachingHours.toLocaleString("fa-IR")}
                    description={labels.stats.teachingHours.description}
                  />
                  <HeroStat
                    icon={<School className="h-4 w-4" />}
                    label={labels.stats.courses.label}
                    value={stats.coursesCount.toLocaleString("fa-IR")}
                    description={labels.stats.courses.description}
                  />
                  <HeroStat
                    icon={<Users className="h-4 w-4" />}
                    label={labels.stats.students.label}
                    value={stats.studentsCount.toLocaleString("fa-IR")}
                    description={labels.stats.students.description}
                  />
                  <HeroStat
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label={labels.stats.member.label}
                    value={labels.stats.member.value ?? ""}
                    description={labels.stats.member.description}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {(instructor.fullBiography || instructor.skills.length > 0) && (
            <section className="glass-panel rounded-[2.25rem] border border-gray-200/80 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.08)] md:p-8 dark:border-white/10 dark:shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)]">
              <SectionHeader
                title={labels.sections.about.title}
                description={labels.sections.about.description}
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  {instructor.fullBiography ? (
                    <InfoCard title={labels.sections.about.biographyTitle} text={instructor.fullBiography} />
                  ) : null}
                </div>

                <div className="flex h-full flex-col rounded-[1.75rem] border border-gray-200/70 bg-white/90 p-5 md:p-6 dark:border-white/10 dark:bg-white/[0.03]">
                  <h3 className="mb-3 text-sm font-black text-text-main">{labels.sections.skills.title}</h3>
                  <p className="mb-5 text-xs leading-6 text-text-muted">{labels.sections.skills.description}</p>
                  <div className="flex min-h-[10rem] flex-wrap content-start gap-3">
                    {instructor.skills.length > 0 ? (
                      instructor.skills.map((skill) => (
                        <span
                          key={skill}
                          className="group inline-flex items-center rounded-full border border-primary/15 bg-gradient-to-b from-primary/12 to-primary/8 px-4 py-2.5 text-sm font-bold text-primary shadow-[0_10px_30px_-18px_rgba(34,197,94,0.6)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/15"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 dark:border-white/10 dark:bg-white/[0.03]">
                        {labels.sections.skills.empty}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="glass-panel rounded-[2.25rem] border border-gray-200/80 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.08)] md:p-8 dark:border-white/10 dark:shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)]">
            <SectionHeader
              title={labels.sections.courses.title}
              description={labels.sections.courses.description}
            />
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <div key={course.id} className="h-full">
                    <CourseCard
                      id={course.id}
                      slug={course.slug}
                      title={course.title}
                      instructor={instructor.fullName}
                      instructorImg={instructor.avatar}
                      image={course.image}
                      hours={course.duration.replace(/\s*ساعت$/, "").trim() || course.duration}
                      students={course.studentsCount}
                      price={course.discountPrice ?? course.price}
                      viewHref={`/courses/${course.slug}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 dark:border-white/10 dark:bg-white/[0.03]">
                {labels.sections.courses.empty}
              </div>
            )}
          </section>

          {instructor.certificates.length > 0 ? (
            <section className="glass-panel rounded-[2.25rem] border border-gray-200/80 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.08)] md:p-8 dark:border-white/10 dark:shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)]">
              <SectionHeader
                title={labels.sections.certificates.title}
                description={labels.sections.certificates.description}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {instructor.certificates.map((item) => (
                  <div
                    key={`${item.title}-${item.date}`}
                    className="group rounded-[1.75rem] border border-gray-200/80 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-gray-50/80 dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.05]"
                  >
                    <div className="mb-4 flex items-center gap-3 text-primary">
                      <Award className="h-5 w-5" />
                      <span className="text-sm font-black">{labels.sections.certificates.badge}</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm font-bold text-primary">{item.issuer}</p>
                    <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">{item.date}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gray-700 transition-colors hover:text-primary dark:text-gray-200"
                      >
                        {labels.sections.certificates.viewLink}
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {instructor.projects.length > 0 ? (
            <section className="glass-panel rounded-[2.25rem] border border-gray-200/80 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.08)] md:p-8 dark:border-white/10 dark:shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)]">
              <SectionHeader
                title={labels.sections.projects.title}
                description={labels.sections.projects.description}
              />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {instructor.projects.map((project) => (
                  <article
                    key={project.title}
                    className="group overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-gray-50/80 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.045]"
                  >
                    {project.image ? (
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </div>
                    ) : null}
                    <div className="space-y-4 p-5">
                      <h3 className="text-base font-black text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:border-primary/20 hover:text-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-transparent dark:text-gray-200"
                          >
                            <Github className="h-4 w-4" />
                            {labels.sections.projects.github}
                          </a>
                        ) : null}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-transparent dark:text-gray-200"
                          >
                            <Globe className="h-4 w-4" />
                            {labels.sections.projects.live}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
