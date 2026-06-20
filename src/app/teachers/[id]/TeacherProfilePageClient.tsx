"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, School, Users } from "lucide-react";
import CourseCard from "@/app/components/CourseCard";
import { SkeletonBox } from "@/components/ui/Skeleton";
import { API_BASE_URL } from "@/lib/api-config";
import { getPublicInstructorById } from "@/lib/public-instructors";

type PublicCourseItem = {
  id?: string;
  slug?: string;
  title?: string;
  price?: string | number;
  time?: string;
  difficulty?: string;
  studentsCount?: number;
  thumbnailFile?: { url?: string } | string;
  teacher?: {
    id?: string;
    fullName?: string;
    bio?: string;
  };
};

type TeacherProfile = {
  teacher: NonNullable<PublicCourseItem["teacher"]>;
  courses: PublicCourseItem[];
};

async function fetchTeacherProfile(teacherId: string): Promise<TeacherProfile | null> {
  const response = await fetch(`${API_BASE_URL}/api/courses/public?limit=100`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    data?: { items?: PublicCourseItem[] };
  };
  const items = payload.data?.items ?? [];
  const courses = items.filter((course) => course.teacher?.id === teacherId);
  const teacher = courses[0]?.teacher;

  if (!teacher?.fullName) return null;

  return { teacher, courses };
}

export default function TeacherProfilePageClient({ teacherId }: { teacherId: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const mockInstructor = getPublicInstructorById(teacherId);
    if (mockInstructor?.slug) {
      router.replace(`/instructors/${mockInstructor.slug}`);
      return;
    }

    let active = true;

    fetchTeacherProfile(teacherId)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setNotFound(true);
          setProfile(null);
          return;
        }
        setProfile(result);
        setNotFound(false);
      })
      .catch(() => {
        if (!active) return;
        setNotFound(true);
        setProfile(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [teacherId, router]);

  if (loading) {
    return (
      <div
        className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-hidden"
        dir="rtl"
      >
        <div className="mesh-bg" />
        <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
          <section className="overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#10131a] p-8 md:p-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <SkeletonBox className="mx-auto h-72 w-72 md:h-[24rem] md:w-[24rem]" rounded="rounded-[2.3rem]" />
              <div className="space-y-4">
                <SkeletonBox className="h-8 w-40" rounded="rounded-full" />
                <SkeletonBox className="h-14 w-full" rounded="rounded-2xl" />
                <SkeletonBox className="h-24 w-full" rounded="rounded-2xl" />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div
        className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex items-center justify-center px-6"
        dir="rtl"
      >
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">پروفایل استاد پیدا نشد</h1>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 font-medium mb-6">
            اطلاعات این استاد در دسترس نیست یا هنوز دوره‌ای منتشر نکرده است.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            بازگشت به دوره‌ها
          </Link>
        </div>
      </div>
    );
  }

  const { teacher, courses } = profile;
  const totalStudents = courses.reduce((sum, course) => sum + Number(course.studentsCount ?? 0), 0);

  return (
    <div
      className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen transition-colors duration-300 relative overflow-x-hidden"
      dir="rtl"
    >
      <div className="mesh-bg" />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 lg:py-12">
        <section className="overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#10131a] shadow-[0_28px_90px_-28px_rgba(0,0,0,0.68)]">
          <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_30%)]" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative h-72 w-72 overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.05] shadow-[0_24px_70px_-24px_rgba(34,197,94,0.55)] md:h-[24rem] md:w-[24rem]">
                  <Image
                    src="/images/inst1.jpg"
                    alt={teacher.fullName ?? "مدرس دوره"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  پروفایل رسمی مدرس
                </div>

                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {teacher.fullName}
                </h1>

                {teacher.bio ? (
                  <p className="mx-auto max-w-3xl text-sm leading-8 text-gray-400 md:text-base lg:mx-0">
                    {teacher.bio}
                  </p>
                ) : null}

                <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:grid-cols-2 lg:mx-0 lg:max-w-none">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-right">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <School className="h-4 w-4" />
                      <span className="text-xs font-bold text-gray-400">دوره‌ها</span>
                    </div>
                    <p className="text-2xl font-black text-white">{courses.length.toLocaleString("fa-IR")}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-right">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-bold text-gray-400">دانشجوها</span>
                    </div>
                    <p className="text-2xl font-black text-white">{totalStudents.toLocaleString("fa-IR")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {courses.length > 0 ? (
          <section className="mt-8 glass-panel rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">دوره‌های این استاد</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                همه دوره‌هایی که توسط این استاد منتشر شده‌اند
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => {
                const thumbnail =
                  typeof course.thumbnailFile === "string"
                    ? course.thumbnailFile
                    : course.thumbnailFile?.url ?? "/images/course3.jpg";
                const price = Number(course.price ?? 0);

                return (
                  <CourseCard
                    key={course.id ?? course.slug}
                    id={course.id}
                    slug={course.slug}
                    title={course.title ?? "دوره بدون عنوان"}
                    instructor={teacher.fullName ?? "مدرس دوره"}
                    image={thumbnail}
                    difficulty={course.difficulty}
                    hours={course.time ?? "۰"}
                    students={course.studentsCount}
                    price={Number.isFinite(price) ? price : 0}
                  />
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="mt-8 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors hover:border-primary/30 hover:text-primary"
          >
            بازگشت به لیست دوره‌ها
          </Link>
        </div>
      </main>
    </div>
  );
}
