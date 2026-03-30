import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { deleteHero, HeroServiceError } from "@/services/heroes/hero.service";

type Params = {
  params: Promise<{ id: string }>;
};

function handleError(error: unknown) {
  if (error instanceof HeroServiceError) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  console.error("[ADMIN_HERO_DELETE]", error);
  return NextResponse.json(
    { error: "Internal server error." },
    { status: 500 },
  );
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return auth.res;
  }

  try {
    const { id } = await params;
    await deleteHero(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
