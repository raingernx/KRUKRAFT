import { handleResourceDownload } from "@/services/purchases";

type RouteContext = {
  params: Promise<{ resourceId: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
  const { resourceId } = await params;
  return handleResourceDownload(req, resourceId);
}
