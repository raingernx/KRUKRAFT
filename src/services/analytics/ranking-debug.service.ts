/**
 * Ranking Debug Service
 *
 * Provides the data behind the admin ranking observability page at
 * /admin/analytics/ranking.
 *
 * Design invariants:
 *   - Read-only. No writes, no mutations.
 *   - Never called from production marketplace paths — kept entirely
 *     separate from `findActivationRankedResources`.
 *   - Returns all score components so the page can render full
 *     breakdowns without any additional computation.
 */

import { prisma } from "@/lib/prisma";
import {
  findRankingDebugRows,
  type RankingDebugRow,
} from "@/repositories/resources/resource.repository";

export interface RankingDebugFilters {
  /** Category slug (from query param). */
  category?: string;
  search?: string;
  /** "free" | "paid" | undefined */
  price?: string;
}

export interface RankingDebugCategory {
  id: string;
  name: string;
  slug: string;
}

export interface RankingDebugReport {
  rows: RankingDebugRow[];
  categories: RankingDebugCategory[];
  /** Active filter values — echoed back for UI state. */
  filters: RankingDebugFilters;
  /** ISO timestamp for the "generated at" footer. */
  generatedAt: string;
  /** Maximum score in this result set — used for proportional bar widths. */
  maxScore: number;
}

export async function getRankingDebugReport(
  filters: RankingDebugFilters,
): Promise<RankingDebugReport> {
  const { category, search, price } = filters;

  // Resolve category slug → id (same pattern as loadMarketplaceResources)
  const categoryId =
    category && category !== "all"
      ? (
          await prisma.category.findUnique({
            where: { slug: category },
            select: { id: true },
          })
        )?.id
      : undefined;

  const isFreeFilter =
    price === "free" ? true : price === "paid" ? false : undefined;

  const [rows, categories] = await Promise.all([
    findRankingDebugRows({
      categoryId,
      search: search?.trim() || undefined,
      isFree: isFreeFilter,
      limit: 50,
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const maxScore = rows.length > 0 ? Math.max(...rows.map((r) => r.score)) : 1;

  return {
    rows,
    categories,
    filters,
    generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    maxScore,
  };
}
