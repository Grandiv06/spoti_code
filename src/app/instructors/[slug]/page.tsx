import type { Metadata } from "next";
import PublicInstructorProfilePageClient from "./PublicInstructorProfilePageClient";
import {
  getPublicInstructorProfile,
} from "@/server/services/instructor.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicInstructorProfile(slug);

  if (!profile) {
    return { title: "پروفایل استاد | اسپاتی‌کد" };
  }

  const instructor = profile.data.instructor;
  const description =
    instructor.shortBio ??
    instructor.mainExpertise ??
    `پروفایل رسمی ${instructor.fullName} در اسپاتی‌کد`;

  return {
    title: `${instructor.fullName} | اسپاتی‌کد`,
    description,
    openGraph: {
      title: instructor.fullName,
      description,
      images: instructor.avatar ? [{ url: instructor.avatar }] : undefined,
    },
  };
}

export default async function PublicInstructorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicInstructorProfilePageClient key={slug} slug={slug} />;
}
