import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAuthUser } from "@/server/auth/request-auth";
import { saveTicketAttachmentFile } from "@/server/services/ticket-media.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthUser(request);
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "فایل ارسال نشده است" }, { status: 400 });
    }

    const data = await saveTicketAttachmentFile({ userId: user.id, file });
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "خطا در آپلود فایل";
    const status = message.includes("حجم") || message.includes("فرمت") ? 400 : 500;
    if (status === 500) console.error("[POST /api/tickets/my/attachments]", error);
    return NextResponse.json({ message }, { status });
  }
}
