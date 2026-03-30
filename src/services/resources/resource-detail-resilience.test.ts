import test from "node:test";
import assert from "node:assert/strict";
import {
  logResourceDetailFailure,
  runNonCriticalResourceDetailTask,
} from "@/services/resources/resource-detail-resilience";

test("runNonCriticalResourceDetailTask returns loader result when successful", async () => {
  const result = await runNonCriticalResourceDetailTask(
    async () => ({ ok: true, value: 42 }),
    {
      context: {
        resourceId: "resource_123",
        section: "reviews",
        slug: "example-resource",
      },
      fallback: { ok: false, value: 0 },
    },
  );

  assert.deepEqual(result, { ok: true, value: 42 });
});

test("runNonCriticalResourceDetailTask returns fallback when loader throws", async () => {
  const expectedFallback = { ok: false, value: 0 };
  const errors: unknown[] = [];
  const originalConsoleError = console.error;

  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    const result = await runNonCriticalResourceDetailTask(
      async () => {
        throw new Error("reviews lookup failed");
      },
      {
        context: {
          resourceId: "resource_123",
          section: "reviews",
          slug: "example-resource",
        },
        fallback: expectedFallback,
      },
    );

    assert.deepEqual(result, expectedFallback);
    assert.equal(errors.length, 1);
  } finally {
    console.error = originalConsoleError;
  }
});

test("logResourceDetailFailure marks timeout-like failures with timeout event label", () => {
  const events: unknown[] = [];
  const originalConsoleError = console.error;

  console.error = (...args: unknown[]) => {
    events.push(args);
  };

  try {
    logResourceDetailFailure(
      {
        critical: false,
        resourceId: "resource_123",
        section: "reviews",
        slug: "example-resource",
      },
      new Error("The operation was aborted due to timeout"),
      1200,
      {
        fallbackApplied: true,
      },
    );

    assert.equal(events.length, 1);
    assert.equal((events[0] as unknown[])[0], "[RESOURCE_DETAIL_TIMEOUT]");
  } finally {
    console.error = originalConsoleError;
  }
});
