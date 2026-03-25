const baseUrlArg = process.argv[2]?.trim();
const baseUrl =
  process.env.BASE_URL?.trim() ||
  process.env.WARM_BASE_URL?.trim() ||
  process.env.NEXTAUTH_URL?.trim() ||
  baseUrlArg;

const hotSlug =
  process.env.HOT_SLUG?.trim() ||
  "middle-school-science-quiz-assessment-set";

const timeoutMs = 5000;
const userAgent = "KruCraft-Warmup/1.0";

if (!baseUrl) {
  console.error(
    "[warm-cache] Missing base URL. Set BASE_URL or pass it as the first CLI argument.",
  );
  process.exit(1);
}

type WarmRoute = {
  label: string;
  path: string;
};

const routes: WarmRoute[] = [
  {
    label: "resources-home",
    path: "/resources",
  },
  {
    label: "listing-recommended",
    path: "/resources?category=all&sort=recommended",
  },
  {
    label: "listing-newest",
    path: "/resources?category=all&sort=newest",
  },
  {
    label: "resource-detail-hot",
    path: `/resources/${encodeURIComponent(hotSlug)}`,
  },
];

type WarmResult = {
  label: string;
  url: string;
  ok: boolean;
  status: number | null;
  elapsedMs: number;
  error?: string;
};

async function warmRoute(route: WarmRoute): Promise<WarmResult> {
  const url = new URL(route.path, baseUrl);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": userAgent,
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    return {
      label: route.label,
      url: url.toString(),
      ok: response.ok,
      status: response.status,
      elapsedMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      label: route.label,
      url: url.toString(),
      ok: false,
      status: null,
      elapsedMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log(
    `[warm-cache] Starting public cache warm-up against ${baseUrl} (${routes.length} routes)`,
  );

  const results: WarmResult[] = [];

  for (const route of routes) {
    console.log(`[warm-cache] Warming ${route.label}: ${route.path}`);
    const result = await warmRoute(route);
    results.push(result);

    if (result.ok) {
      console.log(
        `[warm-cache] OK ${result.status} ${result.label} ${result.elapsedMs}ms`,
      );
    } else {
      console.warn(
        `[warm-cache] FAIL ${result.status ?? "ERR"} ${result.label} ${result.elapsedMs}ms${result.error ? ` ${result.error}` : ""}`,
      );
    }
  }

  const successCount = results.filter((result) => result.ok).length;
  const failureCount = results.length - successCount;

  console.log(
    `[warm-cache] Completed: ${successCount} succeeded, ${failureCount} failed`,
  );

  if (successCount === 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[warm-cache] Unexpected error", error);
  process.exit(1);
});

export {};
