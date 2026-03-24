import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  Eye,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { PriceLabel } from "@/components/ui/PriceLabel";
import { BuyButton } from "@/components/resources/BuyButton";
import { formatFileSize, formatNumber } from "@/lib/format";
import { getPlatform } from "@/services/platform.service";
import { isPreviewSupported } from "@/lib/preview/previewPolicy";

const TYPE_LABELS: Record<string, string> = {
  PDF: "PDF",
  DOCUMENT: "Document",
};

const CTA_COPY = {
  free: {
    kicker: "Free to keep",
    proof: "No card needed. Add it to your library and download any time.",
  },
  paid: {
    kicker: "One-time purchase",
    proof: "Pay once. Yours forever — re-download any time, no subscription needed.",
  },
  owned: {
    kicker: "In your library",
    proof: "Your download is ready whenever you need it.",
  },
} as const;

function formatUpdated(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(d);
}

function getRecentActivityLabel(resource: PurchaseCardResource) {
  if ((resource.recentSales ?? 0) > 0) {
    return `${formatNumber(resource.recentSales ?? 0)} ${
      resource.recentSales === 1 ? "purchase" : "purchases"
    } in the last 30 days`;
  }

  if ((resource.recentDownloads ?? 0) > 0) {
    return `${formatNumber(resource.recentDownloads ?? 0)} downloads in the last 30 days`;
  }

  return null;
}

function getRecentActivityHeading(resource: PurchaseCardResource) {
  if ((resource.recentSales ?? 0) >= 5) {
    return "High demand this week";
  }

  if ((resource.recentDownloads ?? 0) >= 25) {
    return "Trending fast";
  }

  return "Recent activity";
}

export interface PurchaseCardResource {
  id: string;
  title: string;
  slug: string;
  price: number;
  isFree: boolean;
  type: string;
  downloadCount: number;
  author: { id: string; name: string | null };
  category: { id: string; name: string; slug: string } | null;
  /** MIME type of the primary file — used to decide whether to show a Preview CTA. */
  mimeType?: string | null;
  fileSize?: number | null;
  updatedAt?: Date | string | null;
  pageCount?: number | null;
  averageRating?: number | null;
  reviewCount?: number;
  salesCount?: number;
  recentDownloads?: number;
  recentSales?: number;
  levelLabel?: string | null;
  outcomeHint?: string | null;
  comparisonAnchor?: {
    label: string;
  } | null;
}

interface PurchaseCardProps {
  resource: PurchaseCardResource;
  isOwned: boolean;
  hasFile: boolean;
  session: { user?: { id?: string; subscriptionStatus?: string } } | null;
  /** True when the user has just returned from a successful payment. Used for visual emphasis only. */
  isReturningFromCheckout?: boolean;
}

export async function PurchaseCard({
  resource,
  isOwned,
  hasFile,
  session,
  isReturningFromCheckout = false,
}: PurchaseCardProps) {
  const platform = await getPlatform();
  const isFree = resource.isFree || resource.price === 0;
  const isMember =
    session?.user?.subscriptionStatus === "ACTIVE" ||
    session?.user?.subscriptionStatus === "TRIALING";
  const ctaCopy = isOwned ? CTA_COPY.owned : isFree ? CTA_COPY.free : CTA_COPY.paid;
  const hasReviews =
    typeof resource.averageRating === "number" && (resource.reviewCount ?? 0) > 0;
  const recentActivityLabel = getRecentActivityLabel(resource);
  const recentActivityHeading = getRecentActivityHeading(resource);
  const trustItems: Array<{
    label: string;
    value: string;
    meta: string;
    icon: ReactNode;
  }> = [
    hasReviews
      ? {
          label: "Rating",
          value: resource.averageRating!.toFixed(1),
          meta: `${formatNumber(resource.reviewCount ?? 0)} reviews`,
          icon: <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />,
        }
      : null,
    (resource.salesCount ?? 0) > 0
      ? {
          label: "Sales",
          value: formatNumber(resource.salesCount ?? 0),
          meta:
            resource.salesCount === 1
              ? "verified purchase"
              : "verified purchases",
          icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />,
        }
      : null,
    resource.downloadCount > 0
      ? {
          label: "Downloads",
          value: formatNumber(resource.downloadCount),
          meta: "library unlocks",
          icon: <Download className="h-3.5 w-3.5 text-zinc-500" />,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
  const summaryParts = [
    hasReviews ? `${resource.averageRating!.toFixed(1)}★` : null,
    resource.levelLabel ?? null,
    TYPE_LABELS[resource.type] ?? resource.type,
  ].filter(Boolean) as string[];
  const benefitItems = isOwned
    ? []
    : isFree
      ? ["No card needed", "Instant download", "Keep forever"]
      : ["Instant access", "One-time purchase", "Re-download any time"];

  return (
    <div className="flex h-full min-h-0 flex-col justify-between rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
      <div className="space-y-5">
        {(resource.author.name || resource.category) && (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-zinc-500">
            {resource.author.name ? `by ${resource.author.name}` : null}
            {resource.author.name && resource.category ? (
              <span aria-hidden className="text-zinc-300">·</span>
            ) : null}
            {resource.category ? (
              <span className="font-medium text-primary-700">
                {resource.category.name}
              </span>
            ) : null}
          </p>
        )}

        <div className="space-y-2.5">
          <span className="inline-flex items-center rounded-full border border-surface-200 bg-surface-50 px-2.5 py-1 text-caption font-semibold text-zinc-600">
            {ctaCopy.kicker}
          </span>
          <div className="space-y-1.5">
            <p className="text-3xl font-bold tracking-tight text-zinc-900">
              <PriceLabel price={resource.price} isFree={isFree} />
            </p>
            {!isOwned && (
              <p className="max-w-sm text-small leading-6 text-zinc-600">
                {ctaCopy.proof}
              </p>
            )}
            {isOwned && (
              <p className="max-w-sm text-small leading-6 text-zinc-600">
                {ctaCopy.proof}
              </p>
            )}
          </div>
          {summaryParts.length > 0 && (
            <p className="text-caption font-medium text-zinc-600">
              {summaryParts.join(" · ")}
            </p>
          )}
        </div>

        {trustItems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 border-y border-surface-200 py-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center gap-2 text-caption font-medium text-zinc-500">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <p className="text-lg font-semibold tracking-tight text-zinc-900">
                  {item.value}
                </p>
                <p className="text-caption text-zinc-500">{item.meta}</p>
              </div>
            ))}
          </div>
        )}

        {benefitItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-zinc-600">
            {benefitItems.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{item}</span>
                {index < benefitItems.length - 1 ? (
                  <span aria-hidden className="ml-1 text-zinc-300">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        )}

        {!isOwned && ((resource.salesCount ?? 0) >= 10 || resource.downloadCount >= 50) && (
          <p className="text-caption font-medium text-zinc-500">
            {(resource.salesCount ?? 0) >= 10
              ? `Used by ${formatNumber(resource.salesCount ?? 0)}+ teachers`
              : resource.category
                ? `Popular in ${resource.category.name}`
                : `${formatNumber(resource.downloadCount)}+ learners have this`}
          </p>
        )}

        {recentActivityLabel && !isOwned && (
          <div className="rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3">
            <p className="text-caption font-semibold text-primary-700/90">
              {recentActivityHeading}
            </p>
            <p className="mt-1 text-small font-medium text-primary-900">{recentActivityLabel}</p>
          </div>
        )}

        <div className="space-y-3 border-t border-surface-200 pt-4">
          {isOwned && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-small font-medium text-emerald-700">
                Added to your library
              </p>
            </div>
          )}

          {isOwned &&
            (hasFile ? (
              <div className="flex flex-col gap-2">
                <a
                  href={`/api/download/${resource.id}`}
                  className={[
                    "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-primary-700 ring-1 ring-primary-600/20 ring-offset-1",
                    isReturningFromCheckout
                      ? "ring-2 ring-emerald-400/60 ring-offset-2 animate-fade-in"
                      : "",
                  ].join(" ")}
                >
                  <Download className="h-4 w-4" />
                  Download instantly
                </a>
                {isPreviewSupported(resource.mimeType) && (
                  <a
                    href={`/api/preview/${resource.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-5 py-2.5 text-[13px] font-medium text-zinc-700 transition hover:bg-surface-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </a>
                )}
                <p className="text-center text-caption text-zinc-400">
                  Secure, authenticated download
                </p>
              </div>
            ) : (
              <p className="text-center text-caption text-zinc-400">
                File not yet available — check back soon.
              </p>
            ))}

          {!isOwned && isFree &&
            (session?.user ? (
              <BuyButton
                resourceId={resource.id}
                resourceHref={`/resources/${resource.slug}`}
                price={0}
                isFree={true}
                owned={false}
                hasFile={hasFile}
              />
            ) : (
              <Link
                href={`/auth/login?next=/resources/${resource.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-primary-700"
              >
                Sign in to Download
              </Link>
            ))}

          {!isOwned && !isFree &&
            (session?.user ? (
              <BuyButton
                resourceId={resource.id}
                resourceHref={`/resources/${resource.slug}`}
                price={resource.price / 100}
                isFree={false}
                owned={false}
                hasFile={hasFile}
              />
            ) : (
              <div className="space-y-3">
                <Link
                  href={`/auth/login?next=/resources/${resource.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-primary-700"
                >
                  Sign in to Buy
                </Link>
                <p className="text-center text-caption text-zinc-400">
                  Create a free account to purchase.
                </p>
              </div>
            ))}
        </div>

      </div>

      <div className="space-y-4 border-t border-surface-200 pt-4">
        <dl className="space-y-2.5 text-small">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Format</dt>
              <dd className="font-medium text-zinc-900">
                {TYPE_LABELS[resource.type] ?? resource.type}
              </dd>
            </div>
            {resource.pageCount != null && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Pages</dt>
                <dd className="font-medium text-zinc-900">
                  {formatNumber(resource.pageCount)}
                </dd>
              </div>
            )}
            {resource.fileSize != null && resource.fileSize > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">File size</dt>
                <dd className="font-medium text-zinc-900">
                  {formatFileSize(resource.fileSize)}
                </dd>
              </div>
            )}
            {resource.category && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Category</dt>
                <dd className="font-medium text-zinc-900">
                  {resource.category.name}
                </dd>
              </div>
            )}
            {hasReviews && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Rating</dt>
                <dd className="font-medium text-zinc-900">
                  {resource.averageRating!.toFixed(1)} / 5 (
                  {formatNumber(resource.reviewCount ?? 0)})
                </dd>
              </div>
            )}
            {(resource.salesCount ?? 0) > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Sales</dt>
                <dd className="font-medium text-zinc-900">
                  {formatNumber(resource.salesCount ?? 0)}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">Downloads</dt>
              <dd className="font-medium text-zinc-900">
                {formatNumber(resource.downloadCount)}
              </dd>
            </div>
            {resource.updatedAt != null && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Updated</dt>
                <dd className="font-medium text-zinc-900">
                  {formatUpdated(resource.updatedAt)}
                </dd>
              </div>
            )}
          </dl>

        <div className="space-y-2">
          {isMember ? (
            <p className="text-small font-medium text-emerald-700">
              Member pricing is already active on your account
            </p>
          ) : (
            <>
              <p className="text-small font-medium text-zinc-900">
                Save more with {platform.platformShortName} Plus
              </p>
              <p className="text-small leading-6 text-zinc-500">
                Members unlock discounted pricing and a faster path to repeat
                downloads.
              </p>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 text-small font-medium text-primary-700 transition hover:text-primary-800"
              >
                <Sparkles className="h-4 w-4" />
                Explore membership
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
