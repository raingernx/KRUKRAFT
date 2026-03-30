import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false as const,
      session: null,
      res: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false as const,
      session: null,
      res: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    session,
    res: null,
  };
}
