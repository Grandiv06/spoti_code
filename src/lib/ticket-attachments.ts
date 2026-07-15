import { apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

export type TicketAttachment = {
  name: string;
  url: string;
  size: number;
  type: string;
};

const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadTicketAttachment(file: File): Promise<TicketAttachment> {
  if (file.size > MAX_BYTES) {
    throw new Error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await apiPostNoMock<{ data?: TicketAttachment; message?: string }>(
    "/api/tickets/my/attachments",
    formData,
    getAuthHeaders()
  );

  if (!response?.data?.url) {
    throw new Error(response?.message || "آپلود فایل انجام نشد");
  }

  return response.data;
}
