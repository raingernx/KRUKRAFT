import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import {
  createAdminTag,
  getAdminTagsPageData,
} from "@/services/admin";

// ── Schemas ───────────────────────────────────────────────────────────────────

const CreateTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

// ── GET /api/admin/tags ───────────────────────────────────────────────────────

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  try {
    const tags = await getAdminTagsPageData();
    return NextResponse.json({ data: tags });
  } catch (err) {
    console.error("[ADMIN_TAGS_GET]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ── POST /api/admin/tags ──────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  try {
    const body   = await req.json();
    const parsed = CreateTagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const result = await createAdminTag(parsed.data.name);
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status ?? 409 }
      );
    }

    return NextResponse.json({ data: result.tag }, { status: 201 });
  } catch (err) {
    console.error("[ADMIN_TAGS_POST]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
