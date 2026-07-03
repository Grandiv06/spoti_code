import { NextRequest } from "next/server";
import { handleMockApiRoute } from "@/lib/api-mock-handler";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function routeHandler(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  return handleMockApiRoute(request, path);
}

export const GET = routeHandler;
export const POST = routeHandler;
export const PUT = routeHandler;
export const PATCH = routeHandler;
export const DELETE = routeHandler;
