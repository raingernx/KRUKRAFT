import "server-only";

import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type AppUserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface AuthTokenSnapshot {
  authenticated: boolean;
  userId: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  role: AppUserRole | null;
  subscriptionStatus: string | null;
}

function getStringClaim(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toSnapshot(token: JWT | null): AuthTokenSnapshot {
  const userId = getStringClaim(token?.id) ?? getStringClaim(token?.sub);

  return {
    authenticated: Boolean(userId),
    userId,
    name: getStringClaim(token?.name),
    email: getStringClaim(token?.email),
    image:
      getStringClaim(token?.picture) ??
      getStringClaim((token as { image?: unknown } | null)?.image),
    role: getStringClaim(token?.role) as AppUserRole | null,
    subscriptionStatus: getStringClaim(token?.subscriptionStatus),
  };
}

export async function getAuthTokenSnapshot(
  req: NextRequest,
): Promise<AuthTokenSnapshot> {
  const token = await getToken({ req });
  return toSnapshot(token);
}
