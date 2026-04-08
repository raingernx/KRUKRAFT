import { Suspense } from "react";
import { AdminSettingsClient } from "./AdminSettingsClient";
import { PageContent, SectionHeader } from "@/design-system";
import { AdminSettingsFormSkeleton } from "@/components/skeletons/AdminSettingsPageSkeleton";
import { getPlatformAdminSettings } from "@/services/platform";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  return (
    <PageContent className="max-w-[1180px] space-y-6 lg:space-y-8">
      <SectionHeader
        title="Settings"
        description="Manage global platform branding and metadata. Other sections stay local-only for now."
      />
      <Suspense fallback={<AdminSettingsFormSkeleton />}>
        <AdminSettingsContent />
      </Suspense>
    </PageContent>
  );
}

async function AdminSettingsContent() {
  const platform = await getPlatformAdminSettings();

  return (
    <AdminSettingsClient
      initialPlatformSettings={platform.resolved}
      initialStoredSettings={platform.stored}
      showHeader={false}
      wrapInPageContent={false}
    />
  );
}
