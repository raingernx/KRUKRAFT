import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { HeroServiceError, updateHero } from "@/services/heroes";

const ToggleHeroSchema = z.object({
  isActive: z.boolean(),
});

type Params = {
  params: Promise<{ id: string }>;
};

function handleError(error: unknown) {
  if (error instanceof HeroServiceError) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  console.error("[ADMIN_HERO_TOGGLE_PATCH]", error);
  return NextResponse.json(
    { error: "Internal server error." },
    { status: 500 },
  );
}

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return auth.res;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = ToggleHeroSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        fields: {
          isActive: parsed.error.flatten().fieldErrors.isActive?.[0] ?? "isActive is required.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const { id } = await params;
    const hero = await updateHero(id, {
      isActive: parsed.data.isActive,
    });

    return NextResponse.json({ hero });
  } catch (error) {
    return handleError(error);
  }
}
