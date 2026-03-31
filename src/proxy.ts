import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import {
  RANKING_EXPERIMENT_COOKIE,
  RANKING_EXPERIMENT_DURATION_DAYS,
  isValidRankingVariant,
  type RankingVariant,
} from "@/lib/ranking-experiment";
import { locales } from "@/i18n/config";

function assignRankingVariantIfAbsent(
  req: NextRequest,
  response: NextResponse,
): void {
  const current = req.cookies.get(RANKING_EXPERIMENT_COOKIE)?.value;
  if (isValidRankingVariant(current)) return;

  const assigned: RankingVariant = Math.random() < 0.5 ? "A" : "B";
  response.cookies.set(RANKING_EXPERIMENT_COOKIE, assigned, {
    maxAge: RANKING_EXPERIMENT_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

const authProxy = withAuth(
  function authProxy(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

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
  },
);

function isNextResponse(response: Response | null | void): response is NextResponse {
  return response instanceof NextResponse;
}

export async function proxy(
  req: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  const { pathname } = req.nextUrl;

  const localePrefix = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

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

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    const response = await authProxy(req, event);

    if (isNextResponse(response)) {
      assignRankingVariantIfAbsent(req, response);
      return response;
    }

    return response ?? NextResponse.next();
  }

  const response = NextResponse.next();
  assignRankingVariantIfAbsent(req, response);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default proxy;
