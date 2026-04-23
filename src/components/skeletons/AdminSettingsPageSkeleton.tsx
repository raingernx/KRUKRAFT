"use client";

import { Skeleton } from "boneyard-js/react";
import { PageContent } from "@/design-system";
import { LoadingSkeleton } from "@/design-system";

const ADMIN_SETTINGS_PAGE_SKELETON_NAME = "admin-settings-page";

function AdminSectionSkeleton({
  columns = 2,
  rows = 2,
}: {
  columns?: 1 | 2;
  rows?: number;
}) {
  const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="space-y-5 border-b border-border pb-6 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <LoadingSkeleton className="h-5 w-36 rounded-md" />
        <LoadingSkeleton className="h-4 w-80 rounded-md" />
      </div>
      <div className={`grid gap-4 ${gridClass}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-1.5">
            <LoadingSkeleton className="h-4 w-32 rounded-md" />
            <LoadingSkeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ManualAdminSettingsPageSkeleton() {
  return (
    <PageContent className="max-w-[1180px] space-y-6 lg:space-y-8">
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-32 rounded-md" />
        <LoadingSkeleton className="h-4 w-[34rem] max-w-full rounded-md" />
      </div>

      <div className="space-y-0 rounded-2xl border border-border bg-card px-6 py-6 shadow-card sm:px-7 sm:py-7">
        <AdminSectionSkeleton rows={6} />
        <section className="space-y-5 border-b border-border pb-6">
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-36 rounded-md" />
            <LoadingSkeleton className="h-4 w-80 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton
                key={index}
                className="h-48 rounded-xl border border-border bg-muted"
              />
            ))}
          </div>
        </section>
        <section className="space-y-5 border-b border-border pb-6">
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-32 rounded-md" />
            <LoadingSkeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-2">
                  <LoadingSkeleton className="h-4 w-44 rounded-md" />
                  <LoadingSkeleton className="h-3.5 w-72 rounded-md" />
                </div>
                <LoadingSkeleton className="h-6 w-[46px] rounded-full" />
              </div>
            ))}
          </div>
        </section>
        <AdminSectionSkeleton rows={2} />
        <AdminSectionSkeleton rows={3} columns={1} />
        <AdminSectionSkeleton rows={3} />
        <AdminSectionSkeleton rows={5} columns={1} />
      </div>

      <div className="flex justify-end">
        <LoadingSkeleton className="h-12 w-56 rounded-2xl border border-border bg-card" />
      </div>
    </PageContent>
  );
}

function PreviewAdminSection({
  title,
  description,
  fields,
  columns = 2,
}: {
  title: string;
  description: string;
  fields: Array<{ label: string; value: string }>;
  columns?: 1 | 2;
}) {
  const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="space-y-5 border-b border-border pb-6 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={`grid gap-4 ${gridClass}`}>
        {fields.map((field) => (
          <div key={field.label} className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">{field.label}</p>
            <div className="flex h-11 w-full items-center rounded-xl border border-input bg-background px-4 text-sm text-foreground">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminSettingsPagePreview() {
  return (
    <PageContent className="max-w-[1180px] space-y-6 lg:space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure brand assets, integrations, and platform-wide defaults.
        </p>
      </div>

      <div className="space-y-0 rounded-2xl border border-border bg-card px-6 py-6 shadow-card sm:px-7 sm:py-7">
        <PreviewAdminSection
          title="Brand profile"
          description="Public metadata and core platform identity."
          fields={[
            { label: "Platform name", value: "Krukraft" },
            { label: "Support email", value: "support@krukraft.com" },
            { label: "Short tagline", value: "Ready-made teaching resources" },
            { label: "Primary domain", value: "krukraft.com" },
            { label: "Checkout label", value: "Krukraft Plus" },
            { label: "Locale", value: "th-TH" },
          ]}
        />
        <section className="space-y-5 border-b border-border pb-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Brand assets</h2>
            <p className="text-sm text-muted-foreground">
              Uploaded marks used across auth, marketing, and checkout surfaces.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {["Full logo", "Mark", "Dark logo", "Light logo"].map((asset) => (
              <div
                key={asset}
                className="flex h-48 items-end rounded-xl border border-border bg-muted p-4"
              >
                <p className="text-sm font-medium text-foreground">{asset}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-5 border-b border-border pb-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Feature flags</h2>
            <p className="text-sm text-muted-foreground">
              Toggle storefront and creator-facing experiments.
            </p>
          </div>
          <div className="divide-y divide-border">
            {[
              "Enable memberships",
              "Enable AI draft generation",
              "Show creator CTA",
              "Expose recommendation experiments",
            ].map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {index % 2 === 0 ? "Enabled for production" : "Disabled by default"}
                  </p>
                </div>
                <div className="h-6 w-[46px] rounded-full border border-border bg-muted" />
              </div>
            ))}
          </div>
        </section>
        <PreviewAdminSection
          title="Checkout"
          description="Payment provider labels and plan defaults."
          fields={[
            { label: "Currency", value: "THB" },
            { label: "Checkout mode", value: "Xendit + Stripe" },
          ]}
        />
        <PreviewAdminSection
          title="Discovery"
          description="Section defaults used on the public resources route."
          fields={[
            { label: "Trending window", value: "7 days" },
            { label: "Featured cap", value: "4 cards" },
            { label: "Default sort", value: "Trending" },
          ]}
          columns={1}
        />
        <PreviewAdminSection
          title="Email"
          description="Transactional sender identity and reply path."
          fields={[
            { label: "From name", value: "Krukraft" },
            { label: "Reply-to", value: "support@krukraft.com" },
            { label: "Receipt sender", value: "billing@krukraft.com" },
          ]}
        />
        <PreviewAdminSection
          title="Compliance"
          description="Legal and operational links used in footer and auth screens."
          fields={[
            { label: "Privacy policy", value: "/privacy" },
            { label: "Terms", value: "/terms" },
            { label: "Cookies", value: "/cookies" },
            { label: "Support", value: "/support" },
            { label: "Status page", value: "Not configured" },
          ]}
          columns={1}
        />
      </div>

      <div className="flex justify-end">
        <div className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-6 text-sm font-medium text-foreground">
          Save settings
        </div>
      </div>
    </PageContent>
  );
}

export function AdminSettingsPageSkeletonBonesPreview() {
  return (
    <Skeleton
      name={ADMIN_SETTINGS_PAGE_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <AdminSettingsPagePreview />
    </Skeleton>
  );
}

export function AdminSettingsPageSkeleton() {
  return <ManualAdminSettingsPageSkeleton />;
}

export function AdminSettingsFormSkeleton() {
  return (
    <div className="space-y-0 rounded-2xl border border-border bg-card px-6 py-6 shadow-card sm:px-7 sm:py-7">
      <AdminSectionSkeleton rows={6} />
      <section className="space-y-5 border-b border-border pb-6">
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-36 rounded-md" />
          <LoadingSkeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              className="h-48 rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      </section>
      <section className="space-y-5 border-b border-border pb-6">
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-32 rounded-md" />
          <LoadingSkeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-44 rounded-md" />
                <LoadingSkeleton className="h-3.5 w-72 rounded-md" />
              </div>
              <LoadingSkeleton className="h-6 w-[46px] rounded-full" />
            </div>
          ))}
        </div>
      </section>
      <AdminSectionSkeleton rows={2} />
      <AdminSectionSkeleton rows={3} columns={1} />
      <AdminSectionSkeleton rows={3} />
      <AdminSectionSkeleton rows={5} columns={1} />
    </div>
  );
}
