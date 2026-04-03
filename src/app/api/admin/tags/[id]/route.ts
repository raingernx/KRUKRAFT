import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import {
  deleteAdminTag,
  updateAdminTag,
} from "@/services/admin";

type Params = { params: Promise<{ id: string }> };

// ── Schema ────────────────────────────────────────────────────────────────────

const PatchTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

// ── PATCH /api/admin/tags/[id] ────────────────────────────────────────────────

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  try {
    const body   = await req.json();
    const parsed = PatchTagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const result = await updateAdminTag({ id, name: parsed.data.name });
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status ?? 409 }
      );
    }

    return NextResponse.json({ data: result.tag });
  } catch (err) {
    console.error("[ADMIN_TAGS_PATCH]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ── DELETE /api/admin/tags/[id] ───────────────────────────────────────────────

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  try {
    const result = await deleteAdminTag(id);
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status ?? 404 },
      );
    }

    return NextResponse.json({ data: { id } });
  } catch (err) {
    console.error("[ADMIN_TAGS_DELETE]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
