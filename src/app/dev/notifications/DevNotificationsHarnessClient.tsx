"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { Button, Card } from "@/design-system";
import { NotificationStack } from "@/components/admin/NotificationStack";
import { AdminUXProvider } from "@/features/admin-ux/AdminUXProvider";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { useNotifications } from "@/features/notifications/useNotifications";
import type { NotificationType } from "@/features/admin-ux/types";

type HarnessSample = {
  type: NotificationType;
  message: string;
  description: string;
  actionLabel?: string;
};

const harnessSamples: readonly HarnessSample[] = [
  {
    type: "success",
    message: "Resource published",
    description: "Use this to confirm the shared success tone and icon wrapper.",
  },
  {
    type: "info",
    message: "Resource already published",
    description: "Use this to confirm the neutral informational status tone.",
    actionLabel: "Review",
  },
  {
    type: "warning",
    message: "Resource deleted",
    description: "Use this to confirm warning tone and the inline action affordance.",
    actionLabel: "Undo",
  },
  {
    type: "error",
    message: "Failed to publish resource",
    description: "Use this to confirm destructive status tone on the live stack.",
    actionLabel: "Retry",
  },
] as const;

function NotificationHarnessControls() {
  const { notify, clear } = useNotifications();
  const searchParams = useSearchParams();
  const didAutofireRef = useRef<string | null>(null);

  function triggerSample(sample: HarnessSample) {
    notify(sample.type, sample.message, sample.description, {
      actionLabel: sample.actionLabel,
      onAction: () => undefined,
    });
  }

  function triggerAll() {
    clear();
    for (const sample of harnessSamples) {
      triggerSample(sample);
    }
  }

  useEffect(() => {
    const scenario = searchParams.get("scenario");
    if (!scenario || didAutofireRef.current === scenario) return;

    didAutofireRef.current = scenario;

    if (scenario === "all") {
      triggerAll();
      return;
    }

    const target = harnessSamples.find((sample) => sample.type === scenario);
    if (!target) return;

    clear();
    triggerSample(target);
  }, [searchParams, clear]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-7 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <p className="font-ui text-caption text-muted-foreground">Dev only</p>
          <h1 className="mt-1 font-display text-h2 font-semibold text-foreground">
            Notification harness
          </h1>
          <p className="mt-1.5 max-w-2xl text-small text-muted-foreground">
            Non-production proof surface for the shared notification stack,
            bell, and status tones. Use this page to verify{" "}
            <code>success | info | warning | error</code> without touching
            live admin data.
          </p>
        </div>
        <NotificationBell defaultOpen />
      </div>

      <Card className="space-y-5 rounded-2xl p-6">
        <div className="space-y-1">
          <h2 className="font-display text-h3 font-semibold text-foreground">
            Trigger states
          </h2>
          <p className="text-small text-muted-foreground">
            The bottom-right stack proves the live <code>NotificationItem</code>{" "}
            surface. The bell proves the compact list surface.
          </p>
          <p className="text-caption text-muted-foreground">
            Add <code>?scenario=success</code>, <code>?scenario=info</code>,{" "}
            <code>?scenario=warning</code>, <code>?scenario=error</code>, or{" "}
            <code>?scenario=all</code> to autofire a proof state on load.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" size="md" onClick={triggerAll}>
            Trigger all
          </Button>
          <Button type="button" size="md" variant="quiet" onClick={clear}>
            Clear all
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {harnessSamples.map((sample) => (
            <button
              key={sample.type}
              type="button"
              onClick={() => triggerSample(sample)}
              className="rounded-xl border border-border bg-shell p-4 text-left transition-colors hover:border-border-strong hover:bg-card"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-ui text-caption capitalize text-muted-foreground">
                  {sample.type}
                </span>
                <span className="text-caption text-primary">
                  Trigger
                </span>
              </div>
              <p className="mt-2 text-small font-medium text-foreground">
                {sample.message}
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 rounded-2xl p-6">
        <h2 className="font-display text-h3 font-semibold text-foreground">
          What this proves
        </h2>
        <ul className="space-y-2 text-small text-muted-foreground">
          <li>
            Status icon wrappers keep the semantic{" "}
            <code>success | info | warning | danger</code> token mapping.
          </li>
          <li>
            Action text stays on semantic <code>primary</code> across every
            notification type.
          </li>
          <li>
            The same notifications appear in both the fixed stack and the bell
            dropdown without needing route-specific data mutations.
          </li>
        </ul>
      </Card>
    </div>
  );
}

export function DevNotificationsHarnessClient() {
  return (
    <AdminUXProvider>
      <main className="min-h-screen bg-background">
        <NotificationHarnessControls />
        <NotificationStack />
      </main>
    </AdminUXProvider>
  );
}
