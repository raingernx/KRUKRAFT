const baseUrl =
  process.env.WARM_BASE_URL?.trim() ||
  process.env.NEXTAUTH_URL?.trim();

const secret = process.env.PERFORMANCE_WARM_SECRET?.trim();

if (!baseUrl) {
  console.error(
    "[warm-public-cache] Missing base URL. Set WARM_BASE_URL or NEXTAUTH_URL.",
  );
  process.exit(1);
}

if (!secret) {
  console.error(
    "[warm-public-cache] Missing PERFORMANCE_WARM_SECRET.",
  );
  process.exit(1);
}

async function main() {
  const url = new URL("/api/internal/performance/warm", baseUrl);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("[warm-public-cache] Request failed", {
      status: response.status,
      payload,
    });
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        url: url.toString(),
        payload,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("[warm-public-cache] Unexpected error", error);
  process.exit(1);
});
