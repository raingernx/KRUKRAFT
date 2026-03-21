import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CreatorServiceError,
  approveCreatorApplication,
  rejectCreatorApplication,
} from "@/services/creator.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { action, reason } = await req.json().catch(() => ({}));
    const { userId } = await params;

    if (action === "approve") {
      await approveCreatorApplication(userId);
      return NextResponse.json({ ok: true });
    }

    if (action === "reject") {
      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
      }
      await rejectCreatorApplication(userId, reason.trim());
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
  } catch (error) {
    if (error instanceof CreatorServiceError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    console.error("[ADMIN_CREATORS_PATCH]", error);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
