import { NextRequest, NextResponse } from "next/server";
import { getMockApiResponse } from "@/lib/mock-api";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

async function readRequestBody(request: NextRequest): Promise<unknown> {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "DELETE") {
    return undefined;
  }

  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function handleMockApiRoute(
  request: NextRequest,
  pathSegments: string[] = []
): Promise<NextResponse> {
  const pathname = `/api/${pathSegments.join("/")}`;
  const search = request.nextUrl.search;
  const fullPath = search ? `${pathname}${search}` : pathname;
  const method = request.method.toLowerCase() as HttpMethod;
  const body = await readRequestBody(request);

  const mockResponse = getMockApiResponse({ method, path: fullPath, body });
  if (mockResponse === undefined) {
    return NextResponse.json({ message: "مسیر یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(mockResponse);
}
