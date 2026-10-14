import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      coursesCount,
      distinctStudents,
      sumStudentsCount,
      sumDurationHours,
      ratingAgg,
      recentReviews,
    ] = await Promise.all([
      prisma.course.count({
        where: { status: "published" },
      }),
      prisma.courseEnrollment.groupBy({
        by: ["userId"],
      }),
      prisma.course.aggregate({
        where: { status: "published" },
        _sum: { studentsCount: true },
      }),
      prisma.course.aggregate({
        where: { status: "published" },
        _sum: { durationHours: true },
      }),
      prisma.comment.aggregate({
        where: {
          parentId: null,
          rating: { not: null, gt: 0 },
          approvalStatus: { in: ["approved", "pending"] },
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.comment.findMany({
        where: {
          parentId: null,
          rating: { not: null, gt: 0 },
          approvalStatus: { in: ["approved", "pending"] },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          rating: true,
          authorId: true,
          authorName: true,
          authorAvatar: true,
          createdAt: true,
          course: {
            select: { title: true },
          },
        },
      }),
    ]);

    const enrolledStudentsCount = distinctStudents.length;
    const aggregatedStudentsCount = sumStudentsCount._sum.studentsCount ?? 0;
    const totalStudents = Math.max(enrolledStudentsCount, aggregatedStudentsCount);
    const totalDurationHours = sumDurationHours._sum.durationHours ?? 0;

    // Calculate rating and reviews count
    const reviewsCount = ratingAgg._count.rating ?? 0;
    const averageRating =
      ratingAgg._avg.rating !== null && ratingAgg._avg.rating !== undefined
        ? Number(ratingAgg._avg.rating.toFixed(1))
        : 5.0;

    // Collect distinct reviewers
    const seenAuthorKeys = new Set<string>();
    const reviewers: Array<{
      id: string;
      userId?: string | null;
      name: string;
      avatar: string;
      rating?: number | null;
      courseTitle?: string | null;
    }> = [];

    for (const rev of recentReviews) {
      const key = rev.authorId || rev.authorName;
      if (!seenAuthorKeys.has(key)) {
        seenAuthorKeys.add(key);
        reviewers.push({
          id: rev.id,
          userId: rev.authorId,
          name: rev.authorName,
          avatar: rev.authorAvatar || "/images/student1.jpg",
          rating: rev.rating,
          courseTitle: rev.course?.title ?? null,
        });
      }
      if (reviewers.length >= 3) break;
    }

    // Enhance reviewers with latest user profile data (e.g. latest uploaded avatar)
    const authorUserIds = reviewers
      .map((r) => r.userId)
      .filter((id): id is string => Boolean(id));

    if (authorUserIds.length > 0) {
      const profiles = await prisma.userProfile.findMany({
        where: { userId: { in: authorUserIds } },
        select: {
          userId: true,
          image: true,
          user: {
            select: {
              fullName: true,
            },
          },
        },
      });

      const profileMap = new Map(profiles.map((p) => [p.userId, p]));
      for (const rev of reviewers) {
        if (rev.userId && profileMap.has(rev.userId)) {
          const profile = profileMap.get(rev.userId)!;
          if (profile.image?.trim()) {
            rev.avatar = profile.image.trim();
          }
          if (profile.user?.fullName?.trim()) {
            rev.name = profile.user.fullName.trim();
          }
        }
      }
    }

    // If fewer than 3 reviewers exist, supplement with real users who have profiles/images
    if (reviewers.length < 3) {
      const needed = 3 - reviewers.length;
      const additionalUsers = await prisma.user.findMany({
        where: {
          id: { notIn: authorUserIds },
        },
        include: {
          profile: true,
        },
        take: 15,
      });

      // Prefer users with an actual profile image
      additionalUsers.sort((a, b) => {
        const aHasImg = a.profile?.image ? 1 : 0;
        const bHasImg = b.profile?.image ? 1 : 0;
        return bHasImg - aHasImg;
      });

      for (const u of additionalUsers) {
        if (reviewers.length >= 3) break;
        reviewers.push({
          id: `usr-${u.id}`,
          userId: u.id,
          name: u.fullName || "کاربر اسپاتی‌کد",
          avatar: u.profile?.image?.trim() || "/images/student1.jpg",
          rating: 5,
        });
      }
    }

    return NextResponse.json(
      {
        coursesCount,
        studentsCount: totalStudents,
        durationHours: totalDurationHours,
        rating: averageRating,
        reviewsCount,
        reviewers: reviewers.slice(0, 3),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/stats/public]", error);
    return NextResponse.json(
      { message: "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}
