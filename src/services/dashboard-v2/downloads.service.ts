import { formatDate, formatFileSize } from "@/lib/format";
import { getUserDownloadHistory } from "@/services/purchases/purchase.service";

export interface DashboardV2DownloadItem {
  id: string;
  downloadedAt: Date;
  resource: {
    id: string;
    title: string;
    slug: string;
    previewUrl: string | null;
    fileSize: number | null;
    type: string;
    authorName: string | null;
  };
}

export interface DashboardV2DownloadsData {
  state: "ready" | "empty" | "error";
  count: number;
  visibleCount: number;
  latestDownloadLabel: string | null;
  downloads: DashboardV2DownloadItem[];
  errorTitle?: string;
  errorDescription?: string;
}

export function formatDashboardV2DownloadFileSize(bytes: number | null) {
  if (!bytes) {
    return "—";
  }

  return formatFileSize(bytes);
}

export async function getDashboardV2DownloadsData(input: {
  userId: string;
}): Promise<DashboardV2DownloadsData> {
  try {
    const downloads = await getUserDownloadHistory(input.userId);

    if (downloads.length === 0) {
      return {
        state: "empty",
        count: 0,
        visibleCount: 0,
        latestDownloadLabel: null,
        downloads: [],
      };
    }

    return {
      state: "ready",
      count: downloads.length,
      visibleCount: downloads.length,
      latestDownloadLabel: formatDate(downloads[0].createdAt),
      downloads: downloads.map((download) => ({
        id: download.id,
        downloadedAt: download.createdAt,
        resource: {
          id: download.resource.id,
          title: download.resource.title,
          slug: download.resource.slug,
          previewUrl: download.resource.previewUrl ?? null,
          fileSize: download.resource.fileSize ?? null,
          type: download.resource.type,
          authorName: download.resource.author?.name ?? null,
        },
      })),
    };
  } catch {
    return {
      state: "error",
      count: 0,
      visibleCount: 0,
      latestDownloadLabel: null,
      downloads: [],
      errorTitle: "Could not load downloads",
      errorDescription:
        "Try refreshing this page. Your download access still stays protected behind the download route.",
    };
  }
}
