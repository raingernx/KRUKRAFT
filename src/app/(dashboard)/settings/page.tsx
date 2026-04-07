import { requireSession } from "@/lib/auth/require-session";
import { PageContentNarrow, SectionHeader } from "@/design-system";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { getDashboardSettingsPageData } from "@/services/admin";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await requireSession(routes.settings);

  const { user, preferences } = await getDashboardSettingsPageData(userId);

  return (
    <PageContentNarrow data-route-shell-ready="dashboard-settings" className="space-y-8">
      <SectionHeader
        title="Settings"
        description="Manage your account preferences and security."
      />

      <SettingsTabs
        user={{
          name: user?.name ?? null,
          email: user?.email ?? null,
          image: user?.image ?? null,
        }}
        preferences={preferences}
      />
    </PageContentNarrow>
  );
}
