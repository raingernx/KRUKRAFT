import Link from "next/link";

import { Download, ExternalLink, Eye, FileText } from "@/lib/icons";
import { Badge, Button } from "@/design-system";
import type { DashboardLibraryItem } from "@/services/dashboard/library.service";
import { isPreviewSupported } from "@/lib/preview/previewPolicy";
import { routes } from "@/lib/routes";

function getDownloadedLabel(downloadedAt: Date) {
  const diffMs = Date.now() - downloadedAt.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));

  if (diffMinutes < 60) {
    return `Downloaded ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Downloaded ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 14) {
    return `Downloaded ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 9) {
    return `Downloaded ${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `Downloaded ${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `Downloaded ${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

export function DashboardLibraryResourceCard({
  item,
}: {
  item: DashboardLibraryItem;
}) {
  const resourceHref = routes.resource(item.slug);

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl rounded-b-none bg-muted">
        {item.previewUrl ? (
          <img
            src={item.previewUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--card)/0.8)]">
              <FileText className="h-6 w-6 text-muted-foreground/50" aria-hidden />
            </div>
          </div>
        )}

        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-primary/25 bg-primary/10 text-primary"
        >
          Owned
        </Badge>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="min-h-[2.75rem] line-clamp-2 text-base font-semibold leading-snug text-foreground">
            {item.title}
          </h3>
          <p className="line-clamp-1 min-h-[1.25rem] text-small text-muted-foreground">
            {item.authorName?.trim() || "Owned resource"}
          </p>
        </div>

        <div className="mt-auto space-y-3 border-t border-border-subtle pt-3">
          <p className="text-caption text-muted-foreground">
            {getDownloadedLabel(item.purchasedAt)}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild density="compact" className="flex-1 gap-1.5">
              <a href={`/api/download/${item.id}`}>
                <span className="inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  <span>Download</span>
                </span>
              </a>
            </Button>

            {isPreviewSupported(item.mimeType) ? (
              <Button asChild variant="quiet" density="compact" className="flex-1 gap-1.5">
                <a
                  href={`/api/preview/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    <span>Preview</span>
                  </span>
                </a>
              </Button>
            ) : null}

            <Button asChild variant="tertiary" density="compact" className="flex-1 gap-1.5">
              <Link href={resourceHref}>
                <span className="inline-flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  <span>Open</span>
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
