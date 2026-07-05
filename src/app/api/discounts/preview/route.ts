import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { previewCartDiscount, buildCheckoutLineItems } from "@/server/services/discount.service";

export const dynamic = "force-dynamic";

type PreviewBody = {
  courseIds?: string[];
  discountCode?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request).catch(() => null);
    const body = (await request.json().catch(() => ({}))) as PreviewBody;
    const courseIds = Array.isArray(body.courseIds)
      ? [...new Set(body.courseIds.map((id) => String(id).trim()).filter(Boolean))]
      : [];

    if (courseIds.length === 0) {
      return NextResponse.json({
        data: {
          subtotal: 0,
          discountAmount: 0,
          total: 0,
          applied: null,
        },
      });
    }

    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        status: "published",
      },
      select: {
        id: true,
        price: true,
      },
    });

    const items = await buildCheckoutLineItems(
      courses.map((course) => ({ id: course.id, price: course.price }))
    );

    const preview = await previewCartDiscount(user, items, body.discountCode ?? null);

    return NextResponse.json({ data: preview });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("[POST /api/discounts/preview]", error);
    return NextResponse.json({ message: "خطا در محاسبه تخفیف" }, { status: 500 });
  }
}
