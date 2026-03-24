const PERFORMANCE_DEBUG_LOGS_ENABLED = process.env.PERFORMANCE_DEBUG_LOGS === "1";

type PerformanceDetails = Record<string, unknown>;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function logPerformanceEvent(
  event: string,
  details: PerformanceDetails = {},
) {
  if (!PERFORMANCE_DEBUG_LOGS_ENABLED) {
    return;
  }

  console.info(`[PERF] ${event}`, details);
}

export async function withPerformanceTiming<T>(
  event: string,
  details: PerformanceDetails,
  work: () => Promise<T>,
) {
  const startedAt = Date.now();
  logPerformanceEvent(`${event}:start`, details);

  try {
    const result = await work();
    logPerformanceEvent(`${event}:done`, {
      ...details,
      elapsedMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logPerformanceEvent(`${event}:fail`, {
      ...details,
      elapsedMs: Date.now() - startedAt,
      error: normalizeError(error),
    });
    throw error;
  }
}
