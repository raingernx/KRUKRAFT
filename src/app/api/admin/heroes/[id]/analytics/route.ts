import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getHeroAnalytics, HeroServiceError } from "@/services/heroes/hero.service";

type Params = {
  params: Promise<{ id: string }>;
};

function handleError(error: unknown) {
  if (error instanceof HeroServiceError) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  console.error("[ADMIN_HERO_ANALYTICS_GET]", error);
  return NextResponse.json(
    { error: "Internal server error." },
    { status: 500 },
  );
}

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return auth.res;
  }

  try {
    const { id } = await params;
    const analytics = await getHeroAnalytics(id);
    return NextResponse.json(analytics);
  } catch (error) {
    return handleError(error);
  }
}
