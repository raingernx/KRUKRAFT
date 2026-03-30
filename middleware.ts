import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import {
  RANKING_EXPERIMENT_COOKIE,
  RANKING_EXPERIMENT_DURATION_DAYS,
  isValidRankingVariant,
  type RankingVariant,
} from "@/lib/ranking-experiment";
import { locales } from "@/i18n/config";

// ── Ranking experiment ────────────────────────────────────────────────────────

/**
 * Sets the `ranking_variant` cookie on the response if no valid variant is
 * already present on the request.
 *
 * Runs on every page navigation (the middleware matcher excludes /api, _next,
 * and static files). Cookie-writing here guarantees:
 *   - Assignment is stable: the same user always gets the same cookie value
 *     until it expires, regardless of authentication state.
 *   - No extra server roundtrip: cookie is piggy-backed on the normal page
 *     response — zero additional HTTP requests.
 *   - Both authenticated and anonymous users are enrolled.
 */
function assignRankingVariantIfAbsent(
  req: NextRequest,
  response: NextResponse,
): void {
  const current = req.cookies.get(RANKING_EXPERIMENT_COOKIE)?.value;
  if (isValidRankingVariant(current)) return; // already assigned — do nothing

  const assigned: RankingVariant = Math.random() < 0.5 ? "A" : "B";
  response.cookies.set(RANKING_EXPERIMENT_COOKIE, assigned, {
    maxAge: RANKING_EXPERIMENT_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

// ── Auth protection middleware (auth guard for dashboard + admin) ─────────────
const authMiddleware = withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Admin section — require ADMIN role
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export default function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl;

  const localePrefix = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  // ── Backwards-compat: redirect legacy locale-prefixed paths to flat routes ──
  if (localePrefix) {
    const url = req.nextUrl.clone();
    url.pathname =
      pathname === `/${localePrefix}`
        ? "/"
        : pathname.slice(localePrefix.length + 1);
    const response = NextResponse.redirect(url, { status: 301 });
    assignRankingVariantIfAbsent(req, response);
    return response;
  }

  // ── Apply auth guard on protected routes ────────────────────────────────
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    const response = (authMiddleware as any)(req) as NextResponse;
    assignRankingVariantIfAbsent(req, response);
    return response;
  }

  const response = NextResponse.next();
  assignRankingVariantIfAbsent(req, response);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
