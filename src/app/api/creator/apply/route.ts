import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreatorServiceError, submitCreatorApplication } from "@/services/creator.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    await submitCreatorApplication(session.user.id, body);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof CreatorServiceError) {
      return NextResponse.json(error.payload, { status: error.status });
    }
    console.error("[CREATOR_APPLY_POST]", error);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}
