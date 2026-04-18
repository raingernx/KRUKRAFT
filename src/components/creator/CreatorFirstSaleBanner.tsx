import { PartyPopper, TrendingUp } from "@/lib/icons";

interface CreatorFirstSaleBannerProps {
  totalSales: number;
}

/**
 * Celebratory banner shown when a creator has made their first 1–5 sales.
 * Disappears naturally once totalSales exceeds 5 — no dismissal state needed.
 */
export function CreatorFirstSaleBanner({ totalSales }: CreatorFirstSaleBannerProps) {
  if (totalSales < 1 || totalSales > 5) return null;

  const isFirstSale = totalSales === 1;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-5">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          {isFirstSale ? (
            <PartyPopper className="h-5 w-5 text-emerald-600" aria-hidden />
          ) : (
            <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden />
          )}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-900">
            {isFirstSale
              ? "Your first sale is in — well done."
              : `The momentum is building — ${totalSales} sales so far.`}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            {isFirstSale
              ? "A real buyer chose your resource. That's the hardest step. Keep your listing sharp and let it compound."
              : "Each sale adds social proof and search signal. Consistent listing quality is the fastest way to keep this going."}
          </p>
        </div>
      </div>
    </div>
  );
}
