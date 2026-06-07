import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import CourseCard from "@/app/components/CourseCard";
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
  Star,
  Users,
} from "lucide-react";
import {
  getCoursesForInstructor,
  getInstructorStats,
  getPublicInstructorBySlug,
  getPublicInstructorSlugs,
} from "@/lib/public-instructors";

export function generateStaticParams() {
  return getPublicInstructorSlugs().map((slug) => ({ slug }));
}

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
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
    >
      <span className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export default async function PublicInstructorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getPublicInstructorBySlug(slug);

  if (!instructor) notFound();

  const courses = getCoursesForInstructor(instructor.slug);
  const stats = getInstructorStats(instructor.slug);
  const socialLinks = [
    instructor.socials?.github
      ? {
          href: instructor.socials.github,
          label: "گیت‌هاب",
          icon: <Github className="h-4 w-4" />,
        }
      : null,
    instructor.socials?.linkedin
      ? {
          href: instructor.socials.linkedin,
          label: "لینکدین",
          icon: <Linkedin className="h-4 w-4" />,
        }
      : null,
    instructor.socials?.telegram
      ? {
          href: instructor.socials.telegram,
          label: "تلگرام",
          icon: <MessageCircle className="h-4 w-4" />,
        }
      : null,
    instructor.socials?.website
      ? {
          href: instructor.socials.website,
          label: "وب‌سایت شخصی",
          icon: <Globe className="h-4 w-4" />,
        }
      : null,
    instructor.socials?.email && instructor.publicVisibility?.email
      ? {
          href: `mailto:${instructor.socials.email}`,
          label: "ایمیل عمومی",
          icon: <Mail className="h-4 w-4" />,
        }
      : null,
    instructor.socials?.phone && instructor.publicVisibility?.phone
      ? {
          href: `tel:${instructor.socials.phone}`,
          label: "شماره تماس",
          icon: <PhoneIcon />,
        }
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
                      src={instructor.avatar}
                      alt={instructor.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 right-6 rounded-full border border-white/10 bg-[#0e1117]/95 px-4 py-2 text-[11px] font-black text-primary shadow-xl backdrop-blur">
                    {instructor.verified ? "مدرس تاییدشده اسپاتی‌کد" : "مدرس اسپاتی‌کد"}
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
                    {instructor.fullName}
                  </h1>
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
                    label="ساعت آموزش"
                    value="۲۴"
                    description="ساعت محتوای آموزشی"
                  />
                  <HeroStat
                    icon={<School className="h-4 w-4" />}
                    label="دوره‌ها"
                    value={stats.coursesCount.toLocaleString("fa-IR")}
                    description="دوره فعال"
                  />
                  <HeroStat
                    icon={<Users className="h-4 w-4" />}
                    label="دانشجوها"
                    value={stats.studentsCount.toLocaleString("fa-IR")}
                    description="نفر"
                  />
                  <HeroStat
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="مدرس اسپاتی‌کد"
                    value="تایید شده"
                    description="عضو تیم آموزشی"
                  />
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {(instructor.fullBiography ||
            instructor.teachingStyle ||
            instructor.professionalBackground ||
            instructor.skills.length > 0) && (
            <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
              <SectionHeader
                title="درباره استاد و مهارت‌ها"
                description="نگاهی کامل‌تر به مسیر حرفه‌ای، شیوه انتقال تجربه و تخصص‌های اصلی"
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  {instructor.fullBiography && (
                    <InfoCard title="بیوگرافی کامل" text={instructor.fullBiography} />
                  )}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {instructor.teachingStyle && (
                      <InfoCard title="سبک تدریس" text={instructor.teachingStyle} />
                    )}
                    {instructor.professionalBackground && (
                      <InfoCard title="پیشینه حرفه‌ای" text={instructor.professionalBackground} />
                    )}
                  </div>
                </div>

                <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <h3 className="mb-3 text-sm font-black text-white">مهارت‌ها و تخصص‌ها</h3>
                  <p className="mb-5 text-xs leading-6 text-gray-400">
                    فناوری‌ها و حوزه‌هایی که این استاد به‌صورت تخصصی روی آن‌ها کار کرده است
                  </p>
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
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <div key={course.id} className="h-full">
                    <CourseCard
                      title={course.title}
                      instructor={instructor.fullName}
                      instructorImg={instructor.avatar}
                      image={course.image}
                      hours={course.duration.replace(/\s*ساعت$/, "").trim() || course.duration}
                      students={course.studentsCount}
                      price={course.discountPrice ?? course.price}
                      viewHref={`/courses/${course.id}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs font-bold text-gray-500">
                هنوز دوره‌ای برای نمایش ثبت نشده است.
              </div>
            )}
          </section>

          {instructor.certificates && instructor.certificates.length > 0 && (
            <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
              <SectionHeader
                title="گواهی‌ها و دستاوردها"
                description="اعتبارنامه‌ها، دوره‌های تخصصی و دستاوردهایی که مسیر حرفه‌ای استاد را پشتیبانی می‌کنند"
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {instructor.certificates.map((item) => (
                  <div
                    key={`${item.title}-${item.date}`}
                    className="group rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.05]"
                  >
                    <div className="mb-4 flex items-center gap-3 text-primary">
                      <Award className="h-5 w-5" />
                      <span className="text-sm font-black">گواهی تخصصی</span>
                    </div>
                    <h3 className="text-base font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm font-bold text-primary">{item.issuer}</p>
                    <p className="mt-1 text-xs font-bold text-gray-400">{item.date}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gray-200 transition-colors hover:text-primary"
                      >
                        مشاهده مرجع
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {instructor.projects && instructor.projects.length > 0 && (
            <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
              <SectionHeader
                title="پروژه‌ها و نمونه‌کارها"
                description="چند نمونه از پروژه‌هایی که نگاه فنی و تجربه اجرایی این استاد را نشان می‌دهد"
              />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {instructor.projects.map((project) => (
                  <article
                    key={project.title}
                    className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.045]"
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
                      <h3 className="text-base font-black text-white">{project.title}</h3>
                      <p className="text-sm leading-7 text-gray-300">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-gray-300 transition-colors hover:border-primary/20 hover:text-primary"
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
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
                          >
                            <Github className="h-4 w-4" />
                            گیت‌هاب
                          </a>
                        ) : null}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
                          >
                            <Globe className="h-4 w-4" />
                            نسخه آنلاین
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {instructor.reviews && instructor.reviews.length > 0 && (
            <section className="glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.7)] md:p-8">
              <SectionHeader
                title="نظرات دانشجویان"
                description="بازخورد هنرجویانی که تجربه آموزش با این استاد را داشته‌اند"
              />
              <div className="grid grid-cols-1 gap-4">
                {instructor.reviews.map((review) => (
                  <div
                    key={`${review.studentName}-${review.date}`}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-primary/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-base font-black text-white">{review.studentName}</h3>
                        <p className="mt-1 text-sm font-bold text-primary">{review.relatedCourse}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < review.rating ? "fill-primary" : "text-white/15"}`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-xs font-bold text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1.5 rounded-full bg-primary shadow-[0_0_18px_rgba(34,197,94,0.5)]" />
        <h2 className="text-xl font-black text-white md:text-2xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-gray-400">{description}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="h-full rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.045] to-white/[0.03] p-6 md:p-7 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/[0.05]">
      <h3 className="mb-3 text-sm font-black text-primary">{title}</h3>
      <p className="text-sm leading-8 text-gray-200/90">{text}</p>
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
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/[0.055]">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-black">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-gray-400">{description}</p>
    </div>
  );
}
