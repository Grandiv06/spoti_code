import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import CourseCard from "@/app/components/CourseCard";
import {
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

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-10 md:px-8 lg:px-12 lg:py-14">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#10131a] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)]">
          <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.05),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_36%)] opacity-90" />

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  {instructor.verified ? "مدرس تاییدشده اسپاتی‌کد" : "مدرس اسپاتی‌کد"}
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                    {instructor.fullName}
                  </h1>
                </div>

                <p className="mx-auto max-w-3xl text-sm leading-8 text-gray-400 md:text-base lg:mx-0">
                  {instructor.shortBio}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Clock3 className="h-4 w-4" />
                      <span className="text-[11px] font-black">ساعت آموزش</span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      ۲۴
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">ساعت محتوای آموزشی</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <School className="h-4 w-4" />
                      <span className="text-[11px] font-black">دوره‌ها</span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {stats.coursesCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">دوره فعال</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Users className="h-4 w-4" />
                      <span className="text-[11px] font-black">دانشجوها</span>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {stats.studentsCount.toLocaleString("fa-IR")}
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">نفر</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-right shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <BadgeCheck className="h-4 w-4" />
                      <span className="text-[11px] font-black">مدرس اسپاتی‌کد</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-gray-400">عضو تیم آموزشی اسپاتی‌کد</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 lg:items-end">
                <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_-24px_rgba(34,197,94,0.35)] md:h-72 md:w-72">
                  <Image
                    src={instructor.avatar}
                    alt={instructor.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {(instructor.fullBiography || instructor.teachingStyle || instructor.professionalBackground) && (
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="درباره استاد"
                  description="نگاهی کامل‌تر به مسیر حرفه‌ای و شیوه انتقال تجربه"
                />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {instructor.fullBiography && (
                    <div className="xl:col-span-2">
                      <InfoCard title="بیوگرافی کامل" text={instructor.fullBiography} />
                    </div>
                  )}
                  {instructor.teachingStyle && (
                    <InfoCard title="سبک تدریس" text={instructor.teachingStyle} />
                  )}
                  {instructor.professionalBackground && (
                    <InfoCard title="پیشینه حرفه‌ای" text={instructor.professionalBackground} />
                  )}
                </div>
              </section>
            )}

            {instructor.skills.length > 0 && (
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="مهارت‌ها و تخصص‌ها"
                  description="فناوری‌ها و حوزه‌هایی که این استاد به‌صورت تخصصی روی آن‌ها کار کرده است"
                />
                <div className="flex flex-wrap gap-3">
                  {instructor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {courses.length > 0 && (
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="دوره‌های این استاد"
                  description="همه دوره‌هایی که توسط این استاد منتشر یا تدریس شده‌اند"
                />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {courses.map((course) => (
                    <div key={course.id} className="mx-auto w-full max-w-[420px]">
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
              </section>
            )}

            {instructor.certificates && instructor.certificates.length > 0 && (
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="گواهی‌ها و دستاوردها"
                  description="اعتبارنامه‌ها، دوره‌های تخصصی و دستاوردهایی که مسیر حرفه‌ای استاد را پشتیبانی می‌کنند"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {instructor.certificates.map((item) => (
                    <div
                      key={`${item.title}-${item.date}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
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
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gray-200 hover:text-primary"
                        >
                          مشاهده مرجع
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {instructor.projects && instructor.projects.length > 0 && (
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="پروژه‌ها و نمونه‌کارها"
                  description="چند نمونه از پروژه‌هایی که نگاه فنی و تجربه اجرایی این استاد را نشان می‌دهد"
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {instructor.projects.map((project) => (
                    <article
                      key={project.title}
                      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]"
                    >
                      {project.image ? (
                        <div className="relative h-44">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="space-y-4 p-5">
                        <h3 className="text-base font-black text-white">{project.title}</h3>
                        <p className="text-sm leading-7 text-gray-300">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-gray-300"
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
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-200 hover:border-primary/30 hover:text-primary"
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
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-200 hover:border-primary/30 hover:text-primary"
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
              <section className="glass-panel rounded-[2rem] p-6 md:p-8">
                <SectionHeader
                  title="نظرات دانشجویان"
                  description="بازخورد هنرجویانی که تجربه آموزش با این استاد را داشته‌اند"
                />
                <div className="space-y-4">
                  {instructor.reviews.map((review) => (
                    <div
                      key={`${review.studentName}-${review.date}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
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

          {socialLinks.length > 0 && (
            <aside className="glass-panel h-fit rounded-[2rem] p-6 md:sticky md:top-28">
              <SectionHeader
                title="راه‌های ارتباطی"
                description="کانال‌های عمومی و حرفه‌ای برای آشنایی بیشتر با این استاد"
              />
              <div className="space-y-3">
                {socialLinks.map((item) => (
                  <SocialLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
                ))}
              </div>
            </aside>
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
