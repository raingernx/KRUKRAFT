"use client";

import { Skeleton } from "boneyard-js/react";
import { PageContentNarrow } from "@/design-system";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const SETTINGS_PAGE_SKELETON_NAME = "settings-page";

function FlatSectionSkeleton({
  rows,
  footerWidth,
}: {
  rows: number;
  footerWidth?: string;
}) {
  return (
    <section className="space-y-5 border-b border-border pb-6 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <LoadingSkeleton className="h-5 w-28 rounded-md" />
        <LoadingSkeleton className="h-4 w-72 rounded-md" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_240px] md:gap-6"
          >
            <div className="space-y-2">
              <LoadingSkeleton className="h-4 w-32 rounded-md" />
              <LoadingSkeleton className="h-3.5 w-64 rounded-md" />
            </div>
            <LoadingSkeleton className="h-11 w-full max-w-xs rounded-xl" />
          </div>
        ))}
      </div>
      {footerWidth ? <LoadingSkeleton className={`h-9 rounded-xl ${footerWidth}`} /> : null}
    </section>
  );
}

function ManualSettingsPageSkeleton() {
  return (
    <PageContentNarrow className="space-y-8">
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-32 rounded-md" />
        <LoadingSkeleton className="h-4 w-72 rounded-md" />
      </div>

      <div className="space-y-0">
        <FlatSectionSkeleton rows={2} footerWidth="w-32" />
        <FlatSectionSkeleton rows={1} footerWidth="w-36" />
        <FlatSectionSkeleton rows={4} />
        <FlatSectionSkeleton rows={3} footerWidth="w-32" />
        <div className="pt-6">
          <LoadingSkeleton className="h-24 rounded-xl border border-border bg-card" />
        </div>
      </div>
    </PageContentNarrow>
  );
}

function PreviewSettingsSection({
  title,
  description,
  rows,
  footerLabel,
}: {
  title: string;
  description: string;
  rows: Array<{ label: string; hint: string; value: string }>;
  footerLabel?: string;
}) {
  return (
    <section className="space-y-5 border-b border-border pb-6 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_240px] md:gap-6"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{row.label}</p>
              <p className="text-sm text-muted-foreground">{row.hint}</p>
            </div>
            <div className="flex h-11 w-full max-w-xs items-center rounded-xl border border-input bg-background px-4 text-sm text-foreground">
              {row.value}
            </div>
          </div>
        ))}
      </div>
      {footerLabel ? (
        <div className="inline-flex h-9 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground">
          {footerLabel}
        </div>
      ) : null}
    </section>
  );
}

function SettingsPagePreview() {
  return (
    <PageContentNarrow className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, notifications, and account preferences.
        </p>
      </div>

      <div className="space-y-0">
        <PreviewSettingsSection
          title="Profile"
          description="Update your public identity and contact details."
          rows={[
            { label: "Display name", hint: "Shown across marketplace and purchases.", value: "Kru Craft" },
            { label: "Email", hint: "Used for account updates and receipts.", value: "hello@krukraft.com" },
          ]}
          footerLabel="Save profile"
        />
        <PreviewSettingsSection
          title="Preferences"
          description="Choose defaults for language, theme, and reading comfort."
          rows={[
            { label: "Theme", hint: "Applied across app shell and dashboard.", value: "Light" },
          ]}
          footerLabel="Save preferences"
        />
        <PreviewSettingsSection
          title="Notifications"
          description="Decide which updates should reach you by email."
          rows={[
            { label: "New purchases", hint: "Receipt and confirmation emails.", value: "Enabled" },
            { label: "Membership updates", hint: "Renewals and plan reminders.", value: "Enabled" },
            { label: "Creator updates", hint: "Publishing and review alerts.", value: "Disabled" },
            { label: "Product news", hint: "Feature announcements and releases.", value: "Disabled" },
          ]}
        />
        <PreviewSettingsSection
          title="Security"
          description="Keep your account safe and up to date."
          rows={[
            { label: "Password", hint: "Use a strong password for sign-in.", value: "Last updated recently" },
            { label: "Connected provider", hint: "Google account currently linked.", value: "Google" },
            { label: "Session activity", hint: "Signed in on current device.", value: "This browser" },
          ]}
          footerLabel="Review security"
        />
        <div className="pt-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Permanently remove your account and all associated data.
            </p>
          </div>
        </div>
      </div>
    </PageContentNarrow>
  );
}

export function SettingsPageSkeletonBonesPreview() {
  return (
    <Skeleton
      name={SETTINGS_PAGE_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <SettingsPagePreview />
    </Skeleton>
  );
}

export function SettingsPageSkeleton() {
  return <ManualSettingsPageSkeleton />;
}
